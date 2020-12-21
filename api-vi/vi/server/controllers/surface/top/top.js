const newProductService = require(
  '@services/surface/systemtrade/index/newProduct')
const profitRateService = require(
  '@services/surface/systemtrade/index/profitRate')
const profitTotalService = require(
  '@services/surface/systemtrade/index/profitTotal')
const profitFactorService = require(
  '@services/surface/systemtrade/index/profitFactor')
const riskReturnService = require(
  '@services/surface/systemtrade/index/riskReturn')
const bestSellService = require('@services/surface/systemtrade/index/bestSell')
const pieChartService = require('@services/surface/systemtrade/index/pieChart')
const scatterChartService = require(
  '@services/surface/systemtrade/index/scatterChart')
const columnChartService = require(
  '@services/surface/systemtrade/index/columnChart')
const scatterlineService = require(
  '@services/surface/systemtrade/index/scatterlineChart')

// categoryId of fx product
const FXCategoryId = 1

/**
 * Get criterial data for fx index
 *
 * @param {Void}
 * @return {Object}
 */
async function _criterial() {
  let input = {
      limit: 5,
      categoryId: FXCategoryId
    },
    [rateOf3M, amountOf3M, profitOf3M, riskOf3M] = await Promise
      .all([
        profitRateService.index(input),
        profitTotalService.index(input),
        profitFactorService.index(input),
        riskReturnService.index(input),
      ])
  return {
    rateOf3M: {
      title: '',
      data: rateOf3M
    },
    amountOf3M: {
      title: '',
      data: amountOf3M
    },
    profitOf3M: {
      title: '',
      data: profitOf3M
    },
    riskOf3M: {
      title: '',
      data: riskOf3M
    },
  }
}

/**
 * Get Pie & Scatter Chart data for fx index
 *
 * @param {Void}
 * @return {Object}
 */
async function _pieScatterChart() {
  let [pie, scatter] = await Promise.all([
    pieChartService.index({
      limit: 6,
      categoryId: FXCategoryId,
      order: 'value DESC'
    }),
    scatterChartService.index({
      limit: 150,
      categoryId: FXCategoryId,
    }),
  ])
  return {
    pie,
    scatter,
  }
}

/**
 * Get Column Scatterline Chart data for fx index
 *
 * @param {Void}
 * @return {Object}
 */
async function _columnScatterlineChart() {
  let [column, scatterLine] = await Promise.all([
    columnChartService.index({
      categoryId: FXCategoryId,
      order: 'id ASC'
    }),
    scatterlineService.index({
      categoryId: FXCategoryId,
    }),
  ])
  return {
    column,
    scatterLine,
  }
}

/**
 * Get new Product data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function top(req, res) {
  try {
    let [criterial, chartPieScatter, chartColumnScatterLine, bestsell,
      newProduct
    ] = await Promise.all([
      _criterial(),
      _pieScatterChart(),
      _columnScatterlineChart(),
      bestSellService.index({
        categoryId: FXCategoryId,
        limit: 12,
      }),
      newProductService.index({
        categoryId: FXCategoryId,
        limit: 8,
      }),
    ])
    res.json({
      criterial,
      chartPieScatter,
      chartColumnScatterLine,
      bestsell,
      newProduct,
    })
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  top,
}
