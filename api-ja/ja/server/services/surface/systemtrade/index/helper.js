const app = require('@server/server')
const {
  sfPrice,
} = require('@services/common/price')

const objectUtil = app.utils.object
const pagingUtil = app.utils.paging

// list categoryIds of systemtrade
const categoryIds = require('@@server/common/data/hardcodedData').SYSTEMTRADE_CATEGORY_IDS
const { SYSTEMTRADE_PRODUCT_URL } = require('@@server/common/data/hardcodedData')
// index common fields
const indexFields = {
  isReal: true,
  categoryId: true,
  productId: true,
  productName: true,
  price: true,
  isSpecialDiscount: true,
  specialDiscountPrice: true,
  reviewsStars: true,
  reviewsCount: true,
  balanceCurve: true,
  accountCurrencyType: true,
}

const timeMaps = {
  'SystemtradeRankingProfitTotal': '?t=3',
  'SystemtradeRankingProfitRate': '?t=3',
  'SystemtradeRankingPf': '?t=3',
  'SystemtradeRankingRiskReturn': '?t=3',
  'SystemtradeRankingBestSellers': '',
}

/**
 * generate index Chart
 *
 * @param {Array} products
 * @param {Number} type
 * @return {Array}
 * @private
 */
function indexChart(product, type = 0) {
  if (!product.balanceCurve) {
    return type == 1 ? [] : undefined
  }

  const balance = product.balanceCurve.split(',')

  // type == 1 high charts
  if (type == 1) {
    const time = product.timeCurrent.split(',')
    return time.map((value, key) => {
      return [parseInt(value) * 1000, parseInt(balance[key] || 0)]
    })
  }

  // type == 0 google char
  const min = Math.min(...balance)
  const max = Math.max(...balance)
  const length = max - min

  if (length == 0) {
    return ''
  }

  return balance.map(value => {
    return parseFloat(
      ((value - min) / length * 100).toFixed(1),
    )
  }).toString()
}

function indexPipChart(product) {
  if (!product.pipsCurve) {
    return ''
  }

  const pips = product.pipsCurve.split(',')

  const min = Math.min(...pips)
  const max = Math.max(...pips)
  const length = max - min

  if (length === 0) {
    return ''
  }

  return pips.map(value => {
    return parseFloat(
      ((value - min) / length * 100).toFixed(1),
    )
  }).toString()
}

/**
 * calculate profit factor
 *
 * @param {Number} products
 * @return {Number or String}
 * @private
 */
function _profitFactor(pf) {
  if (!pf) {
    return
  } else if (pf == 999999999) {
    return '-'
  } else {
    return pf > 0 ? pf : 0
  }
}

/**
 * generate systemtrade index indexCondition form input
 *
 * @param {Object} input
 * @param {Object} fields
 * @return {Object}
 * @public
 */
function indexCondition(input, fields = {}) {
  const condition = {
    where: {
      isValid: 1,
    },
    order: 'id ASC',
  }

  // if type != 1, fields = null
  if ((input.type || 0) == 0) {
    condition.fields = Object.assign(fields, indexFields)

    // if systemtrade is stock, show platformId
    if (input.categoryId == 3) {
      condition.fields.platformId = true
    }
  }

  if (categoryIds.indexOf(parseInt(input.categoryId)) != -1) {
    condition.where.categoryId = input.categoryId
  }

  if ((input.limit || 0) > 0) {
    condition.limit = input.limit
  }

  if ((input.page || 0) > 0) {
    condition.skip = (parseInt(input.page) - 1) * (parseInt(input.limit) || 0)
  }

  return condition
}

/**
 * generate index Object
 *
 * @param {Array} products
 * @param {Number} type
 * @return {Array}
 * @public
 */
function indexObject(product, type = 0, extendQuery = '') {
  return objectUtil.filter({
    id: product.productId,
    isReal: product.isReal,
    name: product.productName,
    category: product.categoryId,
    platform: product.platformId,
    prices: sfPrice(product),
    review: {
      stars: product.reviewsStars || 0,
      count: product.reviewsCount || 0,
    },
    salesCount: product.salesCount,
    profitRate: product.profitRate,
    profitTotal: product.profitTotal,
    currencyType: product.accountCurrencyType,
    winningRate: product.winningRate,
    profitFactor: _profitFactor(product.profitFactor),
    riskReturn: product.riskReturnRate,
    chart: indexChart(product, type),
    detailUrl: detailUrl(product.productId, product.categoryId, extendQuery),
  })
}

/**
 * systemtrade detailUrl
 *
 * @param {Number} pId
 * @param {Number} categoryId
 * @return {Array}
 * @public
 */
function detailUrl(pId, categoryId, extendQuery = '') {
  if (categoryIds.indexOf(categoryId) == -1) {
    return ''
  }

  return SYSTEMTRADE_PRODUCT_URL[categoryId] + pId + extendQuery
}

/**
 * get data
 *
 * @param {model} model
 * @param {object} input
 * @param {object} input
 *
 * @return {object}
 * @private
 */
async function _getData(model, input, fields) {
  const data = await model.find(
    indexCondition(input, fields),
  )
  const modelName = model.name.toString()
  return data.map(
    item => indexObject(item, input.type || 0, timeMaps[modelName]),
  )
}

/**
 * get index for model
 *
 * @param {object} input
 * @param {model} model
 * @param {object} fields
 *
 * @return {object || array} return array if dont have input.page || input.limit
 * @public
 */
async function getIndex(input, model, fields) {
  let data,
    total
  const conditions = indexCondition(input, fields)

  if (!input.page || !input.limit) {
    data = await _getData(model, input, fields)
  } else {
    [data, total] = await Promise.all([
      _getData(model, input, fields),
      model.count(conditions.where),
    ])

    data = pagingUtil.addPagingInformation(data, input.page, total, input.limit, input.displayRange)
  }

  return data
}

/**
 * Get balance curve for systemtrade products
 *
 * @param {Number} productIds
 * @returns {Promise<Object>}
 * @public
 */
async function systemtradeBalanceCurve(productIds) {
  const systemtradeProducts = await app.models.SystemtradeSearch.find({
    where: {
      productId: {
        inq: productIds,
      },
      isValid: 1,
      months: 0,
    },
    fields: { balanceCurve: true, productId: true },
  }) || []
  
  return systemtradeProducts.reduce((acc, product) => {
    acc[product.productId] = {
      balanceCurve: product.balanceCurve,
    }
    return acc
  }, {})
}

module.exports = {
  indexCondition,
  indexObject,
  detailUrl,
  getIndex,
  indexChart,
  systemtradeBalanceCurve,
  indexPipChart,
}
