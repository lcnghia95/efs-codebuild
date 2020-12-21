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

const fxService = require('@services/surface/systemtrade/fx/detail/fx')
const forwardService = require(
  '@services/surface/systemtrade/fx/detail/forward')
const otherService = require('@services/surface/systemtrade/fx/detail/others')

const metaUtil = require('@@server/utils/meta')

// categoryId of fx product
const FXCategoryId = 1

// const FinancialValue = 2
// const UnemployValue = 1

/**
 * Get metadata (headers,...)
 *
 * @param req
 * @returns {Ojbect}
 * @private
 */
function _meta(req) {
  return metaUtil.meta(req, ['userId'])
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
async function chartFx(req, res) {
  try {
    res.json(await forwardService.chartFx(req.params.id))
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
    res.json(await otherService.show(req.params.id))
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

module.exports = {
  forwardPage,
  calendar,
  newProduct,
  profitRate,
  profitTotal,
  profitFactor,
  riskReturn,
  bestSell,
  others,
  listOutline,
  chartFx,
  show,
  showFxProduct,
}
