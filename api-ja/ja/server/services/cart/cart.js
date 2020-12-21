const app = require('@server/server')

const helper = require('./helper')
const errors = require('./errors')
const userService = require('./user')
const saleService = require('./sale')
const giftService = require('./gift')
const priceService = require('./price')
const discountCampaignService  = require('./discountCampaign')
const seriesService = require('./series')
const permitService = require('./permit')
const paymentService = require('./payment')
const productService = require('./product')
const { getLanguages } = require('./getLanguages')
const contractService = require('./contract')
const validateService = require('./validate')
const affiliateService = require('./affiliate')
const marginUserService = require('./marginUser')
const productSetService = require('./productSet')
const cartMailService = require('@services/cart/mail')
const userCommonService = require('@services/common/user')
const productCommonService = require('@services/common/product')
const nonMemberAuthService = require('@services/auth/nonMember')
const productUrlCommonService = require('@services/common/productUrl')
const alsoBoughtProductService = require('@services/common/alsoBoughtProduct')
const mailmagazineSubscribersService = require('./mailmagazineSubscribers')
const quantxService = require('@@services/common/quantx')
const {insertWebAuth} = require('./webAuth')
const {
  uniq,
  map,
  filter,
} = require('lodash')
const _getSaleByProductIds = require('@services/common/sale').getSaleByProductIds
const { TIED_UP_PRODUCT, TIED_UP_PRODUCT_PRICES, DISCOUNT_TYPE_COUNT, DISCOUNT_TYPE_TOTAL_PRICE } = require('@@server/common/data/hardcodedData')
const UNPAID_SALE_STATUS = 0
const PAID_SALE_STATUS = 1
const INDEX_PAGE_TYPE = 2
const CONFIRM_PAGE_TYPE = 3
const CHECKOUT_TYPE = 4
const NAVI_PRODUCT_TYPE_ID = 3
const SALON_PRODUCT_TYPE_ID = 4
const VIDEO_PRODUCT_TYPE_ID = 5
const BUY_NOW_FLAG = 1
const BUY_LATER_FLAG = 2
const CHANGE_QUANTITY_FLAG = 3
const CHANGE_PRICE_FLAG = 4
const BUY_NOW_STATUS_TYPE = 1
const CART_OPEN_FLAG = 0
const CART_UN_PURCHASED_FLAG = 0
const CART_PURCHASED_FLAG = 1
const CART_PROCESSING_FLAG = 2
const BANK_AUTO_TRANSFER_PAYMENT_TYPE = 5
const DEFAULT_AFFILIATE_USER_ID = 0

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object

// models
const cartModel = app.models.Carts
const salesModel = app.models.Sales
const externalProductMappingModel = app.models.ExternalProductMapping
const productSerialKeysModel = app.models.ProductSerialKeys

// Biz information
const maps = {
  1: 'buyNow',
  2: 'buyLater',
  3: 'cannotBuy',
}

const LANGTYPE = [2, 3, 4]

/**
 * Check if product can be sellect multiple or not
 *
 * @param {Object} product
 * @returns {Boolean}
 * @private
 */
function _isMultiple(product) {
  const isSubscription = product.isSubscription
  if (isSubscription != 0) {
    return false
  }
  const typeId = product.typeId
  if (typeId == SALON_PRODUCT_TYPE_ID || typeId == NAVI_PRODUCT_TYPE_ID ||
    typeId == VIDEO_PRODUCT_TYPE_ID || quantxService.isQuantXProd(product)) {
    return false
  }
  return true
}

/**
 * Check if product is article or not
 *
 * @param {Object} product
 * @returns {Promise<Boolean>}
 * @private
 */
async function _isArticle(product) {
  if (product.typeId !== NAVI_PRODUCT_TYPE_ID) {
    return false
  }
  const count = await app.models.Articles.count({
    isValid: 1,
    status: 1,
    productId: product.id,
  })
  return count ? true : false
}

/**
 * Get meta infromation
 *
 * @param {Object} meta
 * @returns {Object}
 * @private
 */
function _meta(meta) {
  meta.affiliates = {
    referer: meta.referer || '',
    affiliateUserId: meta.affiliateUserId || 0,
  }
  return meta
}

/**
 * Add product to cart
 *
 * @param {Object} validateResult
 * @param {number} productId
 * @param {number} userId
 * @param {number} cartSessionId
 * @param {Object} affiliates
 * @param {number} langType
 * @returns {void}
 * @private
 */
async function _add(
  validateResult,
  productId,
  userId,
  cartSessionId,
  affiliates,
  langType,
) {
  const [
      product,
      productPriceId,
    ] = await Promise.all([
      _product(productId, 1),
      _currentProductPriceId(productId, userId, cartSessionId),
    ])
    const cart = await _create(
      userId,
      cartSessionId,
      product,
      validateResult.statusType,
      validateResult.error,
      validateResult.warning,
      productPriceId,
      langType,
    )
  await _addAffiliateInformation(affiliates, userId, cart)
  return cart
}

/**
 * Get product
 *
 * @param {number} productId
 * @param {number} type
 * @returns {Object}
 * @private
 */
async function _product(productId, type) {
  if (type == 1) {
    // Add to cart
    return await productCommonService.product(
      productId, {
        id: true,
        productPriceId: true,
      },
    )
  }
}

/**
 * Get current price id of product in cart (if any)
 *
 * @param {number} userId
 * @param {number} cartSessionId
 * @param {Array} statusTypes
 * @returns {number}
 * @private
 */
async function _currentProductPriceId(productId, userId, cartSessionId) {
  const cart = await cartModel.findOne({
    where: helper.cartQueryCondition(userId, cartSessionId, productId),
    fields: {
      id: true,
      productPriceId: true,
    },
  })
  return cart ? cart.productPriceId : null
}

/**
 * create cart item
 *
 * @param {number} userId
 * @param {number} cartSessionId
 * @param {Object} product
 * @param statusType
 * @param error
 * @param warning
 * @param {number} productPriceId
 * @param {number} langType
 * @returns {void}
 * @private
 */
async function _create(
  userId,
  cartSessionId,
  product,
  statusType,
  error,
  warning,
  productPriceId,
  langType,
) {
  return await cartModel.create({
    isValid: 1,
    isPurchase: CART_OPEN_FLAG,
    userId: userId,
    sessionId: cartSessionId,
    productId: product.id,
    productPriceId: productPriceId || product.productPriceId || 0,
    statusType,
    errorCode: error,
    warningCode: warning,
    langType,
  })
}

/**
 * Generate expired_at datetime when add to cart
 *
 * @returns number
 * @private
 */
function _expiredAt() {
  return app.utils.time.addMonths(1)
}

/**
 * Update cart affiliate information to cart item
 *
 * @param {Object} affiliates
 * @param {number} userId
 * @param {Object} cart
 * @returns {void}
 * @private
 */
async function _addAffiliateInformation(affiliates, userId, cart) {
  if (!cart) {
    return
  }

  const {
    affiliateUserId,
    referer,
  } = await affiliateService.affiliateInformation(affiliates)

  cart.affiliateUserId = affiliateUserId || 0
  cart.referer = referer
  await marginUserService.checkMarginUser(cart)

  await cartModel.updateAll({
    id: cart.id,
  }, {
    affiliateUserId: cart.affiliateUserId,
    referer: cart.referer,
    expiredAt: _expiredAt(),
  })
  // Update affiliate information
  // https://gogojungle.backlog.jp/view/OAM-12767#comment-50672340
  _updateAffiliateInformation(cart.productId, userId, cart.sessionId)
}

/**
 * Get `common.cart` records
 *
 * @param {number} userId
 * @param {number} cartSessionId
 * @param {Array} statusTypes
 * @returns {Array}
 * @private
 */
async function _carts(userId, cartSessionId, statusTypes = [1, 2, 3]) {
  // await validateService.sync(userId, cartSessionId)

  let carts = await cartModel.find({
    where: helper.cartQueryCondition(userId, cartSessionId),
    order: 'id DESC',
  })
  carts = carts.filter(cart => {
    if (statusTypes.indexOf(cart.statusType) < 0) {
      return false
    }
    return cart.userId == 0 || cart.userId == userId
  })

  // Modify carts items
  _addUserId(carts, userId)
  return carts
}

/**
 * Add userId into `common.carts` records
 *
 * @param {Array} carts
 * @param {number} userId
 * @returns {void}
 * @private
 */
async function _addUserId(carts, userId) {
  if (userId == 0 || carts.length == 0) {
    return
  }

  const cartIds = carts.filter(cart => cart.userId == 0).map(cart => cart.id)

  if (cartIds.length > 0) {
    await cartModel.updateAll({
      id: {
        inq: cartIds,
      },
    }, {
      userId,
    })
  }
}

/**
 * Get cart information
 *
 * @param {Object} cart
 * @param {number} payId
 * @param {number} dvdOpt
 * @param {Object} opt: opt.type in {INDEX_PAGE_TYPE, CONFIRM_PAGE_TYPE}
 * @returns {Object}
 * @private
 */
async function _cartInformation(carts, payId, dvdOpt, opt = {}) {
  // No cart item
  if (carts.length == 0) {
    return {}
  }
  const {
    products,
    productUrls,
    productObjects,
    priceObjects,
    giftObjects,
    users,
    hasDvd,
    conclusionBefore,
    conclusion,
    upperLimits,
  } = await _relatedInformation(carts, opt.type, true)
  let langProducts = {}

  // No valid product
  if (products.length == 0) {
    return {}
  }
  if (LANGTYPE.includes(opt.langType || 0)) {
    const langPids = arrayUtil.attributeArray(products, 'id')
    langProducts = await getLanguages(langPids, opt.langType)
    langProducts = objectUtil.arrayToObject(langProducts, 'productId')
  }
  // Filter cart item
  carts = carts.filter(cart => {
    const product = productObjects[cart.productId] || {}
      const productId = product.id || 0

    // Ignore cart item of invalid product
    if (productId == 0) {
      cart.isValid = 0
      cart.save()
      return false
    }

    // Check and make sure that productPriceId is valid
    const productPriceId = cart.productPriceId || 0
    if (productPriceId == 0) {
      if ((product.productPriceId || 0) > 0) {
        cart.productPriceId = product.productPriceId
        cart.save()
      }
    }
    return true
  })

  // Update cart
  const res = await _checkProductPriceIds(carts, priceObjects, products, opt.type)
  // OAM-21112
  if (res && res.error) {
    return res
  }

  const isLoginRequired = _isLoginRequired(products)
    const isAddressRequired = LANGTYPE.includes(opt.langType || 0) ? 0 : true
  // isAddressRequired = LANGTYPE.includes(meta.langType || 0) ? 0 : _isAddressRequired(products)

  // Memo: this variable used to mark that product is already in response data
  let idxFlag,
    idx

  if (opt.type == INDEX_PAGE_TYPE) {
    idxFlag = {
      buyNow: {},
      buyLater: {},
      cannotBuy: {},
    }
    idx = {
      buyNow: 0,
      buyLater: 0,
      cannotBuy: 0,
    }
  } else {
    idxFlag = {
      buyNow: {},
    }
    idx = {
      buyNow: 0,
    }
  }

  return carts.reduce((result, cart) => {
    // Invalid items

    // // TODO: check biz logic here!!!
    // //    SHOULD WE REMOVE THIS ITEM FROM CART OR NOT
    // if (cart.statusType == 3) {
    //   return result
    // }

    const statusType = cart.statusType
      const productId = cart.productId
      const product = productObjects[productId]
      const group = maps[statusType]

    if (!product) {
      return result
    }
    if (langProducts[productId]) {
      product.name = langProducts[productId].name || product.name
    }

    // Ignore product with no user information
    const user = (users || {})[product.userId]
    if (!user) {
      return result
    }

    // Init cart object
    if (idxFlag[group][productId] === undefined) {
      // https://gogojungle.backlog.jp/view/OAM-11970
      let affUser
      if (cart.affiliateUserId && cart.affiliateUserId != 120001) {
        affUser = (users || {})[cart.affiliateUserId]
      }
      idxFlag[group][productId] = idx[group]
      idx[group]++
      result[group].push(_cartOject(
        cart,
        product,
        productUrls[productId] || '',
        user,
        (priceObjects || {})[productId] || [],
        (giftObjects || {})[productId] || [],
        affUser,
        upperLimits[productId],
      ))
    } else {
      const record = result[group][idxFlag[group][productId]]
      record.count++
      if (record.count > record.upperLimit) {
        record.count--
        // MEMO: if cart data has more record than upperLimit, remove the record from cart
        cartModel.destroyById(cart.id)
      }
    }
    return result
  }, {
    buyNow: [],
    buyLater: [],
    cannotBuy: [],
    info: {
      hasDvd,
      payId,
      dvdOpt,
    },
    conclusionBefore,
    conclusion,
    isLoginRequired,
    isAddressRequired,
  })
}

/**
 * Check if product_price_id and update in case of invalid
 *
 * @param {Object} priceObjects
 * @returns {Promise<Boolean>}
 * @private
 * @param carts
 * @param products
 * @param pageType
 */
async function _checkProductPriceIds(carts, priceObjects, products, pageType) {
  /**
   * OAM-21112
   * Prerequisite:
   *    Do not login
   * Steps to reproduce
   * Step 1: add to cart. Ex: https://www.gogo.ex-cloud.biz/cart/add/13820
   *    Keep this page opens, don't touch this page
   * Step 2: change price in fx-on admin page
   *  https://fx-on.ex-cloud.biz/admin/asp/product.php?i=13820&1568867209
   * Step 3: in /cart page
   *    Choose payment type
   *    login in /cart page
   * Expected result: in /cart/confirm the price is 0
   */
  if (pageType == CONFIRM_PAGE_TYPE) {
    const isPriceChanged = carts.find(c => {
      const pro = products.find(p => c.productId == p.id)
      return pro && pro.productPriceId != c.productPriceId
    })
    if (isPriceChanged) {
      return errors.cartError013
    }
  }
  const promises = carts.map(async cart => {
    const prices = priceObjects[cart.productId] || []
    let price = prices.find(price => price.id == cart.productPriceId)
    if (!price) {
      const currentPrice = await app.models.ProductPrices.findOne({
        where: {
          id: cart.productPriceId,
          isValid: {
            inq: [0, 1],
          },
        },
        fields: {
          id: true,
          productId: true,
          chargeType: true,
        },
      }) || {}
      if (currentPrice.id) {
        if (cart.productId == currentPrice.productId) {
          price = prices.find(price => {
            return price.chargeType == currentPrice.chargeType
          }) || {}
          cart.productPriceId = price.id || 0
          cart.save()
        } else {
          // This happen when user add an article to cart, but after that, change it into series
          // Currently, seller cannot change price of series, so we don't have to check any thing here
        }
      } else {
        // OAM-17594
        price = prices[0] || {}
        cart.productPriceId = price.id || 0
        cart.save()
      }
    }
    return 0
  }); const res = await Promise.all(promises)
  return res.find(e => e.error)
}

/**
 * Check login require or not
 *
 * @param {Array} products
 * @returns {Boolean}
 * @private
 */
function _isLoginRequired(products) {
  const product = products.find(product => product.typeId !=
    SALON_PRODUCT_TYPE_ID)
  return product ? true : false
}

/**
 * Check address require or not
 *
 * @param {Array} products
 * @returns {Boolean}
 * @private
 */
// function _isAddressRequired(products) {
//   // OAM-25994
//   return true
//   // let product = products.find(product => product.typeId !=
//   //   SYSTEM_PRODUCT_TYPE_ID)
//   // return product ? true : false
// }

/**
 * Get data to generate cart objects
 *
 * @param {Array} cart
 * @param {number} type
 * @param {Boolean} isGetSeries
 * @returns {Object}
 * @private
 */
async function _relatedInformation(carts, type, isGetSeries = false) {
  let productIds = arrayUtil.attributeArray(carts, 'productId')
  const productPriceIds = arrayUtil.attributeArray(carts, 'productPriceId')
  const affiliateUserIds = arrayUtil.attributeArray(carts, 'affiliateUserId')
  let products,
    prices = [],
    giftObjects,
    upperLimits = {},
    productCategories
  const userId = (carts[0] || {}).userId

  if (type == INDEX_PAGE_TYPE) {
    [products, prices, giftObjects, upperLimits, productCategories] = await Promise.all([
      _products(productIds, type),
      priceService.getPricesByProductIds(productIds),
      giftService.giftUserInformationObjects(productIds),
      permitService.upperLimits(productIds, userId),
      app.models.ProductCategories.find({
        where: {
          isValid: 1,
          productId: {
            inq: productIds,
          },
        },
        fields: {
          productId: true,
          categoryId: true,
        },
        order: 'categoryId DESC',
      }),
    ])
  }
  if (type == CONFIRM_PAGE_TYPE) {
    [products, prices, productCategories] = await Promise.all([
      _products(productIds, type),
      priceService.getPrices(productPriceIds),
      app.models.ProductCategories.find({
        where: {
          isValid: 1,
          productId: {
            inq: productIds,
          },
        },
        fields: {
          productId: true,
          categoryId: true,
        },
        order: 'categoryId DESC',
      }),
    ])
  }

  if (products.length == 0) {
    return {
      products,
    }
  }

  // TODO: fix DB
  prices = prices.filter(price => price.price > 0)

  productCategories = arrayUtil.index((productCategories || []), 'productId')
  products = products.map(product => {
    product.categories = (productCategories[product.id] || {}).categoryId || ''
    return product
  })

  // TODO: consider about this point
  _removeInvalidCartItem(carts, products)

  productIds = arrayUtil.attributeArray(products, 'id')
  const buyNowProductIds = arrayUtil.attributeArray(carts.filter(e => e.statusType == 1), 'productId', false)
  const userIds = arrayUtil.unique(affiliateUserIds.concat(arrayUtil.attributeArray(
    products, 'userId')))
  let productObjects = objectUtil.arrayToObject(products),
    hasDvd,
    users,
    priceObjects,
    conclusion,
    conclusionBefore,
    productUrls,
    discountCampaign
  if (type == INDEX_PAGE_TYPE) {
    [hasDvd, users, priceObjects, conclusionBefore, productUrls, discountCampaign] = await Promise
      .all([
        productService.hasDvd(productIds),
        userCommonService.getUsers(userIds),
        priceService.priceObjects(prices, productObjects),
        contractService.conclusionBefore(productObjects),
        productUrlCommonService.productDetailUrls(products),
        discountCampaignService.getCampaign(buyNowProductIds, prices),
      ])
  }

  if (type == CONFIRM_PAGE_TYPE) {
    [hasDvd, users, priceObjects, conclusion, productUrls, discountCampaign] = await Promise.all(
      [
        productService.hasDvd(productIds),
        userCommonService.getUsers(userIds),
        priceService.priceObjects(prices, productObjects),
        contractService.conclusion(productObjects),
        productUrlCommonService.productDetailUrls(products),
        discountCampaignService.getCampaign(buyNowProductIds, prices),
      ])
  }
  for (const productId in priceObjects) {
    if (priceObjects[productId]) {
      const discout0 = discountCampaign[DISCOUNT_TYPE_COUNT][productId]
      const discout1 = discountCampaign[DISCOUNT_TYPE_TOTAL_PRICE][productId]
      if (discout0 && discout1) {
        priceObjects[productId] = priceObjects[productId].map(price => {
          return _addPriceCampaign0(price, discout0)
        })
        priceObjects[productId] = priceObjects[productId].map(price => {
          return _addPriceCampaign1(price, discout1)
        })
      } else if (discout0) {
        priceObjects[productId] = priceObjects[productId].map(price => {
          return _addPriceCampaign0(price, discout0)
        })
      } else if (discout1) {
        priceObjects[productId] = priceObjects[productId].map(price => {
          return _addPriceCampaign1(price, discout1)
        })
      }
    }
  }
  users = objectUtil.arrayToObject(users)

  if (isGetSeries) {
    productObjects = await _seriesInfo(productObjects, userId)
  }

  return {
    products,
    productUrls,
    productObjects,
    priceObjects,
    giftObjects,
    users,
    hasDvd,
    conclusionBefore,
    conclusion,
    upperLimits,
  }
}

/**
 * Get series Info
 *
 * @param {Object} productObjects
 * @returns {Array}
 * @private
 */
async function _seriesInfo(productObjects, userId) {
  // TODO: optimize
  for (const productId in productObjects) {
    if (!productObjects.hasOwnProperty.call(productObjects, productId)) {
      continue
    }
    const isArticle = await _isArticle(productObjects[productId])
    if (!isArticle) {
      continue
    }

    let seriesPId = await seriesService.seriesPId(productId)
    // https://gogojungle.backlog.jp/view/OAM-15877
    if (TIED_UP_PRODUCT[seriesPId]) {
      const check = await _purchasedTiedUp(userId, [seriesPId, TIED_UP_PRODUCT[seriesPId]])
      if (!check) {
        seriesPId = TIED_UP_PRODUCT[seriesPId]
      }
    }
    const seriesInfo = await _relatedInformation(
      [{
        productId: seriesPId,
      }],
      2,
      false,
    )
    if (!seriesInfo.productObjects) {
      continue
    }
    productObjects[productId].series = {
      product: seriesInfo.productObjects[seriesPId] || {},
      prices: seriesInfo.priceObjects[seriesPId] || {},
      user: seriesInfo.users[seriesInfo.productObjects[seriesPId].userId] ||
        {},
      gifts: seriesInfo.giftObjects[seriesPId] || {},
    }
    productObjects[productId].series.product.url = Object.values(seriesInfo.productUrls)[0] || ''
  }
  return productObjects
}

/**
 * Get payment information of product in cart
 *
 * @param {Array} buyNowInformation
 * @returns {Object}
 * @private
 */
function _payments(buyNowInformation) {
  // Get product to calculate payment type
  const productObjects = buyNowInformation.reduce((productObjects, item) => {
    if (item.seriesProduct) {
      const priceId = item.priceId
        const price = item.prices.find(price => price.id == priceId) || {}
      if (price.chargeType == 2) {
        productObjects[item.seriesProduct.id] = item.seriesProduct
        return productObjects
      }
    }
    productObjects[item.product.id] = item.product
    return productObjects
  }, {})
  return paymentService.getPayments(productObjects)
}

/**
 * Get product
 *
 * @param {number} productId
 * @param {number} type in {INDEX_PAGE_TYPE, CONFIRM_PAGE_TYPE, CHECKOUT_TYPE}
 * @returns {Object}
 * @private
 */
async function _products(productIds, type) {
  let fields = {}
  if (type == INDEX_PAGE_TYPE || type == CONFIRM_PAGE_TYPE) {
    fields = {
      id: true,
      typeId: true,
      platformId: true,
      name: true,
      isIb: true,
      isAdvising: true,
      userId: true,
      isDvd: true,
      productPriceId: true,
      isFreeFirstMonth: true,
      isSpecialDiscount: true,
      specialDiscountCount: true,
      specialDiscountStartAt: true,
      specialDiscountEndAt: true,
      isLimited: true,
      upperLimit: true,
      isSubscription: true,
    }
  } else if (type == CHECKOUT_TYPE) {
    fields = {
      id: true,
      typeId: true,
      platformId: true,
      userId: true,
      affiliateMargin: true,
      productPriceId: true,
      isIb: true,
      isAdvising: true,
      isSubscription: true,
      isDvd: true,
      isSet: true,
      isFreeFirstMonth: true,
      isSpecialDiscount: true,
      specialDiscountCount: true,
      specialDiscountStartAt: true,
      specialDiscountEndAt: true,
      isLimited: true,
      upperLimit: true,
      name: true,
      usablePeriod: true,
    }
  }
  return await productService.getProducts(productIds, fields)
}

/**
 * Remove cart item with invalid products from `common.cart`
 *
 * @param {Array} carts
 * @param {Array} products
 * @returns {void}
 * @private
 */
function _removeInvalidCartItem(carts, products) {
  const invalidProductIds = arrayUtil.arrayDiff(
    arrayUtil.attributeArray(carts, 'productId'),
    arrayUtil.attributeArray(products),
  )
  cartModel.destroyAll({
    productId: {
      inq: invalidProductIds,
    },
  })
}

/**
 * Generate response object of cart for cart feature
 *
 * @param {Object} cart
 * @param {Object} product
 * @param {string} url
 * @param {Object} user
 * @param {Array} prices
 * @param {Array} gifts
 * @param {Object} affUser
 * @param {number} upperLimit
 * @returns {Object}
 * @private
 */
function _cartOject(cart, product, url, user, prices, gifts, affUser,
                    upperLimit) {
  const typeId = product.typeId
    const isMultiple = _isMultiple(product) ? 1 : undefined
    const object = {
      cartStatus: cart.statusType,
      priceId: cart.productPriceId,
      error: cart.errorCode,
      warning: cart.warningCode,
      count: 1,
      user,
      affUser,
      upperLimit,
      product: {
        id: product.id,
        name: product.name,
        platformId: product.platformId,
        typeId,
        isAdvising: product.isAdvising,
        isSubscription: product.isSubscription,
        isFreeFirstMonth: product.isFreeFirstMonth,
        isMultiple,
        url,
        categories: product.categories,
      },
    }
  if (typeId == 4) {
    object.user.oldId = userCommonService.oldDeveloperId(user.id)
  }

  if (product.series) {
    const series = product.series
    object.seriesProduct = {
      id: series.product.id,
      name: series.product.name,
      typeId: series.product.typeId,
      isAdvising: series.product.isAdvising,
      isSubscription: series.product.isSubscription,
      url: series.product.url,
    }
    series.gifts.length > 0 && (object.giftSerie = series.gifts)
    series.prices.length > 0 && (
      prices = prices.concat(series.prices.map(record => {
        record.isSeries = 1
        return record
      }))
    )
  }

  // Check nulls
  // TODO: refactor this block later
  if (prices.length == 0 || !prices.find(price => (price.id == cart.productPriceId))) {
    prices.push({
      id: cart.productPriceId,
      chargeType: 0,
      price: 0,
    })
  }
  object.prices = prices
  gifts.length > 0 && (object.gifts = gifts.filter(gift => {
    return gift.id == cart.affiliateUserId || gift.id == product.userId
  }))
  return object
}

/**
 * Edit carts form buy_later to buy_now
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} cartSessionId
 * @returns void
 * @private
 */
async function _now(productId, userId, cartSessionId) {
  await _updateStatusType(productId, userId, cartSessionId, 1)
}

function _calcPriceCampaign(price, discout) {
  const {unitType, discountValue} = discout

  let pri = 0
  if (unitType == 0 && discountValue <= 100) {
    pri = price.price - (price.price * discountValue) / 100
  }

  if (unitType == 1 && discountValue <= price.price) {
    pri = price.price - discountValue
  }
  price.price = pri > 0 ? pri : 0
  return price
}


function _addPriceCampaign0(price, discout) {
  const {unitType, discountValue} = discout

  let pri = price.price
  if (unitType == 0 && discountValue <= 100) {
    pri = pri - (pri * discountValue) / 100
    price.campaign0 = pri
    price.offType0 = unitType + 1
    price.discountValue0 = discountValue
  }

  if (unitType == 1 && discountValue <= pri) {
    pri = pri - discountValue
    price.campaign0 = pri > 0 ? pri : 0
    price.offType0 = unitType + 1
    price.discountValue0 = discountValue
  }

  return price
}

function _addPriceCampaign1(price, discout) {
  const {unitType, discountValue} = discout

  let pri = price.campaign0 != null && price.campaign0 != undefined ? price.campaign0 : price.price
  if (unitType == 0 && discountValue <= 100) {
    pri = pri - (pri * discountValue) / 100
    price.campaign1 = pri
    price.offType1 = unitType + 1
    price.discountValue1 = discountValue
  }

  if (unitType == 1 && discountValue <= pri) {
    pri = pri - discountValue
    price.campaign1 = pri > 0 ? pri : 0
    price.offType1 = unitType + 1
    price.discountValue1 = discountValue
  }

  return price
}

/**
 * Edit carts form buy now to buy later
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} cartSessionId
 * @returns void
 * @private
 */
async function _later(productId, userId, cartSessionId) {
  await _updateStatusType(productId, userId, cartSessionId, 2)
}

/**
 * Move product in cart to buy now or buy later list
 *
 * @param {number} productId
 * @param {number} userId
 * @param {number} cartSessionId
 * @param {number} newStatusType
 * @returns {void}
 * @private
 */
async function _updateStatusType(
  productId,
  userId,
  cartSessionId,
  newStatusType,
) {
  if (newStatusType !== 1 && newStatusType !== 2) {
    return
  }

  const condition = Object.assign({
      statusType: 3 - newStatusType,
    },
    helper.cartQueryCondition(userId, cartSessionId, productId),
    )

    const carts = await cartModel.find({
      where: condition,
      fields: {
        id: true,
      },
    })

  if (carts.length > 0) {
    await cartModel.updateAll({
      id: {
        inq: carts.map(cart => cart.id),
      },
    }, {
      statusType: newStatusType,
    })
  }
}

/**
 * Change quantity of item in cart
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} cartSessionId
 * @param {number} quantity
 * @returns void
 * @private
 */
async function _changeQuantity(productId, userId, cartSessionId, quantity) {
  if (Number.isInteger(quantity) && quantity > 0) {

    // Check if user can update quantity or not
    // NOTE: if user use GUI, this is alway valid
    const validateResult = await validateService.changeQuantity(
      userId,
      productId,
      cartSessionId,
    )

    if (validateResult.statusType == 1) {
      const upperLimit = validateResult.maxQuantity
      if (upperLimit === undefined || quantity < upperLimit) {
        await _updateQuantity(productId, userId, cartSessionId, quantity)
      }
    }
  }
}

/**
 * Update quantity of item in cart
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} cartSessionId
 * @param {number} quantity
 * @returns void
 * @private
 */
async function _updateQuantity(productId, userId, cartSessionId, quantity) {
  const where = helper.cartQueryCondition(userId, cartSessionId, productId)
  where.statusType = 1

  const count = await cartModel.count(where)

  // Invalid behavior on GUI
  // or nothing to do
  if (count == 0 || count == quantity) {
    return
  }

  if (count < quantity) { // ==> add more
    const lastestItem = await cartModel.findOne({
        where: where,
        order: 'id DESC',
        fields: {
          productPriceId: true,
          affiliateUserId: true,
          langType: true,
          referer: true,
          expiredAt: true,
        },
      })
      const record = {
        isValid: 1,
        isPurchase: 0,
        userId: userId,
        sessionId: cartSessionId,
        productId: productId,
        productPriceId: lastestItem.productPriceId,
        statusType: 1,
        affiliateUserId: lastestItem.affiliateUserId,
        referer: lastestItem.referer,
        langType: lastestItem.langType,
        expiredAt: lastestItem.expiredAt * 1000,
      }

      // Clone record
      const data = [...new Array(quantity - count)]
        .map(() => record)
    await cartModel.create(data)
  } else {
    // count > quantity ==> delete some
    const carts = await cartModel.find({
      limit: (count - quantity),
      order: 'id ASC',
      where: where,
      fields: {
        id: true,
      },
    })
    await cartModel.destroyAll({
      id: {
        inq: carts.map(item => item.id),
      },
    })
  }
}

/**
 * change priceId of items in cart
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} cartSessionId
 * @param {number} priceId
 * @returns void
 * @private
 */
async function _changePrice(productId, userId, cartSessionId, priceId) {
  if (Number.isInteger(priceId)) {
    // https://gogojungle.backlog.jp/view/OAM-15877
    const originPriceId = priceId
    if (TIED_UP_PRODUCT_PRICES[priceId]) {
      const check = await _purchasedTiedUp(userId,
        [TIED_UP_PRODUCT_PRICES[priceId]['PID'], TIED_UP_PRODUCT_PRICES[priceId]['TIED_UP_PID']])
      if (!check) {
        priceId = TIED_UP_PRODUCT_PRICES[priceId]['TIED_UP_PRICE_ID']
      }
    }
    // Check if user can change price or not
    // NOTE: if user use GUI, this is alway valid
    const validateResult = await validateService.changePrice(productId, priceId)
    if (validateResult.statusType == 1) {
      await _updateCart(productId, userId, cartSessionId, {
        productPriceId: originPriceId,
      })
    }
  }
}

/**
 * Update data to cart
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} cartSessionId
 * @param {Object} data
 * @returns void
 * @private
 */
async function _updateCart(productId, userId, cartSessionId, data) {
  // Update
  const condition = helper.cartQueryCondition(
    userId,
    cartSessionId,
    productId,
  )
  cartModel.updateAll(condition, data)
}

/**
 * Lock `common.carts` records for processing
 *  (update carts.is_purchase = 2)
 *
 * @param {Array} carts
 * @returns {void}
 */
function _markProcessing(carts) {
  _mark(carts, CART_PROCESSING_FLAG)
}

/**
 * Mark `common.carts` records as purchased
 *  (update carts.is_purchase = 1)
 *
 * @param {Array} carts
 * @returns {void}
 */
function _markPurchased(carts) {
  _mark(carts, CART_PURCHASED_FLAG)
}

/**
 * Mark `common.carts` records as un purchase when rollback
 *  (update carts.is_purchase = 0)
 *
 * @param {Array} cartIds
 * @returns {void}
 */
async function _markUnPurchase(cartIds) {
  if (cartIds.length == 0) {
    return
  }

  await cartModel.updateAll({
    id: {
      inq: cartIds,
    },
  }, {
    isPurchase: CART_UN_PURCHASED_FLAG,
  })
}

/**
 * Update `common.carts.is_purchase`
 *
 * @param {Array} carts
 * @param {number} isPurchase
 * @returns {void}
 */
function _mark(carts, isPurchase) {
  cartModel.updateAll({
    id: {
      inq: carts.map(cart => cart.id),
    },
  }, {
    isPurchase,
  })
}

/**
 * Update affiliate information of cart items of specific user with same product id
 *
 * @param {number} productId
 * @param {number} userId
 * @param {number} cartSessionId
 * @returns {Object}
 * @public
 */
async function _updateAffiliateInformation(
  productId,
  userId,
  cartSessionId,
) {
  const condition = helper.cartQueryCondition(userId, cartSessionId, productId)

  let carts = await cartModel.find({
    where: condition,
    order: 'id DESC',
  })
  if (carts.length == 0) {
    return
  }

  // Get latest affiliate information
  const cart = carts.find(cart => cart.affiliateUserId !=
    DEFAULT_AFFILIATE_USER_ID) || {}
    const {
      affiliateUserId,
      referer,
    } = cart

  if (!affiliateUserId) {
    return
  }

  carts = carts.filter(cart => cart.affiliateUserId != affiliateUserId)

  // All carts item have correct affiliate information
  if (carts.length == 0) {
    return
  }

  cartModel.updateAll({
    id: {
      inq: arrayUtil.column(carts),
    },
  }, {
    affiliateUserId,
    referer,
  })
}

// https://gogojungle.backlog.jp/view/OAM-15877
/**
 * Check if user purchased product or it tiedup before
 *
 * @param {Number} userId
 * @returns {Boolean}
 * @public
 */
async function _purchasedTiedUp(userId, pIDs) {
  return await helper.purchased(pIDs, userId, false, true)
}

// ------------------------------------------------------------------------------

/**
 * Validate and add product to cart
 *
 * @param {number} productId
 * @param {Object} meta
 * @returns void
 * @public
 */
async function add(productId, meta = {}, input = {}) {
  const {
    userId,
    cartSessionId,
    affiliates,
    langType,
  } = _meta(meta)

  // https://gogojungle.backlog.jp/view/OAM-15877
  if (TIED_UP_PRODUCT[productId]) {
    const check = await _purchasedTiedUp(userId, [productId, TIED_UP_PRODUCT[productId]])
    if (!check) {
      productId = TIED_UP_PRODUCT[productId]
    }
  }
  const validateResult = await validateService.addToCart(
    userId,
    productId,
    cartSessionId,
    input,
    )
    const logInfo = {
      api: `POST: .../api/v3/cart/add/${productId}`,
      meta,
      validateResult,
    }
  if (validateResult.statusType != 0) {
    const cart = await _add(validateResult, productId, userId, cartSessionId,
      affiliates, langType)

    // Cannot add item to cart
    if (!cart) {
      logInfo.cart = cart
      console.log('CART ADD errors.cartError999 logInfo %j', logInfo)
      return errors.cartError999
    }
    console.log('CART ADD %j', cart)
  }

  // Move salon/article/series product to buy_now list
  if (validateResult.error == 'cartError004') {
    await _now(productId, userId, cartSessionId)
  }

  // TODO: reconsider this block
  if (validateResult.statusType == 3) {
    validateResult.statusType = 0
  }
  logInfo.validateResult = validateResult
  console.log('CART ADD logInfo %j', logInfo)
  return validateResult
}

/**
 * Get list of items in cart for /cart
 *
 * @param {Object} meta
 * @returns {Object}
 * @public
 */
async function index(meta = {}) {
  console.log('CART INDEX %j', meta)
  const opt = {
      type: INDEX_PAGE_TYPE,
      langType: meta.langType,
    }
    const carts = await _carts(meta.userId || 0, meta.cartSessionId)
    const res = await _cartInformation(carts, 0, 0, opt)

  // Calculate payment type
  if (res.info) {
    res.info.payments = _payments(res.buyNow || [])
  }
  return res
}

async function alsoBought(meta = {}) {
  const carts = await _carts(meta.userId || 0, meta.cartSessionId)
  if (!carts.length)
    {return []}
  const productIds = arrayUtil.column(carts, 'productId')
  const data = await alsoBoughtProductService.alsoBought(productIds, carts.userId, false)
  return data
}

/**
 * Edit carts when user change cart info
 *
 * @param {number} productId
 * @param {Object} input
 * @param {Object} meta
 * @returns void
 * @public
 */
async function edit(productId, input, meta) {
  const {
      userId,
      cartSessionId,
    } = _meta(meta)
    const type = input.type || 0
  let quantity,
    priceId

  console.log('CART EDIT %j', {
    meta,
    input,
  })
  switch (type) {
    case BUY_NOW_FLAG:
      await _now(productId, userId, cartSessionId)
      break
    case BUY_LATER_FLAG:
      await _later(productId, userId, cartSessionId)
      break
    case CHANGE_QUANTITY_FLAG:
      quantity = input.quantity
      await _changeQuantity(productId, userId, cartSessionId, quantity)
      break
    case CHANGE_PRICE_FLAG:
      priceId = input.priceId
      await _changePrice(productId, userId, cartSessionId, priceId)
      break
    default:
      break
  }
  // if (type == BUY_LATER_FLAG || type == BUY_NOW_FLAG) {
    return await index(meta)
  // }
}

/**
 * Remove product from cart
 *
 * @param {number} productId
 * @param {Object} meta
 * @returns void
 * @public
 */
async function remove(productId, meta) {
  const {
      userId,
      cartSessionId,
    } = _meta(meta)
    const condition = helper.cartQueryCondition(
      userId,
      cartSessionId,
      productId,
    )

  console.log('CART REMOVE %j', {
    productId,
    meta,
  })
  await cartModel.destroyAll(condition)
  return await index(meta)
}

/**
 * Get list of items in cart for confirmation screen
 *
 * @param {number} payId
 * @param {number} dvdOpt
 * @param {Object} meta
 * @returns {Object}
 * @public
 */
async function confirm(payId, dvdOpt, meta = {}) {
  const {
      userId,
      cartSessionId,
    } = _meta(meta); const [carts, buyer] = await Promise.all([
      _carts(userId, cartSessionId, [BUY_NOW_STATUS_TYPE]),
      userId > 0 ? userCommonService.getUserFullInformation(userId) :
        undefined,
    ])

    const res = await _cartInformation(carts, payId, dvdOpt, {
      type: CONFIRM_PAGE_TYPE,
      langType: meta.langType,
    })
  if (buyer) {
    res.buyer = buyer
  }

  console.log('CART CONFIRM %j', {
    meta,
    payId,
    dvdOpt,
  })

  // In case user add an article to cart, but after that, change it into series,
  // display series information in confirm screen
  if (res.buyNow) {
    res.buyNow.forEach(item => {
      if (item.seriesProduct) {
        if (item.prices[0].chargeType == 2) {
          item.product = item.seriesProduct
        }
        delete item.seriesProduct
      }
    })

    // OAM-24191
    if (payId == 2) {
      // カード決済(SB)
      const ffmProductIds = map(filter(
        res.buyNow, e => e.product && e.product.isFreeFirstMonth && e.product.isSubscription,
      ), e => e.product.id)
      if (ffmProductIds.length) {
        const freeFirstMonthSales = await _getSaleByProductIds(ffmProductIds,
          userId, false, true, {
            productId: true,
          })
          const purchasedFFMProductIds = uniq(map(freeFirstMonthSales, 'productId'))
        res.showFFM = !purchasedFFMProductIds.length || ffmProductIds.some(e => !purchasedFFMProductIds.includes(e))
      }
    }
  }
  return res
}

/**
 * Checkout and process for payment
 *
 * @param {Object} userData
 * @param {number} payId
 * @param {number} dvdOpt
 * @param {number} userType
 * @param {Object} meta
 * @returns {Object}
 * @public
 */
async function checkout(userData, payId, dvdOpt, meta = {}) {
  let userId = meta.userId
  const carts = await _carts(
    userId,
    meta.cartSessionId, [BUY_NOW_STATUS_TYPE],
  )
  const logInfo = {
    api: 'POST: api/v3/cart/checkout',
    // userData, // TODO: don't log
    payId,
    dvdOpt,
    meta,
    carts,
  }
  // No valid items in cart
  if (carts.length == 0) {
    console.log('CART CHECKOUT invalid cart %j', logInfo)
    return {}
  }

  const userType = userData.type || 1
  let salesSessionId = helper.salesSessionId(userId)
  userId = await userService.push(
    userId,
    userData,
    salesSessionId,
    meta.ipAddress,
    meta.userAgent,
  )
  if (userType == 2) {
    salesSessionId = 'n_' + userId + '_' + salesSessionId
  }

  // Log
  logInfo.salesSessionId = salesSessionId
  console.log('CART CHECKOUT service %j', logInfo)

  // Invalid user
  if (userId == 0) {
    return {}
  }

  const productPriceIds = arrayUtil.attributeArray(carts, 'productPriceId')
  const isApiAccessRequired = helper.isApiAccessRequired(payId)
  const prices = await priceService.getPrices(productPriceIds)
  const productIds = arrayUtil.column(carts.concat(prices), 'productId', true)
  const products = await _products(productIds, CHECKOUT_TYPE)
  const getCampaignPids = arrayUtil.column(carts, 'productId', false)
  const discountCampaign = await discountCampaignService.getCampaign(getCampaignPids, prices)
  const isLoginRequired = _isLoginRequired(products)
  const isAddressRequired = LANGTYPE.includes(meta.langType || 0) ? 0 : true
  // isAddressRequired = LANGTYPE.includes(meta.langType || 0) ? 0 : _isAddressRequired(products),
  const reserverData = await _checkoutQuantXProd(products, userId)

  if ((isLoginRequired && userType != 1) ||
    (reserverData != null && !Object.keys(reserverData).length)) {
    return {}
  }

  if ((productPriceIds || []).length && isAddressRequired && !userCommonService.hasAddress(userData)) {
    return {}
  }

  const productObjects = objectUtil.arrayToObject(products)
  const [priceObjects, productSetObjects] = await Promise.all([
    priceService.priceObjects(prices, productObjects),
    productSetService.productSetObjects(products),
  ])

  for (const productId in priceObjects) {
    if (priceObjects[productId]) {
      const discount0 = discountCampaign[DISCOUNT_TYPE_COUNT][productId]
      const discount1 = discountCampaign[DISCOUNT_TYPE_TOTAL_PRICE][productId]
      if (discount0 && discount1) {
        priceObjects[productId] = priceObjects[productId].map(price => {
          return _calcPriceCampaign(price, discount0)
        })
        priceObjects[productId] = priceObjects[productId].map(price => {
          return _calcPriceCampaign(price, discount1)
        })
      } else if (discount0) {
        priceObjects[productId] = priceObjects[productId].map(price => {
          return _calcPriceCampaign(price, discount0)
        })
      } else if (discount1) {
        priceObjects[productId] = priceObjects[productId].map(price => {
          return _calcPriceCampaign(price, discount1)
        })
      }
    }
  }

  // Make sure that other processes don't interupt checkout process
  _markProcessing(carts)

  const sales = await saleService.initialize(
    carts,
    products,
    productSetObjects,
    priceObjects,
    payId,
    userId,
    userType,
    salesSessionId,
    meta.ipAddress,
    meta.userAgent,
    dvdOpt,
  )

  // Save QX info
  if (reserverData && Object.keys(reserverData).length) {
    const _salesObj = objectUtil.arrayToObject(sales || [], 'productId')
      const serialKeyData = []
    for (const i in reserverData) {
      if (!_salesObj[i]) {
        continue
      }
      console.log('CART CHECKOUT save productSerialKeys %j', {
        serialKey: reserverData[i].reserve_hash,
        productId: i,
        salesId: _salesObj[i].id,
      })
      serialKeyData.push({
        isValid: 1,
        statusType: 1,
        productId: i,
        serialKey: reserverData[i].reserve_hash,
        salesId: _salesObj[i].id,
      })
    }
    console.log('CART CHECKOUT  %j', logInfo)
    await productSerialKeysModel.create(serialKeyData)
  }

  // payId == 1 || 5 send template undefined
  if (payId == 1 || payId == 5) {
    cartMailService.sendMailToBuyer(salesSessionId, userId, 0)    
  }

  if (payId == 1 || payId == 4 || payId == 5) {
    insertWebAuth(salesSessionId)
  }

  // Cart item was added to sales table
  _markPurchased(carts)

  let result = {
    payId,
    sessionId: salesSessionId,
    typeIds: products.map(product => product.typeId),
  }

  if (payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE) {
    result.salonsPrice = sales.reduce((total, sale) => (total + (sale.price -
      sale.expensePrice) / 3), 0)
  }

  if (!isApiAccessRequired) {
    result.transferNumber = userId
  } else {
    const paymentProcessResult = await paymentService.process(
      payId,
      sales,
      salesSessionId,
      productObjects,
      userId,
      userType,
      meta.storeId,
      meta.langType,
    )
    result = Object.assign(result, paymentProcessResult)
  }

  _postCheckoutHandler(
    sales,
    carts,
    productObjects,
    priceObjects,
    productSetObjects,
    salesSessionId,
    userId,
  )
  const subPids = _subProductIds(productSetObjects)
  let [productCategories, subProducts] = await Promise.all([
    app.models.ProductCategories.find({
      where: {
        isValid: 1,
        productId: {
          inq: productIds.concat(subPids || []),
        },
      },
      fields: {
        productId: true,
        categoryId: true,
      },
      order: 'categoryId DESC',
    }),
    (subPids || []).length ? productService.getProducts(subPids, {id: true, name: true}) : [],
  ])
  productCategories = arrayUtil.index(productCategories, 'productId')
  subProducts = arrayUtil.index(subProducts, 'id')

  let totalPrice = 0,
    position = 1
  const items = {}
  for (const i in sales) {
    if (sales[i]) {
      const sale = sales[i]
      const pId = sale.productId
      const category = (productCategories[pId] || {}).categoryId
      totalPrice += sale.price
      if (items[pId]) {
        items[pId].quantity += 1
      } else {
        items[pId] = {
          id: pId,
          name: (productObjects[pId] || {}).name || (subProducts[pId] || {}).name,
          brand: sale.developerUserId,
          category,
          typeId: sale.typeId,
          list_position: position ++,
          quantity: 1,
          price: sale.price,
        }
      }
      // OAM-35663 hardcode 3 products (banktransfer refund fee - dvd ship 550JPY - dvd ship 1100JPY)
      if (pId == 11882) {
        items[pId].name = '銀行振込手数料値引き'
      } else if (pId == 8030) {
        items[pId].name = 'DVD郵送オプション'
      } else if (pId == 8031) {
        items[pId].name = 'DVD郵送オプション（速達）'
      }
    }
  }

  const trackingInfo = {
    transaction_id: salesSessionId,
    affiliation: (sales[0] || {}).affiliateUserId || 0,
    value: totalPrice,
    currency: 'JPY',
    tax: 0,
    shipping: 0,
    items: Object.values(items),
  }
  result.trackingInfo = trackingInfo
  return result
}

function _subProductIds(productSetObjects) {
  const res = {}
  const subProductIds = []
  for (const k in productSetObjects) {
    if (!productSetObjects.hasOwnProperty.call(productSetObjects, k)){
      continue
    }
    productSetObjects[k].forEach(e => {
      res[e] = ''
    })
  }
  for (const k in res) {
    if (!res.hasOwnProperty.call(res, k)){
      continue
    }
    subProductIds.push(k)
  }
  return subProductIds
}

/**
 * Handle sales data after checkout
 *
 * @param {Array} sales
 * @param {Array} carts
 * @param {Object} productObjects
 * @param {Object} priceObjects
 * @param {Object} productSetObjects
 * @param {string} salesSessionId
 * @param {number} userId
 * @returns {void}
 * @private
 */
async function _postCheckoutHandler(
  sales,
  carts,
  productObjects,
  priceObjects,
  productSetObjects,
  salesSessionId,
  userId,
) {
  // Send mail to seller (in case of free product)
  const allSaleRecords = await salesModel.find({
    where: {
      statusType: {
        inq: [PAID_SALE_STATUS, UNPAID_SALE_STATUS],
      },
      sessionId: salesSessionId,
      // price: 0,
      // isFree: 1,
      cartId: {
        inq: arrayUtil.column(carts),
      },
    },
    fields: {
      id: true,
      productId: true,
      developerUserId: true,
      price: true,
      langType: true,
      typeId: true,
      userId: true,
      isFree: true,
    },
  })

  const freeRecords = allSaleRecords.filter(sale => sale.price == 0 && sale.isFree == 1)

  if (freeRecords.length > 0) {
    cartMailService.sendMailToSeller(freeRecords, 54)
    if (freeRecords.length == allSaleRecords.length) {
      cartMailService.sendMailToBuyer(salesSessionId, userId, 191)
    }
    mailmagazineSubscribersService.create(freeRecords.filter(sale => sale.typeId == SALON_PRODUCT_TYPE_ID))
  }

  // Calculate and set value for sales records
  await Promise.all([
    affiliateService.validateAffiliateData(sales),
    contractService.addContractData(sales, productObjects),
    giftService.addGiftIdsToSalesRecords(sales),
  ])

  await saleService.calculate(
    sales,
    carts,
    productObjects,
    priceObjects,
    productSetObjects,
  )

  saleService.syncSaleRecordToFxon(sales)
}

/**
 * Remove all salons product from cart
 *
 * @param {Object} meta
 * @returns {void}
 * @public
 */
async function removeSalons(meta) {
  const carts = await _carts(meta.userId, meta.cartSessionId)
    const productIds = await productService.salonsProducts(
      carts.map(cart => cart.productId),
    )
    const deleteCartIds = carts
      .filter(cart => productIds.indexOf(cart.productId) > -1)
      .map(cart => cart.id)

  if (deleteCartIds.length > 0) {
    cartModel.destroyAll({
      id: {
        inq: deleteCartIds,
      },
    })
  }
  console.log('CART REMOVESALONS %j', {
    meta,
    deleteCartIds,
  })
}

/**
 * Add userId to cart items after login
 *
 * @param {Object} meta
 * @returns {void}
 * @public
 */
async function sync(meta) {
  // TODO: TEMPORARILY REMOVE SYNC LOGIC
  // let hasError = await validateService.sync(meta.userId, meta.cartSessionId),
  const hasError = 0
    const carts = await cartModel.find({
      where: {
        isValid: 1,
        isPurchase: 0,
        userId: 0,
        sessionId: meta.cartSessionId,
      },
      fields: {
        id: true,
        userId: true,
        affiliateUserId: true,
        referer: true,
      },
    })

  _addUserId(carts, meta.userId || 0)
  return {
    hasError: hasError || 0,
  }
}

/**
 * Rollback sales data
 *
 * @param {number} userId
 * @param {number} cartSessionId
 * @returns {void}
 * @public
 */
async function rollback(userId, sessionId) {
  console.log('CART ROLLBACK %j', {
    userId,
    sessionId,
  })

  const fields = 'id,userId,userType,cartId,statusType,productId'
  let sales = await helper.sales(userId, sessionId, fields)
  sales = sales.filter(sale => sale.statusType == UNPAID_SALE_STATUS)
  if (sales.length == 0) {
    return
  }
  if (sales[0].userType == 0) {
    nonMemberAuthService.remove(sales[0].userId)
  }
  await Promise.all([
    _markUnPurchase(sales.map(sale => sale.cartId)),
    _rollbackQuantXProds(sales),
    saleService.remove(sales),
  ])
}

/**
 * Rollback quantx product
 * @param productIds
 * @returns {Promise<void>}
 * @private
 */
async function _rollbackQuantXProds(sales) {
  const pIds = arrayUtil.column(sales, 'productId')
    const saleIds = arrayUtil.column(sales)
    // find quantx products
    const qps = await app.models.Products.find({
      where: Object.assign({}, {
        id: { inq: pIds },
      }, quantxService.quantxProdCondition()),
      fields: { id: true },
    })
    // find reserve_hash to cancel
    const serialKeys = await productSerialKeysModel.find({
      where: {
        salesId: {
          inq: saleIds,
        },
        productId: {
          inq: arrayUtil.column(qps),
        },
        isValid: 1,
      },
      fields: { serialKey: true, id: true },
    })
  console.log('CART ROLLBACK QuantX %j', { pIds, saleIds, serialKeys })
  if (!serialKeys.length) {return}

  await _cancelQuantXProds(serialKeys)
}

/**
 * Checkout quantx products
 *
 * Business steps:
 *  Try to get reserve_hash from quantx
 *    OK
 *    Failed by:
 *    1. Already reserved: cancel old reserve and renew
 *    2. Other: reject
 *
 * @param products
 * @param userId
 * @returns {Promise<{}>}
 * @private
 */
async function _checkoutQuantXProd(products, userId) {
  console.log('CART CHECKOUT QuantX BEGIN')
  const qXProducts = products.filter(e => quantxService.isQuantXProd(e))
    const qXProductIds = arrayUtil.attributeArray(qXProducts, 'id')
    const externalProds = await _getQuantXProdIds(qXProductIds)
    const reserverData = {}

  if (!qXProducts || !qXProducts.length) {
    return null
  }

  try {
    console.log('CART CHECKOUT QuantX externalProds %j', externalProds)
    const arr = []
    for (const i in externalProds) {
      if (!externalProds.hasOwnProperty.call(externalProds, i)) {
        continue
      }
      arr.push((x => {
        return new Promise((resolve, reject) => {
          console.log(
            'CART CHECKOUT QuantX call reserve %j',
            { userId, externalProductId: externalProds[x].externalProductId })
          quantxService.reserves(externalProds[x].externalProductId, userId)
            .then(x1 => {
              const pId = externalProds[x].productId
              console.log(
                'CART CHECKOUT QuantX get reserve OK %j',
                { pId, externalProductId: externalProds[x].externalProductId })
              reserverData[pId] = x1
              resolve()
            })
            .catch(async x1 => {
              /*
               * two cases:
               *   1. Already reserved => cancel reserve and try to reserve again
               *   2. Failed => reject
               * */
              if (x1.code == 400 && x1.error && x1.error.body ==
                'already reserved') {
                // already reserved case, will cancel old reserve and renew
                // get old reserve from saleId and productId in product_serial_keys table
                const pId = externalProds[x].productId
                  const sales = await salesModel.find({
                    where: {
                      productId: pId,
                      userId: userId,
                      statusType: UNPAID_SALE_STATUS,
                      isValid: 1,
                    },
                    fields: { id: true },
                  })
                console.log('CART CHECKOUT QuantX already reserved %j',
                  { pId: pId, uId: userId })
                if (!sales.length) {
                  reject(new Error(`No sale with unpaid status record for product ${pId}`))
                  return
                }
                const saleIds = arrayUtil.column(sales)
                  const serialKeys = await productSerialKeysModel.find({
                    where: {
                      salesId: {
                        inq: saleIds,
                      },
                      productId: pId,
                      isValid: 1,
                    },
                    fields: { serialKey: true, id: true },
                  })
                if (!serialKeys.length) {
                  reject(new Error
                  (`No product_serial_keys for sales ${saleIds}, pid ${pId}`))
                  return
                }
                // call cancel reserve
                await _cancelQuantXProds(serialKeys)
                try {
                  const epi = externalProds[x].externalProductId
                  console.log('CART CHECKOUT QuantX call reserve AGAIN %j',
                    { userId, externalProductId: epi, pId })
                  reserverData[pId] = await quantxService.reserves(epi, userId)
                  resolve()
                } catch (e) {
                  reject(e)
                }
              } else {
                reject(x1)
              }
            })
        })
      })(i))
    }
    await Promise.all(arr)
  } catch (err) {
    console.log('CART CHECKOUT QuantX error %j', err)
  }

  if (externalProds.length != Object.keys(reserverData).length) {
    return {}
  }
  return reserverData
}

/**
 * Get QuantX product from product ids
 * @param productIds
 * @returns {Promise<void>}
 */
async function _getQuantXProdIds(productIds) {
  return await externalProductMappingModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    fields: {
      productId: true,
      externalProductId: true,
    },
  })
}

async function _cancelQuantXProds(serialKeys) {
  for (let i = 0, l = serialKeys.length; i < l; i++) {
    console.log('CART CHECKOUT QuantX call reserve cancel %j', serialKeys[i])
    try {
      await Promise.all([
        quantxService.reservesCancel(serialKeys[i].serialKey),
        productSerialKeysModel.update({ id: serialKeys[i].id }, { isValid: 0 }),
      ])
    } catch (e) {
      // do nothing
      console.log('CART CHECKOUT QuantX call reserve cancel Error %j', e)
    }
  }
}

module.exports = {
  index,
  sync,
  add,
  edit,
  remove,
  confirm,
  checkout,
  rollback,
  removeSalons,
  alsoBought,
}
