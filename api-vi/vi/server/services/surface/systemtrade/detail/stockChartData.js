const helper = require('./helper')
const userCommon = require('@services/common/user.js')

const format = require('date-fns/format')
const parse = require('date-fns/parse')
const sprintf = require('sprintf-js').sprintf

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const modelUtils = require('@@server/utils/model')
const objectUtil = require('@ggj/utils/utils/object')
const queryUtil = require('@ggj/utils/utils/query')

/**
 * Get chart data for specific strock product
 *
 * @param pId
 * @param year
 * @return {Promise<object>}
 */
async function data(pId, year) {
  const product = await helper.productObject(pId)
  const rawData = !product ? {} :
    await _rawData(pId, product.userId, product.platformId, year)

  return !Object.keys(rawData).length ?
    null :
    _object(rawData)
}

async function _isValidTable(schema, tableName) {
  const sql = ' SELECT count(*) AS count FROM information_schema.TABLES WHERE (TABLE_SCHEMA = (?)) AND (TABLE_NAME = (?))'
  const data = (await modelUtils.excuteQuery(schema, sql, [schema, tableName])) || []

  if (data.length === 0 || data[0].count === 0) {
    return false
  }

  return true
}

async function getStockData(product, year) {
  const table = _table(product.id, userCommon.oldDeveloperId(product.userId), product.platformId)
  const pf = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const wr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  if (!await _isValidTable('kabu_system', table)) {
    return {
      profitAndSwapBars: pf,
      winRateBars: wr,
    }
  }

  const sql = `SELECT month(CloseTime) as closeMonth, SUM(Profit) AS totalProfit,
      COALESCE(SUM(CASE WHEN Profit > 0 THEN 1 ELSE 0 END) / NULLIF(count(*),0), 0) * 100 as winRate
    FROM ${table}
    WHERE IsValid = 1 AND CloseTime >= (?) AND CloseTime < (?)
    GROUP BY month(CloseTime)`
  const data = (await modelUtils.excuteQuery('kabu_system', sql, [`${year}-01-01 00:00:00z`, `${year + 1}-01-01 00:00:00z`])) || []

  for (let idx = 0; idx < 12; idx++) {
    const month = idx + 1
      const monthData = data.find(x => x.closeMonth == month)
    if(objectUtil.isPresent(monthData)) {
      pf[idx] = monthData.totalProfit
      wr[idx] = monthData.winRate.toFixed(2)
    }
  }

  return {
    profitAndSwapBars: pf,
    winRateBars: wr,
  }
}

/**
 * Get raw data for specific stock product in specific year
 *
 * @param pId
 * @param uId
 * @param fId
 * @param inputYear
 * @return {Promise<array>}
 * @private
 */
async function _rawData(pId, uId, fId, inputYear) {
  const table = _table(pId, userCommon.oldDeveloperId(uId), fId)
  const year = parseInt(inputYear) || new Date().getFullYear()
  const fields = 'CloseTime,Profit'

  // Get all data of given product in given year
  return await modelUtils.find('kabu_system', table, {
    where: {
      IsValid: 1,
      and: [{
        CloseTime: {
          gte: format(`${year}-01-01 00:00:00`),
        },
      },
      {
        CloseTime: {
          lt: format(`${year + 1}-01-01 00:00:00`),
        },
      },
      ],
    },
    fields: queryUtil.fields(fields),
  })
}

/**
 * Get table name of stock (kabu_system)
 *
 * @param pId
 * @param oldUId
 * @param platform
 * @return {string}
 * @private
 */
function _table(pId, oldUId = 0, platform = 0) {
  const subPlatform = {
    2: 'si_',
    3: 'ts_',
    4: 'st_',
  }
  return (subPlatform[platform] || '') + sprintf('%04d', pId) + '_' + sprintf('%04d', oldUId) + '_' + '0000'
}

/**
 * Convert response chart data for stock
 *
 * @param rawData
 * @return {object}
 * @private
 */
function _object(rawData) {
  const monthlyData = _initMonths()

  // Get monthly data
  rawData.forEach(record => {
    const closeTime = parse(record.CloseTime)
    const month = closeTime.getMonth() + 1
    const profit = record.Profit

    monthlyData[month]['profit'].push(profit)
    if (profit > 0) {
      monthlyData[month]['win'].push(profit)
    }
  })

  // Get response chart data by month
  const pf = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const wr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (let idx = 0; idx < 12; idx++) {
    const month = idx + 1
    const monthly = monthlyData[month]
    const c = monthly['profit'].length
    const wc = monthly['win'].length

    pf[idx] = arrayUtil.sum(monthly['profit'])
    wr[idx] = !c ? 0 : parseFloat((100 * (wc / c)).toFixed(2))
  }

  return {
    profitAndSwapBars: pf,
    winRateBars: wr,
  }
}

/**
 * Init year data (12 months)
 *
 * @param type
 * @private
 */
function _initMonths() {
  const res = {}

  for (let i = 1; i <= 12; i++) {
    res[i] = {}
    res[i]['profit'] = []
    res[i]['win'] = []
  }

  return res
}

module.exports = {
  data,
  getStockData,
}
