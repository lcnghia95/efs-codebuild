const app = require('@server/server')
const profitRateService = require(
  '@services/surface/systemtrade/index/profitRate')
const profitTotalService = require(
  '@services/surface/systemtrade/index/profitTotal')
const profitFactorService = require(
  '@services/surface/systemtrade/index/profitFactor')
const riskReturnService = require(
  '@services/surface/systemtrade/index/riskReturn')
const bestSellService = require('@services/surface/systemtrade/index/bestSell')
const newProductService = require(
  '@services/surface/systemtrade/index/newProduct')
const pieChartService = require('@services/surface/systemtrade/index/pieChart')
const columnChartService = require(
  '@services/surface/systemtrade/stock/index/columnChart')
const adsService = require('@services/surface/systemtrade/stock/index/ads')

const stockService = require('@services/surface/systemtrade/stock/detail/stock')
const forwardService = require(
  '@services/surface/systemtrade/stock/detail/forward')
const otherService = require(
  '@services/surface/systemtrade/stock/detail/others')

// categoryId of stock product
const StockCategoryId = 3

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
 * Get new Product data for stock index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function top(req, res) {
  try {
    let categoryId = StockCategoryId,
      input = {
        categoryId,
        limit: 5
      },
      [bestsell, returnRate, amount, riskReturn, pf, newProduct, pie, column] =
      await Promise.all([
        bestSellService.index({
          categoryId,
          limit: 18
        }),
        profitRateService.index(input),
        profitTotalService.index(input),
        riskReturnService.index(input),
        profitFactorService.index(input),
        newProductService.index({
          categoryId,
          limit: 8,
        }),
        pieChartService.index({
          categoryId,
          limit: 6,
          order: 'id ASC'
        }),
        columnChartService.index(),
      ])
    res.json({
      criterial: {
        bestsell,
        returnRate,
        amount,
        riskReturn,
        pf,
      },
      bestsell: bestsell.slice(0, 10),
      newProduct,
      pie,
      column
    })
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get criterial data for stock index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function criterial(req, res) {
  try {
    let input = {
        categoryId: StockCategoryId,
        limit: 5
      },
      [bestsell, returnRate, amount, pf] = await Promise.all([
        bestSellService.index({
          categoryId: StockCategoryId,
          limit: 18
        }),
        profitRateService.index(input),
        profitTotalService.index(input),
        profitFactorService.index(input),
      ])
    res.json({
      bestsell,
      returnRate,
      amount,
      pf,
    })
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get profit Rate data for stock index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function profitRate(req, res) {
  try {
    let input = req.query
    input.categoryId = StockCategoryId
    res.json(await profitRateService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get profit Total data for stock index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function profitTotal(req, res) {
  try {
    let input = req.query
    input.categoryId = StockCategoryId
    res.json(await profitTotalService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get profit Factor data for stock index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function profitFactor(req, res) {
  try {
    let input = req.query
    input.categoryId = StockCategoryId
    res.json(await profitFactorService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get risk return data for stock index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function riskReturn(req, res) {
  try {
    let input = req.query
    input.categoryId = StockCategoryId
    res.json(await riskReturnService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get risk return data for stock index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function bestSell(req, res) {
  try {
    let input = req.query
    input.categoryId = StockCategoryId
    res.json(await bestSellService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get new Product data for Stock index
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function newProduct(req, res) {
  try {
    let input = req.query
    input.categoryId = StockCategoryId
    res.json(await newProductService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get Pie & Column Chart data for stock index
 *
 * @param {Void}
 * @return {Object}
 */
async function pieColumnChart(req, res) {
  try {
    let [pie, column] = await Promise.all([
      pieChartService.index({
        limit: 6,
        categoryId: StockCategoryId,
        order: 'id ASC'
      }),
      columnChartService.index(),
    ])

    res.json({
      pie,
      column,
    })
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get ads
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function ads(req, res) {
  try {
    res.json(await adsService.index())
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
    res.json(await stockService.show(req.params.id, req.body, _meta(req)))
  } catch (e) {
    res.sendStatus(e)
  }
}

/**
 * Get main chart data for detail page
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
    res.json(await stockService.listOutline(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  top,
  criterial,
  profitRate,
  profitTotal,
  profitFactor,
  riskReturn,
  bestSell,
  newProduct,
  pieColumnChart,
  ads,
  show,
  chart,
  forward,
  forwardPage,
  calendar,
  others,
  listOutline,
}
