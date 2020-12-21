const app = require('@server/server')
const helper = require('./helper')
const productService = require('./product')
const priceService = require('./price')
const priceCommonService = require('@services/common/price')
const syncService = require('@services/common/synchronize')
const productCommonService = require('@services/common/product')
const userCommonService = require('@services/common/user')
const commonEmailV1 = require('@@services/common/emailv1')
const crypto = require('@server/utils/crypto')
const _fullProductIds = require('@services/common/tieup').fullProductIds
const _map = require('lodash').map
const _isEmpty = require('lodash').isEmpty
const _inRange = require('lodash').inRange
const modelUtil = require('@server/utils/model')
const arrayUtils = require('@ggj/utils/utils/array')

const articleModel = app.models.Articles
const productModel = app.models.Products
const seriesModel = app.models.Series
const surfaceNaviModel = app.models.SurfaceNavi
const salesCountModel = app.models.SalesCount
const saleModel = app.models.Sales

const { filter, arrayToObject } = app.utils.object
const timeUtil = app.utils.time

const FIFTEEN_MINUTES = 900000 // 15*60*1000
const STATUS_TYPE = ['unpublish', 'publish', 'sale-stopped']

/**
 * Get article of specific developer
 *
 * @param {number} id
 * @param {number} userId
 * @returns {Promise<Object>}
 * @private
 */
async function _article(id, userId) {
  return await articleModel.findOne({
    where: {
      id,
      isValid: 1,
      userId,
    },
    fields: {
      categoryId: true,
      id: true,
      seriesId: true,
      title: true,
      content: true,
      productId: true,
      publishedAt: true,
      isReservedStart: true,
      reserveStartAt: true,
      statusType: true,
      createdAt: true,
      updatedAt: true,
      isPaidContent: true,
      paidContent: true,
      isCampain: true,
      naviCategoryId: true,
      articleOption: true
    },
  }) || {}
}

/**
 * Update status of article object
 *
 * @param {Object} article
 * @param {number} statusType
 * @returns {void}
 * @private
 */
async function _updateArticleStatus(article, statusType) {
  article.statusType = statusType

  if (statusType == 1) {
    _setPublishDate(article)
    await _privateToPublic(article) // OAM-24059
  } else {
    _publicToPrivate(article)
    article.publishedAt = null
  }

  article.updatedAt = timeUtil.toUnix(Date.now())
  await article.save()
  _updateSurfaceNavi(article)

  await syncService.syncDataToFxon('articles', article.id)
}

/**
 * Handle change article status from public to private (1 -> 0)
 *
 * @param {Object} article
 * @returns {void}
 * @private
 */
function _publicToPrivate(article) {
  const publish = article.publishedAt * 1000 || 0
  const now = Date.now()

  if (article.isReservedStart == 1) {
    if (publish >= now) {
      return commonEmailV1.cancel(article.id)
    }
  }
  if (article.isReservedStart == 0) {
    if (now - publish < FIFTEEN_MINUTES) {
      return commonEmailV1.cancel(article.id)
    }
  }
}

/**
 * Handle change article status from private to public (0 -> 1)
 *
 * @param {Object} article
 * @returns {void}
 * @private
 */
async function _privateToPublic(article) {
  const publish = article.publishedAt.getTime()
  const now = Date.now()

  if (article.isReservedStart == 1) {
    if (publish >= now) {
      await _notify(article, timeUtil.sqlDate(publish, 'YYYY-MM-DDTHH:mm:ss'))
      return
    }
  }
  if (article.isReservedStart == 0) {
    const sendAt = publish + FIFTEEN_MINUTES
    await _notify(article, timeUtil.sqlDate(sendAt, 'YYYY-MM-DDTHH:mm:ss'))
    return
  }
}

/**
 * Update surface navi
 *
 * @param {Object} article
 * @returns {void}
 * @private
 */
async function _updateSurfaceNavi(article) {
  const surfaceNavi = await app.models.SurfaceNavi.findOne({
    where: {
      id: article.id,
    },
    fields: {
      id: true,
    },
  }) || {}

  if (surfaceNavi.id) {
    surfaceNavi.statusType = article.statusType
    surfaceNavi.publishedAt = article.publishedAt
    surfaceNavi.save()
    return
  }

  // Create new surface record
  app.models.SurfaceNavi.create({
    id: article.id,
    isValid: 1,
    publishedAt: article.publishedAt,
    statusType: article.statusType,
    articleId: article.id,
  })
}

/**
 * Update publishDate of article object
 *
 * @param {Object} article
 * @returns {void}
 * @private
 */
function _setPublishDate(article) {
  article.publishedAt = parseInt(article.isReservedStart) == 1 ?
    article.reserveStartAt * 1000 :
    Date.now()
}

/**
 * Convert timestamp
 * @param {string} timeString
 * @returns {Number}
 * @private
 */
function _getTimeStamp(timeString) {
  return new Date(timeString).getTime()
}

/**
 * Get series record
 *
 * @param {number} id
 * @returns {Object}
 * @private
 */
async function _series(id) {
  const series = await seriesModel.findOne({
    where: {
      id,
      isValid: 1,
      statusType: 1,
    },
    fields: {
      productId: true,
    },
  }) || {}
  return series
}

/**
 * Get type sort ASC | DESC
 * @param {number} option
 */
function _getTypeSort(option) {
  return parseInt(option) == 1 ? 'ASC' : 'DESC'
}

/**
 * Get product record
 *
 * @param {number} id
 * @returns {Object}
 * @private
 */
async function _product(id) {
  const product = await productModel.findOne({
    where: {
      id,
      isValid: 1,
      statusType: 1,
      isSaleStop: 0,
    },
    fields: {
      id: true,
      name: true,
    },
  }) || {}
  return product
}

/**
 * Get sale records
 *
 * @param {Array} productIds
 * @returns {Object}
 * @private
 */
async function _sales(productIds, article) {
  //   let saleConditions = saleService.saleConditions()
  // saleConditions.where.productId = {
  //   inq: productIds
  // }
  // saleConditions.where = objectUtil.deepFilter(saleConditions.where)
  // saleConditions.fields = {
  //   userId: true,
  // }
  // delete saleConditions.where.userType
  // delete saleConditions.where.salesType
  // delete saleConditions.order

  let sql = 'select user_id as userId from sales '
  sql += 'where pay_at >= service_start_at AND service_end_at >= pay_at AND '
  sql += 'is_valid = 1 AND '
  sql += 'status_type = 1 AND '
  sql += 'offset_id = 0 AND '
  sql += 'is_repayment = 0 AND '
  sql += `product_id in (${productIds.join()})`
  let parsedReverseStart
  if (typeof article.reserveStartAt === 'number' && article.reserveStartAt < 1e10) {
    parsedReverseStart = article.reserveStartAt * 1000
  } else {
    parsedReverseStart = article.reserveStartAt
  }
  const rStart = timeUtil.sqlDate(parsedReverseStart)
  const pDay = timeUtil.sqlDate(article.publishedAt)
  if (article.isReservedStart) {
    sql += ` AND service_start_at <= "${rStart}"`
    sql += ` AND service_end_at > "${rStart}"`
  } else {
    sql += ` AND service_start_at <= "${pDay}"`
    sql += ` AND service_end_at > "${pDay}"`
  }
  const sales = await modelUtil.excuteQuery('privacy', sql)
  // let sales = await saleModel.find(saleConditions)
  return sales
}

/**
 * Notify to users about new publish article
 *
 * @param {Object} article
 * @param {String} sendAt
 * @returns {void}
 * @private
 */
async function _notify(article, sendAt) {
  const series = await _series(article.seriesId)
  let serieProductId = series.productId || 0
  if (serieProductId == 0) {
    return
  }
  const product = await _product(serieProductId)
  serieProductId = product.id || 0
  if (serieProductId == 0) {
    return
  }

  // OAM-23498
  // const OAM23498 = {
  //   BOUGHT_ARTICLES: [21308, 21309],
  //   SEE_SERIES: 1072
  // }

  let listPids = []
  if (article.seriesId == consts.OAM23498.SEE_SERIES) {
    listPids = consts.OAM23498.BOUGHT_ARTICLES
  }

  const productIds = _fullProductIds([serieProductId])
  const sales = await _sales(productIds.concat(listPids), article)
  const userIds = _map(sales, 'userId')
  const users = await userCommonService.getUsers(userIds, {
    mailAddress: true,
  })
  const emails = users.map(user => user.mailAddress).join()
  const content = {
    id: article.id,
    series_id: article.seriesId,
    product_name: product.name,
    article_title: article.title,
  }

  if (emails.length == 0) {
    return
  }
  // only japanese currently supported
  commonEmailV1.send(emails, content, 61, process.env.LANGUAGE, article.id, sendAt)
}

/**
 * Check if article is sold as single product or not
 *
 * @param {Object} article
 * @param {Object} product
 * @returns {number}
 * @private
 */
function _isSingle(article, product, price) {
  const productId = article.productId || 0
  if (productId == 0) {
    return 0
  }
  if (product.isSaleStop == 1) {
    return 0
  }
  if (product.isPassword == 1 && price == 0) {
    return 0
  }
  return 1
}

/**
 * Update status of article
 *
 * @param {number} articleId
 * @param {number} statusType
 * @param {number} userId
 * @returns {void}
 * @public
 */
async function updateStatus(articleId, statusType, userId) {
  // Validate status type
  if (![0, 1].includes(statusType)) {
    return
  }

  // Get article
  const article = await _article(articleId, userId)

  // Cannot update status of article with no seriesId
  if (!article.seriesId) {
    return
  }

  // Status must change
  if (article.statusType == statusType) {
    return
  }

  // Update status of article & product
  _updateArticleStatus(article, statusType)

  if (article.productId) {
    productService.updateStatus(article.productId, statusType, userId)
    syncService.syncDataToFxon('products', article.productId)
  }
}

/**
 * Count article by Series
 * @param {array}  serieIds
 * @returns {array}
 * @private
 */
async function countArticleBySerieIds(serieIds) {
  const serieIdString = serieIds.join('","')
  const sql = `SELECT series_id as seriesId, count(*) as count
               FROM navi.articles
               WHERE series_id in ("${serieIdString}") AND is_valid = 1
               GROUP BY series_id`

  return await modelUtil.excuteQuery('master', sql)
}

/**
 * Get list article by series Id
 *
 * @param {number} userId
 * @param {number} seriesId
 * @param {object} fields
 */
async function getArticlesBySeriesId(userId, seriesId, fields) {
  if (!seriesId) {
    return []
  }

  const listArticle = await articleModel.find({
    where: {
      userId,
      seriesId,
      isValid: 1,
    },
    fields: app.utils.query.fields(fields),
  })
  return listArticle
}

/**
 * Get list article none seriesId
 *
 * @param {number} userId
 * @param {object} fields
 */
async function getArticlesNoneSeries(userId, fields) {
  return await articleModel.find({
    where: {
      userId,
      isValid: 1,
      seriesId: 0,
      statusType: 0,
    },
    fields: app.utils.query.fields(fields),
  })
}

/**
 *
 * @param {number} userId
 * @param {number} limit
 * @param {number} skip
 * @param {number} type
 * @return {Promise<array>}
 * @private
 */
async function _getArticleBySortPv(queryObject, limit, skip, type ){
  const listArticle = await articleModel.find({  where: queryObject })
  const listArticleId = _map(listArticle, 'id')
  const listPv = await surfaceNaviModel.find({
    where: {
      articleId: { inq: listArticleId},
      isValid: 1,
    },
    fields: {
      articleId: true,
      accessCount: true
    }
  })
  const listPvObject = arrayToObject(listPv, 'articleId')
  const listArticlePV = listArticle.map( item => {
    const pvObject =  listPvObject[item.id] || {}
    item.pv = pvObject.accessCount || 0
    return item
  }).sort((a,b) => {
    return parseInt(type) == -1 ?  b.pv - a.pv : a.pv - b.pv
  }).splice(skip , skip + limit)

  const listProductId = _map(listArticlePV, 'productId')
  const listSalesCount = await salesCountModel.find({
    where:{
      productId: { inq: listProductId }
    },
    fields: {
      productId: true,
      salesCount: true
    }
  })
  const salsesCountObject = arrayToObject(listSalesCount, 'productId')
  return listArticlePV.map(item =>{
    const itemSales = salsesCountObject[item.productId || 0] || {}
    item.salesCount = itemSales.salesCount || 0
    return item
  })
}

/**
 *
 * @param {number} userId
 * @param {number} limit
 * @param {number} skip
 * @param {number} type
 * @return {Promise<array>}
 * @private
 */
async function _getArticleBySortSale(queryObject, limit, skip, type){
  const listArticle = await articleModel.find({ where: queryObject })
  const listProductId = [...new Set(_map(listArticle, 'productId'))]
  const listSalesCount = await salesCountModel.find({
    where:{
      productId: { inq: listProductId },
      isValid: 1,
    },
    fields: {
      productId: true,
      salesCount: true
    }
  })
  const listSalesCountObject = arrayToObject(listSalesCount, 'productId')
  const listArticleSales = listArticle.map(item => {
    const productId = item.productId || 0
    const salesCountObject = listSalesCountObject[productId] || {}
    item.salesCount = salesCountObject.salesCount || 0
    return item
  }).sort((a, b) => {
    return parseInt(type) == -1 ? b.salesCount - a.salesCount : a.salesCount - b.salesCount
  }).splice(skip, skip + limit)
  const listArticleId = _map(listArticleSales, 'id')
  const listPv = await surfaceNaviModel.find({
    where:{
      articleId: { inq: listArticleId},
      isValid: 1,
    },
    fields: {
      accessCount: true,
      articleId:true
    }
  })
  const listPvObject = arrayToObject(listPv, 'articleId')

  return listArticleSales.map(item => {
    const pvObject = listPvObject[item.id] || {}
    item.pv = pvObject.accessCount || 0
    return item
  })

}

/**
 * get list article by query
 * @param {string} userId
 * @param {Object} opt
 * @returns {array}
 * @private
 */
async function _getArticlesByQuery(userId, opt = {}) {
  const page = parseInt(opt.page) || 1
  const limit = parseInt(opt.limit) || 10
  const skip = (page - 1) * limit
  // init normal query
  const paramSql = []
  const sql = {}
  const queryObject = {userId, isValid: 1}
  sql.SELECT = `
                  SELECT  navi.articles.id as id, navi.articles.series_id as seriesId,
                  navi.articles.created_at as createdAt, navi.articles.updated_at as updatedAt,
                  navi.articles.status_type as statusType, navi.articles.title as title,
                  navi.articles.content as content,
                  navi.articles.product_id as productId
                `,
  sql.FROM = 'FROM navi.articles'
  sql.ORDERBY = ''
  sql.WHERE = ` WHERE navi.articles.user_id = ${userId} AND navi.articles.is_valid = 1 `
  sql.LIMIT = `LIMIT ${limit} OFFSET ${skip}`
  // Fix queryString by params request
  if (opt.status_type && [0, 1, 2].includes(parseInt(opt.status_type))) {
    sql.WHERE += ` AND navi.articles.status_type = ${opt.status_type}`
    queryObject.statusType = opt.status_type
  }
  if (opt.keyword) {
    sql.WHERE += ' AND navi.articles.title like ? '
    paramSql.push(`%${decodeURIComponent(opt.keyword)}%`)
    const pattern = new RegExp('^' + decodeURIComponent(opt.keyword) + '.*', "i");
    queryObject.title = { like : pattern}
  }
  if (opt.created_at) {
    sql.ORDERBY = `ORDER BY createdAt ${_getTypeSort(opt.created_at)}`
  }
  if (opt.updated_at) {
    sql.ORDERBY = `ORDER BY updatedAt ${_getTypeSort(opt.updated_at)}`
  }
  // input value queryString
  const queryRecord = `
                    SELECT  articles.*,surfaces.surface_navi.access_count as pv,common.sales_count.sales_count as salesCount
                    FROM  (
                            ${sql.SELECT} ${sql.FROM} ${sql.WHERE} ${sql.ORDERBY} ${sql.LIMIT}
                          ) as articles
                    LEFT JOIN surfaces.surface_navi ON articles.id = surfaces.surface_navi.article_id
                    LEFT JOIN common.sales_count ON articles.productId = common.sales_count.product_id
                    ${sql.ORDERBY}
                  `
  const queryTotal = `
                    SELECT count(navi.articles.id) as count
                    ${sql.FROM}
                    ${sql.WHERE}
                  `
  if (opt.pv) {
    return [
      (await modelUtil.excuteQuery('master', queryTotal, paramSql))[0],
      await _getArticleBySortPv(queryObject,limit,skip, opt.pv)
    ]
  }
  if (opt.sales) {
    return [
      (await modelUtil.excuteQuery('master', queryTotal, paramSql))[0],
      await _getArticleBySortSale(queryObject,limit,skip, opt.sales, queryObject)
    ]
  }
  return [
    (await modelUtil.excuteQuery('master', queryTotal, paramSql))[0],
    await modelUtil.excuteQuery('master', queryRecord, paramSql),
  ]
}

/**
 *
 * @param {number} userId
 * @private
 * @return {Promise<array>}
 */
async function _countArticleByStatus(userId){
  const sql = `SELECT IFNULL(SUM(ar.status_type = 0), 0) AS '0',
                      IFNULL(SUM(ar.status_type = 1), 0 ) AS '1',
                      IFNULL(SUM(ar.status_type = 2), 0 ) AS '2'
              FROM navi.articles as ar
              WHERE user_id = ${userId}  AND is_valid = 1
  `
  return modelUtil.excuteQuery('master', sql)
}

/**
 * Get all articles
 *
 * @param {number} userId
 * @returns {Promise<Object>}
 * @public
 */
async function index(userId) {
  if (userId == 0) {
    return {}
  }

  const fields =
    'id,statusType,seriesId,publishedAt,title,isReservedStart,reserveStartAt,productId,isCampaign,createdAt'
  const articles = await articleModel.find({
    where: {
      userId,
      isValid: 1,
    },
    order: 'id DESC',
    fields: app.utils.query.fields(fields),
  })
  const productIds = _map(articles, 'productId')
  const products = await productCommonService.products(
    productIds,
    'id,typeId,affiliateMargin,isSaleStop,productPriceId,isPassword,pagePassword',
  )
  const productObjects = arrayToObject(products)
  const prices = await priceCommonService.getPricesByProductIds(
    _map(products, 'id'),
  )
  const priceObjects = await priceCommonService.priceObjects(prices,
    productObjects)

  return articles.map(article => {
    const productId = article.productId || 0
    const product = productObjects[productId] || {}
    const price = helper.price(product, priceObjects)
    const isSingle = _isSingle(article, product, price)

    return filter({
      id: article.id,
      sId: article.seriesId || 0,
      pId: productId,
      status: article.statusType || 0,
      title: article.title || '',
      isCampaign: article.isCampaign || 0,
      createdAt: article.createdAt,
      isReserved: article.isReservedStart || 0,
      reservedAt: article.reserveStartAt || 0,
      isSingle,
      margin: product.affiliateMargin,
      isPassword: product.isPassword,
      password: product.pagePassword,
      price,
    })
  }).reduce((res, article) => {
    if (article.sId > 0) {
      if (!res.classified) {
        res.classified = []
      }
      res.classified.unshift(article)
    } else {
      if (!res.unclassified) {
        res.unclassified = []
      }
      res.unclassified.unshift(article)
    }
    return res
  }, {})
}

/**
 * get list article
 * @param {string} userId
 * @param {Object} opt
 * @returns {array}
 * @private
 */
async function getArticles(userId, opt = {}) {
  if (userId == 0) {
    return {}
  }
  const [totalRecord, listArticles] = await _getArticlesByQuery(userId, opt)
  const listIdSeries = [...new Set(_map(listArticles, 'seriesId'))]
  const listSeries = await seriesModel.find({
    where: {
      id: { inq: listIdSeries },
    },
    fields: {
      id: true,
      productId: true,
    },
  })
  const listProductId = _map(listSeries, 'productId')
  const listProduct = await productModel.find({
    where: {
      userId,
      id: { inq: listProductId },
    },
    fields: {
      id: true,
      name: true,
    },
  })
  const seriesObjects = arrayToObject(listSeries)
  const productObject = arrayToObject(listProduct)
  const data = listArticles.map(article => {
    const seriesId = article.seriesId || 0
    const objectSeries = seriesObjects[seriesId] || {}
    const productId = objectSeries.productId || 0
    const objectProduct = productObject[productId] || {}
    return {
      id: article.id,
      pv: article.pv || 0,
      title: article.title,
      status: article.statusType || 0,
      sId: article.seriesId || 0,
      sales: article.salesCount || 0,
      isFree: article.productId ? 0 : 1,
      series_name: objectProduct.name || '',
      createdAt: _getTimeStamp(article.createdAt),
      updatedAt: _getTimeStamp(article.updatedAt),
    }
  })

  const statusCount = await _countArticleByStatus(userId)
  return {
    total: totalRecord.count,
    data: data,
    statusCount: statusCount[0] || {}
  }
}

/**
 * get list Article By query string
 * @param {string} userId
 * @param {Object} opt
 * @returns {array}
 * @private
 */
async function getListArticleSearch(userId, opt = {}) {

  if (userId == 0) {
    return []
  }

  const queryObject = { userId, isValid: 1 }
  if (opt.series_id) {
    queryObject.seriesId = opt.series_id
  }

  if (opt.keyword) {
    queryObject.title = { regexp: new RegExp(`(${decodeURIComponent(opt.keyword)})`, 'gi') }
  }
  if (parseInt(opt.isNoneSeries)) {
    queryObject.seriesId = 0
  }

  const articles = articleModel.find({
    where: queryObject,
    fields: {
      id: true,
      title: true,
      statusType: true,
      seriesID: true,
    },
  })
  return articles
}

/**
 * Get all article for edit by id
 * Note: articleOptnion and typeOption check in comment : https://gogojungle.backlog.jp/view/OAM-46711#comment-90500273
 * @param {number} uid
 * @param {number} articleId
 * @public
 * @return {object}
 */
async function show(uid, articleId) {
  // validate
  if (uid == 0) {
    return { code: 400 }
  }
  const article = await _article(articleId, uid)
  if (_isEmpty(article)) {
    return { code: 404 }
  }
  const productInfo = article.productId ? (await productService.getProductById(uid, article.productId || 0, 'id,affiliateMargin,productPriceId')) : {}
  const price = !_isEmpty(productInfo) ? await priceService.getPriceById(uid, productInfo.productPriceId || 0, 'id,price') : {}
  const status = article.statusType
  return {
    status: STATUS_TYPE[status],
    id: article.id,
    price: price.price || 0,
    title: article.title || '',
    content: article.content || '',
    seriesId: article.seriesId || 0,
    productId: productInfo.id || 0,
    paidContent: article.paidContent || '',
    categoryId: article.naviCategoryId || 0,
    margin: productInfo.affiliateMargin || 0,
    isReserved: article.isReservedStart || 0,
    reservedDate: article.reserveStartAt || 0,
    isPaidContent: article.isPaidContent || 0,
    publishedAt: article.publishedAt || 0,
    articleOption: article.articleOption || 0
  }
}

/**
 * validate logic to create and update article
 * Note: articleOptnion and typeOption check in comment : https://gogojungle.backlog.jp/view/OAM-46711#comment-90500273
 * @param {object} data
 * @private
 */
function _validateInput(data = {}) {
  const {
    title,
    margin,
    price,
    content,
    reservedDate,
    isReservedStart,
    statusType,
    paidContent,
    seriesId,
    articleOption,
    typeOption
  } = data

  const errFields = []
  // validate logic
  if (statusType == 1) {
    if (!content) {
      errFields.push('content')
    }
    if (!price && ([1,3].includes(articleOption) && typeOption == 1) ||(margin && !price) || (price && price < 100)) {
      errFields.push('price')
    }
    if (price && !_inRange(margin, 0, 100)) {
      errFields.push('margin')
    }
    if (reservedDate && !isReservedStart) {
      errFields.push('isReserved')
    }
    if (price && !paidContent && articleOption != 2 || (articleOption == 2 && !paidContent) ) {
      errFields.push('paidContent')
    }
    if ((isReservedStart && !reservedDate) || (isReservedStart && reservedDate < Date.now() / 1000)) {
      errFields.push('ReservedDate')
    }
    if(!seriesId && [2,3].includes(articleOption)){
      errFields.push('seriesId')
    }
  }
  if (!title) {
    errFields.push('title')
  }
  if (errFields.length > 0) {
    return errFields
  }
  return true
}

/**
 * Validate data to create and update article
 * Note: articleOptnion and typeOption check in comment : https://gogojungle.backlog.jp/view/OAM-46711#comment-90500273
 * @param {object} data
 */
async function _validateFields(data = {}) {
  const {
    status = 'unpublish',
    title = '',
    content = '',
    margin = 0,
    price = 0,
    paidContent = '',
    isReserved = 0,
    reservedDate = 0,
    seriesId = 0,
    categoryId = 0,
    articleOption = 1,
    typeOption = 1
  } = data
  return {
    statusType: STATUS_TYPE.findIndex(item => item == status) != 1 ? 0 : 1,
    publishedAt: (status == 'publish' && isReserved == 1) ? reservedDate : (status == 'publish') ? (Date.now() / 1000) : 0,
    title,
    price: (Number.isInteger(price * 1) && price >= 0) ? price * 1 : 0,
    margin: (Number.isInteger(margin * 1) && margin >= 0) ? margin * 1 : 0,
    content,
    categoryId: (await helper.getListIdNaviCategories()).includes(+categoryId) ? +categoryId : 0,
    seriesId,
    isPaidContent: [1,3].includes(articleOption) && typeOption == 2 ? 0 : 1,
    paidContent: ([1,3].includes(articleOption) && typeOption == 2) ? '' : paidContent,
    reservedDate: (Number.isInteger(reservedDate * 1) && reservedDate >= 0) ? reservedDate * 1 : 0,
    isReservedStart: +[1].includes(isReserved),
    articleOption: [1,2,3].includes(articleOption) ? articleOption : 1,
    typeOption: [1,2].includes(typeOption) ? typeOption : 2
  }
}

/**
 * create article
 * Note: articleOptnion and typeOption check in comment : https://gogojungle.backlog.jp/view/OAM-46711#comment-90500273
 * @param {object} meta
 * @param {object} data
 */
async function createArticle(meta, data = {}) {
  // validate
  if (_isEmpty(meta)) {
    return { code: 400, errMess: 'userNotAvailable' }
  }
  if (_isEmpty(data)) {
    return { code: 400, errMess: 'emptyBodyData' }
  }
  const { userId, userAgent, ipAddress } = meta
  // standard fields
  const newData = await _validateFields(data)
  // validate Logic
  // const checkValidate = _validateInput(newData)
  if (!(newData.title || '').trim()) {
    return { code: 400, errMess: 'errData', message: 'Title is not allowed empty' }
  }

  // create product and prodcutPrice
  let product = {},
    productPrice = {}

  // add data to article
  if ([1,3].includes(newData.articleOption) && newData.typeOption == 1) {
    [product, productPrice] = await productService.createProductHasPrice({
      userId,
      userAgent,
      ipAddress,
      price: newData.price || 0,
      title: newData.title || '',
      margin: newData.margin || 0,
      statusType: newData.statusType,
      chargeType: 1
    })
  }
  newData.seriesId = (await helper.checkUserSeries(userId, newData.seriesId)) && ([2,3].includes(newData.articleOption)) ? newData.seriesId : 0

  // create article
  const article = await articleModel.create({
    userId,
    userAgent,
    ipAddress,
    isValid: 1,
    title: newData.title || '',
    seriesId: newData.seriesId,
    productId: product.id || 0,
    statusType: newData.statusType,
    content: newData.content || '',
    publishedAt: newData.publishedAt,
    articleOption: newData.articleOption,
    isPaidContent: newData.isPaidContent,
    paidContent: newData.paidContent || '',
    naviCategoryId: newData.categoryId || 0,
    isReservedStart: newData.isReservedStart ? 1 : 0,
    reserveStartAt: parseInt(newData.reservedDate) || 0,
  })

  // sync data
  syncService.syncDataToFxon('articles', article.id)
  return {
    id: article.id,
    title: article.title || '',
    productId: product.id || 0,
    price: productPrice.price || 0,
    content: article.content || '',
    seriesId: article.seriesId || 0,
    categoryId: article.naviCategoryId,
    isReserved: article.isReservedStart,
    articleOption: article.articleOption,
    isPaidContent: article.isPaidContent,
    margin: product.affiliateMargin || 0,
    status: STATUS_TYPE[article.statusType],
    paidContent: crypto.decrypt(article.paidContent),
    publishedAt: parseInt(_getTimeStamp(article.publishedAt) / 1000) || 0,
    reservedDate: parseInt(_getTimeStamp(article.reserveStartAt) / 1000) || 0,
  }
}

/**
 * Update multiple articles coumlun seriesId
 *
 * @param {array} articleIds
 * @param {number} seriesId
 * @param {number} userId
 */
async function updateArticleSeriesID(articleIds, seriesId, userId) {
  if (!seriesId || !userId) {
    return []
  }
  const articles = await getArticlesBySeriesId(userId, seriesId, 'id')
  const listOldArticleId = arrayUtils.column(articles, 'id')
  const listDelete = listOldArticleId.filter(item => !articleIds.includes(item))
  const listAddNew = articleIds.filter(item => !listOldArticleId.includes(item))

  // update articles
  if (listDelete.length > 0) {
    await articleModel.updateAll({ userId, id: { inq: listDelete }, isValid: 1 }, { seriesId: 0 })
  }
  if (listAddNew.length > 0) {
    // validate list addNew is none series
    const listAddNewNoneSeries = await articleModel.find({
      where: {
        id: { inq: listAddNew },
        seriesId: 0,
        isValid: 1,
      },
    })
    await articleModel.updateAll({ userId, id: { inq: arrayUtils.column(listAddNewNoneSeries, 'id') } }, { seriesId })
  }
  syncService.syncMultiDataToFxon('articles', listDelete.concat(listAddNew))
  return await getArticlesBySeriesId(userId, seriesId, 'id,title,statusType')
}

/**
 * Update article
 * Note: articleOptnion and typeOption check in comment : https://gogojungle.backlog.jp/view/OAM-46711#comment-90500273
 * @param {object} meta
 * @param {number} id
 * @param {object} data
 */
async function updateArticle(meta, id, data = {}) {
  const { userId, userAgent, ipAddress } = meta
  if (_isEmpty(meta)) {
    return { code: 400, errMess: 'userNotAvailable' }
  }
  if (_isEmpty(data)) {
    return { code: 400, errMess: 'emptyBodyData' }
  }
  const article = await _article(id, userId)
  if (_isEmpty(article) || !article) {
    return { code: 404, errMess: 'userNotAvailable' }
  }

  if (![0, 1].includes(article.statusType)) {
    return { code: 400, errMess: 'itemCantNotUpdate' }
  }
  const newData = await _validateFields(data)

  const checkValidate = _validateInput(newData)
  if (checkValidate !== true) {
    return { code: 400, errMess: 'errData', message: checkValidate }
  }

  let product = {},
    productPrice = {}

  // update product or create new product
  if ([1,3].includes(newData.articleOption) && newData.typeOption == 1) {
    if (article.statusType == 0) {
      if (!article.productId) {
        [product, productPrice] = await productService.createProductHasPrice({
          userId,
          userAgent,
          ipAddress,
          title: newData.title || '',
          margin: newData.margin || 0,
          price: newData.price || 0,
          statusType: newData.statusType,
        })
      } else {
        const productId = article.productId
        product = await productService.updateProduct(userId, productId, { affiliateMargin: newData.margin, statusType: newData.statusType }) || {}
        productPrice = await priceService.updateProductPrice(userId, product.productPriceId, { price: newData.price, statusType: newData.statusType }) || {}
      }
    }
    if (article.statusType == 1) {
      product = (article.productId)
        ? await productService.updateProduct(userId, article.productId, { affiliateMargin: newData.margin || 0, statusType: newData.statusType })
        : await productService.getProductById(
          userId,
          article.productId || 0,
          'id,name,affiliateMargin,productPriceId,isSpecialDiscount,isFreeFirstMonth,specialDiscountEndAt,specialDiscountStartAt',
        )
      productPrice = await priceService.getPriceById(userId, product.productPriceId, 'price,specialDiscountPrice')
    }
  }
  // update article when article statusType = 0
  newData.isPaidContent = newData.isPaidContent
  newData.productId = product.id || 0
  newData.reserveStartAt = newData.reservedDate
  newData.naviCategoryId = newData.categoryId || 0
  newData.seriesId = ([2,3].includes(newData.articleOption)) && (await helper.checkUserSeries(userId, newData.seriesId)) ? newData.seriesId : 0

  await articleModel.updateAll({ userId, id }, newData)

  // get new article after update
  const newArticle = await _article(id, userId)
  // set publish date/send mail
  if (newArticle.seriesId && newData.statusType == 1) {
    await _updateArticleStatus(newArticle, newData.statusType)
  } else {
    // sync data article
    syncService.syncDataToFxon('articles', article.id)
  }

  return {
    id: newArticle.id,
    productId: product.id || 0,
    title: newArticle.title || '',
    price: productPrice.price || 0,
    content: newArticle.content || '',
    seriesId: newArticle.seriesId || 0,
    paidContent: newArticle.paidContent,
    margin: product.affiliateMargin || 0,
    isReserved: newArticle.isReservedStart,
    isPaidContent: newArticle.isPaidContent,
    categoryId: newArticle.naviCategoryId || 0,
    status: STATUS_TYPE[newArticle.statusType],
    publishedAt: newArticle.publishedAt || 0,
    reservedDate: newArticle.reserveStartAt || 0,
    articleOptionL: newArticle.articleOption || 0
  }

}

/**
 * Delete article
 *
 * @param {number} userId
 * @param {number} id
 */
async function deleteArticle(userId, id) {

  if (!userId || !id) {
    return false
  }
  const article = await _article(id, userId)
  if (_isEmpty(article)) {
    return false
  }
  if (article.statusType > 0) {
    return false
  }
  if (article.productId) {
    await productService.deleteProduct(userId, article.productId)
  }
  const resultDeleteArticle = await articleModel.updateAll({ userId, id, isValid: { inq: [0, 1] } }, { isValid: 0 })
  if (!resultDeleteArticle.count) {
    return false
  }
  syncService.syncDataToFxon('articles', id, { is_valid: 0 })
  return true
}

/**
 * sales stop artice
 * @param {number} userId
 * @param {number} id
 */
async function salesStopArticle(userId, id) {
  const article = await _article(id, userId)
  if (![1].includes(article.statusType)) {
    return false
  }
  await articleModel.updateAll({ id }, { statusType: 2 })
  if (article.productId) {
    await Promise.all([
      productService.updateProduct(userId, article.productId, { statusType: 9 }),
      saleModel.updateAll({ productId: article.productId }, { isFinished: 1 }),
    ])
  }
  syncService.syncDataToFxon('articles', id)

  return true
}

/**
 * re-sell article
 * @param {number} userId
 * @param {number} articleId
 * @returns {Promise<Object|{}|{articleId: *, userId: *}>}
 */

async function resell(userId, articleId) {
  const article = await _article(articleId, userId) || {}
  const isNotSaleStopped = ![2, 9].includes(article.statusType)
  const isBelongToSeries = article.articleOption === 2

  if (!Object.keys(article).length || isNotSaleStopped || isBelongToSeries) return article

  const processes = [
    articleModel.updateAll({ id: articleId }, { statusType: 1 })
  ]

  if (article.productId) {
    processes.push(
      productService.updateProduct(userId, article.productId, { statusType: 1 }),
      saleModel.updateAll({ productId: article.productId }, { isFinished: 0 }),
    )
  }

  await Promise.all(processes)
  syncService.syncDataToFxon('articles', article.id)
  return {
    userId,
    articleId
  }
}

module.exports = {
  show,
  index,
  getArticles,
  updateStatus,
  createArticle,
  deleteArticle,
  updateArticle,
  salesStopArticle,
  getListArticleSearch,
  updateArticleSeriesID,
  getArticlesBySeriesId,
  getArticlesNoneSeries,
  countArticleBySerieIds,
  resell
}


