const app = require('@server/server')

/**
 * Get product_sets data
 *
 * @param {Array} products
 * @returns {Object}
 * @public
 */
async function productSetObjects(products) {
  let ids = products
    .filter(product => (product.isSet == 1))
    .map(product => product.id)

  if (ids.length == 0) {
    return {}
  }

  let data = await app.models.ProductSets.find({
    where: {
      isValid: 1,
      statusType: 1,
      parentProductId: {
        inq: ids
      },
    },
    fields: {
      productId: true,
      parentProductId: true,
    }
  })

  return data.reduce((result, record) => {
    let idx = record.parentProductId
    if (!result[idx]) {
      result[idx] = []
    }
    result[idx].push(record.productId)
    return result
  }, {})
}

module.exports = {
  productSetObjects,
}
