const app = require('@server/server')
const syncService = require('@services/common/synchronize')

// models
const channelModel = app.models.Channels
const videoModel = app.models.Videos
const videoViewableModel = app.models.VideoViewableUsers
const productModel = app.models.Products
const saleModel = app.models.Sales
const videoCommentModel = app.models.VideoComments
const userModel = app.models.Users
const reviewModel = app.models.Reviews
const priceModel = app.models.ProductPrices
const reviewStarsModel = app.models.ReviewStars
// utils
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object
const pageUtil = app.utils.paging

/**
 * Get data of video products
 * @param {Object} input
 * @param {Object} meta
 * @return {Promise<Object>}
 * @public
 */
async function index(input, meta) {
  const uId = meta.userId
  const page = input.page || 1
  const limit = input.limit || 5
  const order = {
    1: 'id DESC',
    2: 'createdAt DESC',
    3: 'createdAt ASC',
    4: 'payAt DESC',
    5: 'payAt ASC',
  }
  const orderType = input.sortType || 4

  const sales = await saleModel.find({
    where: {
      typeId: 5,
      isValid: 1,
      userType: 1,
      statusType: 1,
      saleType: 1,
      isFinished: 0,
      userId: uId,
    },
    fields: {
      productId: true,
    },
    order: order[orderType],
    limit: 0,
  })

  // Memo: If there are no recode in sales
  // => display recommend video instead of purchased video
  if (!sales.length) {
    return await _products(input)
  }

  const pIds = arrayUtil.column(sales, 'productId')

  const [videos, products, periods] = await Promise.all([
    videoModel.find({
      where: {
        isValid: 1,
        promotionMasterId: { inq: pIds },
      },
    }),
    productModel.find({
      where: {
        isValid: 1,
        id: { inq: pIds },
      },
      fields: {
        id: true,
        name: true,
        userId: true,
      },
    }),
    channelModel.find({
      where: {
        isValid: 1,
        productId: { inq: pIds },
      },
      fields: {
        productId: true,
        intervalDay: true,
      },
    }),
  ])

  const users = arrayUtil.index(
    await userModel.find({
      where: {
        id: {
          inq: arrayUtil.column(products, 'userId'),
        },
        isValid: 1,
      },
      fields: {
        id: true,
        nickName: true,
      },
    }), 'id')

  const data = products.reduce((acc, product) => {
    const video = _videos(videos, product.id)
    const user = users[product.userId]
    const period = periods.find(period => period.productId == product.id).intervalDay || null
    acc.push(objectUtil.nullFilter({
      id: video[Object.keys(video)[0]].channelId,
      seller: {
        id: product.userId,
        name: user.nickName,
      },
      videos: video,
      period: period,
      product: {
        id: product.id,
        name: product.name,
      },
    }))
    return acc
  }, [])

  const res = []
  for (const pId of pIds) {
    data.forEach(record => {
      if (pId === record.product.id) {
        res.push(record)
      }
    })
  }

  return pageUtil.addPagingInformation(
    res,
    page,
    data.length,
    limit,
  )
}

/**
 * Get video detail
 * @param {Number} id
 * @return {Promise<Object>}
 * @public
 */
async function show(id) {
  const video = await videoModel.findOne({
    where: {
      id: id,
      isValid: 1,
    },
    fields: {
      id: true,
      channelId: true,
      promotionMasterId: true,
    },
  })

  if (!video){
    return {}
  }

  const [videos, product] = await Promise.all([
    videoModel.find({
      where: {
        channelId: video.channelId,
        isValid: 1,
      },
    }),
    productModel.findOne({
      where: {
        id: video.promotionMasterId,
        isValid: 1,
      },
      fields: {
        id: true,
        name: true,
        userId: true,
        nickName: true,
        catchCopy: true,
      },
    }),
  ])

  // response videos for exist product
  if (product) {
    const user = await userModel.findOne({
        where: {
          id: product.userId,
          isValid: 1,
        },
        fields: {
          id: true,
          nickName: true,
        },
      })
      const period = await channelModel.findOne({
        where: {
          isValid: 1,
          productId: product.id,
        },
        fields: {
          productId: true,
          intervalDay: true,
        },
      })

    return objectUtil.nullFilter({
      id: video.channelId,
      seller: {
        id: product.userId,
        name: user.nickName,
      },
      videos: _videos(videos, product.id),
      period: period.intervalDay || null,
      product: {
        id: product.id,
        name: product.name,
        description: product.catchCopy,
      },
    })
  }

  // else response videos for not exist product

  return objectUtil.nullFilter({
    id: video.channelId,
    videos: videos.reduce((acc, video) => {
      const id = video.id
      acc[id] = objectUtil.nullFilter({
        id: id,
        channelId: video.channelId,
        publishedDate: video.publishedAt,
        title: video.title || null,
        watchUrl: video.watchUrl || null,
        content: video.content || null,
        liveFrom: video.liveStartAt || null,
        liveTo: video.liveEndAt || null,
        thumbnail: video.thumbnailUrl || null,
        start: video.createdAt,
      })
      return acc
    }, {}),
  })
}

/**
 * Get comments of specific video
 * @param {Number} id
 * @param {Object} meta
 * @param {Object} input
 * @return {Promise<Object>}
 * @public
 */
async function comment(id, input, meta) {
  const page = input.page || 1
    const limit = input.limit || 20
    const comments = await videoCommentModel.find({
      where: {
        videoId: id,
        isValid: 1,
        userId: meta.userId,
      },
      fields: {
        id: true,
        userId: true,
        publishedAt: true,
        content: true,
        title: true,
        videoId: true,
      },
    })

  if (comments.length === 0) {
    return {}
  }

  const uIds = arrayUtil.column(comments, 'userId')

    const users = arrayUtil.index(await userModel.find({
      where: {
        isValid: 1,
        id: {inq: uIds},
      },
    }), 'id')

    const data = comments.reduce((acc, comment) => {
      const cId = comment.id
        const usr = users[comment.userId]
      acc[cId] = objectUtil.nullFilter({
        id: cId,
        user: {
          id: usr.id,
          name: usr.nickName,
        },
        publishedDate: comment.publishedAt,
        title: comment.title || null,
        content: comment.content || null,
        videoId: comment.videoId,
      })
      return acc
    }, {})

  return pageUtil.addPagingInformation(
    data,
    page,
    Object.keys(data).length,
    limit,
  )
}

/**
 * post a comment
 * @param {Number} id
 * @param {Object} input
 * @param {Object} meta
 * @return {Promise<Object>}
 * @public
 */
async function postComment(id, input, meta) {
  const userId = meta.userId
    const isGetId = input.isGetId || 0
    const data = objectUtil.nullFilter({
      isValid: 1,
      statusType: 0,
      videoId: id,
      userId: userId,
      publishedAt: Date.now(),
      title: input.title || null,
      content: input.content || null,
    })

  if (!userId || !Object.keys(data).length || !id) {
    return {}
  }


  const newComment = await videoCommentModel.create(data)
  if (newComment) {
    syncService.syncDataToFxon('video_comments', newComment.id)
  }


  return isGetId > 0 ? {id: newComment.id} : {}
}

/**
 * Delete a comment by id
 * @param {Number} id
 * @param {Object} meta
 * @return {Promise<Object>}
 */
async function deleteComment(id, meta) {
  const comment = await videoCommentModel.findOne({
    where: {
      id: id,
      userId: meta.userId || 0,
      isValid: 1,
    },
    fields: {
      id: true,
    },
  })

  if (!comment) {
    return {}
  }

  // delete comment
  comment.isValid = 0
  await comment.save()

  // sync
  syncService.syncDataToFxon('video_comments', id, {
    is_valid: 0,
  })

  return {}
}

/**
 * Get schedule response
 * @param {Number} id
 * @param {Object} meta
 * @param {Object} input
 * @return {Promise<Object>}
 * @public
 */
async function schedule(id, input, meta) {
  const page = input.page || 1
    const limit = input.limit || 20

    const videos = await videoModel.find({
      where: {
        channelId: id,
        isValid: 1,
        userId: meta.userId,
      },
    })

  if (videos.length === 0) {
    return {}
  }
  const pIds = arrayUtil.column(videos, 'promotionMasterId')
    const product = await productModel.findOne({
      where: {
        isValid: 1,
        id: pIds[0] || 0,
      },
      fields: {
        id: true,
        name: true,
        userId: true,
      },
    })

    const video = _videos(videos, product.id, input)

    const data = objectUtil.nullFilter({
      videos: Object.keys(video).length == 0 ? [] : video,
      product: {
        id: product.id,
        name: product.name,
      },
    })

    const total = Object.keys(data.videos).length
  if (total > 0) {
    return pageUtil.addPagingInformation(
      data,
      page,
      total,
      limit,
    )
  }
  return {data: data}
}

/**
 * Get setting data for user
 * @param {Object} meta
 * @return {Promise<Object>}
 * @public
 */
async function setting(meta) {

  const purchasedVideos = await videoViewableModel.find({
    where: {
      isValid: 1,
      userId: meta.userId,
    },
    fields: {
      videoId: true,
      deliveryType: true,
    },
  })
  if (purchasedVideos.length === 0) {
    return {}
  }

  const videos =  await videoModel.find({
    where: {
      isValid: 1,
      id: {
        inq: arrayUtil.column(purchasedVideos, 'videoId'),
      },
    },
    fields: {
      id: true,
      channelId: true,
      backNumber: true,
      publishedAt: true,
      title: true,
      watchUrl: true,
      promotionUrl: true,
      thumbnailUrl: true,
      createdAt: true,
    },
    order: 'id DESC',
  })

  return videos.map(video => {
    const deliveryType = purchasedVideos.find(
      item => item.videoId == video.id,
    ).deliveryType || 0
    if (deliveryType > 0)
      {return {
        id: video.id,
        channelId: video.channelId,
        backNumber: video.backNumber,
        publishedDate: video.publishedAt,
        title: video.title,
        watchUrl: video.watchUrl,
        deliveryType: deliveryType,
        promotionUrl: video.promotionUrl,
        thumbnail: video.thumbnailUrl,
        start: video.createdAt,
      }}

    return {
      id: video.id,
      channelId: video.channelId,
      backNumber: video.backNumber,
      publishedDate: video.publishedAt,
      title: video.title,
      watchUrl: video.watchUrl,
      promotionUrl: video.promotionUrl,
      thumbnail: video.thumbnailUrl,
      start: video.createdAt,
      deliveryType: deliveryType,
    }
  })
}

/**
 * Update setting
 * @param {Object} meta
 * @param {Object} input
 * @return {Promise<Object>}
 * @public
 */
async function postSetting(input, meta) {
  const purchasedVideos = await videoViewableModel.find({
    where: {
      isValid: 1,
      userId: meta.userId,
    },
    fields: {
      id: true,
      videoId: true,
      deliveryType: true,
    },
  })


  if (purchasedVideos.length === 0) {
    return {}
  }

  input = arrayUtil.index(input)

  for (const record of purchasedVideos) {
    videoViewableModel.updateAll({
      id: record.id,
      videoId: record.videoId,
      userId: meta.userId,
      isValid: 1,
    }, {
      deliveryType :input[record.videoId].deliveryType,
    })

    // sync
    syncService.syncDataToFxon('video_viewable_users', record.id, {
      delivery_type :input[record.videoId].deliveryType,
    })
  }

  return {}
}

/**
 * Get reviews for specific channel
 * @param {Number} id
 * @param {Object} meta
 * @return {Promise<Object>}
 * @public
 */
async function review(id, meta) {
  if (!parseInt(id)) {
    return {}
  }

  const channel = await channelModel.findOne({
      where: {
        isValid: 1,
        id: id,
      },
      fields: {
        productId: true,
      },
    })

    const review = await _review(channel, meta.userId)

  if (!review) {
    return {}
  }

  return objectUtil.nullFilter({
    id: review.id,
    reviewStars: review.reviewStars || null,
    title: review.title || null,
    content: review.content || null,
    product: {
      id: channel.productId,
    },
  })
}

/**
 * Post or update review
 * @param {Number} id
 * @param {Object} input
 * @param {Object} query
 * @param {Object} meta
 * @return {Promise<Object>}
 * @public
 */
async function postReview(id, input, meta) {
  const isGetId = input.isGetId || 0

    const channel = await channelModel.findOne({
      where: {
        isValid: 1,
        id: id,
      },
      fields: {
        productId: true,
      },
    })

  if(!channel) {
    return {}
  }

  const review = await _review(channel, meta.userId)
    const data = {
      reviewStars: input.reviewStars,
      title: input.title,
      content: input.content,
      productId: channel.productId,
      isValid: 1,
      typeId: 0,
      userId: meta.userId,
      ipAddress: meta.ipAddress || '',
      userAgent: meta.userAgent || '',
    }

  if (review) {
    reviewModel.updateAll(
      {
        id: review.id,
        userId: meta.userId,
        productId: channel.productId,
      },
      data,
    )
    syncService.syncDataToFxon('reviews', review.id, data)
    return isGetId ? {id: review.id} : {}
  }

  data.publishedAt = Date.now()

  const newReview = await reviewModel.create(data)

  syncService.syncDataToFxon('reviews',newReview.id, data)

  return isGetId ? {id: newReview.id} : {}
}



/**
 * Get all videos based on product id
 * @param {Object} videos
 * @param {Number} pId
 * @return {Object}
 * @private
 */
function _videos(videos, pId, input = {}) {
  const fromDate = input.from || 0
    const toDate = input.to || 100000000000
    const isIndexById = input.isIndexById || 1

    const res = videos.reduce((acc, video) => {
      const id = video.id
      if (
        video.promotionMasterId == pId &&
        video.createdAt >= fromDate &&
        video.createdAt <= toDate
      ) {
        acc[id] = objectUtil.nullFilter({
          id: id,
          channelId: video.channelId,
          backNumber: video.backNumber,
          publishedDate: video.publishedAt,
          title: video.title || null,
          watchUrl: video.watchUrl || null,
          promotionUrl: video.promotionUrl || null,
          thumbnail: video.thumbnailUrl || null,
          start: video.createdAt,
        })
      }
      return acc
    }, {})


  return parseInt(isIndexById)
    ? res
    : objectUtil.objectToArray(res).sort((a, b) => b.id - a.id)
}

/**
 * Get review for specific channel and user
 * @param {Number} channel
 * @param {Number} userId
 */
async function _review(channel, userId) {
  return channel ? await reviewModel.findOne({
    where: {
      isValid: 1,
      productId: channel.productId,
      userId: userId,
    },
    fields: {
      id: true,
      reviewStars: true,
      title: true,
      content: true,
    },
  }) : channel
}

/**
 * Get video products
 * @param {Object} input
 * @return {Promise<Object>}
 * @private
 */
async function _products(input) {
  const isIndexById = input.isIndexById || 1
    const products = await productModel.find({
      where: {
        isValid: 1,
        typeId: 5,
        statusType: 1,
      },
      fields: {
        id: true,
        name: true,
        catchCopy: true,
      },
    })

    const pIds = arrayUtil.column(products, 'id')

    const videos = arrayUtil.index(
      await videoModel.find({
        where: {
          isValid: 1,
          promotionMasterId: {
            inq: pIds,
          },
        },
        fields: {
          id: true,
          promotionUrl: true,
          promotionMasterId: true,
          channelId: true,
        },
      }), 'promotionMasterId')

    const prices = arrayUtil.index(
      await _prices(pIds),
      'productId',
    )

    const reviews = arrayUtil.index(
      await reviewStarsModel.find({
        where: {
          isValid: 1,
          productId: {
            inq: pIds,
          },
        },
        fields: {
          productId: true,
          reviewStars: true,
          reviewCount: true,
        },
      }), 'productId')

    const data = {}

  for (const product of products) {
    const video = videos[product.id]
      const price = prices[product.id]
      const review = reviews[product.id] || null
    if (video) {
      data[product.id] = _deepFilter({
        id: product.id,
        prices: [price],
        review: review ? {
          stars: parseInt(review.reviewStars),
          count: parseInt(review.reviewCount),
        } : null,
        promotionUrl: video.promotionUrl,
        videoId: video.channelId,
        name: product.name,
        description: product.catchCopy,
      })
    }
  }


  return parseInt(isIndexById)
    ? {
      data: data,
      isPromotion: 1,
    }
    : {
      data: objectUtil.objectToArray(data),
      isPromotion: 1,
    }
}

function _deepFilter(obj) {
  Object.keys(obj).forEach(key =>{
    if (obj[key] === undefined || obj[key] === null || obj[key] === ''){
      delete obj[key]
    }
  })
  return obj
}

/**
 * get prices for products
 * @param {Object} product
 * @return {Promise<Object>}
 * @private
 */
async function _prices(pIds) {
  const prices = priceModel.find({
    where: {
      isValid: 1,
      chargeType: {gt: 0},
      price: {gt: 0},
      productId: {
        inq: pIds,
      },
    },
    fields: {
      id: true,
      price: true,
      chargeType: true,
      productId: true,
    },
  })

  return prices.map(price => {
    return {
      id: price.id,
      price: price.price,
      chargeType: price.chargeType,
      productId: price.productId,
    }
  })
}

module.exports = {
  index,
  show,
  comment,
  postComment,
  deleteComment,
  schedule,
  setting,
  postSetting,
  review,
  postReview,
}
