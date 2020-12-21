const app = require('@server/server')

/**
 * Get product on sale condition
 *
 * @param {number|null} productId
 * @returns {Object}
 * @private
 */
function _onSaleCondition(productId = null) {
  // let salesCount = productId ? await app.models.Sales.salesCount(productId) : 0
  let now = Date.now(),
    condition = {
      id: productId,
      isValid: 1,
      statusType: 1,
      isSaleStop: 0,
      isSignalOnly: 0,
      isOnlyPay: 0, // TODO: check biz logic here!!!
      and: [
        {or: [{isReservedStart: 0}, {isReservedStart: 1, reservedStartAt: {lt: now}}]},
        {or: [{isReservedEnd: 0}, {isReservedEnd: 1, reservedEndAt: {gt: now}}]},
        // {or: [{isLimited: 0}, {isLimited: 1, upperLimit: {gt: salesCount}}]}
      ]
    }
  !productId && (delete condition.id)
  return condition
}

module.exports = async function(Products) {
  /**
   * Find onSale product
   *
   * @param {number} productId
   * @returns {Object|null}
   * @public
   */
  Products.findOnSale = async function(productId, fields) {
    fields.isLimited = true
    fields.upperLimit = true
    let where = await _onSaleCondition(productId),
      product = await Products.findOne({
        where,
        fields: fields
      })
    if (!product) {
      return product
    }
    if (product.isLimited == 1) {
      // TODO: get salesCount for better performance
      let salesCount = await app.models.Sales.salesCount(productId)
      if (salesCount > product.upperLimit) {
        return null
      }
    }
    return product
  }

  /**
   * Get on-sale condition
   *
   * @param {number|null} productId
   * @returns {Object}
   * @public
   */
  Products.onSaleCondition = function(productId = null) {
    return _onSaleCondition(productId)
  }
}
