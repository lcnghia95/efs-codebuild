const app = require('@server/server')

const arrayUtil = require('@ggj/utils/utils/array')

/**
 * create videoViewableUser
 *
 * @param {Array} sales
 * @return {Void}
 * @public
 */
async function videoViewableUser(sales) {
  const productIds = arrayUtil.column(sales, 'productId', true)
  const videos = await _videos(productIds)

  const result = sales.reduce((result, sale) => {
    const subVideos = videos[sale.productId]

    if (!subVideos) {
      return result
    }

    subVideos.map(video => {
      result.push({
        isValid: 1,
        videoId: video.id,
        userId: sale.userId,
        salesId: sale.id,
      })
    })

    return result
  }, [])

  if (result.length) {
    app.models.VideoViewableUsers.create(result)
  }
}

/**
 * create videoViewableUser
 *
 * @param {Array} sales
 * @return {Void}
 * @public
 */
async function _videos(productIds) {
  const videos = await app.models.VideoRankingAccess.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
      price: {
        gt: 0,
      },
    },
    fields: {
      id: true,
      productId: true,
    },
  })

  return videos.reduce((result, video) => {
    if (!result[video.productId]) {
      result[video.productId] = []
    }
    result[video.productId].push(video)
    return result
  }, {})
}

module.exports = {
  videoViewableUser,
}
