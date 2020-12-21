const app = require('@server/server')
const commonUser = require('@services/common/user')
const commonCart = require('@services/common/cart')
const commonProduct = require('@services/common/product')
const helper = require('@services/surface/systemtrade/detail/helper')
const sprintf = require('sprintf-js').sprintf

// models
const transactionModel = app.models.Transaction

// utils
const modelUtil = require('@@server/utils/model')
const stringUtil = require('@@server/utils/string')


// constants
const KABU_SYSTEM = 'kabu_system'
const SUP_STOCK_TABLE_NAME = {
  2: 'sa_',
  3: 'ts_',
  4: 'st_',
  9: 'qtx_',
}
const SUP_SYMBOL_TABLE_NAME = {
  2: 'si_',
  3: 'ts_',
  4: 'st_',
  9: 'qtx_',
}

/**
 * list createdAt of outline
 *
 * @param {Number} productId
 * @returns {Array}
 * @public
 */
async function listOutline(productId) {
  return helper.listOutline(productId)
}

/**
 * Get detail data of specific stock product
 *
 * @param {Number} id
 * @param {Object} input
 * @param {Object} meta
 * @returns {Object}
 * @public
 */
async function show(id, input, meta) {
  if (!id) {
    return {}
  }

  const dataExchange = await app.models.DataExchange.findOne({
    where: {
      productId: id,
      isValid: 1,
    },
    fields: {
      productId: true,
      displayProductId: true,
    },
  })

  const displayProductId = (dataExchange || {}).displayProductId

  // get product detail
  input.typeIds = '1'

  const product = await commonProduct.show(id, input)
  const transaction = await _transaction(product.userId, id)

  transaction && (product.transaction = transaction)

  // validate product
  if (Object.keys(product).length < 4) {
    return product
  }

  const [systemtrade, questionTotal, cartInfo, symbol] = await Promise.all([
    _systemtrade(displayProductId || id, product.platformId),
    helper.questionTotal(id),
    commonCart.show(id, product, meta.userId),
    _symbol(id, product.platformId, commonUser.oldDeveloperId(product.userId)),
  ])

  product.displayProductId = displayProductId

  return _object(product, systemtrade, questionTotal, cartInfo, symbol)
}

/**
 * Get systemtrade data with product id
 *
 * @param {Number} productId
 * @param {Number} platformId
 * @returns {Object}
 * @private
 */
async function _systemtrade(productId, platformId) {
  const table = `${SUP_STOCK_TABLE_NAME[platformId]}collect_total`
  return await modelUtil.findOne(KABU_SYSTEM, table, {
    where: {
      ProductID: productId, // platform = 2,3
      ProductId: productId, // platform = 4
      product_id: productId, // platform = 9
    },
  }) || {}
}

/**
 * Get record from `privacy`.`transaction`
 * @param {Number} userId
 * @param {Number} productId
 * @returns {Promise<String>}
 */
async function _transaction(userId, productId) {
  const transaction = await transactionModel.findOne({
    where: {
      isValid: 1,
      or: [{ userId }, { productId }],
    },
    fields: {content: true},
    order: 'id DESC',
  }) || {}

  return transaction.content
}

/**
 * Get symbol
 *
 * @param {Number} pId
 * @param {Number} platformId
 * @param {Number} oldDevId
 * @returns {String}
 * @private
 */
async function _symbol(pId, platformId, oldDevId) {
  let table = SUP_SYMBOL_TABLE_NAME[platformId]

  if (!table) {
    return ''
  }

  table += `${sprintf('%04d', pId)}_${sprintf('%04d', oldDevId)}_0000`

  const result = await modelUtil.findOne(KABU_SYSTEM, table, {
    fields: {
      ID: true,
      Symbol: true,
    },
  }) || {}

  return result.Symbol || ''
}

/**
 * Get systemtrade data & mapping into response object
 *
 * @param {Object} product
 * @param {Object} systemtrade
 * @param {Number} questionTotal
 * @param {Object} cartInfo
 * @param {String} symbol
 * @returns {Object}
 * @private
 */
async function _object(product, systemtrade, questionTotal, cartInfo, symbol) {
  return app.utils.object.filter({
    id: product.id,
    exProductId: product.exProductId,
    status: product.status,
    name: product.productName,
    description: product.catchCopy,
    platform: product.platformId,
    isPassword: product.passwordType,
    categories: product.categories,
    keywords: product.keywords,
    review: {
      stars: product.reviewsStars,
      count: product.reviewsCount,
    },
    set: product.setProducts,
    updated: product.versionUpdatedAt,
    version: product.version,
    user: helper.userObject(product),
    outline: _outlineObject(product, symbol),
    cartInfo,
    criterial: _criterialObject(systemtrade),
    // spider: null,
    currencyType: product.accountCurrencyType,
    questionTotal,
    ads: _ads(),
  })
}

/**
 * Get outline object of given data (sf product data)
 *
 * @param {Object} product
 * @param {String} symbol
 * @returns {Object}
 * @private
 */
function _outlineObject(product, symbol) {
  const replaceOutlines = stringUtil.externalLink(product.productOutline)
  return {
    tradingTypes: product.tradingTypes || '',
    tradingStyles: product.tradingStyles || '',
    initialDeposit: product.initialDeposit || '',
    symbolName: symbol,
    outline: stringUtil.expandHyperlink(replaceOutlines) || '',
  }
}

/**
 * Get criterial object of given data (systemtrade data)
 *
 * @param {Object} data
 * @returns {Object}
 */
function _criterialObject(data) {
  const winRate = data.PercentProfitable || data.AllPercentProfitable || 0
  let profitFactor = data.ProfitFactor || data.AllProfitFactor || 0

  profitFactor = (profitFactor == 0 && winRate > 0) ? '-' : profitFactor

  return {
    profitTotal: _parseFloat(
      data.NetProfit || data.AllNetProfit || 0,
    ),
    profitRate: _parseFloat(
      data.ReturnOnInitialCapital || data.AllReturnOnInitialCapital || 0,
    ),
    maxDD: _parseFloat(
      data.MaxDrowDownRate || data.AllMaxStrategyDrawdownRate || 0,
    ),
    maxContractsHeld: data.MaxContractsHeld || data.AllMaxContractsHeld || 0,
    winRate: _parseFloat(winRate),
    profitFactor,
    riskReturn: _parseFloat(data.RiskReturn || 0),
    totalProfitPips: data.TotalProfitPips || 0,
    expectedProfit: _parseFloat(data.ExpectedProfit || 0),
  }
}

/**
 * parse Float
 *
 * @param {Number/StringNumber} value
 * @returns {Number}
 * @private
 */
function _parseFloat(value, digits = 2) {
  value = parseFloat(value)
  return parseFloat(value.toFixed(digits))
}

/**
 *
 * @param {Void}
 * @returns {Array}
 */
function _ads() {
  const fxonHost = process.env.FXON_HOST_URL
  return [
    [
      fxonHost + 'kabu/include/img/banner/systre_tatujinn.png',
      fxonHost + 'ebooks/detail/?id=11361',
    ],
    [
      fxonHost + 'kabu/include/img/banner/easy_language.png',
      fxonHost + 'ebooks/detail/?id=10174',
    ],
    [
      fxonHost + 'kabu/include/img/banner/banner_multichart.png',
      fxonHost + 'ebooks/detail/?id=6301',
    ],
    [
      fxonHost + 'kabu/include/img/banner/banner_multichart2.png',
      fxonHost + 'ebooks/detail/?id=6302',
    ],
    [
      fxonHost + 'kabu/include/img/banner/banner_multichart3.png',
      fxonHost + 'ebooks/detail/?id=6305',
    ],
  ]
}

module.exports = {
  show,
  listOutline,
}
