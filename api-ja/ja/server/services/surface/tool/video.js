
const app = require('@server/server')
const videoModel = app.models.ProductDouga

async function getVideos(id, input) {
  return await videoModel.find({
    where: {
      isValid: 1,
      productId: id,
    },
    order: 'id DESC',
    fields: {
      url: true,
    },
    limit: input.limit || 3,
  }) || {}
}

module.exports = {
  getVideos,
}