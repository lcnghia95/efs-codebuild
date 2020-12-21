const app = require('@server/server')
const favoriteProductModel = app.models.FavoriteProducts

async function isFavorite(pId, userId = 0) {
  if (userId === 0) {
    return false
  }
  return !! (await favoriteProductModel.findOne({
    where: {
      isValid: 1,
      userId: userId,
      productId: pId,
    },
    fields: {id: true},
    order: 'id DESC'
  }))
}

module.exports = {
  isFavorite,
}
