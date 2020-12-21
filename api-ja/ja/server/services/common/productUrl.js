const app = require('@server/server')

// utils
const arrayUtil = require('@ggj/utils/utils/array')

const UNDEFINED_URL = '/'
const SYSTEMTRADE_PRODUCT_TYPE_ID = 1
const NAVI_PRODUCT_TYPE_ID = 3
const EVENT_PRODUCT_TYPE_ID = 19
const VIDEO_PRODUCT_TYPE_ID = 5
const FX_PRODUCT_CATEGORY_ID = 1
const STOCK_PRODUCT_CATEGORY_ID = 3
const BITCOIN_PRODUCT_CATEGORY_ID = 18
const SERIES_FLAG = 1
const ARTICLE_FLAG = 2

/**
 * Get navi mapping information
 *
 * @param {Array} products
 * @param {number} typeId
 * @returns {Array}
 * @private
 */
function _filterIds(products, typeId) {
  if (products.length == 0) {
    return []
  }
  return products.filter(product => ((product.typeId || 0) == typeId)).map(
    product => product.id || product.productId)
}

/**
 * Get navi mapping information
 *
 * @param {Array} products
 * @returns {Object}
 * @private
 */
async function _naviMap(products) {
  const naviProductIds = _filterIds(products, NAVI_PRODUCT_TYPE_ID)
  if (naviProductIds.length == 0) {
    return {}
  }

  const [seriesObjects, articleObjects] = await Promise.all([
    _relatedData(naviProductIds, app.models.SurfaceNaviSeries, true),
    _relatedData(naviProductIds, app.models.SurfaceNavi, true),
  ])

  return naviProductIds.reduce((result, productId) => {
    if (seriesObjects[productId]) {
      result[productId] = {
        id: seriesObjects[productId].id,
        flag: SERIES_FLAG,
      }
    } else if (articleObjects[productId]) {
      result[productId] = {
        id: articleObjects[productId].id,
        flag: ARTICLE_FLAG,
        seriesId: articleObjects[productId].seriesId,
      }
    }
    return result
  }, {})
}

/**
 * Get event id mapping information
 *
 * @param {Array} products
 * @returns {Object}
 * @private
 */
async function _eventIdMap(products) {
  const eventProductIds = _filterIds(products, EVENT_PRODUCT_TYPE_ID)
  if (eventProductIds.length == 0) {
    return {}
  }
  const events = await _relatedData(eventProductIds, app.models.Events)
  return arrayUtil.index(events, 'productId', 'id')
}

/**
 * Get video id mapping information
 *
 * @param {Array} products
 * @returns {Object}
 * @private
 */
async function _videoIdMap(products) {
  const videoProductIds = _filterIds(products, VIDEO_PRODUCT_TYPE_ID)
  if (videoProductIds.length == 0) {
    return {}
  }
  const videos = await _relatedData(videoProductIds, app.models.VideoRankingAccess)
  return arrayUtil.index(videos, 'productId', 'id')
}

/**
 * Get navi mapping information
 *
 * @param {Array} productIds
 * @param {Object} model
 * @param {Boolean} isObject
 * @returns {Object|Array}
 * @private
 */
async function _relatedData(productIds, model, isObject = false) {
  const array = await model.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    fields: {
      id: true,
      productId: true,
      // for article only
      seriesId: true,
    },
  })
  return isObject ? arrayUtil.index(array, 'productId') : array
}

/**
 * Get categories data
 *
 * @param {Array} productIds
 * @returns {Array}
 * @private
 */
async function _categories(productIds) {
  return await app.models.ProductCategories.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    fields: {
      productId: true,
      categoryId: true,
    },
    order: 'id DESC',
  })
}

/**
 * Get systemtrade category mapping information
 *
 * @param {Array} products
 * @returns {Object}
 * @private
 */
async function _systemtradeCategoryMap(products) {
  const systemtradeProductIds = _filterIds(products, SYSTEMTRADE_PRODUCT_TYPE_ID)
  if (systemtradeProductIds.length == 0) {
    return {}
  }
  const categories = await _categories(systemtradeProductIds)
  return arrayUtil.index(categories, 'productId', 'categoryId')
}

/**
 * Calculate product detail
 *
 * @param {Object} product
 * @param {Object} systemtradeCategoryMap
 * @param {Object} naviMap
 * @param {Object} eventIdMap
 * @param {Object} videoIdMap
 * @returns {string}
 * @private
 */
function _url(product, systemtradeCategoryMap, naviMap, eventIdMap, videoIdMap) {
  const productId = product.id || product.productId
    const typeId = product.typeId

  // Systemtrade
  if (typeId == 1) {
    const categoryId = systemtradeCategoryMap[productId] || 0
    if (categoryId == FX_PRODUCT_CATEGORY_ID) {
      return '/systemtrade/fx/' + productId
    }
    if (categoryId == STOCK_PRODUCT_CATEGORY_ID) {
      return '/systemtrade/stocks/' + productId
    }
    if (categoryId == BITCOIN_PRODUCT_CATEGORY_ID) {
      return '/systemtrade/fx/' + productId
    }
    return UNDEFINED_URL
  }

  // Indicators
  if (typeId == 2) {
    return '/tools/indicators/' + productId
  }

  // Share room
  if (typeId == 13) {
    return '/tools/rooms/' + productId
  }

  // Navi
  if (typeId == 3) {
    if ((naviMap[productId] || {}).flag == SERIES_FLAG) {
      return `/finance/navi/series/${naviMap[productId].id}`
    } else if ((naviMap[productId] || {}).flag == ARTICLE_FLAG) {
      return `/finance/navi/articles/${naviMap[productId].id}`
    }
    return UNDEFINED_URL
  }

  // Salons
  if (typeId == 4) {
    return '/finance/salons/' + productId
  }

  // Tools
  if ([6, 8, 9, 10, 70, 71, 72].indexOf(typeId) >= 0) {
    return '/tools/ebooks/' + productId
  }

  // Event
  if (typeId == 19) {
    return '/event/' + (eventIdMap[productId] || 0)
  }

  // Video
  if (typeId == 5) {
    return '/finance/videos/' + (videoIdMap[productId] || 0)
  }
}

/**
 * Generate detail urls of products
 *
 * @param {Array} products
 * @return {Object}
 * @public
 */
async function productDetailUrls(products) {
  const [
    systemtradeCategoryMap,
    eventIdMap,
    naviMap,
    videoIdMap,
  ] = await Promise.all([
    _systemtradeCategoryMap(products),
    _eventIdMap(products),
    _naviMap(products),
    _videoIdMap(products),
  ])

  return products.reduce((result, product) => {
    result[product.id || product.productId] =
      _url(product, systemtradeCategoryMap, naviMap, eventIdMap, videoIdMap)
    return result
  }, {})
}

module.exports = {
  productDetailUrls,
}
