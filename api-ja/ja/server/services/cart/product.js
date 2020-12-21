const app = require('@server/server')
const {dvdProIds} = require('./helper')

// Models
const productModel = app.models.Products

/**
 * Get `master.products` data
 *
 * @param {Array} productIds
 * @param {Object} fields
 * @returns {Array}
 * @public
 */
async function getProducts(productIds, fields) {
  const where = productModel.onSaleCondition(productIds)
  where.id = {
    inq: productIds,
  }

  let products = await productModel.find({
      where,
      order: 'id ASC',
      fields,
    }),

    // TODO: check salesCount
    salesCounts = {}
  // limitProductIds = products.reduce((result, product) => {
  //   product.isLimited === 1 && result.push(product.id)
  //   return result
  // }, [])
  // ...

  // Remove product that over limit
  products = products.filter(product => {
    const salesCount = (salesCounts || {})[product.id] || 0
    return product.isLimited == 0 || product.upperLimit > salesCount
  })
  return products
}

/**
 * Check existence of product with is_dvd = 1
 * In case, there is a product in list has is_dvd = 0, return 0
 * Return [true|false, true|false] depends on [8030 is valid, 8031 is valid]
 *
 * @param {Array} productIds
 * @returns number
 * @public
 */
async function hasDvd(productIds) {
  // Memo: should use count instead of findOne for slightly better performance
  const where = Object.assign({}, productModel.onSaleCondition(productIds), {
    id: {
      inq: productIds,
    },
    isDvd: 0,
  })
  const [hasNoDvd, dvdProducts] = await Promise.all([
    await app.models.Products.count(where),
    await productModel.find({
      where: {
        id: {
          inq: dvdProIds,
        },
        isValid: 1,
        statusType: 1,
        isSaleStop: 0,
      },
      fields: 'id',
    }),
  ])
  if (hasNoDvd > 0) {
    return 0
  }
  return dvdProIds.map(x => dvdProducts.some(e => e.id == x ) )
}


/**
 * Get all salons products
 *
 * @param {Array} productIds
 * @returns Array
 * @public
 */
async function salonsProducts(productIds) {
  const result = await productModel.find({
    where: {
      id: {
        inq: productIds,
      },
      typeId: 4,
      isAdvising: 1,
    },
    order: 'id ASC',
    fields: {
      id: true,
    },
  })
  return (result || []).map(item => item.id)
}


module.exports = {
  hasDvd,
  getProducts,
  salonsProducts,
}
