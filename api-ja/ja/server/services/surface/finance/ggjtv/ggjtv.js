const app = require('@server/server')
const commonSale = require('@services/common/sale')
const commonCart = require('@services/common/cart')
const commonProduct = require('@services/common/product')

// models
const videoModel = app.models.Videos
const channelModel = app.models.Channels
const videoRankingAccessModel = app.models.VideoRankingAccess
const saleModel = app.models.Sales
const productModel = app.models.Products

// utils
const pagingUtil = app.utils.paging
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object
const stringUtil = app.utils.string
const modelUtil = require('@server/utils/model')

// lodash
const {
  shuffle,
} = require('lodash')

/**
 * Get random 5 videos data from 'video_ranking_access'
 *
 * @param {Number} limit
 * @return {Array}
 * @public
 */
async function index(limit) {
  const input = {
    limit: 100,
    channelId: 10,
  }
  const videos = await _videos(
    input, {
      channelId: input.channelId,
    },
    'publishedAt DESC',
  )

  return (videos.length < limit) ? videos : arrayUtil.shuffle(videos, limit)
}

/**
 * Get new video
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function newGGJTV(input) {
  return _videos(input, {}, 'publishedAt DESC')
}

/**
 * Get premier videos
 *
 * @param {Object} input
 * @return {Array}
 */
async function premier(input) {
  return _videos(input, {
    price: {
      gte: 1,
    },
  }, 'count DESC')
}

/**
 * Get gogojungle TV
 *
 * @param {Object} input
 * @return {Array}
 */
async function free(input) {
  return _videos(input, {
    price: 0,
  }, 'count DESC')
}

/**
 * Get popular videos
 *
 * @param {Object} input
 * @return {Array}
 */
async function popular(input) {
  return _videos(input, {}, 'count DESC')
}

/**
 * Get total of all video types
 *
 * @return {Array}
 * @public
 */
async function total() {
  const [all, freeCount, premierCount] = await Promise.all([
    videoRankingAccessModel.count({
      isValid: 1,
    }),
    videoRankingAccessModel.count({
      isValid: 1,
      price: 0,
    }),
    videoRankingAccessModel.count({
      isValid: 1,
      price: {
        gt: 0,
      },
    }),
  ])

  return {
    'new': all,
    'popular': all,
    'free': freeCount,
    'premier': premierCount,
  }
}

/**
 * Get detail data for video
 *
 * @param id
 * @param meta
 * @return {Array}
 */

async function show(id, uId) {
  // get video
  const video = await videoModel.findOne({
    where: {
      isValid: 1,
      id: id,
    },
  })

  // get channel info
  if (!video) {
    return {}
  }

  const channel = await channelModel.findOne({
    where: {
      isValid: 1,
      id: video.channelId,
    },
    fields: {
      id: true,
      productId: true,
    },
  }) || {}

  // Product data, use for determine paid/free video
  const data = !channel.productId ? [] : await commonProduct.show(channel.productId)

  // response for free video
  if (!channel.productId || (!data.typeId ? 0 : data.typeId) != 5) {
    const watchUrl = video.watchUrl ? video.watchUrl : video.promotionUrl || ''
    return {
      'id': parseInt(id),
      'publishedDate': video.publishedAt,
      'title': video.title,
      'content': stringUtil.convertCrlfBr(video.content),
      'watchUrl': _parseWatchUrl(watchUrl),
      'tags': !video.tags ? [] : video.tags.split(','),
    }
  }

  if (!data) {
    return {}
  }

  // response for fee video
  const isPurchased = await commonSale.isPurchased(uId, channel.productId, false, true)
  const watchUrl = isPurchased ? video.watchUrl : video.promotionUrl || ''
  const category = ((data.categories || '').split(',')).sort((a, b) => a - b)[0] || ''

  return {
    id: video.id,
    publishedDate: video.publishedAt,
    productName: data.productName || '',
    category,
    title: video.title,
    content: video.content,
    watchUrl: _parseWatchUrl(watchUrl),
    productId: channel.productId,
    thumbnailUrl: video.thumbnailUrl || null,
    tags: !video.tags ? [] : video.tags.split(','),
    review: objectUtil.nullFilter({
      stars: data.reviewsStars,
      count: data.reviewsCount,
    }),
    cartInfo: await commonCart.show(data.id, data, uId, isPurchased ? 1 : 0),
    outline: stringUtil.externalLink(data.productOutline) || '',
    userIntroduction: data.userSelfIntroduction || '',
    userId: data.userId,
    userName: data.nickName || '',
    userUrl: data.saleUrl || '',
    transaction: data.transaction || '',
  }
}

/**
 * Get recommend videos
 *
 * @param {Number} id
 * @param {Number} limit
 * @return {Array}
 */

async function recommend(id, limit = 0) {
  const data = await videoRankingAccessModel.findOne({
    where: {
      isValid: 1,
      videoId: id,
    },
    fields: {
      videoId: true,
      genreId: true,
    },
  })

  if (!data) {
    return []
  }

  const videos = await videoRankingAccessModel.find({
    where: {
      isValid: 1,
      channelType: 1,
      id: {
        neq: id,
      },
    },
    fields: {
      id: true,
      genreId: true,
    },
    limit: 0,
  })
  const genreId = data.genreId

  videos.forEach((video, index) => {
    videos[index].genreOrder = 2
    if (video.genreId === genreId) {
      videos[index].genreOrder = 1
    }
  })

  // sort by genre order asc, if equal genre order: sort by id desc
  videos.sort((a, b) => {
    if (a.genreOrder == b.genreOrder)
      {return b.id - a.id}
    return a.genreOrder - b.genreOrder
  })

  return _videos({
    limit,
  }, {
    id: {
      inq: arrayUtil.column(videos.slice(0, 10), 'id'),
    },
  }, 'id DESC')
}

/**
 * Get others video of same developer
 *
 * @param {number} id
 * @param {number} limit
 * @return {Array}
 */

async function others(id, limit = 0) {
  // get video to determine userId
  const video = await videoModel.findOne({
    where: {
      isValid: 1,
      id: id,
    },
  })

  if (!video) {
    return []
  }

  const products = await productModel.find({
    where: {
      isValid: 1,
      statusType: 1,
      isSaleStop: 0,
      userId: video.userId,
    },
    fields: {
      id: true,
    },
    limit: 0,
  })

  return _videos({
    limit,
  }, {
    productId: {
      inq: arrayUtil.column(products, 'id'),
    },
  }, 'id DESC')
}


/**
 * Get purchased videos of current user
 *
 * @param {Object} input
 * @param {Number} uId
 * @return {Array}
 */
async function purchased(input, uId) {
  if (!uId) {
    return []
  }

  const conditions = commonSale.saleConditions(uId, false, false)
  conditions.fields = {
    productId: true,
  }
  conditions.where.typeId = 5
  const sales = await saleModel.find(conditions)
  if (!sales.length) {
    return []
  }

  const videos = await videoRankingAccessModel.find({
    where: {
      productId: {
        inq: arrayUtil.column(sales, 'productId'),
      },
      typeId: 5,
    },
    limit: 0,
    fields: {
      id: true,
      title: true,
      channelId: true,
    },
  })

  return videos.map(video => ({
    'id': video.id,
    'title': video.title,
  }))
}

/**
 * Search by keyword for video
 *
 * @param array $input
 * @return array
 */
async function search(input, isMobile) {
  const conditions = _searchConditions(input)
  let [videos, total] = await Promise.all([
    videoRankingAccessModel.find(conditions),
    videoRankingAccessModel.count(conditions.where),
  ])

  videos = videos.map(video => _ggjtvObject(video))

  return input.page ? pagingUtil.addPagingInformation(
    videos,
    input.page || 1,
    total,
    input.limit || 20,
    isMobile ? 2 : 4,
  ) : videos
}


/**
 * Get relate video
 *
 * @param {number} id
 * @param {number} limit
 * @return {Array}
 * @public
 */
async function related(id, limit = 0) {
  const ids = await _getVideoIds(id)
  const conditions = {
    id: {
      inq: ids,
    },
  }
  const input = {
    limit,
  }
  const videos = await _videos(input, conditions, 'publishedAt DESC')

  return videos
}

/**
 * get video_ranking_access ids
 *
 * @param {number} id
 * @return array
 */
async function _getVideoIds(id) {
  const ignoreId = id > 10000 ? id - 10000 : 0
  const conditions = {
    where: {
      BackNumberURL: {
        like: 'http%',
      },
      ID: {
        neq: ignoreId,
      },
      IsValid: 1,
      CasterID: 1,
    },
    fields: {
      ID: true,
    },
  }
  const subschemas = shuffle(await modelUtil.find('douga', 'subschema', conditions))
  const videos = subschemas.slice(0, 10)

  return videos.reduce((acc, video) => {
    acc.push(video.ID + 10000)
    return acc
  }, [])
}

/**
 * generate search conditions
 *
 * @param array $input
 * @return array
 */
function _searchConditions(input) {
  const offset = pagingUtil.getOffsetCondition(
    input.page || 1,
    input.limit || 20,
  )
  const conditions = {
    where: {
      isValid: 1,
      statusType: 1,
    },
    limit: offset.limit,
    skip: offset.skip,
    order: 'publishedAt ASC',
  }
  const and = []

  if (input.tags) {
    and.push(objectUtil.commaKey(input.tags, 'tags'))
  }

  if (input.keyword) {
    and.push({
      or: [{
        title: {
          like: '%' + input.keyword + '%',
        },
      }, {
        content: {
          like: '%' + input.keyword + '%',
        },
      }],
    })
  }

  if (and.length) {
    conditions.where.and = and
  }
  return conditions
}

/**
 * Generate ggjtv object
 *
 * @param {Object} input
 * @return {Array}
 * @private
 */
function _ggjtvObject(input, isGetContent = true) {
  const pId = input.productId
  const review = objectUtil.nullFilter({
    stars: input.reviewsStars || null,
    count: input.reviewsCount || null,
  })
  const prices = objectUtil.nullFilter({
    price: input.price || null,
    discountPrice: (parseInt(input.isSpecialDiscount) || 0) === 1 ?
      (parseInt(input.specialDiscountPrice) || null) : null,
  })
  let title = input.title,
    content = input.content
    
  if (pId != 0) {
    title = input.productName
    content = input.title
  }

  return objectUtil.nullFilter({
    id: input.id,
    productId: pId,
    title: title,
    content: isGetContent ? stringUtil.stripTags(content) : null,
    publishedDate: input.publishedAt,
    thumbnailUrl: input.thumbnailUrl,
    watchUrl: input.watchUrl,
    review: Object.keys(review).length === 0 ? [] : review,
    prices: Object.keys(prices).length === 0 ? [] : [prices],
  })
}

/**
 * find videos with order, where conditions
 *
 * @param {Object} input
 * @param {Object} whereConditions
 * @param {string} orderCondition
 * @return {Object}
 */
async function _videos(input, whereConditions, orderCondition) {
  const page = parseInt(input.page) || 1
  let limit = parseInt(input.limit)
  limit = limit === 0 ? 0 : (limit || 4)

  const videos = await videoRankingAccessModel.find(
    _getConditions(page, limit, whereConditions, orderCondition),
  )

  if (videos.length === 0) {
    return []
  }
  return videos.map(video => {
    return _ggjtvObject(video)
  })
}

/**
 * get conditions for find videos
 *
 * @param {number} page
 * @param {number} limit
 * @param {Object} whereConditions
 * @param {string} orderCondition
 * @return {Object}
 */
function _getConditions(page, limit, whereConditions, orderCondition) {
  const offset = pagingUtil.getOffsetCondition(page, limit)

  return objectUtil.nullFilter({
    where: Object.assign({
      isValid: 1,
      statusType: 1,
    }, whereConditions),
    limit: offset.limit === 0 ? null : offset.limit,
    skip: offset.skip,
    order: orderCondition || 'publishedAt DESC',
  })
}

/**
 * get conditions for find videos
 *
 * @param {string} url
 * @return {string}
 */
function _parseWatchUrl(url) {
  if (url.includes('iframe')) {
    const pattern = /src="([^"]*)"/i
      const match = url.match(pattern)
    url = match[1]
  }
  return url
}


module.exports = {
  index,
  newGGJTV,
  free,
  premier,
  popular,
  purchased,
  search,
  total,
  show,
  recommend,
  others,
  related,
}
