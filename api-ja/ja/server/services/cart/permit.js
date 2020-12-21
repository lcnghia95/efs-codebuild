const app = require('@server/server')
const helper = require('./helper')
const saleCountCommonService = require('@services/common/saleCount')
const arrayUtil = require('@ggj/utils/utils/array')
const salesModel = app.models.Sales
const permitPurchaseModel = app.models.PermitPurchase
const productsModel = app.models.Products

/**
 * Get `master.permit_purchase` data
 *
 * @param {Array|number} productIds
 * @param {number|undefined} targetProductId
 * @returns {Array}
 * @private
 */
async function _permitPurchase(productIds, targetProductId) {
  return await permitPurchaseModel.find({
    where: {
      isValid: 1,
      productId: Array.isArray(productIds) ? {
        inq: productIds,
      } : productIds,
      targetProductId,
    },
    sort: 'id DESC',
    fields: {
      productId: true,
      targetProductId: true,
      upperLimit: true,
      serviceStartAt: true,
      serviceEndAt: true,
    },
  })
}

/**
 * Check max quantiy of items that user can purchased (no target product)
 *
 * @param {Array} productIds
 * @param {number} userId
 * @returns {Object}
 * @private
 */
async function upperLimits(productIds, userId) {
  // https://gogojungle.backlog.jp/view/OAM-11855
  const permitPurchases = await _permitPurchase(productIds, 0)
  if (permitPurchases.length == 0) {
    return {}
  }

  productIds = arrayUtil.column(permitPurchases, 'productId')

  const salesCounts = await saleCountCommonService.salesCounts(userId, productIds)

  return permitPurchases.reduce((result, record) => {
    const productId = record.productId || 0
    if (!result[productId]) {
      const count = salesCounts[productId] || 0
      result[productId] = record.upperLimit - count
    }
    return result
  }, {})
}

/**
 * Check max quantiy of items that user can purchased (no target product)
 *
 * @param {Object} product
 * @param {number} userId
 * @param {string} cartSessionId
 * @returns {Object}
 * @private
 */
async function upperLimit(productId, userId, cartSessionId) {
  // https://gogojungle.backlog.jp/view/OAM-11855
  const product = await productsModel.findOne({
    where: {
      id: productId,
    },
    fields: {
      id: true,
      upperLimit: true,
      isLimited: true,
    },
  })
  
  if (!product) {
    return {
      limit: 0,
      upperLimit: 0,
    }
  }
  if (!product.isLimited) {
    return {
      limit: 10,
      upperLimit: 0,
    }
  }
  
  const [cartCount, purchasedCount] = await Promise.all([
    helper.countProductInCart(productId, userId, cartSessionId),
    salesModel.salesCount(productId),
  ])
  
  return {
    limit: Math.max(0, product.upperLimit - purchasedCount - cartCount),
    upperLimit: product.upperLimit,
  }
}

/**
 * Check max quantiy of items that user can purchased (using target product)
 *
 * @param {Object} product
 * @param {number} userId
 * @param {string} cartSessionId
 * @returns {Array}
 * @private
 */
async function limit(product, userId, cartSessionId) {
  const productId = product.id
  const permitPurchases = await _permitPurchase(productId)

  if (permitPurchases.length == 0) {
    return 10
  }

  if (userId == 0) {
    return 0
  }

  // TOOD: add product set data or check using asp._info_shipping
  const targetProductIds = arrayUtil.column(permitPurchases, 'targetProductId')
  const salesCounts = await saleCountCommonService.salesCounts(userId, targetProductIds)

  if (Object.keys(salesCounts).length == 0) {
    return 0
  }

  // Check unlimited condition
  let limit = permitPurchases
    .filter(record => (record.upperLimit == 0))
    .reduce((limit, record) => {
      return limit + (salesCounts[record.targetProductId] || 0)
    }, 0)

  if (limit > 0) {
    return 10
  }

  // All have limit
  limit = permitPurchases
    .filter(record => (record.upperLimit > 0))
    .reduce((limit, record) => {
      const count = salesCounts[record.targetProductId] || 0
      return limit + count * record.upperLimit
    }, 0)

  if (limit == 0) {
    return 0
  }

  const [cartCount, purchasedCount] = await Promise.all([
    helper.countProductInCart(productId, userId, cartSessionId),
    saleCountCommonService.salesCount(userId, productId),
  ])

  return Math.min(10 - cartCount, limit - cartCount - purchasedCount)
}

function _purchasable() {
  return {
    permission: 1,
  }
}

function _unPurchasable(isOverLimit = 0) {
  return {
    permission: 0,
    overLimit: isOverLimit,
  }
}

/**
 * Check if user can buy product or not base on master.permit_purchase
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} cartSessionId
 * @returns {Array}
 * @private
 */
async function checkPermision(productId, userId, cartSessionId) {
  let permitPurchases = await _permitPurchase(productId)

  permitPurchases = permitPurchases.filter(record => record.targetProductId > 0)

  if (permitPurchases.length == 0) {
    return _purchasable()
  }

  if (userId == 0) {
    return _unPurchasable()
  }

  const targetProductIds = arrayUtil.column(permitPurchases, 'targetProductId')
  const condition = Object.assign({
    productId: {
      inq: targetProductIds,
    },
  }, salesModel.validCondition(userId))
  const sales = await salesModel.find({
    where: condition,
    fields: {
      productId: true,
      payAt: true,
    },
  })

  if (sales.length == 0) {
    return _unPurchasable()
  }
  
  const salesCounts = permitPurchases.reduce((result, record) => {
    const targetProductId = record.targetProductId
    if (!result[targetProductId]) {
      result[targetProductId] = sales.filter(sale => {
        if (sale.productId != targetProductId) {
          return false
        }
        if (sale.payAt == 0) {
          return false
        }
        if (record.serviceStartAt == 0 && record.serviceEndAt == 0) {
          return true
        }
        if (record.serviceStartAt > sale.payAt) {
          return false
        }
        if (record.serviceEndAt < sale.payAt) {
          return false
        }
        return true
      }).length
    }
    return result
  }, {})

  if (Object.keys(salesCounts).length == 0) {
    return _unPurchasable()
  }

  // Check unlimited condition
  let limit = permitPurchases
    .filter(record => (record.upperLimit == 0))
    .reduce((limit, record) => {
      return limit + (salesCounts[record.targetProductId] || 0)
    }, 0)
  if (limit > 0) {
    return _purchasable()
  }

  // All have limit
  limit = permitPurchases
    .filter(record => (record.upperLimit > 0))
    .reduce((limit, record) => {
      const count = salesCounts[record.targetProductId] || 0
      return limit + count * record.upperLimit
    }, 0)

  if (limit == 0) {
    return _unPurchasable()
  }

  const [cartCount, purchasedCount] = await Promise.all([
    helper.countProductInCart(productId, userId, cartSessionId),
    saleCountCommonService.salesCount(userId, productId),
  ])
  limit = limit - cartCount - purchasedCount
  return limit > 0 ? _purchasable() : _unPurchasable(1)
}

/**
 * Find permit purchase by product id
 * https://gogojungle.backlog.jp/view/OAM-36597
 * In permit_purchase table, find the record with targetProductId = 0
 *
 * @param {number} productId
 * @returns {void | Promise<Object>}
 * @public
 */
function getPermitPurchaseByProductId(productId) {
  return permitPurchaseModel.findOne({
    where: {
      isValid: 1,
      targetProductId: 0,
      productId,
    },
    fields: {
      productId: true,
      serviceStartAt: true,
      serviceEndAt: true,
      message: true,
    },
  })
}

module.exports = {
  limit,
  upperLimit,
  upperLimits,
  checkPermision,
  getPermitPurchaseByProductId,
}
