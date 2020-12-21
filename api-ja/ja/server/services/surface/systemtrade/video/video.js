const app = require('@server/server')
const videoModel = app.models.ProductDouga

async function show(id) {
  const video = await videoModel.findOne({
    where: {
      isValid: 1,
      productId: id,
    },
    order: 'id DESC',
    fields: {
      url: true,
      liveUrl: true,
    },
  })

  return video || {}
}

module.exports = {
  show,
}