const app = require('@server/server')
const commonPrice = require('@services/common/price')
const {
  authorObject,
} = require('@services/surface/finance/navi/common')

// models
const surfaceNaviAuthorModel = app.models.SurfaceNaviAuthors

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const queryUtil = app.utils.query
const pagingUtil = app.utils.paging

/**
 * Get data from `navi.favorite_series`
 *
 * @param {Array} seriesIds
 * @param {number} userId
 * @returns {Array}
 * @private
 */
async function _favoriteSeries(seriesIds, userId) {
  if (userId == 0) {
    return []
  }
  return await app.models.FavoriteSeries.find({
    where: {
      isValid: 1,
      userId,
      masterId: {
        inq: seriesIds,
      },
      masterType: 3,
    },
    fields: {
      masterId: true,
    },
  })
}

/**
 * Get data from `navi.articles`
 *
 * @param {Array} seriesIds
 * @returns {Array}
 * @private
 */
async function _articles(seriesIds) {
  return await app.models.Articles.find({
    where: {
      seriesId: {
        inq: seriesIds,
      },
      isValid: 1,
      statusType: 1,
      typeId: 3,
    },
    fields: queryUtil.fields('id,seriesId,title,publishedAt'),
    order: 'publishedAt ASC',
  })
}

/**
 * Get data from `surfaces.surface_navi_series`
 *
 * @param {number} authorId
 * @returns {Array}
 * @private
 */
async function _series(authorId) {
  const fields = 'id,productId,title,lastArticleId,lastArticleTitle,price,isSpecialDiscount,specialDiscountPrice'
  return await app.models.SurfaceNaviSeries.find({
    where: {
      isValid: 1,
      typeId: 3,
      userId: authorId,
    },
    fields: queryUtil.fields(fields),
    order: 'id DESC',
  })
}

/**
 * Get authors index
 *
 * @param {Object} input
 * @returns {Object}
 * @public
 */
async function index(input) {
  const where = {
    isValid: 1,
  }
  const offset = pagingUtil.getOffsetCondition(input.page, input.limit)
  const [total, authors] = await Promise.all([
    surfaceNaviAuthorModel.count(where),
    surfaceNaviAuthorModel.find({
      where,
      limit: offset.limit,
      skip: offset.skip,
      order: ['userId DESC'],
      fields: {
        userId: true,
        nickName: true,
        userSelfIntroduction: true,
      },
    }),
  ])

  if (!input.page) {
    return authors.map(authors => authorObject(authors))
  }

  return pagingUtil.addPagingInformation(
    authors.map(authors => authorObject(authors)),
    parseInt(input.page),
    total,
  )
}

/**
 * Get author information
 *
 * @param {number} authorId
 * @param {Object} meta
 * @returns {Object}
 * @public
 */
async function show(authorId, meta) {
  const author = await app.models.SurfaceNaviAuthors.findById(
    authorId, {
      fields: queryUtil.fields('id,nickName,userSelfIntroduction'),
    },
  )

  if (!author) {
    return []
  }

  authorId = author.id
  const series = await _series(authorId)
  const seriesIds = arrayUtil.column(series)
  const [articles, favoriteSeries] = await Promise.all([
    _articles(seriesIds),
    _favoriteSeries(seriesIds, meta.userId || 0),
  ])
  const articleIdx = articles.reduce((acc, article) => {
    const sId = article.seriesId
    acc[sId] = acc[sId] || []
    acc[sId].push(article)
    return acc
  }, {})
  const isFavorites = arrayUtil.index(favoriteSeries, 'masterId')
  const seriesObjects = series.map(serie => {
    const sId = serie.id
    const articleSerie =  articleIdx[sId] || []
    const firstArticle = articleSerie[0] || {}
    const lastArticle = articleSerie[articleSerie.length - 1] || {}
    const isFavorite = isFavorites[sId] ? 1 : 0
    const priceObject = commonPrice.sfPrice(serie)[0] || {}

    return Object.assign({
      pId: serie.productId,
      sId,
      name: serie.title,
      articleId: !firstArticle.id ? null : firstArticle.id,
      articleTitle: !firstArticle.title ? null : firstArticle.title,
      updatedAt: lastArticle.publishedAt,
      description: serie.lastArticleTitle, // TODO: move to batch process
      isFavorite,
    }, priceObject)
  }).sort((a, b) => b.updatedAt - a.updatedAt)

  return {
    writer: {
      id: authorId,
      name: author.nickName,
      title: (series[0] || {}).title || '',
      userIntroduction: author.userSelfIntroduction,
    },
    series: seriesObjects,
  }
}

module.exports = {
  show,
  index,
}
