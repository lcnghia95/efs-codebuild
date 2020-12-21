const app = require('@server/server')
const helper = require('./helper')
const rewardService = require('./reward')
const twotierService = require('./twotier')
const syncService = require('@services/common/synchronize')
const nonMemberAuthService = require('@services/auth/nonMember')
const mailmagazineSubscribersService = require('./mailmagazineSubscribers')
const videoService = require('./video')
const {updateSpecialFeePrice} = require('./specialFee')
const {insertWebAuth} = require('./webAuth')
const {
  map,
  uniq,
  keyBy,
  filter,
} = require('lodash')
const _getSaleByProductIds = require('@services/common/sale').getSaleByProductIds

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const timeUtil = app.utils.time

// models
const salesModel = app.models.Sales
const productModel = app.models.Products

const GOGOJUNGLE_DEV_USER = 110001
const NORMAL_SALE_TYPE = 1
const UNPAID_SALE_STATUS = 0
const PAID_SALE_STATUS = 1
const BANK_TRANSFER_PAYMENT_TYPE = 1
const BANK_TRANSFER_REPAYMENT_LIMIT = 5000
const BANK_AUTO_TRANSFER_PAYMENT_TYPE = 5
const BANK_TRANSFER_REPAYMENT_PRODUCT_ID = 11882
const BANK_TRANSFER_REPAYMENT_TYPE_ID = 79
const DVD_RECORD_TYPE_ID = 81
const SALON_PRODUCT_TYPE_ID = 4
const { SALON_EXPENSE_FEE, SPECIAL_PRODUCTS } = require('@@server/common/data/hardcodedData')
const SET_CHILD_PRODUCT_STATUS_TYPE = 5
const NON_MEMBER_USER_TYPE = 2
const DEFAULT_AFFILIATE_USER_ID = 0
const GOGO_AFFILIATE_USER_ID = 120001

const dvdInformation = {
  1: {
    productId: 8030,
    price: 550,
  },
  2: {
    productId: 8031,
    price: 1100,
  },
}

/**
 * Initialize sale record data
 *
 * @param {Object} cart
 * @param {Object} product
 * @param {number} price
 * @param {number} chargeType
 * @param {Object} information
 * @param {number} expensePrice
 * @param {number} langType
 * @param {Array} purchasedFFMProductIds
 * @returns {Object}
 * @private
 */
function _initSaleRecord(
  cart,
  product,
  price,
  chargeType,
  information,
  expensePrice,
  langType,
  isUserPurchasedBefore,
  purchasedFFMProductIds,
) {
  let affiliateUserId = cart.affiliateUserId

  const referer = cart.referer || ''
  const typeId = product.typeId
  const isFree = (price == 0)
  const payId = isFree ? 0 : information.payId
  const isAuto = (payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE) && (typeId == SALON_PRODUCT_TYPE_ID)

  if (isAuto) {
    price = price * 3
  }

  // https://gogojungle.backlog.jp/view/OAM-11978#comment-50457821
  if (referer.length == 0) {
    if (cart.affiliateUserId == DEFAULT_AFFILIATE_USER_ID) {
      if (isUserPurchasedBefore) {
        // affiliate_user_id = 0 & referer = NULL
        affiliateUserId = GOGO_AFFILIATE_USER_ID
      }
    }
  } else if (cart.affiliateUserId != DEFAULT_AFFILIATE_USER_ID) {
    if (affiliateUserId != GOGO_AFFILIATE_USER_ID) {
      if (Date.now() > cart.expiredAt * 1000) {
        if (isUserPurchasedBefore) {
          // valid affiliate_user_id & referer but expired
          affiliateUserId = GOGO_AFFILIATE_USER_ID
        } else {
          affiliateUserId = DEFAULT_AFFILIATE_USER_ID
        }
      }
    }
  }

  // Handle for free first month product
  if (product.isFreeFirstMonth) {
    if (purchasedFFMProductIds.length == 0 || !purchasedFFMProductIds.includes(product.id)) {
      price = 0
    }
  }

  const serviceEndAt = isFree ? (product.usablePeriod ? timeUtil.addDays(product.usablePeriod, Date.now()) : information.serviceEndAt) : null
  const productId = parseInt(product.id)
  const isSpecial = SPECIAL_PRODUCTS.includes(productId)
  return app.utils.object.nullFilter({
    isValid: 1,
    statusType: isFree && !product.isIb && !isSpecial ? PAID_SALE_STATUS : UNPAID_SALE_STATUS,
    salesType: NORMAL_SALE_TYPE,
    typeId,
    productId,
    isSet: product.isSet,
    isFree: +isFree,
    chargeType,
    payId,
    price: price + expensePrice,
    expensePrice,
    userId: information.userId,
    affiliateUserId,
    userType: 2 - information.userType, // MEMO: in code: non-member is 1, in DB: non-member is 0
    developerUserId: product.userId,
    payAt: isFree && !product.isIb && !isSpecial ? information.payAt : null,
    serviceStartAt: isFree && !product.isIb && !isSpecial ? information.serviceStartAt : null,
    serviceEndAt: (product.isIb || isSpecial) ? null : serviceEndAt,
    cartId: cart.id,
    sessionId: information.salesSessionId,
    ipAddress: information.ipAddress,
    userAgent: information.userAgent,
    referer: cart.referer,
    langType,
  })
}

/**
 * Generate idx for caching sale record
 *
 * @param {Object} cart
 * @returns {Object}
 * @private
 */
function _cacheIndex(cart) {
  return cart.productId + '_' + cart.productPriceId + '_' + cart.affiliateUserId
}

/**
 * Dvd record
 *
 * @param {Object} information
 * @returns {Object}
 * @private
 */
function _dvdSalesRecord(information) {
  const price = dvdInformation[information.dvdOpt].price
  return {
    isValid: 1,
    statusType: UNPAID_SALE_STATUS,
    salesType: NORMAL_SALE_TYPE,
    typeId: DVD_RECORD_TYPE_ID,
    productId: dvdInformation[information.dvdOpt].productId,
    chargeType: 1, // TODO: confirm
    payId: information.payId,
    price,
    feePrice: price,
    userId: information.userId,
    userType: information.userType,
    developerUserId: GOGOJUNGLE_DEV_USER,
    sessionId: information.salesSessionId,
    ipAddress: information.ipAddress,
    userAgent: information.userAgent,
  }
}

/**
 * Repayment record
 *
 * @param {Object} information
 * @returns {Object|undefined}
 * @private
 */
function _repaymentRecord(information) {
  const price = information.totalPrice < 30000 ? -220 : -440
  return {
    isValid: 1,
    statusType: UNPAID_SALE_STATUS,
    salesType: NORMAL_SALE_TYPE,
    typeId: BANK_TRANSFER_REPAYMENT_TYPE_ID,
    productId: BANK_TRANSFER_REPAYMENT_PRODUCT_ID,
    chargeType: 1,
    payId: information.payId,
    price,
    feePrice: price,
    userId: information.userId,
    userType: information.userType,
    developerUserId: GOGOJUNGLE_DEV_USER,
    sessionId: information.salesSessionId,
    ipAddress: information.ipAddress,
    userAgent: information.userAgent,
  }
}

/**
 * Add `asp._info_shipping` data
 *
 * @param {Array} sales
 * @returns {void}
 * @private
 */
function _generateFxonInfoShippingRecord(sales) {
  // TODO: consider insert Data
  return app.models.FxonInfoShipping.create(sales.map((sale) => {
    return {
      Id: sale.id,
      IsValid: 1,
      // ProductId: sale.productId,
      // BuyUserId: sale.userId,
      // PaypalTxnID: sale.sessionId,
    }
  }))
}

/**
 * Generate sub sales records for product set
 *
 * @param {Object} sale
 * @param {Array} setData
 * @param {Array} subProducts
 * @returns {Array}
 * @private
 */
function _subRecords(sale, setData, subProducts) {
  return setData.map(id => {
    const product = subProducts.find(product => product.id == id) || {}
    return Object.assign({},
      sale, {
        productId: id,
        price: 0,
        typeId: product.typeId || 0,
        salesType: SET_CHILD_PRODUCT_STATUS_TYPE,
      },
    )
  })
}

/**
 * Check if sale record is for salon product
 *
 * @param {Object} sale
 * @returns {void}
 * @private
 */
function _isSaleRecordOfSalon(sale) {
  return sale.typeId == SALON_PRODUCT_TYPE_ID
}

/**
 * Calculate serviceEndAt for sale record
 *
 * @param {Array} sales
 * @returns {void}
 * @private
 */
// function _calculateServiceEndAt(sale, serviceStartAt) {
//   const payId = sale.payId
//   if (payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE) {
//     return timeUtil.addMonths(3, serviceStartAt)
//   }
//   return timeUtil.addMonths(1, serviceStartAt)
// }

/**
 * Calculate serviceEndAt for sale record
 *
 * @param {Array} sales
 * @returns {void}
 * @private
 */
function _newCalServiceEndAt(sale, serviceStartAt, sysSubProduct, product) {
  if (product.isIb || SPECIAL_PRODUCTS.includes(parseInt(product.id))) {
    return null
  }

  const payId = sale.payId

  if (payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE) {
    return timeUtil.addMonths(3, serviceStartAt)
  }

  if (product.usablePeriod) {
    return timeUtil.addDays(product.usablePeriod, serviceStartAt)
  }

  if (sysSubProduct) {
    return timeUtil.addDays(34, serviceStartAt)
  }

  return timeUtil.addMonths(1, serviceStartAt)
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

// xxx

// ------------------------------------------------------------------------------
/**
 * calculate prices of sales
 *
 * @param {Array} sales
 * @param {Array} carts
 * @param {Object} productObjects
 * @param {Object} priceObjects
 * @param {Object} productSetObjects
 * @returns {void}
 * @public
 */
async function calculate(
  sales,
  carts,
  productObjects,
  priceObjects,
  productSetObjects,
) {
  const affiliateUserIds = arrayUtil.column(sales, 'affiliateUserId')
  const twotiers = await twotierService.twotiers(affiliateUserIds)
  await Promise.all(sales.map(async sale => {
    const productId = sale.productId
    const product = productObjects[productId]
    if (product) {
      const affiliateUserId = sale.affiliateUserId
      const twotier = twotiers[affiliateUserId] || {}
      const setData = productSetObjects[productId] || []
      await rewardService.calculateReward(sale, product, twotier, setData)
      return sale.save()
    }
  }))
}

/**
 * Generate sales data when user checkout cart
 *   Memo: price detail is not included here
 *
 * @param {Array} carts
 * @param {Array} products
 * @param {Object} productSetObjects
 * @param {Object} priceObjects
 * @param {number} payId
 * @param {number} userId,
 * @param {number} userType,
 * @param {string} salesSessionId
 * @param {string} ipAddress
 * @param {string} userAgent
 * @param {number} dvdOpt,
 * @returns {Array}
 * @public
 */
async function initialize(
  carts,
  products,
  productSetObjects,
  priceObjects,
  payId,
  userId,
  userType,
  salesSessionId,
  ipAddress,
  userAgent,
  dvdOpt,
) {
  let sales = {} // Cache in case of add many items at once
  const productObjects = keyBy(products, 'id')
  const isFreeFirstMonthProductIds = uniq(map(filter(
    products, ['isFreeFirstMonth', 1],
  ), 'id'))
  const isAuto = payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE
  let expensePrice = isAuto ? SALON_EXPENSE_FEE : 0
  const now = Date.now()
  const pricesArray = arrayUtil.objectToArray(priceObjects)
  const additionInformation = {
    payId,
    userId,
    userType,
    salesSessionId,
    ipAddress,
    userAgent,
    payAt: now,
    serviceStartAt: now,
    serviceEndAt: timeUtil.addMonths(1, now),
  }
  const [isUserPurchasedBefore, subProducts, freeFirstMonthSales] = await Promise.all(
    [
      // https://gogojungle.backlog.jp/view/OAM-11978#comment-50457821
      helper.isUserPurchasedBefore(userId),
      productModel.find({
        where: {
          id: {
            inq: _subProductIds(productSetObjects),
          },
        },
        fields: {
          id: true,
          typeId: true,
        },
      }),
      _getSaleByProductIds(isFreeFirstMonthProductIds, userId, false, true, {
        productId: true,
      }),
    ])

  const purchasedFFMProductIds = uniq(map(freeFirstMonthSales, 'productId'))
  
  // Initialize data for privacy.sales
  const salesData = carts.reduce((result, cart) => {
    const productPriceId = cart.productPriceId
    const prices = pricesArray.find(prices => {
      return (prices[0] || {}).id == productPriceId
    }) || []
    const priceObject = prices[0] || {}
    const productId = priceObject.productId || cart.productId
    const product = productObjects[productId] || []

    // Ignore invalid product
    if (!product) {
      return result
    }

    const price = priceObject.price || 0
    const chargeType = priceObject.chargeType || 0
    const setData = productSetObjects[productId] || []
    // Generate record
    const idx = _cacheIndex(cart)
    const sale = sales[idx] || _initSaleRecord(cart, product, price, chargeType,
      additionInformation, expensePrice, cart.langType,
      isUserPurchasedBefore, purchasedFFMProductIds)

    if (isAuto) {
      expensePrice -= sale.expensePrice
    }

    // Cache
    if (!sales[idx]) {
      sales[idx] = sale
    }

    // Add sale record
    result.push(sale)

    // Add sale record for sub products of set
    if (setData.length > 0) {
      result = result.concat(_subRecords(sale, setData, subProducts))
    }

    return result
  }, [])

  // DVD郵送オプション
  if (dvdOpt > 0) {
    additionInformation.dvdOpt = dvdOpt
    salesData.push(_dvdSalesRecord(additionInformation))
  }

  // 銀行振込手数料
  if (payId == BANK_TRANSFER_PAYMENT_TYPE) {
    const totalPrice = helper.totalPrice(salesData)
    if (totalPrice > BANK_TRANSFER_REPAYMENT_LIMIT) {
      additionInformation.totalPrice = totalPrice
      salesData.push(_repaymentRecord(additionInformation))
    }
  }

  // Generate sales records (with no detail price data)
  sales = await salesModel.create(salesData)
  await _generateFxonInfoShippingRecord(sales)
  syncSaleRecordToFxon(sales)
  videoService.videoViewableUser(sales)
  return sales.filter(sale => sale.statusType == UNPAID_SALE_STATUS)
}

/**
 * Mark sales records is PAID
 *
 * @param {string} sessionId
 * @returns {void}
 * @public
 */
async function markCheckoutSuccess(sessionId) {
  if (sessionId.toString().length == 0) {
    return
  }

  const now = Date.now()
  let sales = await salesModel.find({
    where: {
      isValid: 1,
      salesType: {
        inq: [
          NORMAL_SALE_TYPE,
          SET_CHILD_PRODUCT_STATUS_TYPE,
        ],
      },
      statusType: UNPAID_SALE_STATUS,
      sessionId,
      cancelType: 0,
    },
    fields: {
      id: true,
      payId: true,
      typeId: true,
      userId: true,
      userType: true,
      productId: true,
      chargeType: true,
    },
  })

  if (sales.length == 0) {
    return
  }
  
  const allPids = sales.map(e => e.productId)
  let  products = await productModel.find({
      where: {
        id: {
          inq: allPids,
        },
      },
      fields: {
        id: true,
        typeId: true,
        isSubscription: true,
        usablePeriod: true,
        isIb: true,
      },
    }),
    newSubProduct = products.filter(product => product.isSubscription == 1 && product.typeId == 1)

  newSubProduct = arrayUtil.index(newSubProduct)
  products = arrayUtil.index(products)

  sales = sales.map(sale => {
    const productId = parseInt(sale.productId)
    const product = products[productId]
    sale.statusType = SPECIAL_PRODUCTS.includes(productId) ? UNPAID_SALE_STATUS : PAID_SALE_STATUS
    sale.payAt = (product.isIb || SPECIAL_PRODUCTS.includes(productId)) ? 0 : now
    sale.serviceStartAt = (product.isIb || SPECIAL_PRODUCTS.includes(productId)) ? 0 : now
    sale.serviceEndAt = _newCalServiceEndAt(sale, now, newSubProduct[sale.productId], product)
    return sale
  })
  
  await Promise.all([
      ...sales.map(async sale => {
      return await sale.save()
    }),
    updateSpecialFeePrice(sales),
  ])
  insertWebAuth(sessionId)
  mailmagazineSubscribersService.create(sales.filter(_isSaleRecordOfSalon))
  syncSaleRecordToFxon(sales)
}

/**
 * Mark sales records as CANCELED
 *
 * @param {string} sessionId
 * @returns {void}
 * @public
 */
async function cancelCheckout(sessionId) {
  const sales = await salesModel.find({
    where: {
      isValid: 1,
      salesType: NORMAL_SALE_TYPE,
      statusType: UNPAID_SALE_STATUS,
      cancelType: 0,
      sessionId,
    },
    fields: {
      id: true,
    },
  })

  if (sales.length == 0) {
    return
  }

  await salesModel.updateAll({
    id: {
      inq: sales.map(sale => sale.id),
    },
  }, {
    cancelType: 1,
    cancelAt: Date.now(),
  })

  syncSaleRecordToFxon(sales)
}

/**
 * Delete sales records
 *
 * @param {Array} sales
 * @returns {void}
 * @public
 */
async function remove(sales) {
  if (sales.length == 0) {
    return
  }

  salesModel.updateAll({
    id: {
      inq: sales.map(sale => sale.id),
    },
  }, {
    isValid: 0,
  })
  syncSaleRecordToFxon(sales, {
    is_valid: 0,
  })

  // Remove nom member
  const head = sales[0] || {}
  if (head.userType == NON_MEMBER_USER_TYPE) {
    nonMemberAuthService.remove(head.userId || 0)
  }

}

/**
 * Sync sale record to fx-on
 *
 * @param {Array} sales
 * @param {Object} data
 * @returns {void}
 * @public
 */
// function syncSaleRecordToFxon(sales, data) {
//   sales.forEach(sale => {
//     syncService.syncDataToFxon('sales', sale.id, data || {
//       is_valid: 1,
//     })
//   })
// }

function syncSaleRecordToFxon(sales, data, isNewService = true) {
  // Using new sync service to sync data from sales to _info_shipping
  if(isNewService) {
    const saleIds = arrayUtil.column(sales, 'id', true)
    return syncService.newSyncDataToFxon('sales', saleIds)
  } else { // TODO - Long : Remove this case when new sync service stable operation
    sales.forEach(sale => {
      syncService.syncDataToFxon('sales', sale.id, data || {
        is_valid: 1,
      })
    })
  }
}


function ignoreProductIds() {
  return [BANK_TRANSFER_REPAYMENT_PRODUCT_ID, dvdInformation[1].productId, dvdInformation[2].productId]
}

module.exports = {
  remove,
  calculate,
  initialize,
  cancelCheckout,
  markCheckoutSuccess,
  syncSaleRecordToFxon,
  ignoreProductIds,
}
