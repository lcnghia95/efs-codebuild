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
  const now = Date.now()
    const condition = {
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
      ],
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
    const where = await _onSaleCondition(productId)
      const product = await Products.findOne({
        where,
        fields: fields,
      })
    if (!product) {
      return product
    }
    if (product.isLimited == 1) {
      const salesCount = await app.models.SalesCount.findOne({
        where: {
          productId,
        },
        fields: {
          salesCount: true,
        },
      })
      if (salesCount && salesCount.salesCount > product.upperLimit) {
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
