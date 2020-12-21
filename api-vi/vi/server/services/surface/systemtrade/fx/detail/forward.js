const app = require('@server/server')
const commonSfProductService = require('@services/common/surfaceProduct')
const sprintf = require('sprintf-js').sprintf
const {
  find,
  excuteQuery,
} = require('@@server/utils/model')
const {getDataPage} = require('@@services/surface/systemtrade/fx/forward')

// models
const fxonInfoProductModel = app.models.FxonInfoProduct

// utils
const objectUtil = require('@ggj/utils/utils/object')
const timeUtil = require('@ggj/utils/utils/time')
const queryUtil = require('@ggj/utils/utils/query')

/**
 * Get mainChart data of
 *
 * @param pId
 * @returns {Promise<Object>}
 */
async function chart(pId) {
  if (!await commonSfProductService.validateSfProduct(pId)) {
    return {}
  }
  const [chart, product] = await Promise.all([
    mainChart(pId),
    fxonInfoProductModel.findOne({
      where: {
        Id: pId,
      },
      fields: {
        IsOperationStop: true,
        IsRealTime: true,
      },
    }),
  ])

  if (!product) {
    return {}
  }

  return objectUtil.filter({
    isOperationStop: product ? product.IsOperationStop : 1,
    mainChart: chart,
  })
}

/**
 * Get mainChart data of
 *
 * @param pId
 * @returns {Promise<Object>}
 */
async function chartFx(pId) {
  const table = `sa_equity_daily_${sprintf('%05d', pId)}`
  const [isValidProduct, isValidTable] = await Promise.all([
    commonSfProductService.validateSfProduct(pId),
    _isValidTable('fx_system', table),
  ])

  if (!isValidProduct) {
    return {}
  }

  const [chart, product] = await Promise.all([
    mainChartFx(table, isValidTable),
    fxonInfoProductModel.findOne({
      where: {
        Id: pId,
      },
      fields: {
        IsOperationStop: true,
        IsRealTime: true,
      },
    }),
  ])

  if (!product) {
    return {}
  }

  return objectUtil.filter({
    isOperationStop: product ? product.IsOperationStop : 1,
    mainChart: chart,
  })
}

/**
 * Get forward data of
 *
 * @param pId
 * @returns {Promise<Object>}
 */
async function index(pId) {
  if (!await commonSfProductService.validateSfProduct(pId)) {
    return {}
  }

  const [data, product] = await Promise.all([
    getData(pId),
    fxonInfoProductModel.findOne({
      where: {
        Id: pId,
      },
      fields: {
        IsOperationStop: true,
        IsRealTime: true,
      },
    }),
  ])

  if (!product) {
    return {}
  }

  return objectUtil.filter({
    forward: forwards(data, product.IsRealTime || 0),
    calendar: calendar(data),
  })
}


/**
 * Get forward data paging
 *
 * @param pId
 * @returns {Promise<Object>}
 */
async function indexPage(pId, input) {
  if (!await commonSfProductService.validateSfProduct(pId)) {
    return {}
  }

  const [data, product] = await Promise.all([
    getDataPage(pId, input),
    fxonInfoProductModel.findOne({
      where: {
        Id: pId,
      },
      fields: {
        IsOperationStop: true,
        IsRealTime: true,
      },
    }),
  ])

  if (!product) {
    return {}
  }

  data.data = forwards(data.data, product.IsRealTime || 0)
  return data
}

/**
 * Get calendar data of month
 *
 * @param pId
 * @returns {Promise<Object>}
 */
async function getCalendar(pId, input) {
  if (!await commonSfProductService.validateSfProduct(pId)) {
    return {}
  }

  const data = await getDataCalendar(pId, input)
  return calendar(data)
}

/**
 * Get data for forwards
 *
 * @param pId
 * @param oldUId
 * @returns {Promise<void>}
 */
async function getData(pId, oldUId = 0) {
  if (!oldUId) {
    oldUId = await fxonInfoProductModel.findOne({
      where: {
        Id: pId,
      },
      fields: {
        DevUserId: true,
      },
    })
    oldUId = oldUId ? oldUId.DevUserId : 0
  }

  const table = `si_${pId}_${sprintf('%04d', oldUId)}_0000`
  const fields = 'IsOpen,CheckDate,Pair,Position,EntryOpen,OrderOpen,ReverseOpen' +
  ',CloseDate,EntryClose,OrderClose,ReverseClose,Size,Commision,Taxes' +
  ',Swap,ProfitTotal,ProfitTotalSum,OperationType,Profit'

  return await find('fx_system', table, {
    where: {
      or: [{
        IsOpen: 1,
      }, {
        EntryClose: {
          neq: 0,
        },
      }],
    },
    fields: queryUtil.fields(fields),
    order: ['IsOpen DESC', 'CloseDate DESC', 'CheckDate DESC',
      'TicketID DESC',
    ],
  })
}


/**
 * Get data for calendar
 *
 * @param pId
 * @param oldUId
 * @returns {Promise<void>}
 */
async function getDataCalendar(pId, input = [], oldUId = 0) {
  if (!oldUId) {
    oldUId = await fxonInfoProductModel.findOne({
      where: {
        Id: pId,
      },
      fields: {
        DevUserId: true,
      },
    })

    oldUId = oldUId ? oldUId.DevUserId : 0
  }

  const table = `si_${pId}_${sprintf('%04d', oldUId)}_0000`
  const fields = 'IsOpen,CloseDate,ProfitTotal,Swap'
  let begin,
    end

  if (input.year && input.month) {
    begin = new Date(Date.UTC(input.year, parseInt(input.month - 1), 1))
    end = new Date(Date.UTC(input.year, input.month, 0, 23, 59, 59))
  } else {
    const date = new Date()
    begin = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1))
    end = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59))
  }

  return await find('fx_system', table, {
    where: {
      and: [{
        CloseDate: {
          gte: begin,
        },
      }, {
        CloseDate: {
          lte: end,
        },
      }, {
        or: [{
          IsOpen: 1,
        }, {
          EntryClose: {
            neq: 0,
          },
        }],
      }],
    },
    fields: queryUtil.fields(fields),
    order: ['IsOpen DESC', 'CloseDate DESC', 'CheckDate DESC',
      'TicketID DESC',
    ],
  })
}

/**
 * Get main chart data
 *
 * @param pId
 * @returns {Promise<Array>}
 */
async function mainChart(pId) {
  const table = `sa_equity_daily_${sprintf('%05d', pId)}`
  const data = await find('fx_system', table, {
    order: 'DateValue ASC',
  })

  if (data.length === 0) {
    return []
  }

  const chart = {
    'Balance': [],
    'Balance+Equity': [],
  }
  const names = {
    'Balance+Equity': '収益+当日最大含み損益',
    'Balance': '収益',
  }
  const colors = {
    'Balance': '#003366',
    'Balance+Equity': 'orange',
  }

  data.map(record => {
    const initTime = timeUtil.toUnix(record.DateValue) * 1000

    chart['Balance'].push([initTime, parseInt(record.Balance)])
    chart['Balance+Equity'].push([initTime, parseInt(record.Balance + record.Equity)])
  })

  return Object.keys(names).map(idx => ({
    name: names[idx],
    tooltip: {
      valueDecimals: 2,
    },
    data: chart[idx] || [],
    color: colors[idx],
  }))
}

/**
 * Get main chart data
 *
 * @param pId
 * @returns {Promise<Array>}
 */
async function mainChartFx(table, isValidTable) {
  if (!isValidTable) {
    return []
  }
  
  let sql = ''
  sql += ' SELECT UNIX_TIMESTAMP(DateValue)*1000 AS \'DateValue\','
  sql += ' CAST(Balance AS SIGNED) AS \'Balance\','
  sql += ' CAST((Balance + Equity) AS SIGNED) AS \'Balance+Equity\''
  sql += ` FROM ${table}`
  sql += ' ORDER BY DateValue ASC'

  const data = (await excuteQuery('fx_system', sql)) || []

  if (data.length === 0) {
    return []
  }

  const chart = {
    'Balance': [],
    'Balance+Equity': [],
  }
  const names = {
    'Balance+Equity': 'Balance+Equity',
    'Balance': 'Balance',
  }
  const colors = {
    'Balance': '#003366',
    'Balance+Equity': 'orange',
  }

  data.map(record => {
    chart['Balance'].push([record['DateValue'], record['Balance']])
    chart['Balance+Equity'].push([record['DateValue'], record['Balance+Equity']])
  })

  return Object.keys(names).map(idx => ({
    name: names[idx],
    tooltip: {
      valueDecimals: 2,
    },
    data: chart[idx] || [],
    color: colors[idx],
  }))
}

/**
 * Get forward data based on given data
 *
 * @param data
 * @returns {Array}
 */
function forwards(data, isRealTime = 0) {
  data = data.reduce((arr, record) => {
    if (record.IsOpen || record.EntryClose) {
      arr.push(forwardObject(record, isRealTime))
    }
    return arr
  }, [])

  return data
}

/**
 * Convert forward object
 *
 * @param record
 * @returns {Object}
 */
function forwardObject(record, isRealTime = 0) {
  if (record.IsOpen === 1 && isRealTime == 0) {
    let status = 3

    status = (record.ReverseOpen || 0) > 0 ? 2 : status
    status = (record.OrderOpen || 0) > 0 ? 1 : status
    return {
      'status': status,
    }
  }

  const subType = {
    'ショート': 0,
    'ロング': 1,
  }
  return {
    open: timeUtil.toUnix(record.CheckDate),
    symbol: record.Pair || null,
    type: subType[record.Position] || null,
    openPrice: parseFloat(record.EntryOpen || 0),
    stop: parseFloat(record.ReverseClose || 0),
    takeProfit: parseFloat(record.OrderClose || 0),
    close: timeUtil.toUnix(record.CloseDate),
    closePrice: parseFloat(record.EntryClose || 0),
    lots: parseFloat(record.Size || 0),
    commission: parseFloat(record.Commision || 0),
    tax: parseFloat(record.Taxes || 0),
    swap: parseFloat(record.Swap || 0),
    pips: record.IsOpen ? '-' : parseFloat(record.ProfitTotal || 0),
    profit: record.IsOpen ? '-' : parseFloat(record.ProfitTotalSum || 0),
    reverseOpen: parseFloat(record.ReverseOpen || 0),
  }
}

/**
 * Get calendar data
 *
 * @param data
 * @returns {Array}
 */
function calendar(data) {
  const calendar = data.reduce((calendar, record) => {
    if (record.IsOpen === 1) {
      return calendar
    }

    const dateFormat = record.CloseDate ? record.CloseDate.slice(0, 10) :
      null
    if (!calendar[dateFormat]) {
      calendar[dateFormat] = 0
    }
    calendar[dateFormat] += parseInt(record.Swap || 0) + parseInt(record.ProfitTotal || 0)
    return calendar
  }, {})

  const res = []
  for (const i in calendar) {
    if (calendar[i]) {
      res.push({
        start: timeUtil.toUnix(i) * 1000,
        title: calendar[i],
      })
    }
  }

  return res
}

async function _isValidTable(schema, tableName) {
  const sql ='SELECT count(*) AS count FROM information_schema.TABLES WHERE (TABLE_SCHEMA = (?)) AND (TABLE_NAME = (?))'
  const data = (await excuteQuery('fx_system', sql, [schema, tableName])) || []

  if (data.length === 0 || data[0].count === 0) {
    return false
  }
  return true
}

module.exports = {
  index,
  indexPage,
  getCalendar,
  chart,
  chartFx,
}
