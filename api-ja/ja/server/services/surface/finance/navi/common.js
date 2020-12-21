const app = require('@server/server')
const {
  sfPrice,
} = require('@services/common/price')
const {
  saleConditions,
} = require('@services/common/sale')

// utils
const timeUtil = require('@server/utils/time')
const queryUtil = require('@server/utils/query')
const arrayUtil = require('@ggj/utils/utils/array')

// models
const readLateArticleModel = app.models.ReadLateArticles
const favoriteSeriesModel = app.models.FavoriteSeries
const saleModel = app.models.Sales
const surfaceNaviModel = app.models.SurfaceNavi

const NAVI_CONTENT_LENGTH = 50

/**
 * Convert given article data into article response object
 *
 * @param articleObj
 * @param isRL
 * @param isFavorite
 * @param isPurchased
 * @param isGetContent
 * @returns {Object}
 */
function articleObject(articleObj, isRL = 0, isFavorite = 0, isPurchased = 0,
  isGetContent = false) {
  const article = JSON.parse(JSON.stringify(articleObj)) // Clone article object
  let isPaid = parseInt(article.isPaidContent)
  if (isPaid && !article.price && !article.seriesPrice) {
    isPaid = 0
  }

  const oldArticlePrice = article.price
  if (isPaid === 1 && !article.price) {
    article.price = article.seriesPrice
    article.isMonthlyPrice = 1
  }

  const id = article.articleId
  const imgName = article.imageFile || ''
  let img = ''

  if (imgName && imgName.length > 1) {
    img = process.env.FXON_HOST_URL + 'navi/include/img/article/' + id +
      '/icon/' + imgName
  }

  return app.utils.object.nullFilter(Object.assign({
    id: id,
    seriesId: article.seriesId,
    seriesProductId: article.seriesProductId,
    title: article.title,
    content: isGetContent ?
      app.utils.string.stripTags(article.content || '').substr(0, 100) :
      null,
    publishedDate: article.publishedAt,
    user: {
      id: article.userId,
      name: article.nickName,
    },
    image: img || null,
    isCampaign: article.isCampaign,
    isPaidContent: isPaid,
    isFavorite: isFavorite,
    isReadLater: isRL,
    isPurchased: isPurchased,
    isMonthlyPrice: article.isMonthlyPrice || 0,
    seriesPrice: article.seriesPrice,
    articlePrice: oldArticlePrice,
    categoryId: article.categoryId || article.naviCategoryId,
  }, sfPrice(article).shift()))
}

/**
 * Convert given series data into series response object
 *
 * @param series
 * @param isGetContent
 * @returns {Object}
 */
function seriesObject(series, isGetContent = false) {
  const price = sfPrice(series).shift()

  // content: isGetContent ?
  // app.utils.string.stripTags(series.lastArticleTitle || '').substr(0,
  //   100) :
  // null,

  return app.utils.object.nullFilter(Object.assign({
    id: series.id || null,
    isPaidContent: price.price ? 1 : 0,
    productId: series.productId || null,
    title: (series.title || series.name) || null,
    content: isGetContent ?
      (series.content|| '').length > NAVI_CONTENT_LENGTH
      ? app.utils.string.stripTags(series.content || '').substr(0,
        NAVI_CONTENT_LENGTH)+ '...' : series.content
      : null,
    publishedDate: series.publishedAt,
    updatedDate: series.updatedAt,
    categoryId:series.categoryId,
    user: {
      id: series.userId,
      name: series.nickName,
    },
  }, price))
}

/**
 * Convert given data into author response object
 *
 * @param author
 */
function authorObject(author) {
  return app.utils.object.nullFilter({
    id: author.userId,
    name: author.nickName,
    introduction: author.userSelfIntroduction ?
      app.utils.string.stripTags(author.userSelfIntroduction || '').substr(
        0, 100) :
      null,
  })
}

/**
 * Get read later articles of current user
 * If given article ids is null, get all
 *
 * @param userId
 * @param articleIds
 * @returns {Promise<Object>}
 */
async function getReadLaterArticles(userId, articleIds = null) {
  if (userId == 0) {return {}}
  const data = arrayUtil.index(await readLateArticleModel.find({
    where: Object.assign({
      isValid: {
        inq: [0, 1],
      },
    },
    app.utils.object.deepFilter({
      userId: userId,
      articleId: {
        inq: articleIds,
      },
    }),
    ),
  }) || [], 'articleId')

  // TODO cheat for data (because old data is incorrect - one user have many read_late record of one article)
  // So we only get last record
  return app.utils.object.keyFilter(data, 'isValid', 1)
}

/**
 * Get favorite articles of current user
 * If given article ids is null, get all
 *
 * @param userId
 * @param articleIds
 * @returns {Promise<Object>}
 */
async function getFavoriteArticles(userId, articleIds = null) {
  if (userId == 0) {return {}}
  return arrayUtil.index(await favoriteSeriesModel.find({
    where: app.utils.object.deepFilter({
      isValid: 1,
      userId: userId,
      masterId: {
        inq: articleIds,
      },
      masterType: 4, // 3: series; 4: article
    }),
  }) || [], 'masterId')
}

/**
 * Get purchased articles of current user
 * If given product ids is null, get all
 *
 * @param userId
 * @param productIds
 * @returns {Promise<Object>}
 */
async function getPurchasedArticles(userId, productIds = null) {
  if (userId == 0) {
    return {}
  }

  const conditions = saleConditions(userId)

  conditions.fields = {
    id: true,
    productId: true,
  }
  conditions.where.typeId = 3

  if (Array.isArray(productIds)) {
    conditions.where.productId = {
      inq: productIds,
    }
  }

  return arrayUtil.index(
    await saleModel.find(conditions) || [],
    'productId',
  )
}

/**
 * Get favorite series of current user
 * If given series ids is null, get all
 *
 * @param {number} authorId
 * @param {Array|null} seriesId
 * @returns {Promise<Object>}
 */
async function getFavoriteSeries(userId, seriesIds = null) {
  if (userId == 0) {
    return {}
  }

  const where = {
    isValid: 1,
    userId,
    masterType: 3, // 3: series; 4: article
  }

  if (Array.isArray(seriesIds)) {
    where.masterId = {
      inq: seriesIds,
    }
  }

  return arrayUtil.index(
    await favoriteSeriesModel.find({
      where,
    }) || [],
    'masterId',
  )
}

/**
 * Check if user like serie or not
 *
 * @param {number} authorId
 * @param {number} seriesId
 * @returns {Promise<number>} 0 or 1
 * @public
 */
async function isFavoriteSeries(userId, seriesId) {
  if (userId == 0) {
    return 0
  }

  const count = await favoriteSeriesModel.count({
    isValid: 1,
    userId: userId,
    masterId: seriesId,
    masterType: 3, // 3: series; 4: article
  })

  return count > 0 ? 1 : 0
}

/**
 * Get articles based on articles id to display (OAM-22377)
 * @param {Array} articleIds
 * @param {Number} userId
 * @returns {Promise<Array>}
 * @public
 */
async function getArticles(articleIds, userId=0, input={}) {
  const limit = input.limit || 0
  const isGetContent = input.isGetContent || false
  const articles = await _articles(articleIds, limit)

  // Get favorite & read later data for specific user
  const ids = articles.reduce((acc, article) => {
    article.id && acc.article.push(article.id)
    article.productId && acc.product.push(article.productId)
    article.seriesProductId && acc.seriesProduct.push(article.seriesProductId)
    return acc
  }, {
    article: [],
    product: [],
    seriesProduct: [],
  })

  const [readLateArticles, favoriteArticles, purchasedArticles]
    = await Promise.all([
      getReadLaterArticles(userId, ids.article),
      getFavoriteArticles(userId, ids.article),
      getPurchasedArticles(userId, ids.product.concat(ids.seriesProduct)),
    ])

  // Mapping all articles into response
  return articles.map(article => {
    const isRL = !readLateArticles[article['id']] ? 0 : 1
    const isFavorite = !favoriteArticles[article['id']] ? 0 : 1
    const isPurchased = !purchasedArticles[article['productId']] &&
      !purchasedArticles[article['seriesProductId']] ? 0 : 1

    return articleObject(article, isRL, isFavorite, isPurchased, !!isGetContent)
  })
}

/**
 * Get articles data from `surface`.`navi`
 * @param {Array} articleIds
 * @returns {Promise<Array>}
 * @private
 */
async function _articles(articleIds, limit) {
  const fields = 'id,articleId,seriesId,seriesProductId,productId,publishedAt,title,content,userId,nickName,isCampaign,isPaidContent,isSpecialDiscount,specialDiscountPrice,price,isReservedStart,reserveStartAt,seriesPrice,imageFile,tags'

  return await surfaceNaviModel.find({
    where: {
      articleId: {
        inq: articleIds,
      },
      isValid: 1,
      publishedAt: {
        lte: timeUtil.utcDate(),
      },
      isSaleStop: 0,
    },
    limit,
    order: 'publishedAt DESC',
    fields: queryUtil.fields(fields),
  })
}

async function isProductSaleByUserNotEnded(userId, productId) {
  const userSaleHistories = await saleModel.find({
    where: {
      isValid: 1,
      productId,
      userId,
    },
  })
  return userSaleHistories.some(saleRecord => !saleRecord.serviceEndAt || ((saleRecord.serviceEndAt * 1e3) > Date.now()))
}

module.exports = {
  seriesObject,
  authorObject,
  articleObject,
  isFavoriteSeries,
  getFavoriteSeries,
  getFavoriteArticles,
  getReadLaterArticles,
  getPurchasedArticles,
  getArticles,
  isProductSaleByUserNotEnded,
}
