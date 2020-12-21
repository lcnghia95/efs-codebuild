const app = require('@server/server')
const _sfPrice = require('@services/common/price').sfPrice
const _isPurchased = require('@services/common/sale').isPurchased
const _getProductDetailInformation = require('@services/common/product').show
const { getNaviCategory } = require('@services/surface/finance/navi/navi')

const {
  seriesObject,
  isFavoriteSeries,
  getReadLaterArticles,
  getFavoriteArticles,
  getPurchasedArticles,
} = require('./common')

// models
const surfaceNaviModel = app.models.SurfaceNavi
const surfaceNaviSeriesModel = app.models.SurfaceNaviSeries

// utils
const _utcDate = app.utils.time.utcDate
const arrayUtil = require('@ggj/utils/utils/array')
const queryUtil = app.utils.query
const pagingUtil = app.utils.paging
const stringUtil = app.utils.string

/**
 * Get record from `navi.series`
 *
 * @param {number} id
 * @returns {Object}
 * @private
 */
async function _serie(id) {
  const fields = 'id,productId,title,content,userId,nickName,publishedAt,isSpecialDiscount,specialDiscountPrice,price,isSaleStop'
  return await surfaceNaviSeriesModel.findOne({
    where: {
      id,
      isValid: 1,
    },
    fields: queryUtil.fields(fields),
  })
}

/**
 * Get record from `surface.surface_navi`
 *
 * @param {number} seriesId
 * @returns {Array}
 * @private
 */
async function _articles(seriesId) {
  const fields ='id,publishedAt,seriesId,productId,title,content,price,image_File,isPaidContent,naviCategoryId'
  return await surfaceNaviModel.find({
    where: {
      seriesId,
      isValid: 1,
      publishedAt: {
        lte: _utcDate(),
      },
    },
    order: 'publishedAt DESC',
    fields: queryUtil.fields(fields),
  })
}

/**
 * Get list of product id from articles and ignore 0
 *
 * @param {Array} articles
 * @returns {Array}
 * @private
 */
function _productIds(articles) {
  const productIds = arrayUtil.column(articles, 'productId')
  return productIds.filter(productId => productId > 0)
}

/**
 * Get series index
 *
 * @param {Object} input
 * @returns {Promise<Object>}
 * @public
 */
async function index(input) {
  const where = {
    isValid: 1,
    price: {
      gte: 0,
    },
  }
  const offset = pagingUtil.getOffsetCondition(input.page, input.limit)
  const [total, series] = await Promise.all([
    surfaceNaviSeriesModel.count(where),
    surfaceNaviSeriesModel.find({
      where,
      limit: offset.limit,
      skip: offset.skip,
      order: ['publishedAt DESC'],
    }),
  ])

  if (!input.page) {
    return series.map(series => seriesObject(series, true))
  }

  return pagingUtil.addPagingInformation(
    series.map(series => seriesObject(series, true)),
    parseInt(input.page),
    total,
  )
}

/**
 * Get serie deatil information
 *
 * @param {number} seriesId
 * @param input
 * @param {Object} meta
 * @returns {Object}
 * @public
 */
async function show(seriesId, input, meta = {}) {
  const serie = await _serie(seriesId)

  if (!serie) {
    return {}
  }

  // Get product for check password
  const product = await _getProductDetailInformation(serie.productId, input)

  if (Object.keys(product).length < 3) {
    return product
  }

  seriesId = serie.id

  const userId = meta.userId
  const [articles, isFavorite, categories] = await Promise.all([
    _articles(seriesId),
    isFavoriteSeries(userId, seriesId),
    getNaviCategory(),
  ])
  const categoriesIdx = arrayUtil.index(categories)
  const articleIds = arrayUtil.column(articles)
  const productIds = _productIds(articles)
  const productId = serie.productId
  const priceObject = _sfPrice(serie)[0] || {}
  const [readLater, favorite, purchasedArticles,isPurchasedSerie]
    = await Promise.all([
      getReadLaterArticles(userId, articleIds),
      getFavoriteArticles(userId, articleIds),
      getPurchasedArticles(userId, productIds),
      _isPurchased(userId, productId),
    ])

  if (serie.isSaleStop && serie.userId != userId && !isPurchasedSerie) {
    return {}
  }

  const articlesList = articles.map(article => {
    const category = categoriesIdx[article.naviCategoryId] || {}
    return {
      id: article.id,
      sId: seriesId,
      title: article.title,
      content: stringUtil.stripTagsAndStyle(article.content || '').substr(
        0, 300),
      isReadLater: readLater[article.id] ? 1 : 0,
      isFavorite: favorite[article.id] ? 1 : 0,
      purchased: purchasedArticles[article.productId] || isPurchasedSerie ?
        1 : 0,
      paid: article.isPaidContent,
      price: article.price,
      pId: article.productId > 0 ? article.productId : productId,
      publishedAt: article.publishedAt,
      categoryName: category.categoryName || '',
    }
  })

  return {
    status: product.status,
    isPassword: product.passwordType,
    series: Object.assign({
      id: seriesId,
      userId: serie.userId,
      pId: productId,
      userName: serie.nickName,
      isFavorite,
      isPurchased: +isPurchasedSerie,
      title: serie.title,
      updatedAt: (articles[0] || {}).publishedAt,
      content: serie.content,
    }, priceObject),
    articles: articlesList,
  }
}

module.exports = {
  index,
  show,
}
