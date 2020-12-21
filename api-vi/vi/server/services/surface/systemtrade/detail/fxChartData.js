const helper = require('./helper')
const userCommon = require('@services/common/user.js')

const parse = require('date-fns/parse')
const format = require('date-fns/format')
const sprintf = require('sprintf-js').sprintf

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const modelUtils = require('@@server/utils/model')
const objectUtil = require('@ggj/utils/utils/object')
const queryUtil = require('@ggj/utils/utils/query')

/**
 * Position mapping information
 *
 * @var object
 */
const positionMap = {
  'ロング': 'buy',
  'ショート': 'sell',
}

/**
 * Get chart data for specific fx product
 *
 * @param pId
 * @param year
 * @return {Promise<object>}
 */
async function data(pId, year) {
  const product = await helper.productObject(pId)
  const [rawData, monthlyData] = await Promise.all([
    !product ? {} : _rawData(pId, product.userId, year),
    !product ? {} : _monthlyData(pId, year),
  ])

  return !Object.keys(rawData).length && !Object.keys(monthlyData).length ?
    null :
    _object(rawData, monthlyData)
}

/**
 * Get chart data for specific fx product
 *
 * @param pId
 * @param year
 * @return {Promise<object>}
 */
async function getChartData(product, year) {
  const siTable = _table(product.id, product.userId)

  if (!await _isValidTable('fx_system', siTable)) {
    return _buildObject([], [], {})
  }

  const [profitData, pairData, monthlyData] = await Promise.all([
    _getProfit(siTable, year),
    _getPair(siTable, year),
    _monthlyData(product.id, year),
  ])

  return _buildObject(profitData, pairData, monthlyData)
}

async function _isValidTable(schema, tableName) {
  const sql = 'SELECT count(*) AS count FROM information_schema.TABLES WHERE (TABLE_SCHEMA = (?)) AND (TABLE_NAME = (?))'
  const data = (await modelUtils.excuteQuery(schema, sql, [schema, tableName])) || []

  if (data.length === 0 || data[0].count === 0) {
    return false
  }
  
  return true
}

async function _getProfit(siTable, year) {
  const pos = {sell: 'ショート', buy: 'ロング'}
  const sql = `SELECT closeMonth,
      COALESCE(COALESCE(buyProfits / NULLIF(buyProfitsLength,0), 0) / NULLIF(COALESCE(buyLosses / NULLIF(buyLossesLength,0), 0),0), 0) AS brr,
      COALESCE(COALESCE(sellProfits / NULLIF(sellProfitsLength,0), 0) / NULLIF(COALESCE(sellLosses / NULLIF(sellLossesLength,0), 0),0), 0) AS srr,
      buyCount, sellCount
    FROM (
      SELECT MONTH(CloseDate) AS closeMonth,
        SUM(CASE WHEN ProfitTotal > 0 AND Position = '${pos.buy}' THEN ProfitTotal ELSE 0 END) AS buyProfits,
        SUM(CASE WHEN ProfitTotal > 0 AND Position = '${pos.buy}' THEN 1 ELSE 0 END) AS buyProfitsLength,
        SUM(CASE WHEN ProfitTotal <= 0 AND Position = '${pos.buy}' THEN ProfitTotal * -1 ELSE 0 END) AS buyLosses,
        SUM(CASE WHEN ProfitTotal <= 0 AND Position = '${pos.buy}' THEN 1 ELSE 0 END) AS buyLossesLength,
        SUM(CASE WHEN ProfitTotal > 0 AND Position = '${pos.sell}' THEN ProfitTotal ELSE 0 END) AS sellProfits,
        SUM(CASE WHEN ProfitTotal > 0 AND Position = '${pos.sell}' THEN 1 ELSE 0 END) AS sellProfitsLength,
        SUM(CASE WHEN ProfitTotal <= 0 AND Position = '${pos.sell}' THEN ProfitTotal * -1 ELSE 0 END) AS sellLosses,
        SUM(CASE WHEN ProfitTotal <= 0 AND Position = '${pos.sell}' THEN 1 ELSE 0 END) AS sellLossesLength,
        SUM(CASE WHEN Position = '${pos.buy}' THEN 1 ELSE 0 END) AS buyCount,
        SUM(CASE WHEN Position = '${pos.sell}' THEN 1 ELSE 0 END) AS sellCount
      FROM ${siTable}
      WHERE isOpen = 0 AND CloseDate >= (?) AND CloseDate < (?)
      GROUP BY MONTH(CloseDate)
    ) AS t1`
  const data = (await modelUtils.excuteQuery('fx_system', sql, [`${year}-01-01 00:00:00z`, `${year + 1}-01-01 00:00:00z`])) || []
  return data
}

async function _getPair(siTable, year) {
  const pos = {sell: 'ショート', buy: 'ロング'}
  const sql = `SELECT closeMonth, pair, COALESCE(buyDuration / NULLIF(buyDurationCount,0), 0) AS bPosition,
      COALESCE(sellDuration / NULLIF(sellDurationCount,0), 0) AS sPosition
    FROM (
      SELECT MONTH(CloseDate) AS closeMonth, Pair AS pair,
        SUM(CASE WHEN Position = '${pos.buy}' THEN TIMESTAMPDIFF(SECOND, CheckDate, CloseDate)/3600 ELSE 0 END) AS buyDuration,
        SUM(CASE WHEN Position = '${pos.buy}' THEN 1 ELSE 0 END) AS buyDurationCount,
        SUM(CASE WHEN Position = '${pos.sell}' THEN TIMESTAMPDIFF(SECOND, CheckDate, CloseDate)/3600 ELSE 0 END) AS sellDuration,
        SUM(CASE WHEN Position = '${pos.sell}' THEN 1 ELSE 0 END) AS sellDurationCount
      FROM ${siTable}
      WHERE isOpen = 0 AND CloseDate >= (?) AND CloseDate < (?)
      GROUP BY MONTH(CloseDate), Pair
    ) AS t0`
  const data = (await modelUtils.excuteQuery('fx_system', sql, [`${year}-01-01 00:00:00z`, `${year + 1}-01-01 00:00:00z`])) || []
  return data
}

/**
 * Get raw profit data (all individual data in given year of current product)
 *
 * @param pId
 * @param uId
 * @param inputYear
 * @return {Promise<{object}>}
 * @private
 */
async function _rawData(pId, uId, inputYear) {
  const table = _table(pId, uId)
  const year = parseInt(inputYear) || new Date().getFullYear()
  const pos = ['ショート', 'ロング']
  const fields = 'CheckDate,CloseDate,ProfitTotal,Position,Pair'

  // Get all data of given product in given year
  return _convertRawData(await modelUtils.find('fx_system', table, {
    where: {
      IsOpen: 0,
      Position: {
        inq: pos,
      },
      and: [{
        CloseDate: {
          gte: format(`${year}-01-01 09:00:00`),
        },
      },
      {
        CloseDate: {
          lt: format(`${year + 1}-01-01 09:00:00`),
        },
      },
      ],
    },
    fields: queryUtil.fields(fields),
  }))
}

/**
 * Get monthly data for specific product
 *
 * @param pId
 * @param inputYear
 * @return {Promise<object>}
 * @private
 */
async function _monthlyData(pId, inputYear) {
  const fields = 'ProfitAndSwapTotal,WinningRate,LotsTotal,PipsTotal,Month,Year'

  return arrayUtil.index(await modelUtils.find('fx_system', 'ns_collect_monthly', {
    where: {
      ProductID: pId,
      Year: inputYear,
    },
    fields: queryUtil.fields(fields),
    order: 'Month DESC',
  }), 'Month')
}

/**
 * Get table name of specific product
 *
 * @param pId
 * @param uId
 * @return {string}
 * @private
 */
function _table(pId, uId) {
  const oldUID = userCommon.oldDeveloperId(uId)
  return 'si_' + sprintf('%04d', pId) + '_' + sprintf('%04d', oldUID) + '_0000'
}

/**
 * Convert raw data into monthly data
 *
 * @param data
 * @return {object}
 * @private
 */
function _convertRawData(data) {
  const buyDurations = _initMonths(1)
  const buyProfits = _initMonths(2)
  const buyLosses = _initMonths(2)
  const buyCount = _initMonths(3)
  const sellDurations = _initMonths(1)
  const sellProfits = _initMonths(2)
  const sellLosses = _initMonths(2)
  const sellCount = _initMonths(3)

  data.map(record => {
    const closeDate = parse(record.CloseDate)
    const checkDate = parse(record.CheckDate)
    const duration = (closeDate.getTime() - checkDate.getTime()) / 3600000
    const year = closeDate.getFullYear()
    const month = closeDate.getMonth() + 1
    const pair = record.Pair
    const position = positionMap[record.Position]

    if (year === 1970 || month > 12 || month < 1 || !position) {
      return
    }

    // Init buy duration
    if (!buyDurations[month][pair]) {
      buyDurations[month][pair] = []
    }

    // Init sell duration
    if (!sellDurations[month][pair]) {
      sellDurations[month][pair] = []
    }

    const profit = parseFloat(record.ProfitTotal || 0)
    if (position === 'buy') {
      if (profit > 0) {
        buyProfits[month].push(profit)
      } else {
        buyLosses[month].push(profit * (-1))
      }
      buyCount[month] += 1
      buyDurations[month][pair].push(duration)
    } else if (position === 'sell') {
      if (profit > 0) {
        sellProfits[month].push(profit)
      } else {
        sellLosses[month].push(profit * -1)
      }
      sellCount[month] += 1
      sellDurations[month][pair].push(duration)
    }
  })

  return {
    buyDurations,
    buyProfits,
    buyLosses,
    buyCount,
    sellDurations,
    sellProfits,
    sellLosses,
    sellCount,
  }
}

/**
 * Init year data (12 months)
 *
 * @param type
 * @private
 */
function _initMonths(type = 1) {
  const res = {}

  for (let i = 1; i <= 12; i++) {
    if (type === 1) {res[i] = {}}
    else if (type === 2) {res[i] = []}
    else if (type === 3) {res[i] = 0}
  }

  return res
}

/**
 * Convert response object (all chart)
 * Calculate base on monthly data and monthly raw data
 *
 * @param rawData
 * @param monthlyData
 * @private
 */
function _object(rawData, monthlyData) {
  const pfswp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const wr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const pips = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const lots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const brr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const srr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const bc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const sc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const res = {}

  Object.keys(monthlyData).forEach(month => {
    const idx = parseInt(month) - 1
    const record = monthlyData[month]

    pfswp[idx] = record.ProfitAndSwapTotal || 0
    wr[idx] = record.WinningRate || 0
    pips[idx] = record.PipsTotal || 0
    lots[idx] = record.LotsTotal || 0
  })

  for (let idx = 0; idx < 12; idx++) {
    const month = idx + 1

    // Buy
    const buyProfit = rawData['buyProfits'][month]
    const bfCount = buyProfit.length
    const buyLoss = rawData['buyLosses'][month]
    const blCount = buyLoss.length
    const bf = bfCount > 0 ? arrayUtil.sum(buyProfit) / bfCount : 0
    const bl = blCount > 0 ? arrayUtil.sum(buyLoss) / blCount : 0

    brr[idx] = !bl ? 0 : bf / bl
    bc[idx] = rawData['buyCount'][month]

    // Sell
    const sellProfit = rawData['sellProfits'][month]
    const sfCount = sellProfit.length
    const sellLoss = rawData['sellLosses'][month]
    const slCount = sellLoss.length
    const sf = sfCount > 0 ? arrayUtil.sum(sellProfit) / sfCount : 0
    const sl = slCount > 0 ? arrayUtil.sum(sellLoss) / slCount : 0

    srr[idx] = !sl ? 0 : sf / sl
    sc[idx] = rawData['sellCount'][month]

    const buyDuration = rawData['buyDurations'][month]
    const sellDuration = rawData['sellDurations'][month]
    const pairs = []
    const bPosition = []
    const sPosition = []

    // Loop over duration for calculate average of buy & sell
    Object.keys(buyDuration).forEach(key => {
      pairs.push(key)

      bPosition.push(
        !buyDuration[key].length ?
          0 :
          (arrayUtil.sum(buyDuration[key]) / buyDuration[key].length)
            .toFixed(2),
      )

      sPosition.push(
        !sellDuration[key].length ?
          0 :
          (arrayUtil.sum(sellDuration[key]) / sellDuration[key].length)
            .toFixed(2),
      )
    })
    // Add to response for each month
    res['currencies' + month] = pairs
    res['buyPositions' + month] = bPosition
    res['sellPositions' + month] = sPosition
  }

  res['profitAndSwapBars'] = pfswp
  res['winRateBars'] = wr
  res['pipsBars'] = pips
  res['lotsBars'] = lots
  res['buyRiskRewardBars'] = brr
  res['sellRiskRewardBars'] = srr
  res['buyCounts'] = bc
  res['sellCounts'] = sc
  return res
}

function _buildObject(profitData, pairData, monthlyData) {
  const pfswp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const wr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const pips = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const lots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const brr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const srr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const bc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const sc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const res = {}

  Object.keys(monthlyData).forEach(month => {
    const idx = parseInt(month) - 1
    const record = monthlyData[month]

    pfswp[idx] = record.ProfitAndSwapTotal || 0
    wr[idx] = record.WinningRate || 0
    pips[idx] = record.PipsTotal || 0
    lots[idx] = record.LotsTotal || 0
  })

  for (let idx = 0; idx < 12; idx++) {
    const month = idx + 1
    const mProfitData = profitData.find(x => x.closeMonth === month)
    const mPairData = pairData.filter(x => x.closeMonth === month)
    if(objectUtil.isPresent(mProfitData)) {
      brr[idx] = mProfitData.brr
      bc[idx] = mProfitData.buyCount
      srr[idx] = mProfitData.srr
      sc[idx] = mProfitData.sellCount
    }
    if(objectUtil.isPresent(mPairData)) {
      res['currencies' + month] = mPairData.map(x => x.pair)
      res['buyPositions' + month] = mPairData.map(x => x.bPosition.toFixed(2))
      res['sellPositions' + month] = mPairData.map(x => x.sPosition.toFixed(2))
    }
  }

  res['profitAndSwapBars'] = pfswp
  res['winRateBars'] = wr
  res['pipsBars'] = pips
  res['lotsBars'] = lots
  res['buyRiskRewardBars'] = brr
  res['sellRiskRewardBars'] = srr
  res['buyCounts'] = bc
  res['sellCounts'] = sc
  return res
}

module.exports = {
  data,
  getChartData,
}
