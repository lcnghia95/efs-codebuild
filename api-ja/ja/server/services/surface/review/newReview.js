const app = require('@server/server')
const modelUtils = require('@server/utils/model')
const commonProductUrl = require('@services/common/productUrl')
const commonProduct = require('@services/common/product')
// const commonReview = require('@services/common/review')
const commonUser = require('@services/common/user')

// Model
const salesModel = app.models.Sales
const productCategoriesModel = app.models.ProductCategories
const reviewModel = app.models.Reviews
const commonRecentReviewsModels = app.models.CommonRecentReviews
const alsoBoughtProductsModel = app.models.AlsoBoughtProducts
const CommonRecommendedProductsModel = app.models.CommonRecommendedProducts

// Utils
const objectUtil = app.utils.object
const arrayUtil = require('@ggj/utils/utils/array')
const pagingUtil = app.utils.paging
const timeUtil = app.utils.time

// Const variable
const BEST_SALE_IGNORE_PRODUCT_ID = '7650'
const BEST_SALE_IGNORE_TYPE_ID = '16,79'
const PRIVACY_SCHEMA = 'privacy'
const COMMON_SCHEMA = 'common'

const ONE_MONTH = 2592000000
const THREE_MONTHS = 7776000000
const SIX_MONTHS = 15552000000
const ONE_YEAR = 31104000000

const { SALON_PRODUCT_IDS, EBOOK_TYPE_IDS } = require('@@server/common/data/hardcodedData')
// const EBOOK_TYPE_IDS = [2, 6, 9, 10, 13]

const REVIEWS_PERIODS = ['oneMonth', 'threeMonths', 'sixMonths', 'all']

const TYPE_MAPPING = {
  systemtrade: [1],
  kabu: [1],
  tools: EBOOK_TYPE_IDS,
  navi: [3],
  salons: [4],
  emagazine: [4],
  others: [1, 2, 3, 4, 6, 9, 10], // neq this
}

const TIME_MAPPING = {
  all: 0,
  1: ONE_MONTH,
  3: THREE_MONTHS,
  6: SIX_MONTHS,
  12: ONE_YEAR,
}

const REVIEW_STAR_PRIORITY = ['stars', 'count']
const REVIEW_COUNT_PRIORITY = ['count', 'stars']


/**
 * Get list product reviews with many buyers
 *
 * @param {Number} limit
 * @param {Number} offset
 * @param {Boolean} isDetail
 * @return {Promise<Array>}
 * @public
 */
async function popular(limit, offset = 0, isDetail = false) {
  const reviewConditions = {
    where: {
      isValid: 1,
      productId: { nin: BEST_SALE_IGNORE_PRODUCT_ID.split(',') },
      typeId: { nin: BEST_SALE_IGNORE_TYPE_ID.split(',') },
      title: { neq: '' },
      content: { neq: '' },
    },
    fields: { productId: true },
    limit: 0,
  }
  const reviewData = await _getReview(reviewConditions)

  if (!reviewData.length) {
    return []
  }

  const reviewProductId = arrayUtil.column(reviewData, 'productId', true).join(',')
  const dataFilter = `WHERE product_id != 0 AND affiliate_id = 0 AND is_valid = 1 AND status_type = 1
    AND is_monitor = 0 AND is_cancel = 0 AND is_cooling_off = 0
    AND price > 0 AND product_id IN (${reviewProductId})`
  const [ topSaleProducts, totalRecordArr ] = await Promise.all([
    modelUtils.excuteQuery(PRIVACY_SCHEMA, _generateSQL (dataFilter, limit, offset)),
    isDetail ? modelUtils.excuteQuery(PRIVACY_SCHEMA, _generateCountProductSaleGroupSQL(dataFilter)) : -1])
  const totalRecord = isDetail ? totalRecordArr[0].total : -1  // not use if isDetail=false
  if (!topSaleProducts.length || !totalRecord ) {
    return []
  }

  const systemtradeProductIds = arrayUtil.column(topSaleProducts.filter(product => product.typeId == 1), 'productId')
  const productIds = arrayUtil.column(topSaleProducts, 'productId').join(',')
  let [reviews, productCategories, productUrls] = await Promise.all([
    modelUtils.excuteQuery(COMMON_SCHEMA, _generateSQLGetReviewContent(productIds)),
    _getProductCategories(systemtradeProductIds),
    commonProductUrl.productDetailUrls(topSaleProducts),
  ])

  productCategories = arrayUtil.index(productCategories, 'productId')
  reviews = arrayUtil.index(reviews, 'productId')

  const response = topSaleProducts.map(item => _popularObject(item, reviews, productUrls, productCategories))

  return (!isDetail) ? response : { total: totalRecord , data: response }
}

/**
 * Get general data for review of products with high ratings
 *
 * @param {Object} params
 * @param {Object} query
 * @return {Promise<Object>}
 * @public
 */
async function highScore(params, query) {
  const type = params.type
  const month = params.month

  // Get data for Review score ranking
  if (!type && !month) {
    return await reviewScoreRanking(query.limit || 5)
  }

  const page = query.page || 1
  const limit = query.limit || 20

  // Get full high score by type
  if (!month) {
    return await _getDetailRankingReview(0, type, page, limit, REVIEW_STAR_PRIORITY)
  }

  const period = parseInt(TIME_MAPPING[month])

  // Get data for review of products with high ratings
  if (!type) {
    const limit = query.limit || 10
    const data = await _generateHighData(period, REVIEW_STAR_PRIORITY)
    const res = _groupProductsByType(data) // All data

    // Limit response data
    return _limitResponseData(res, limit)
  }

  // Get data for detail of review of products with high ratings
  return await _getDetailRankingReview(period, type, page, limit, REVIEW_STAR_PRIORITY)
}

/**
 * Get general data for review of products with high post
 *
 * @param {Object} params
 * @param {Object} query
 * @return {Promise<Object>}
 * @public
 */
async function highPost(params, query) {
  const type = params.type
  const month = params.month
  const period = parseInt(TIME_MAPPING[month])

  if (!type) {
    const limit = query.limit || 10
    const data = await _generateHighData(period, REVIEW_COUNT_PRIORITY)
    const res = _groupProductsByType(data) // All data

    // Limit response data
    return _limitResponseData(res, limit)
  }

  const page = query.page || 1
  const limit = query.limit || 20

  if (month == 3) {
    if (!['systemtrade', 'tools'].includes(type)) {
      return {}
    }
    return await _getDetailRankingReview(period, type, page, limit, REVIEW_COUNT_PRIORITY)
  }

  return await _getDetailRankingReview(period, type, page, limit, REVIEW_COUNT_PRIORITY)
}

/**
 * Get data for review score ranking
 *
 * @param {Number} limit
 * @return {Promise<Object>}
 * @public
 */
async function reviewScoreRanking(limit) {
  const conditions = {
    where: {
      isValid: 1,
      typeId: {
        inq: [1, 2, 3, 4, 6, 9, 10, 13],
      },
      title: { neq: '' },
      content: { neq: '' },
    },
    order: 'publishedAt DESC',
    fields: { productId: true, typeId: true, reviewStars: true, publishedAt: true },
    limit: 0,
  }
  let reviews = await _getReview(conditions)

  if (reviews.length == 0) {
    return {}
  }

  const pIds = arrayUtil.column(reviews, 'productId', true).join(',')
  const productSQL = `SELECT id, type_id AS typeId, name FROM products WHERE id IN (${pIds})`
  const systemtradeProductIds = arrayUtil.column(reviews.filter(product => product.typeId == 1), 'productId')

  let [productCategories, products] = await Promise.all([
    _getProductCategories(arrayUtil.unique(systemtradeProductIds)),
    modelUtils.excuteQuery(PRIVACY_SCHEMA, productSQL),
  ])

  const productUrls = await commonProductUrl.productDetailUrls(products)

  productCategories = arrayUtil.index(productCategories, 'productId')
  products = arrayUtil.index(products, 'id')

  reviews = reviews.map(item => {
    const id = item.productId
    return objectUtil.nullFilter({
      productId: id,
      typeId: item.typeId,
      publishedAt: item.publishedAt,
      review: {
        stars: item.reviewStars || 0,
      },
      name: products[id] ? products[id].name : '',
      productUrl: productUrls[id] || '',
      categoryId: productCategories[id] ? productCategories[id].categoryId : null,
    })
  })

  const groupReviewsByType = _groupProductsByType(reviews, false)

  return Object.keys(groupReviewsByType).reduce((result, item) => {
    if (!result[item]) {
      result[item] = []
    }
    const data = _groupProductsByPeriod(groupReviewsByType[item], limit)
    result[item] = data
    return result
  }, {})
}

/**
 * Get detail data of popular (List A)
 *
 * @param {Number} page
 * @param {Number} limit
 * @return {Promise<Object>}
 * @public
 */
async function popularDetail(page, limit) {
  const offset = pagingUtil.getOffsetCondition(page, limit)
  const popularProductReviews = await popular(offset.limit, offset.skip, true)
  let data = popularProductReviews.data || []

  if (!data.length) {
    return {}
  }

  const uIds = arrayUtil.column(data, 'userId', true)
  const pIds = arrayUtil.column(data, 'productId', true)
  let [users, products] = await Promise.all([
    commonUser.getUsers(uIds),
    commonProduct.products(pIds, 'id,name'),
  ])

  users = arrayUtil.index(users, 'id')
  products = arrayUtil.index(products, 'id')

  data = data.reduce((result, item) => {
    const uId = item.userId
    const pId = item.productId
    item.nickName = !users[uId] ? '' : users[uId].nickName || ''
    item.name = !products[pId] ? '' : products[pId].name || ''
    result.push(item)
    return result
  }, [])

  return pagingUtil.addPagingInformation(data, page, popularProductReviews.total, limit)
}

/**
 * Generate list detail for new popular (List A)
 *
 * @param {Number} page
 * @param {Number} limit
 * @return {Promise<Object>}
 * @public
 */
async function newPopularDetail(page, limit) {
  const pagingOffset = pagingUtil.getOffsetCondition(page, limit)
  const [reviews, total] = await Promise.all([
    _getCommonRecentReview(pagingOffset.limit, pagingOffset.skip),
    commonRecentReviewsModels.count({
      where: {
        isValid: 1,
      },
    }),
  ])

  if (!reviews.length) {
    return []
  }

  const productUrls = await commonProductUrl.productDetailUrls(reviews)
  const data = reviews.map(item => _detailObject(item, productUrls))

  return pagingUtil.addPagingInformation(data, page, total, limit)
}

/**
 * Get full product review and arrange by review count
 *
 * @param {Number} page
 * @param {Number} limit
 * @return {Promise<Object>}
 * @public
 */
async function fullhighPost(page, limit) {
  return await _getDetailRankingReview(null, null, page, limit, REVIEW_COUNT_PRIORITY)
}

/**
 * Get full product review and arrange by review star
 *
 * @param {Number} page
 * @param {Number} limit
 * @return {Promise<Object>}
 * @public
 */
async function fullhighScore(page, limit) {
  return await _getDetailRankingReview(null, null, page, limit, REVIEW_STAR_PRIORITY)
}

/**
 * Generate object for list detail
 *
 * @param {Object} item
 * @param {Object} productUrls
 * @return {Promise<Array>}
 * @private
 */
function _detailObject(item, productUrls) {
  const id = item.productId
  return objectUtil.nullFilter({
    productId: id,
    name: item.productName || '',
    typeId: item.typeId,
    reviewTitle: item.reviewTitle || '',
    reviewContent: item.reviewContent || '',
    review: {
      stars: item.reviewStars,
    },
    publishedAt: item.reviewPublishedAt,
    userId: item.reviewUserId,
    productUrl: productUrls[id] || '',
    nickName: item.reviewNickName || '',
  })
}

/**
 * Generate data for high detail page (highpost & high score)
 *
 * @param {Number} period
 * @param {String} type
 * @param {Number} page
 * @param {Number} limit
 * @param {Array} sort
 * @return {Promise<Object>}
 * @private
 */
async function _getDetailRankingReview(period, type, page, limit, sort) {
  const pagingOffset = pagingUtil.getOffsetCondition(page, limit)
  let conditions = {}

  if (type) {
    const typeIds = TYPE_MAPPING[type]

    conditions = {
      where: {
        typeId: (type == 'others') ? { nin: typeIds } : { inq: typeIds },
        productId: (type == 'salons') ? { inq: SALON_PRODUCT_IDS } : { nin: SALON_PRODUCT_IDS },
      },
    }
  }

  let data = await _generateHighData(period, sort, conditions)

  if (!data.length) {
    return {}
  }

  // Sort response data by type (for: systemtrade or kabu)
  if (['systemtrade', 'kabu'].includes(type)) {
    if (type == 'systemtrade') {
      data = data.filter(item => item.categoryId == 1)
    } else {
      data = data.filter(item => item.categoryId == 3)
    }
  }

  if (!data.length) {
    return {}
  }

  let pagingData = data.slice(pagingOffset.skip, parseInt(pagingOffset.skip) + parseInt(pagingOffset.limit))

  if (!pagingData.length) {
    return pagingUtil.addPagingInformation(pagingData, page, data.length, limit)
  }

  const pIds = arrayUtil.column(pagingData, 'productId', true)
  const uIds = arrayUtil.column(pagingData, 'userId', true)
  let [products, users] = await Promise.all([
    commonProduct.products(pIds, 'id,name'),
    commonUser.getUsers(uIds),
  ])

  products = arrayUtil.index(products)
  users = arrayUtil.index(users)

  pagingData = pagingData.map(item => {
    item.name = products[item.productId] ? products[item.productId].name : '',
      item.nickName = users[item.userId] ? users[item.userId].nickName : ''
    return item
  })

  return pagingUtil.addPagingInformation(pagingData, page, data.length, limit)
}

/**
 * Get common recent review
 *
 * @param {Number} limit
 * @param {Number} offset
 * @return {Promise<Array>}
 * @private
 */
async function _getCommonRecentReview(limit, offset) {
  const fields = {
    productId: true,
    productName: true,
    reviewUserId: true,
    reviewNickName: true,
    reviewPublishedAt: true,
    reviewTitle: true,
    reviewContent: true,
    typeId: true,
    categoryId: true,
    reviewStars: true,
  }

  return await commonRecentReviewsModels.find({
    where: {
      isValid: 1,
    },
    order: 'reviewPublishedAt DESC',
    fields,
    limit,
    skip: offset,
  })
}

/**
 * Generate data for high score and high post
 *
 * @param {Number} period
 * @param {Array} sort
 * @param {Object} conditions
 * @return {Promise<Array>}
 * @private
 */
async function _generateHighData(period, sort, conditions = {}) {
  const data = await _getReviewProducts(period, conditions)

  if (!data.length) {
    return []
  }

  const processedData = _handleReviewStarData(data, sort)
  const pIds = arrayUtil.column(processedData, 'productId', true).join(',')
  let reviews = await modelUtils.excuteQuery(COMMON_SCHEMA, _generateSQLGetReviewContent(pIds))

  reviews = arrayUtil.index(reviews, 'productId')

  return processedData.map(item => _highObjectData(item, reviews))
}

/**
 * Get all review products by period
 *
 * @param {Number} period
 * @param {Object} extConditions
 * @return {Promise<Array>}
 * @private
 */
async function _getReviewProducts(period, extConditions = {}) {
  const whereExtends = extConditions.where || {}
  const fields = {
    productId: true,
    typeId: true,
    reviewStars: true,
  }

  const conditions = objectUtil.nullFilter({
    where: objectUtil.nullFilter(
      Object.assign(
        {
          isValid: 1,
          publishedAt: (!period) ? null : {
            gte: Date.now() - period,
          },
          title: { neq: '' },
          content: { neq: '' },
        },
        whereExtends,
      ),
    ),
    fields,
    order: extConditions.order || null,
    limit: 0,
  })

  const initialData = await _getReview(conditions)

  if (!initialData.length) {
    return []
  }

  const systemtradeProductIds = arrayUtil.column(initialData.filter(product => product.typeId == 1), 'productId')
  let [productCategories, productUrls] = await Promise.all([
    _getProductCategories(arrayUtil.unique(systemtradeProductIds)),
    commonProductUrl.productDetailUrls(initialData), // TODO: reduce dupplicate initialData before
  ])

  productCategories = arrayUtil.index(productCategories, 'productId')

  return initialData.reduce((result, item) => {
    const id = item.productId
    const data = {
      productId: id,
      typeId: item.typeId || 0,
      categoryId: (!productCategories[id]) ? null : productCategories[id].categoryId,
      review: {
        stars: item.reviewStars || 0,
      },
      productUrl: productUrls[id] || '',
    }
    result.push(objectUtil.nullFilter(data))
    return result
  }, [])
}

/**
 * Generate SQL get review content of products
 *
 * @param {String} pId
 * @return {Promise<Array>}
 * @public
 */
function _generateSQLGetReviewContent(pIds) {
  return `SELECT id, product_id AS productId, title, content, published_at AS publishedAt,
      review_stars AS reviewStars, user_id AS userId
    FROM reviews
    WHERE id IN (
      SELECT max(id) AS id
      FROM reviews
      WHERE is_valid = 1 AND product_id IN(${pIds}) AND title <> '' AND content <> ''
      GROUP BY product_id
    )`
}

/**
 * Generate SQL
 *
 * @param {String} ids
 * @param {Number} limit
 * @param {Number} offset
 * @return {String}
 * @private
 */
function _generateSQL(dataFilter , limit = 0, offset = 0 ) {
  const sql = `SELECT product_id as productId, type_id as typeId, COUNT(id) as total
    FROM sales ${dataFilter}
    GROUP BY product_id
    ORDER BY total DESC`
  return !limit ? sql : sql + ` LIMIT ${limit} OFFSET ${offset}`
}

function _generateCountProductSaleGroupSQL(dataFilter){
  return `SELECT COUNT(DISTINCT(product_id)) as total
    FROM sales ${dataFilter}`
}


/**
 * Limit response data for highscore and highpost
 *
 * @param {Object} data
 * @param {Number} limit
 * @return {Object}
 * @private
 */
function _limitResponseData(data, limit) {
  return Object.keys(data).reduce((result, element) => {
    if (!result[element]) {
      result[element] = []
    }
    if (data[element].length > limit) {
      result[element] = data[element].slice(0, limit)
    } else {
      result[element] = data[element]
    }
    return result
  }, {})
}

/**
 * Generate popular response data
 *
 * @param {Object} item
 * @param {Object} review
 * @param {Object} productUrl
 * @param {Object} categories
 * @return {Object}
 * @private
 */
function _popularObject(item, review, productUrl, categories) {
  const id = item.productId
  const rv = review[id]
  return objectUtil.nullFilter({
    productId: id,
    reviewTitle: (!rv) ? '' : rv.title || '',
    reviewContent: (!rv) ? '' : rv.content || '',
    review: {
      stars: (!rv) ? 0 : rv.reviewStars,
    },
    publishedAt: (!rv) ? null : timeUtil.toUnix(rv.publishedAt),
    typeId: item.typeId,
    userId: (!rv) ? 0 : rv.userId,
    categoryId: (!categories[id]) ? null : categories[id].categoryId,
    productUrl: productUrl[id] || '',
  })
}

/**
 * Generate high response data
 *
 * @param {Object} item
 * @param {Object} review
 * @return {Object}
 * @private
 */
function _highObjectData(item, review) {
  const id = item.productId
  const rv = review[id]
  return objectUtil.nullFilter({
    productId: id,
    typeId: item.typeId,
    categoryId: item.categoryId || null,
    review: {
      stars: item.review.stars,
      count: item.review.count,
    },
    productUrl: item.productUrl || '',
    reviewTitle: (!rv) ? '' : rv.title || '',
    reviewContent: (!rv) ? '' : rv.content || '',
    userId: (!rv) ? 0 : rv.userId,
    publishedAt: (!rv) ? null : timeUtil.toUnix(rv.publishedAt),
  })
}

/**
 * Get product categories
 *
 * @param {Array} productIds
 * @return {Promise<Array>}
 * @private
 */
async function _getProductCategories(productIds) {
  if (!productIds.length) {
    return []
  }
  return productCategoriesModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    fields: { productId: true, categoryId: true },
    limit: 0,
  })
}

/**
 * Get review data
 *
 * @param {Object} conditions
 * @return {Promise<Array>}
 * @private
 */
async function _getReview(conditions) {
  return reviewModel.find(conditions)
}

/**
 * Handle reviews data
 *
 * @param {Array} reviews
 * @return {Promise<Array>}
 * @private
 */
function _groupReviewDataByProductIds(reviews) {
  return reviews.reduce((result, item) => {
    const id = item.productId
    if (!result[id]) {
      result[id] = JSON.parse(JSON.stringify(item))
      result[id].review.count = 1
      result[id].review.stars = item.review.stars
    } else {
      result[id].review.stars += item.review.stars
      result[id].review.count += 1
    }
    return result
  }, {})
}

/**
 * Handle review star
 *
 * @param {Array} reviews
 * @param {Array} sortConditions
 * @return {Array}
 * @private
 */
function _handleReviewStarData(reviews, sortConditions) {
  const input = _groupReviewDataByProductIds(reviews)
  const data = Object.keys(input).reduce((result, item) => {
    const objectData = input[item]
    if (!objectData.review.stars) {
      objectData.review.stars = 0
    } else {
      objectData.review.stars = objectData.review.stars / objectData.review.count
    }
    result.push(objectData)
    return result
  }, [])

  return _sortArrayDESC(data, sortConditions)
}

/**
 * Sort desc array by two attribute
 *
 * @param {Array} data
 * @param {Array} sortConditions
 * @return {Promise<Array>}
 * @private
 */
function _sortArrayDESC(data, sortConditions) {
  if (!data.length) {
    return []
  }

  if (!sortConditions.length) {
    return data
  }

  const firstCondition = sortConditions[0]
  const secondsCondition = sortConditions[1]

  // TODO this function support sort data with 2 attributes

  return data.sort((a, b) => {
    if (a.review[firstCondition] < b.review[firstCondition]) {
      return 1
    }
    if (b.review[firstCondition] < a.review[firstCondition]) {
      return -1
    }

    if (b.review[firstCondition] == a.review[firstCondition]) {
      if (a.review[secondsCondition] < b.review[secondsCondition]) {
        return 1
      }
      if (b.review[secondsCondition] < a.review[secondsCondition]) {
        return -1
      }
      if (b.review[secondsCondition] == a.review[secondsCondition]) {
        if (a.productId && b.productId) {
          if (a.productId < b.productId) {
            return 1
          }
          return -1
        }
        return 0
      }
    }
  })
}

/**
 * Generate response data for highscore and highpost
 *
 * @param {Array} data
 * @param {Object} categories
 * @param {Boolean} isGetOthers
 * @return {Object}
 * @private
 */
function _groupProductsByType(data, isGetOthers = true) {
  const res = {}
  const productTypes = ['systemtrade', 'kabu', 'tools', 'navi',
    'salons', 'emagazine', 'others']

  // Initial data
  productTypes.map(item => res[item] = [])

  // Classification
  data.map((item) => {
    const id = parseInt(item.productId)
    const type = item.typeId

    // Salon: typeId = 4 & in SALON_PRODUCT_IDS
    if (SALON_PRODUCT_IDS.includes(id)) {
      return res['salons'].push(item)
    }

    // Fx or Stock
    if (type == 1) {
      // FX: typeId = 1 & categories = 1
      if (item.categoryId == 1) {
        return res['systemtrade'].push(item)
      } else {
        // Stock or bitcoin: typeId = 1 & categories != 1
        return res['kabu'].push(item)
      }
    }

    // Ebook: typeId = 6,9,10
    if (EBOOK_TYPE_IDS.includes(type)) {
      return res['tools'].push(item)
    }

    // Navi: typeId = 3
    if (type == 3) {
      return res['navi'].push(item)
    }

    // Mailmagazine: typeId = 4
    if (type == 4) {
      return res['emagazine'].push(item)
    }

    // Others
    return res['others'].push(item)
  })

  if (!isGetOthers) {
    delete res['others']
  }

  return res
}

/**
 * Group products by period
 *
 * @param {Array} data
 * @param {Number} limit
 * @return {Promise<Object>}
 * @private
 */
function _groupProductsByPeriod(data, limit) {
  const res = {}
  const now = Date.now()
  const oneMonthLeadtime = (now - ONE_MONTH) / 1000
  const threeMonthsLeadtime = (now - THREE_MONTHS) / 1000
  const sixMonthsLeadtime = (now - SIX_MONTHS) / 1000

  // Initial data
  REVIEWS_PERIODS.map(item => res[item] = [])

  // Classification
  data.map(element => {
    if (element.publishedAt >= sixMonthsLeadtime) {
      res['sixMonths'].push(element)
    }
    if (element.publishedAt >= threeMonthsLeadtime) {
      res['threeMonths'].push(element)
    }
    if (element.publishedAt >= oneMonthLeadtime) {
      res['oneMonth'].push(element)
    }
  })
  res['all'] = data

  return REVIEWS_PERIODS.reduce((result, item) => {
    if (!result[item]) {
      result[item] = {}
    }
    let groupData = _handleReviewStarData(res[item], REVIEW_STAR_PRIORITY)
    if (limit) {
      if (groupData.length > limit) {
        groupData = groupData.slice(0, limit)
      }
    }
    result[item] = groupData
    return result
  }, {})
}

/**
 * Get also bought data of product
 *
 * @param {Number} userId
 * @param {Number} product id
 * @return {Promise<Object>}
 * @public
 */
async function alsoBought(userId, id) {
  let purchasedProductIds = [],
    alsoBoughtProducts = [],
    ignoreProductIds = []

  if (userId) {
    purchasedProductIds = await _getProductsPurchased(userId)
  }

  ignoreProductIds = ignoreProductIds.concat((purchasedProductIds || []).push(id))
  alsoBoughtProducts = await alsoBoughtProductsModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: [id],
      },
      boughtProductId: {
        nin: ignoreProductIds.length ? ignoreProductIds : null,
      },
    },
    fields: {
      productId: true,
      boughtProductId: true,
      boughtProductCount: true,
    },
    order: 'boughtProductCount DESC',
    limit: 20,
  })

  if (!(alsoBoughtProducts || []).length) {
    return []
  }

  const alsoBoughtProductIds = arrayUtil.column(alsoBoughtProducts, 'boughtProductId', true)
  let [products, reviews] = await Promise.all([
    commonProduct.products(alsoBoughtProductIds, 'id,typeId,name,catchCopy'),
    modelUtils.excuteQuery(COMMON_SCHEMA, _generateSQLGetReviewContent(alsoBoughtProductIds.join(','))),
  ])
  const systemtradeProductIds = arrayUtil.column(products.filter(product => product.typeId == 1), 'id')
  let [productUrls, productCategories] = await Promise.all([
    commonProductUrl.productDetailUrls(products),
    _getProductCategories(systemtradeProductIds),
  ])

  products = arrayUtil.index(products)
  reviews = arrayUtil.index(reviews, 'productId')
  productCategories = arrayUtil.index(productCategories, 'productId')
  return alsoBoughtProducts.reduce((result, item) => {
    if (products[item.boughtProductId] && reviews[item.boughtProductId]) {
      const obj = _alsoBoughtObject(item, reviews, productUrls, productCategories, products)
      result.push(obj)
    }
    return result
  }, []).slice(0, 10)
}

/**
 * Get recommend data
 *
 * @param {Number} userId
 * @param {Number} id
 * @return {Promise<Array>}
 * @public
 */
async function recommend(userId, id) {
  let purchasedProducts = []
  if (userId) {
    purchasedProducts = await _getProductsPurchased(userId)
  }

  purchasedProducts = purchasedProducts.concat(parseInt(id))

  let recommends = await _getCommonRecommendedProducts(purchasedProducts)

  if (!recommends.length) {
    return []
  }

  // Random limit record
  recommends = arrayUtil.shuffle(recommends, 10)

  const pIds = arrayUtil.column(recommends, 'productId')
  let [reviews, productUrls] = await Promise.all([
    modelUtils.excuteQuery(COMMON_SCHEMA, _generateSQLGetReviewContent(pIds.join(','))),
    commonProductUrl.productDetailUrls(recommends),
  ])

  reviews = arrayUtil.index(reviews, 'productId')

  return recommends.map(item => _alsoBoughtObject(item, reviews, productUrls))
}

/**
 * Generate object for alsoBought
 *
 * @param {Object} data
 * @param {Object} reviews
 * @param {Object} productUrls
 * @param {Object} productCategories
 * @param {Object} products
 * @return {Object}
 * @private
 */
function _alsoBoughtObject(data, reviews, productUrls, productCategories = {}, products = {}) {
  const id = data.boughtProductId || data.productId
  const prd = products[id] || {}
  const rv = reviews[id]
  return objectUtil.nullFilter({
    id,
    productName: prd.name || data.productName || '',
    productId: id,
    reviewTitle: (!rv) ? '' : rv.title || '',
    reviewContent: (!rv) ? '' : rv.content || '',
    review: {
      stars: (!rv) ? 0 : rv.reviewStars,
    },
    publishedAt: (!rv) ? null : timeUtil.toUnix(rv.publishedAt),
    typeId: prd.typeId || data.typeId,
    userId: (!rv) ? 0 : rv.userId,
    categoryId: (!productCategories[id]) ? (data.categories || null) : productCategories[id].categoryId,
    productUrl: productUrls[id] || '',
  })
}

/**
 * Get recommend products
 *
 * @param {Array} ignoreIds
 * @return {Promise<Array>}
 * @private
 */
async function _getCommonRecommendedProducts(ignoreIds) {
  return await CommonRecommendedProductsModel.find({
    where: {
      isValid: 1,
      productId: {
        nin: ignoreIds,
      },
      reviewsCount: { gt: 0 },
    },
    fields: { productId: true, productName: true, typeId: true, categories: true },
    limit: 0,
  })
}

/**
 * Get user products purchased
 *
 * @param {Number} userId
 * @return {Promise<Array>}
 * @private
 */
async function _getProductsPurchased(userId) {
  return arrayUtil.column(await salesModel.find({
    where: {
      userId,
      userType: 1,
      statusType: 1,
      salesType: 1,
    },
    order: 'id DESC',
    fields: { productId: true },
  }), 'productId', true)
}


module.exports = {
  popular,
  highScore,
  highPost,
  popularDetail,
  alsoBought,
  newPopularDetail,
  fullhighPost,
  fullhighScore,
  recommend,
}
