const app = require('@server/server')

// Models
const productMultiLanguages = app.models.ProductMultiLanguages

const LANGTYPE = [2, 3, 4]

/**
 * Get `master.products` data
 *
 * @param {Array} productIds
 * @param {Object} fields
 * @returns {Array}
 * @public
 */
async function getLanguages(productIds, langType) {
  if (!LANGTYPE.includes(langType)) {
    return []
  }
  
  let products = await productMultiLanguages.find({
    where: {
      languages: langType,
      productId: {
        inq: productIds
      }
    },
    order: 'id ASC',
    fields: {
      productId: true,
      name: true
    }
  })
  return products || []
}

module.exports = {
  getLanguages,
}
