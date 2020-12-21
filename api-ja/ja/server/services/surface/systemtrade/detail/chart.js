const app = require('@server/server')
const commonSfProductService = require('@services/common/surfaceProduct')
const fxChartData = require('@services/surface/systemtrade/detail/fxChartData')
const stockChartData = require('@services/surface/systemtrade/detail/stockChartData')
const productCategoriesModel = app.models.ProductCategories
const categoryIds = require('@@server/common/data/hardcodedData').SYSTEMTRADE_CATEGORY_IDS
const Months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const mdConn = require('@server/models/modelConnector')
const productModel = app.models.Products
const objUtil = app.utils.object

/**
 * get categoryId of product
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function _categoryId(productId) {
  const category = await productCategoriesModel.findOne({
    where: {
      isValid: 1,
      productId,
      categoryId: {
        inq: categoryIds,
      },
    },
    order: 'categoryId ASC',
    fields: {
      categoryId: true,
    },
  })
  return category.categoryId || 0
}

/**
 * get data of index chart
 *
 * @param {Number} productId
 * @param {Number} year
 * @return {Array}
 * @private
 */
async function _data(productId, year, categoryId) {
  if (!await commonSfProductService.validateSfProduct(productId)) {
    return {}
  }
  switch (categoryId) {
    case 1:
      return await fxChartData.data(productId, year)
    case 3:
      return  await stockChartData.data(productId, year)
    case 18:
      return await fxChartData.data(productId, year)
    default:
      return {}
  }
}

async function _getDataChart(productId, year, categoryId) {
  const queryParam = {
    where: {
      id: productId,
    },
    fields: [
      'id',
      'userId',
      'platformId',
    ],
  }
  const [isValidSf, product] = await Promise.all([
    commonSfProductService.validateSfProduct(productId),
    mdConn.selectOne(productModel, queryParam),
  ])
  const parsedYear = parseInt(year) || new Date().getFullYear()

  if (!isValidSf || objUtil.isEmpty(product) || parsedYear <= 1970) {
    return {}
  }

  switch (categoryId) {
    case 1:
      return await fxChartData.getChartData(product, parsedYear)
    case 3:
      return await stockChartData.getStockData(product, parsedYear)
    case 18:
      return await fxChartData.getChartData(product, parsedYear)
    default:
      return {}
  }
}

/**
 * generate stack bar Chart
 *
 * @param {Object} data
 * @return {Object}
 * @private
 */
function _stackBar(data) {
  return Months.reduce((result, month) => {
    const pair = data[`currencies${month}`]
    const buy = data[`buyPositions${month}`]
    const sell = data[`sellPositions${month}`]
    if (!pair || !buy || !sell || !pair.length || !buy.length || !sell.length) {
      return result
    }

    result[month] = pair.reduce((record, item, key) => {
      if (buy[key] || sell[key]) {
        record.categories.push(item)
        record.chart[0].data.push(parseFloat(buy[key]))
        record.chart[1].data.push(parseFloat(sell[key]))
      }
      return record
    }, {
      categories: [],
      chart: [{
        data: [],
        name: 'Buy',
      }, {
        data: [],
        name: 'Sell',
      } ],
    })

    return result
  }, {})
}

/**
 * generate pie Chart
 *
 * @param {String} buyData
 * @param {String} sellData
 * @return {Object}
 * @private
 */
function _pieChart(buyData, sellData) {
  return buyData.reduce((result, item, key) => {
    if (item != 0 || sellData[key] != 0) {
      result[key + 1] = {
        data: [{
          name: 'Buy',
          y: parseInt(item),
        },
        {
          name: 'Sell',
          y: parseInt(sellData[key]),
        },
        ],
      }
    }
    return result
  }, {})
}

/**
 * generate bar Chart
 *
 * @param {String} buyData
 * @param {String} sellData
 * @return {Object}
 * @private
 */
function _barChart(buyData, sellData) {
  buyData = buyData.map(parseFloat)
  sellData = sellData.map(parseFloat)
  return buyData.reduce((result, item, key) => {
    if (item != 0 || sellData[key] != 0) {
      result[key + 1] = {
        data: [
          parseFloat(item.toFixed(2)),
          parseFloat(sellData[key].toFixed(2)),
        ],
      }
    }
    return result
  }, {})
}

/**
 * generate column Chart
 *
 * @param {String} data
 * @return {Array}
 * @private
 */
function _columnChart(data) {
  return data.reduce((result, item, key) => {
    if (item != 0) {
      result.push([(key + 1).toString(), parseFloat(item)])
    }
    return result
  }, [])
}

/**
 * generate fx Chart detail
 *
 * @param {Array} data
 * @return {Object}
 * @private
 */
function _fxChart(data) {
  return {
    column: {
      profit: _columnChart(data.profitAndSwapBars),
      winRate: _columnChart(data.winRateBars),
      pips: _columnChart(data.pipsBars),
      lots: _columnChart(data.lotsBars),
    },
    bar: _barChart(data.buyRiskRewardBars, data.sellRiskRewardBars),
    pie: _pieChart(data.buyCounts, data.sellCounts),
    stackBar: _stackBar(data),
  }
}

/**
 * generate stock Chart detail
 *
 * @param {Array} data
 * @return {Object}
 * @private
 */
function _stockChart(data) {
  return {
    column: {
      profit: _columnChart(data.profitAndSwapBars),
      winRate: _columnChart(data.winRateBars),
      // pips: _columnChart(data.pipsBars),
      // lots: _columnChart(data.lotsBars),
    },
    // bar: _barChart(data.buyRiskRewardBars, data.sellRiskRewardBars),
    // pie: _pieChart(data.buyCounts, data.sellCounts),
    stackBar: _stackBar(data),
  }
}

/**
 * chart detail of systemtrade
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function show(id, input) {
  if (!id || !input.year) {
    return {}
  }

  const categoryId = await _categoryId(id)
  const data = await _data(id, input.year, categoryId)

  if (!data || !Object.keys(data).length) {
    return {}
  }

  switch (categoryId) {
    case 1:
      return _fxChart(data)
    case 3:
      return _stockChart(data)
    case 18:
      return _fxChart(data)
    default:
      return {}
  }
}

/**
 * chart detail of systemtrade
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function showChart(id, input) {
  if (!id || !input.year) {
    return {}
  }

  const categoryId = await _categoryId(id)
  const data = await _getDataChart(id, input.year, categoryId)

  if (!data || !Object.keys(data).length) {
    return {}
  }
  
  switch (categoryId) {
    case 1:
      return _fxChart(data)
    case 3:
      return _stockChart(data)
    case 18:
      return _fxChart(data)
    default:
      return {}
  }
}

module.exports = {
  show,
  showChart,
}
