const app = require('@server/server')
const favoriteProductModel = app.models.FavoriteProducts


/**
 * add favorite_products
 *
 * @param {number} productId
 * @param {object} meta
 * 
 */
async function add(productId, meta) {
  let userId = meta.userId
  if (!userId || !productId) {
    return
  }

  let conditions = _getCondition(productId, userId, [0, 1]),
    data = {
      isValid: 1,
      userId: userId,
      productId: productId
    }

  await favoriteProductModel.upsertWithWhere(conditions, data)
}

/**
 * delete favorite_products
 *
 * @param {number} productId
 * @param {object} meta
 * 
 */
async function remove(productId, meta) {
  let userId = meta.userId
  if (!userId || !productId) {
    return
  }

  let conditions = _getCondition(productId, userId, [1])
  await favoriteProductModel.destroyAll(conditions)
}

function _getCondition(productId, userId, isValid) {
  return {
    isValid: {
      inq: isValid
    },
    userId: userId,
    productId: productId
  }
}

module.exports = {
  add,
  remove,
}
