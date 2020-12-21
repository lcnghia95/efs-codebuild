const app = require('@server/server')
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
const economicService = require(
  '@services/surface/systemtrade/fx/index/economic')
const pieChartService = require('@services/surface/systemtrade/index/pieChart')
const scatterChartService = require(
  '@services/surface/systemtrade/index/scatterChart')
const columnChartService = require(
  '@services/surface/systemtrade/index/columnChart')
const scatterlineService = require(
  '@services/surface/systemtrade/index/scatterlineChart')

const fxService = require('@services/surface/systemtrade/fx/detail/fx')
const forwardService = require(
  '@services/surface/systemtrade/fx/detail/forward')
const otherService = require('@services/surface/systemtrade/fx/detail/others')
const rtRankingService = require('@@services/surface/systemtrade/index/realtradeRanking')

// categoryId of fx product
const FXCategoryId = 1

const FinancialValue = 2
const UnemployValue = 1

/**
 * Get metadata (headers,...)
 *
 * @param req
 * @returns {Ojbect}
 * @private
 */
function _meta(req) {
  return app.utils.meta.meta(req, ['userId'])
}

/**
 * Get criterial data for fx index
 *
 * @param {Void}
 * @return {Object}
 */
async function _criterial() {
  const input = {
      limit: 5,
      categoryId: FXCategoryId,
    }
  const [financial, unemploy, rateOf3M, amountOf3M, profitOf3M, riskOf3M] = await Promise
      .all([
        economicService.top(FinancialValue),
        economicService.top(UnemployValue),
        profitRateService.index(input),
        profitTotalService.index(input),
        profitFactorService.index(input),
        riskReturnService.index(input),
      ])
  return {
    financial,
    unemploy,
    rateOf3M: {
      title: '',
      data: rateOf3M,
    },
    amountOf3M: {
      title: '',
      data: amountOf3M,
    },
    profitOf3M: {
      title: '',
      data: profitOf3M,
    },
    riskOf3M: {
      title: '',
      data: riskOf3M,
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
  const [pie, scatter] = await Promise.all([
    pieChartService.index({
      limit: 6,
      categoryId: FXCategoryId,
      order: 'value DESC',
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
  const [column, scatterLine] = await Promise.all([
    columnChartService.index({
      categoryId: FXCategoryId,
      order: 'id ASC',
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
    const [criterial,
      chartPieScatter,
      chartColumnScatterLine,
      bestsell,
      newProduct,
      rtRanking,
    ] = await Promise.all([
      _criterial(),
      _pieScatterChart(),
      _columnScatterlineChart(),
      bestSellService.index({
        categoryId: FXCategoryId,
        limit: 18,
      }),
      newProductService.index({
        categoryId: FXCategoryId,
        limit: 8,
      }),
      rtRankingService.index(req.query),
    ])
    res.json({
      criterial,
      chartPieScatter,
      chartColumnScatterLine,
      bestsell,
      newProduct,
      rtRanking,
    })
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get new Product data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function newProduct(req, res) {
  try {
    const input = req.query
    input.categoryId = FXCategoryId
    res.json(await newProductService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get Pie & Scatter Chart data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function pieScatterChart(req, res) {
  try {
    res.json(await _pieScatterChart())
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get Column & Scatterline Chart data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function columnScatterlineChart(req, res) {
  try {
    res.json(await _columnScatterlineChart())
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get criterial data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function criterial(req, res) {
  try {
    res.json(await _criterial())
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get profit Rate data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function profitRate(req, res) {
  try {
    const input = req.query
    input.categoryId = FXCategoryId
    res.json(await profitRateService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get profit Total data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function profitTotal(req, res) {
  try {
    const input = req.query
    input.categoryId = FXCategoryId
    res.json(await profitTotalService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get profit Factor data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function profitFactor(req, res) {
  try {
    const input = req.query
    input.categoryId = FXCategoryId
    res.json(await profitFactorService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get risk return data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function riskReturn(req, res) {
  try {
    const input = req.query
    input.categoryId = FXCategoryId
    res.json(await riskReturnService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get risk return data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function bestSell(req, res) {
  try {
    const input = req.query
    input.categoryId = FXCategoryId
    res.json(await bestSellService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get economics data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function economics(req, res) {
  try {
    res.json(await economicService.index())
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get unemploy data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function unemploy(req, res) {
  try {
    res.json(await economicService.systemtrade(req.query, UnemployValue))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get financial data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function financial(req, res) {
  try {
    res.json(await economicService.systemtrade(req.query, FinancialValue))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get detail data
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function show(req, res) {
  try {
    res.json(await fxService.show(req.params.id, req.body, _meta(req)))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get detail data
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function showFxProduct(req, res) {
  try {
    res.json(await fxService.showFxProduct(req.params.id, req.body, _meta(req)))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get forward data for detail page
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function chart(req, res) {
  try {
    res.json(await forwardService.chart(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get forward data for detail page
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function chartFx(req, res) {
  try {
    res.json(await forwardService.chartFx(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function chartFxv2(req, res) {
  try {
    res.json(await forwardService.chartFxv2(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}


/**
 * Get forward data for detail page
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function forward(req, res) {
  try {
    res.json(await forwardService.index(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get forward data for detail page
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function forwardPage(req, res) {
  try {
    res.json(await forwardService.indexPage(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}


/**
 * Get forward data for detail page
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function calendar(req, res) {
  try {
    res.json(await forwardService.getCalendar(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get forward data for detail page
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function others(req, res) {
  try {
    res.json(await otherService.show(req.params.id, _meta(req)))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get forward data for detail page
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function listOutline(req, res) {
  try {
    res.json(await fxService.listOutline(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get Real trade data for fx index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function realtrade(req, res) {
  try {
    const rtRanking = await rtRankingService.index(req.query)
    res.json(rtRanking)
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  show,
  chart,
  chartFxv2,
  forward,
  forwardPage,
  calendar,
  top,
  newProduct,
  pieScatterChart,
  columnScatterlineChart,
  criterial,
  profitRate,
  profitTotal,
  profitFactor,
  riskReturn,
  bestSell,
  economics,
  unemploy,
  financial,
  others,
  listOutline,
  chartFx,
  showFxProduct,
  realtrade,
}
