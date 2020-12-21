const app = require('@server/server')
const commonUser = require('@services/common/user')
const commonCart = require('@services/common/cart')
const commonProduct = require('@services/common/product')
const objUtil = app.utils.object
const arrayUtil = require('@ggj/utils/utils/array')
const helper = require('@services/surface/systemtrade/detail/helper')
const brokerHelper = require('@@services/common/broker')
const sprintf = require('sprintf-js').sprintf

// utils
const modelUtil = require('@server/utils/model')
const timeUtil = app.utils.time
const stringUtil = app.utils.string

//
const FX_SYSTEM = 'fx_system'
const {
  PROFIT_FACTOR_RANGE,
  WINNING_RATE_RANGE,
  PERIOD_RANGE,
  TRANSACTION_COUNT_RANGE,
  RISK_RERTURN_RATE_RANGE,
} = require('@@server/common/data/hardcodedData').SYSTEMTRADE_SPIDER_CHART
const FX_CATEGORY_ID = 1
const ADS_BROKERS_MAPPING = [24, 98, 117, 148, 166, 203, 268]
const defaultCriterialAll = {
  all: {},
  m1: {},
  m3: {},
  m6: {},
  m12: {},
  m24: {},
}

/**
 * list createdAt of outline
 *
 * @param productId
 * @returns {Object}
 * @public
 */
async function listOutline(productId) {
  return helper.listOutline(productId)
}

/**
 * Get detail data of specific fx product
 *
 * @param id
 * @param input
 * @param meta
 * @returns {Object}
 * @public
 */
async function show(id, input, meta) {
  if (!id || !await helper.validateCategoryId(id, FX_CATEGORY_ID)) {
    return {}
  }

  // get product detail
  input.typeIds = '1'
  const product = await commonProduct.show(id, input)

  // validate product
  if (Object.keys(product).length < 4) {
    return product
  }

  // get related data
  const [systemtrade, forward, questionTotal, cartInfo, systemtradeAll] = await Promise.all([
    _systemtrade(id),
    _forward(id, commonUser.oldDeveloperId(product.userId)),
    helper.questionTotal(id),
    commonCart.show(id, product, meta.userId),
    _systemtradeAll(id),
  ])
  return await _object(
    product,
    systemtrade,
    forward,
    questionTotal,
    cartInfo,
    systemtradeAll,
  )
}

/**
 * Get detail data of specific fx product
 *
 * @param id
 * @param input
 * @param meta
 * @returns {Object}
 * @public
 */
async function showFxProduct(id, input, meta) {
  if (!id) {return {}}

  const dataExchange = await app.models.DataExchange.findOne({
      where: {
        productId: id,
        isValid: 1,
      },
      fields: {
        productId: true,
        displayProductId: true,
      },
    }) || {}
  const displayProductId = dataExchange.displayProductId
  
  const [isValidCategory, fxProduct, sfPdDetail, fxDisplayProduct, sfPdDisplayProduct] = await Promise.all([
    helper.validateCategoryId(id, FX_CATEGORY_ID),
    commonProduct.getFxProduct(id),
    commonProduct.getSfPdDetail(id),
    displayProductId ? commonProduct.getFxProduct(displayProductId) : {},
    displayProductId ? commonProduct.getSfPdDetail(displayProductId) : {},
  ])
  if (!isValidCategory || objUtil.isEmpty(fxProduct)) {
    return {}
  }

  const isEmptySfpd = objUtil.isEmpty(sfPdDetail)

  // https://gogojungle.backlog.jp/view/OAM-38034
  if (!fxProduct.isValid || !fxProduct.statusType) {
    const buildProduct = {
      id: fxProduct.id,
      isSync: 1, // Mark sync
      isValid: fxProduct.isValid,
      productId: fxProduct.id,
      statusType: fxProduct.statusType,
    }

    !isEmptySfpd && (await sfPdDetail.updateAttributes(buildProduct))

    return {}
  }

  let isNeedSync = false
  if (objUtil.isPresent(sfPdDetail)) {
    isNeedSync = sfPdDetail.updatedAt < parseInt(Date.now() / 1000) - 60
  }

  let fxData
  if (isNeedSync || isEmptySfpd) {
    fxData = await commonProduct.buildUpInsertFxData(fxProduct, input, meta.userId, isEmptySfpd, fxDisplayProduct)
  } else {
    fxData = await commonProduct.buildRelationalFxData(sfPdDetail, input, meta.userId, sfPdDisplayProduct)
  }

  fxData.fxProduct.displayProductId = displayProductId
  if (Object.keys(fxData.fxProduct).length < 6) {
    return fxData.fxProduct
  }

  const [setProducts, cartInfo, systemtradeAll] = await Promise.all([
    commonProduct.appendSetProducts(fxData.fxProduct),
    commonCart.buildCartInfo(id, fxData.fxProduct, fxData.cartInfo.isFavorite, fxData.cartInfo.isPortfolio),
    _systemtradeAll(displayProductId || id),
  ])

  fxData.fxProduct.setProducts = setProducts

  const retObj = _object(
    fxData.fxProduct,
    fxData.relData.systemtrade,
    fxData.relData.forward,
    fxData.relData.questionTotal,
    cartInfo,
    systemtradeAll,
  )
  return retObj
}

/**
 * Get systemtrade data with product id
 *
 * @param {Number} ProductID
 * @returns {Object}
 * @private
 */
async function _systemtrade(ProductID) {
  return await modelUtil.findOne(FX_SYSTEM, 'ns_collect_total_all', {
    where: {
      ProductID,
    },
  }) || {}
}

async function _systemtradeAll(ProductID) {
  const [all, m1, m3, m6, m12, m24] = await Promise.all([
    modelUtil.findOne(FX_SYSTEM, 'ns_collect_total_all', {
      where: {
        ProductID,
      },
    }) || {},
    modelUtil.findOne(FX_SYSTEM, 'ns_collect_total_1m', {
      where: {
        ProductID,
      },
    }) || {},
    modelUtil.findOne(FX_SYSTEM, 'ns_collect_total_3m', {
      where: {
        ProductID,
      },
    }) || {},
    modelUtil.findOne(FX_SYSTEM, 'ns_collect_total_6m', {
      where: {
        ProductID,
      },
    }) || {},
    modelUtil.findOne(FX_SYSTEM, 'ns_collect_total_12m', {
      where: {
        ProductID,
      },
    }) || {},
    modelUtil.findOne(FX_SYSTEM, 'ns_collect_total_24m', {
      where: {
        ProductID,
      },
    }) || {},
  ])
  return {all, m1, m3, m6, m12, m24}
}

/**
 * Get forwad data with product id
 *
 * @param {Number} pId
 * @param {Number} oldDevId
 * @returns {Object}
 * @private
 */
async function _forward(pId, oldDevId) {
  const table = `si_${sprintf('%04d', pId)}_${sprintf('%04d', oldDevId)}_0000`
  let data = {},
    sql = 'SELECT * FROM '
  sql += '(SELECT MAX(CheckDate) as stop, MIN(CheckDate) as start FROM '
  sql += `${table}) as t1, `
  sql += `(SELECT IsOpen FROM ${table} ORDER BY IsOpen DESC LIMIT 1) as t2, `
  sql += `(SELECT MAX(Profit) as maxProfit, MIN(Profit) as maxLoss FROM ${table} `
  sql += 'WHERE IsOpen=0 AND Position<>\'Balance\') as t3, '
  sql += `(SELECT COUNT(*) as total FROM ${table}) as t4; `

  try {
    data = (await modelUtil.excuteQuery(FX_SYSTEM, sql))[0] || {}
  } catch (e) {
    console.log(e)
  }

  if (!data.total) {
    return {}
  }

  const maxLoss = parseInt(data.maxLoss)
  return {
    period: (timeUtil.toUnix(data.stop) - timeUtil.toUnix(data.start)) / 86400,
    total: parseInt(data.total),
    maxProfit: parseInt(data.maxProfit),
    maxLoss: maxLoss < 0 ? maxLoss : 0, // OAM-14934
    isOpen: parseInt(data.IsOpen),
  }
}

/**
 * Get systemtrade data & mapping into response object
 *
 * @param {Object} product
 * @param {Object} systemtrade
 * @param {Object} forward
 * @param {Number} questionTotal
 * @param {Object} cartInfo
 * @returns {Object}
 * @private
 */
async function _object(
  product,
  systemtrade,
  forward,
  questionTotal,
  cartInfo,
  systemtradeAll,
) {
  const brokers = product.brokers ?
    product.brokers.split(',').map(broker => parseInt(broker)) : {}
  const isDomesticBroker = await brokerHelper.checkDomesticBroker(product.demoBrokerId)
  return app.utils.object.filter({
    id: product.productId,
    displayProductId: product.displayProductId,
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
    brokers: brokers,
    demoBrokerId: product.demoBrokerId,
    isDomesticBroker,
    user: helper.userObject(product),
    outline: _outlineObject(product),
    cartInfo,
    criterial: _criterialObject(product, systemtrade, forward),
    criterialAll: _criterialAllObject(product, systemtradeAll, forward),
    spider: _spider(systemtrade, forward),
    currencyType: product.accountCurrencyType,
    questionTotal,
    ads: await _ads(brokers),
  })
}

/**
 * Get outline object of given data (sf product data)
 *
 * @param {Object} product
 * @returns {Object}
 * @private
 */
function _outlineObject(product) {
  // max_position=1: 1枚運用
  // max_position>1: 複数枚運用
  const maxPosition = product.maxPositions || 0
  let operativeType = 0

  if (maxPosition > 1) {
    operativeType = 1
  }

  const replaceOutlines = stringUtil.externalLink(product.productOutline || product.productOutlineEn || product.productOutlineVi || product.productOutlineTh)

  return app.utils.object.nullFilter({
    'currencyPairs': product.currencyPairs,
    'tradingTypes': product.tradingTypes,
    'tradingStyles': product.tradingStyles,
    'maxPositions': maxPosition,
    'maxPositionsOther': product.maxPositionsOther,
    'operativeType': operativeType,
    'maxLots': product.maxLots,
    'maxLotsOther': product.maxLotsOther,
    'period': product.period,
    'maxStopLoss': product.maxStopLoss,
    'maxStopLossOther': product.maxStopLossOther,
    'maxTakeProfit': product.maxTakeProfit,
    'maxTakeProfitOther': product.maxTakeProfitOther,
    'isHedge': product.isHedge,
    'isSignalOnly': product.isSignalOnly,
    'isUsingExternalFiles': product.isUsingExternalFiles,
    'specialInstructions': product.specialInstructions,
    'outline': stringUtil.expandHyperlink(replaceOutlines),
  })
}

/**
 * Get ads
 *
 * @param {Array} brokers
 * @returns {Array}
 * @private
 */
async function _ads(brokers) {
  const gogoHost = process.env.GOGO_HOST_URL
  let subAds = await _getAdvertiseBanner()

  if (subAds.length == 0) {
    return []
  }

  subAds.map((ads, index) => {
    ads.brokers = ADS_BROKERS_MAPPING[index] || 0
    return ads
  })

  subAds = arrayUtil.index(subAds, 'brokers')

  const shuffleBrokers = arrayUtil.shuffle(brokers)

  for (const broker in shuffleBrokers) {
    if (subAds[shuffleBrokers[broker]]) {
      const data = [
        gogoHost + subAds[shuffleBrokers[broker]]['bannerUrl'],
        gogoHost + subAds[shuffleBrokers[broker]]['landingPageUrl'],
      ]
      return [
        data,
      ]
    }
  }

  return []
}

/**
 * Get advertise banner
 *
 * @returns {Array}
 * @private
 */
async function _getAdvertiseBanner() {
  const now = Date.now()
  return await app.models.AdvertiseBanners.find({
    where: {
      isValid: 1,
      typeId: 3,
      langType: 1,
      deviceType: 1,
      startedAt: {
        lt: now,
      },
      endedAt: {
        gt: now,
      },
      servicePath: '/systemtrade/fx/0',
    },
    fields: {
      id: true,
      bannerUrl: true,
      landingPageUrl: true,
    },
    order: 'id ASC',
  })
}

/**
 * Get criterial object of given data (systemtrade data)
 *
 * @param {Object} product
 * @param {Object} systemtrade
 * @param {Object} forward
 * @returns {Object}
 * @private
 */
function _criterialObject(product, systemtrade, forward) {
  const currency = product.accountCurrencyType || 0
  const recommendedMargin = systemtrade.RecommendedMargin || 0
  const profitTotal = systemtrade.ProfitTotal || 0
  const maxDDPrice = systemtrade.MaxDDPrice || 0
  const lossTrades = systemtrade.LossTrades || 0
  const grossLoss = systemtrade.GrossLoss || 0
  const profitTrades = systemtrade.ProfitTrades || 0
  const grossProfit = systemtrade.GrossProfit || 0
  const firstAmount = currency == 1 ? 1000000 : 10000
  const equity = forward.isOpen == 1 ? (systemtrade.Equity || 0) : 0
  const winRate = (systemtrade.WinningRate || 0) > 0 ? systemtrade.WinningRate : 0
  const profitFactor = (systemtrade.ProfitFactor == 0 && winRate > 0) ?
    '-' : (systemtrade.ProfitFactor || 0)

  return {
    profitTotal,
    recommendedMargin,
    profitFactor,
    riskReturn: maxDDPrice == 0 ?
      0 : parseFloat((profitTotal / maxDDPrice).toFixed(2)),
    averageProfit: profitTrades == 0 ?
      0 : parseFloat((grossProfit / profitTrades).toFixed(2)),
    averageLoss: lossTrades == 0 ?
      0 : parseFloat((grossLoss / lossTrades).toFixed(2)),
    accountBalance: profitTotal + firstAmount,
    revenueIncludes: currency == 1 ? equity : parseFloat(equity.toFixed(2)),
    profitRate: !recommendedMargin ?
      0 : parseFloat(((profitTotal / recommendedMargin) * 100).toFixed(2)),
    winRate,
    profitTrades,
    totalTrades: systemtrade.TradesTotal || 0,
    maxPosition: systemtrade.MaxPosition || 0,
    maxDDRate: parseFloat((systemtrade.MaxDDPercent || 0).toFixed(2)),
    maxDDPrice,
    maxProfit: forward.maxProfit || 0,
    maxLoss: forward.maxLoss || 0,
    firstAmount,
    currency,
  }
}

function _criterialAllObject(product, systemtradeAll, forward) {
  const currency = product.accountCurrencyType || 0
  const result = {}
  for (const _time in defaultCriterialAll) {
    if (defaultCriterialAll[_time]) {
      const systemtrade = systemtradeAll[_time] || {}
      const recommendedMargin = systemtrade.RecommendedMargin || 0
      const profitTotal = systemtrade.ProfitTotal || 0
      const maxDDPrice = systemtrade.MaxDDPrice || 0
      const lossTrades = systemtrade.LossTrades || 0
      const grossLoss = systemtrade.GrossLoss || 0
      const profitTrades = systemtrade.ProfitTrades || 0
      const grossProfit = systemtrade.GrossProfit || 0
      const firstAmount = currency == 1 ? 1000000 : 10000
      const equity = forward.isOpen == 1 ? (systemtrade.Equity || 0) : 0
      const winRate = (systemtrade.WinningRate || 0) > 0 ? systemtrade.WinningRate : 0
      const profitFactor = (systemtrade.ProfitFactor == 0 && winRate > 0) ?
        '-' : (systemtrade.ProfitFactor || 0)

      result[_time] = {
        profitTotal,
        recommendedMargin,
        profitFactor,
        riskReturn: maxDDPrice == 0 ?
          0 : parseFloat((profitTotal / maxDDPrice).toFixed(2)),
        averageProfit: profitTrades == 0 ?
          0 : parseFloat((grossProfit / profitTrades).toFixed(2)),
        averageLoss: lossTrades == 0 ?
          0 : parseFloat((grossLoss / lossTrades).toFixed(2)),
        accountBalance: profitTotal + firstAmount,
        revenueIncludes: currency == 1 ? equity : parseFloat(equity.toFixed(2)),
        profitRate: !recommendedMargin ?
          0 : parseFloat(((profitTotal / recommendedMargin) * 100).toFixed(2)),
        winRate,
        profitTrades,
        totalTrades: systemtrade.TradesTotal || 0,
        maxPosition: systemtrade.MaxPosition || 0,
        maxDDRate: parseFloat((systemtrade.MaxDDPercent || 0).toFixed(2)),
        maxDDPrice,
        maxProfit: systemtrade.MaxTradeProfit || 0,
        maxLoss: systemtrade.MaxTradeLoss || 0,
        firstAmount,
        currency,
      }
    }
  }
  return result
}

/**
 * Get spider chart
 *
 * @param {Object} systemtrade
 * @param {Object} forward
 * @returns {Object}
 * @private
 */
function _spider(systemtrade, forward) {
  const riskReturn = !systemtrade.MaxDDPrice ? 0 : parseFloat((systemtrade.ProfitTotal / systemtrade.MaxDDPrice).toFixed(2))
  const winRate = (systemtrade.WinningRate || 0) > 0 ? systemtrade.WinningRate : 0
  const profitFactor = (systemtrade.ProfitFactor == 0 && winRate > 0) ?
    999999 : (systemtrade.ProfitFactor || 0)

  return {
    data: [
      _spiderRank(profitFactor, PROFIT_FACTOR_RANGE),
      _spiderRank(systemtrade.WinningRate, WINNING_RATE_RANGE),
      _spiderRank(forward.period, PERIOD_RANGE),
      _spiderRank(forward.total, TRANSACTION_COUNT_RANGE),
      _spiderRank(riskReturn, RISK_RERTURN_RATE_RANGE),
    ],
    pointPlacement: 'on',
  }
}

/**
 * Get spider rank
 *
 * @param {Number} value
 * @param {Array} ranks
 * @returns {Number}
 * @private
 */
function _spiderRank(value, ranks) {
  const rank = ranks.reduce((rank, compareValue, key) => {
    if (value >= compareValue) {
      return key
    }
    return rank
  }, 0)
  return rank == 5 ? rank : rank + 1
}

module.exports = {
  show,
  listOutline,
  showFxProduct,
}
