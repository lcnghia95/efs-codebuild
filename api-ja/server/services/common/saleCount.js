const app = require('@server/server')

const salesModel = app.models.Sales

/**
 * Count number of product purchased by user
 *
 * @param {number} userId
 * @param {number} productId
 * @returns {number}
 * @public
 */
async function salesCount(userId, productId) {
  // Check null
  if (userId == 0) {
    return 0
  }
  let condition = Object.assign({
      productId
    }, salesModel.validCondition(userId)),
    count = await salesModel.count(condition)
  return count || 0
}

/**
 * Count number of product purchased by user
 *
 * @param {number} userId
 * @param {Array} productIds
 * @returns {Object}
 * @public
 */
async function salesCounts(userId, productIds) {
  // Check null
  if (userId == 0 || !Array.isArray(productIds) || productIds.length == 0) {
    return {}
  }
  let condition = Object.assign({
      productId: {
        inq: productIds
      }
    }, salesModel.validCondition(userId)),
    sales = await salesModel.find({
      where: condition,
      fields: {
        productId: true
      }
    })
  return sales.reduce((result, sale) => {
    if (!result[sale.productId]) {
      result[sale.productId] = 0
    }
    result[sale.productId] = result[sale.productId] + 1
    return result
  }, {})
}

module.exports = {
  salesCounts,
  salesCount
}
