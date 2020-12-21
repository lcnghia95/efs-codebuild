const app = require('@server/server')

// Models
const salonModel = app.models.Salons
const mailMagazineModel = app.models.Mailmagazine
const threadModel = app.models.Threads
const articleModel = app.models.Articles
const columnModel = app.models.Columns

// Services
const cart = require('@services/common/cart')
const user = require('@services/common/user')
const time = require('@server/utils/time')
const review = require('@services/surface/review/product')
const product = require('@services/common/product')

const {
  find,
  findOne,
} = require('@server/utils/model')

// Utils
const arrayUtil = require('@ggj/utils/utils/array')
const stringUtil = app.utils.string
const objectUtil = app.utils.object

const IGNORE_SALON_IDS = [3, 117, 129, 144, 153, 165, 218, 223, 234, 378, 381]
const IMG_HOST = process.env.IMG_HOST_URL
const FX_HOST = process.env.FXON_HOST_URL


/**
 * get salons detail
 *
 * @param {number} salonId
 * @return {object}
 * @public
 */
async function show(salonId, userId) {
  if (IGNORE_SALON_IDS.includes(salonId)) {
    return {}
  }

  const salon = await _salon(salonId)

  if (!salon || !Object.keys(salon).length || !salon.productId) {
    return {}
  }

  const productId = salon.productId
  const data = await product.show(productId, {typeIds: '4'})

  if (!data || !Object.keys(data).length) {
    return {}
  }

  // TODO: OPTIMIZE THIS BLOCK
  const url = `assets/pc/salons/profile/${productId}.jpg`
  const nickName = data.nickName
  const profile = salon.ownerProfile
  const [salonDetailObj, { isExist }] = await Promise.all([
    _salonDetailObject(productId, data, salon, {
      profile: !profile ? null : profile,
      nickName: nickName,
    }, userId),
    await app.utils.http.get(`${IMG_HOST}exist?path=${url}`),
  ])

  salonDetailObj.profileImg = isExist ? '/img/' + url : null

  return salonDetailObj
}

/**
 * Generate salon detail object
 *
 * @param  {Number} pId
 * @param  {Object} data : product info
 * @param  {Object} salon : salon info
 * @param  {Object} extend : extends condition
 * @return {Promise<Object>}
 * @private
 */
async function _salonDetailObject(pId, data, salon, extend = {}, userId = 0) {
  const uId = data.userId
  const devUserInfo = findOne(
    'asp',
    '_info_devuser', 
    {
      where: {
        id: user.oldDeveloperId(uId),
      },
      fields: {
        blogUrl: true,
      },
    },
  )
  const category = (data.categories.split(',')).sort((a, b) => a - b)[0] || ''
  return Object.assign(
    {}, {
      id: pId,
      salonId: salon.id,
      name: data.productName,
      category,
      outline: stringUtil.externalLink(data.productOutline),
      cartInfo: await cart.show(pId, data, userId),
      description: data.catchCopy,
      transaction: data.isTransaction ? (data.transaction || null) : null,
      userIntroduction: data.userSelfIntroduction,
      userId: uId,
      userUrl: devUserInfo.blogUrl || data.saleUrl || '',
      reviewsStars: data.reviewsStars,
      reviewsCount: data.reviewsCount,
    }, extend)
}

/**
 * get salons
 *
 * @param {Array} productIds
 *
 * @return {array}
 * @private
 */
async function _salon(salonId) {
  return await salonModel.findOne({
    where: objectUtil.nullFilter({
      isValid: 1,
      id: salonId,
    }),
    fields: {
      id: true,
      ownerProfile: true,
      productId: true,
    },
  })
}

/**
 * Get detail data for salon
 *
 * @param  {Number}  pId
 * @param  {Number}  sId
 * @return {Promise<Object>}
 * @public
 */

async function sample(sId) {
  if (IGNORE_SALON_IDS.includes(sId)) {
    return {}
  }
  
  const condition = {
    where: {
      isValid: 1,
      salonId: sId,
      publishedAt: {
        lte: time.addMonths(-6),
      },
    },
    order: 'publishedAt DESC',
    limit: 5,
    fields: {
      title: true,
      content: true,
      publishedAt: true,
    },
  }
  const data = await mailMagazineModel.find(condition)

  return data.map((record) => {
    // TODO [^"] is cheat for not replace image tags
    // E.g. src="http..."
    const match = record.content.match(/([^"]https?|ftp)(:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)/)
    return {
      title: record.title,
      content: match ?
        record.content.replace(match[0], `<A href="${match[1]}${match[2]}">${match[1]}${match[2]}</A>`) :
        record.content,
      date: record.publishedAt,
    }
  }) || {}
}

/**
 * Get latest threads
 *
 * @param {Number}  pId
 * @return {Promise<Object>}
 * @public
 */
async function threads(salonId) {
  if (IGNORE_SALON_IDS.includes(salonId)) {
    return {}
  }

  const salon = await _salon(salonId)

  if (!salon || !Object.keys(salon).length || !salon.productId) {
    return {}
  }

  const pId = salon.productId
  const ids = arrayUtil.column(
    await find('asp', '_mailmagazine_comment', {
      where: {
        ProductId: pId,
        IsValid: 1,
        StatusId: 2,
        TypeId: 1,
      },
      order: 'id DESC',
      fields: {
        Id: true,
      },
      limit: 5,
    }), 'Id')

  const threads = await threadModel.find({
    where: {
      id: {
        inq: ids,
      },
    },
    fields: {
      id: true,
      content: true,
      publishedAt: true,
      userId: true,
    },
    order: 'id DESC',
  })

  let users = await user.getUsers(arrayUtil.column(threads, 'userId'))

  users = arrayUtil.index(users, 'id')
  return threads.map((thread) => {
    const uId = thread.userId
      const user = users[uId]
    return {
      id: thread.id,
      userId: uId,
      userName: user ? user.nickName : null,
      content: stringUtil.stripTags(thread.content),
      date: thread.publishedAt,
    }
  }) || {}
}

/**
 * Reviews of product, display of side menu of detail page
 *
 * @param  {Number}  pId
 * @return {Promise<Object>}
 * @public
 */

async function reviews(salonId) {
  if (IGNORE_SALON_IDS.includes(salonId)) {
    return {}
  }
  const salon = await _salon(salonId)
  if (!salon || !Object.keys(salon).length || !salon.productId) {
    return {}
  }
  return await review.index(salon.productId, {limit: 5}, 2, false)
}

/**
 * Get related article & column of salon
 *
 * @param  {Number} pId
 * @param  {Number} limit
 * @return {Promise<Object>}
 * @public
 */

async function related(salonId, limit = 5) {
  if (IGNORE_SALON_IDS.includes(salonId)) {
    return {}
  }

  const salon = await _salon(salonId)

  if (!salon || !Object.keys(salon).length || !salon.productId) {
    return {}
  }

  const pId = salon.productId
  const [relatedArticles, relatedColumns] = await Promise.all([
    _relatedArticles(pId, limit),
    _relatedColumns(pId, limit),
  ])
  const res = relatedArticles.concat(relatedColumns)

  res.sort((a, b) => {
    return b.date - a.date
  })

  return res.slice(0, limit)
}

/**
 * Get related articles of salon
 *
 * @param  {Number} pId
 * @param  {Number} limit
 * @return {Promise<Object>}
 * @private
 */
async function _relatedArticles(pId, limit) {
  const articlesRelated = await find('fx_default', 'article_relation_product', {
    where: {
      ProductId: pId,
    },
    limit: 0,
    fields: {
      ArticleId: true,
    },
  })
  const aIds = arrayUtil.column(articlesRelated, 'ArticleId')
  const articles = await articleModel.find({
    where: {
      id: {
        inq: aIds,
      },
      isValid: 1,
      statusType: 1,
    },
    order: 'publishedAt DESC',
    fields: {
      id: true,
      title: true,
      publishedAt: true,
    },
    limit: limit,
  })

  return articles.map((article) => {
    return {
      title: article.title,
      img: '/img/articles/' + article.id,
      url: FX_HOST + '/navi/detail?id=' + article.id,
      date: article.publishedAt,
    }
  }) || {}
}

/**
 * Get related columns of salon
 *
 * @param  {Number} pId
 * @param  {Number} limit
 * @return {Promise<Object>}
 * @private
 */
async function _relatedColumns(pId, limit) {
  const cIds = arrayUtil.column(await find('fx_default', 'column_product', {
    where: {
      product_id: pId,
    },
    limit: 0,
    fields: {
      column_id: true,
    },
  }), 'column_id')

  const columns = await columnModel.find({
    where: {
      id: {
        inq: cIds,
      },
      isValid: 1,
    },
    order: 'publishedAt DESC',
    fields: {
      id: true,
      title: true,
      imageUrl1: true,
      publishedAt: true,
    },
    limit: limit,
  })

  return columns.map((column) => {
    return {
      title: column.title,
      img: column.imageUrl1,
      url: FX_HOST + 'news/detail/?id=' + column.id + '&c=1',
      date: column.publishedAt,
    }
  }) || {}
}


module.exports = {
  show,
  sample,
  threads,
  reviews,
  related,
}
