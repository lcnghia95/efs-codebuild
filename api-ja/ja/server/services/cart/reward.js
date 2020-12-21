const app = require('@server/server')
const priceService = require('./price')
const specialFeeService = require('./specialFee')
const customizeRewardService = require('./customizeReward')
const specialRewardModel = app.models.SpecialRewards
const BANK_AUTO_TRANSFER_PAYMENT_TYPE = 5

const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Check if value is number or not
 *
 * @param {any} value
 * @returns {Boolean}
 * @private
 */
function _isNumber(value) {
  if (Number.isInteger(value)) {
    return true
  }
  return /^\d+(\.)?\d*$/.test(value)
}

/**
 * Calculate price by rate
 *
 * @param {number} price
 * @param {number} price
 * @returns {number}
 * @private
 */
function _round(rate, price) {
  return _isNumber(rate) ? Math.round(rate * price / 100) : 0
}

/**
 * Get special reward data
 *
 * @param {number} userId
 * @param {number} productId
 * @returns {Object}
 * @private
 */
async function _specialReward(userId, productId) {
  return (userId == 0 || productId == 0) ? {} : (await specialRewardModel.findOne({
    where: {
      userId,
      productId,
    },
    order: 'id DESC',
    fields: {
      id: true,
      ggjRate: true,
      affiliateRate: true,
      isAdminToolUpdate: true,
      rate: true,
    },
  }) || {})
}

/**
 * Get fee rate
 *
 * @param {Object} product
 * @param {number} price
 * @returns {Object}
 * @private
 */
async function _feeRate(product, price) {
  // Ref: https://imgur.com/a/j4nq7ur
  const typeId = product.typeId

  // システムトレード（自動売買）
  if (typeId == 1) {
    // 【MT4、TradeStation、マルチチャート】   35%
    // 【システムトレードの達人】              29.8%
    return product.platformId == 4 ? 29.8 : 35
  }
  
  // 投資顧問・助言代理業商品
  if (product.isAdvising == 1) {
    return 25
  }

  // 税込販売価格の37.1%（税込40%）
  // Special record

  // 投資サロン
  if (typeId == 4) {
    return 25
  }

  // 投資ナビ+
  if (typeId == 3) {
    return price > 1000 ? 15 : 20
  }

  // 動画
  if (typeId == 5) {
    const record = await app.models.ProductPrices.findOne({
      where: {
        id: product.productPriceId,
      },
      fields: {
        rate: true,
      },
    })
    if (record && record.rate) {
      return record.rate
    }
    // TODO: GogoJungleが動画作成を請け負う場 税込価格販売の 35.2%（税込38%）
    return 30
  }
  // イベント情報
  if (typeId == 19) {
    return price > 1000 ? 15 : 20
  }

  // トークルーム
  // https://gogojungle.backlog.jp/view/OAM-48892#comment-95583410
  if (typeId == 13) {
    return 20
  }

  // インジケーター・電子書籍
  // ストリーミング
  // 有料レポート
  // セミナー
  // ライブ配信
  // 有料コミュニティ
  // 物販
  // if ([2, 6, 9, 10, 13, 14, 15].indexOf(typeId) > -1) {
  //   return price > 1000 ? 10 : 15
  // }

  // Default
  return price > 1000 ? 10 : 15
}

/**
 * Sub product of product set
 *
 * @param {Array} ids
 * @returns {Array}
 * @private
 */
async function _subProducts(ids) {
  return await app.models.Products.find({
    where: {
      id: {
        inq: ids,
      },
      isValid: {
        inq: [0, 1],
      },
    },
    fields: {
      id: true,
      typeId: true,
      platformId: true,
      productPriceId: true,
      affiliateMargin: true,
      isSpecialDiscount: true,
      specialDiscountCount: true,
      specialDiscountEndAt: true,
      specialDiscountStartAt: true,
    },
  })
}

/**
 * Prices data of sale record
 *
 * @param {Object} sale
 * @param {Object} product
 * @param {Object} twotier
 * @param {Object} productIds
 * @returns {Array}
 * @private
 */
async function _calculatePriceForSeparateProduct(sale, product, twotier, productIds = []) {
  const payId = sale.payId
  const price = sale.price - (sale.expensePrice || 0)

  let monthlyPrice = price

  if (payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE) {
    monthlyPrice = price / 3
  }
  
  const productId = product.id
  const affiliateUserId = sale.affiliateUserId || 0
  const [specialReward, customizeReward, specialFeePrice] = await Promise.all([
    _specialReward(affiliateUserId, productId),
    customizeRewardService.calculateCustomizeReward(payId, productId, affiliateUserId, price, monthlyPrice),
    specialFeeService.calculateSpecialFeePrice(productIds, sale.developerUserId, sale.id, monthlyPrice, affiliateUserId),
  ])
    // Customize reward
  let feePrice = customizeReward.feePrice || 0,
    developerPrice = customizeReward.developerPrice || 0,
    affiliatePrice = customizeReward.affiliatePrice || 0,
    twotierUserId = customizeReward.twotierUserId || 0,
    twotierPrice = customizeReward.twotierPrice || 0,
    ggjSpPrice = customizeReward.ggjSpPrice || 0,
    ggjSpFeePrice = customizeReward.ggjSpFeePrice || 0,
    affiliateSpPrice = customizeReward.affiliateSpPrice || 0,
    affiliateSpFeePrice = specialFeePrice + (customizeReward.affiliateSpFeePrice || 0),
    margin = 0,
    affiliateSpRate = 0,
    isAdminToolUpdate = 0

  // NOTICE: Customize reward overwrite normal calculation
  if (affiliatePrice == 0) {
    margin = affiliateUserId > 0 ? product.affiliateMargin || 0 : 0
    affiliatePrice = (margin * monthlyPrice / 100)
    if (specialReward.id > 0) {
      affiliateSpRate = (specialReward.affiliateRate || 0) - margin
      affiliateSpPrice = (affiliateSpRate * monthlyPrice / 100)
    }
  }

  if (feePrice == 0) {
    const rate = await _feeRate(product, price)
    feePrice = (rate * price / 100)
    isAdminToolUpdate = specialReward.isAdminToolUpdate || 0
    ggjSpPrice = ((specialReward.ggjRate || 0) * price / 100)
    ggjSpFeePrice = isAdminToolUpdate ? ((ggjSpPrice + affiliatePrice + affiliateSpPrice) * 0.3) : 0
  }

  if (twotierUserId == 0) {
    twotierUserId = twotier.parentUserId || 0
    twotierPrice = _round(twotier.rate, affiliatePrice)
  }

  if (developerPrice == 0) {
    developerPrice = (price - feePrice - affiliatePrice - affiliateSpPrice - ggjSpPrice - ggjSpFeePrice - twotierPrice - (sale.expensePrice || 0))
  }
  // ==========================================================================
  // ASSIGN DATA TO SALE MODEL
  sale.feePrice = feePrice || 0
  sale.developerPrice = developerPrice || 0
  sale.affiliatePrice = affiliatePrice || 0
  sale.affiliateSpPrice = affiliateSpPrice || 0
  sale.affiliateSpFeePrice = affiliateSpFeePrice || 0
  sale.ggjSpPrice = ggjSpPrice || 0
  sale.ggjSpFeePrice = ggjSpFeePrice || 0
  sale.twotierPrice = twotierPrice || 0
  sale.twotierUserId = twotierUserId || 0
  if (specialReward.ggjRate > 0) {
    sale.specialRewardId = specialReward.id || 0
  }
}

/**
 * Calculate sales reward and update to sales object
 *
 * @param {Object} sale
 * @param {Object} product
 * @param {Object} twotier
 * @param {Array} subProductIds
 * @returns {void}
 * @public
 */
async function calculateReward(sale, product, twotier, subProductIds) {
  let total, diff

  if (subProductIds.length == 0) {
    await _calculatePriceForSeparateProduct(sale, product, twotier, [product.id])
    sale.feePrice = Math.round(sale.feePrice)
    sale.ggjSpPrice = Math.round(sale.ggjSpPrice)
    sale.ggjSpFeePrice = Math.round(sale.ggjSpFeePrice)
    sale.affiliatePrice = Math.round(sale.affiliatePrice)
    sale.affiliateSpPrice = Math.round(sale.affiliateSpPrice)
    sale.affiliateSpFeePrice = Math.round(sale.affiliateSpFeePrice)
    sale.developerPrice = Math.round(sale.developerPrice)
    total = sale.feePrice + sale.ggjSpPrice + sale.ggjSpFeePrice + sale.affiliatePrice + sale.affiliateSpPrice + sale.affiliateSpFeePrice + sale.developerPrice + sale.twotierPrice + (sale.expensePrice || 0)
    diff = sale.price - total
    sale.developerPrice = sale.developerPrice + diff
    return
  }

  // TODO: check null
  const parentPrice = sale.price
  const subProducts = await _subProducts(subProductIds)
  const subProductObjects = app.utils.object.arrayToObject(subProducts)
  const productPriceIds = arrayUtil.column(subProducts, 'productPriceId')
  const prices = await priceService.getPrices(productPriceIds)
  const priceObjects = await priceService.priceObjects(prices, subProductObjects)

  let totalPrice = 0

  subProductIds.forEach(productId => {
    const price = (priceObjects[productId] || [])[0] || {}
    totalPrice += price.price || 0
  })

  const promises = subProductIds.map(async productId => {
    const price = (priceObjects[productId] || [])[0] || {}
    const copy = {
      id: sale.id,
      productId,
      developerUserId: sale.developerUserId,
      affiliateUserId: sale.affiliateUserId,
      price: ((price.price || 0) / totalPrice * parentPrice),
    }
    const subProduct = subProductObjects[productId] || {}

    subProduct.affiliateMargin = product.affiliateMargin
    await _calculatePriceForSeparateProduct(copy, subProduct, {}, [])
    return copy
  })
  const subPrices = await Promise.all(promises)
  const specialFeePrice = await specialFeeService.calculateSpecialFeePrice(
    subProductIds, 
    sale.developerUserId, 
    sale.id, 
    sale.price || 0, 
    sale.affiliateUserId || 0,
  )
  
  sale.feePrice = 0
  sale.developerPrice = 0
  sale.affiliatePrice = 0
  sale.affiliateSpPrice = 0
  sale.affiliateSpFeePrice = specialFeePrice
  sale.ggjSpPrice = 0
  sale.ggjSpFeePrice = 0

  subPrices.forEach(subPrice => {
    sale.feePrice += subPrice.feePrice || 0
    sale.developerPrice += subPrice.developerPrice || 0
    sale.affiliatePrice += subPrice.affiliatePrice || 0
    sale.affiliateSpPrice += subPrice.affiliateSpPrice || 0
    sale.ggjSpPrice += subPrice.ggjSpPrice || 0
    sale.ggjSpFeePrice += subPrice.ggjSpFeePrice || 0
    if (subPrice.specialRewardId > 0) {
      sale.specialRewardId = subPrice.specialRewardId
    }
  })

  sale.twotierUserId = twotier.parentUserId || 0
  sale.twotierPrice = _round(twotier.rate, product.affiliateMargin * sale.price / 100)
  sale.developerPrice -= sale.twotierPrice

  sale.feePrice = Math.round(sale.feePrice)
  sale.ggjSpPrice = Math.round(sale.ggjSpPrice)
  sale.ggjSpFeePrice = Math.round(sale.ggjSpFeePrice)
  sale.affiliatePrice = Math.round(sale.affiliatePrice)
  sale.affiliateSpPrice = Math.round(sale.affiliateSpPrice)
  sale.affiliateSpFeePrice = Math.round(sale.affiliateSpFeePrice)
  sale.developerPrice = Math.round(sale.developerPrice)
  total = sale.feePrice + sale.ggjSpPrice + sale.ggjSpFeePrice + sale.affiliatePrice + sale.affiliateSpPrice + sale.affiliateSpFeePrice + sale.developerPrice + sale.twotierPrice + (sale.expensePrice || 0)
  diff = sale.price - total
  sale.developerPrice = sale.developerPrice + diff

  return subPrices
}

module.exports = {
  calculateReward,
}
