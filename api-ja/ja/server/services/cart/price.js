const app = require('@server/server')
const productCommonService = require('@services/common/product')

/**
 * Get `master.product_prices` data
 *
 * @param {Object} where
 * @returns {Array}
 * @private
 */
async function _find(where) {
  return await app.models.ProductPrices.find({
    where,
    fields: {
      id: true,
      productId: true,
      chargeType: true,
      price: true,
      specialDiscountPrice: true,
    },
  })
}

/**
 * Generate response object of price for cart feature
 *
 * @param {Object} price
 * @param {Object} product
 * @returns {Object}
 * @private
 */
async function _priceObject(price, product) {
  let object = {
    id: price.id,
    chargeType: price.chargeType,
    price: price.price,
    productId: product.id,
  }

  if (price.specialDiscountPrice > 0) {
    let onDiscount = await productCommonService.onDiscount(product)
    if (onDiscount) {
      object.price = price.specialDiscountPrice
      object.oldPrice = price.price
    }
  }
  return object
}

/**
 * Get prices by productId
 *
 * @param {Array} productIds
 * @returns {Array}
 * @public
 */
async function getPricesByProductIds(productIds) {
  return await _find({
    isValid: 1,
    statusType: 1,
    productId: {
      inq: productIds
    }
  })
}

/**
 * Get prices
 *
 * @param {Array} priceIds
 * @returns {Array}
 * @public
 */
async function getPrices(priceIds) {
  return await _find({
    id: {
      inq: priceIds
    },
    isValid: 1,
    statusType: 1,
  })
}

/**
 * Get list of prices for products in cart
 *   response will be group by productId
 *
 * @param {Array} prices
 * @param {Object} productObjects
 * @returns {Object}
 * @public
 */
async function priceObjects(prices, productObjects) {
  let result = {}
  for (const idx in prices) {
    let productId = prices[idx].productId,
      price = await _priceObject(
        prices[idx],
        productObjects[productId] || {}
      )
    if (!result[productId]) {
      result[productId] = []
    }
    result[productId].push(price)
  }
  return result
}

module.exports = {
  getPrices,
  priceObjects,
  getPricesByProductIds,
}
