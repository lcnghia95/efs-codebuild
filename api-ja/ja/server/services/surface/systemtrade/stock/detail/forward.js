const app = require('@server/server')
// const commonSfProductService = require('@services/common/surfaceProduct')
const sprintf = require('sprintf-js').sprintf
const {
  find,
  findOne,
  count,
} = require('@server/utils/model')

// models
const productModel = app.models.Products
const fxonInfoProductModel = app.models.FxonInfoProduct

// utils
const timeUtil = app.utils.time
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object

const NameChart = {
  before: 'ストラテジー登録前',
  after: 'ストラテジー登録後',
  all: '残高+含み損益',
}

/**
 * Get forward data of
 *
 * @param {Number} pId
 * @returns {Object}
 */
async function chart(pId) {
  // if (!await commonSfProductService.validateSfProduct(pId)) {
  //   return {}
  // }
  const dataExchange = await app.models.DataExchange.findOne({
    where: {
      productId: pId,
      isValid: 1,
    },
    fields: {
      productId: true,
      displayProductId: true,
    },
  }) || {}

  pId = dataExchange.displayProductId || pId

  const [product, fxProduct] = await Promise.all([
    _product(pId),
    _fxProduct(pId),
  ])

  if (!product) {
    return {}
  }

  const [data, subData] = await Promise.all([
    _data(pId, fxProduct.DevUserId, product.platformId),
    _subData(pId, product.platformId),
  ])
  const mainChart = _mainChart(data, subData, product.platformId, product.createdAt)

  return objectUtil.filter({
    isOperationStop: (fxProduct.IsOperationStop || 0),
    mainChart,
  })
}

/**
 * Get forward data of
 *
 * @param {Number} pId
 * @returns {Object}
 */
async function index(pId) {
  // if (!await commonSfProductService.validateSfProduct(pId)) {
  //   return {}
  // }
  const [product, fxProduct] = await Promise.all([
    _product(pId),
    _fxProduct(pId),
  ])

  if (!product) {
    return {}
  }

  const data = await _data(pId, fxProduct.DevUserId, product.platformId)
  const calendar = _calendar(data)
  const forward = await _forwards(data)

  return objectUtil.filter({
    forward,
    calendar,
  })
}

/**
 * Get forward data paging
 *
 * @param pId
 * @returns {Promise<Object>}
 */
async function indexPage(pId, input) {
  const [product, fxProduct] = await Promise.all([
    _product(pId),
    _fxProduct(pId),
  ])

  if (!product) {
    return {}
  }

  return await _dataPage(pId, fxProduct.DevUserId, input, product.platformId)
}

/**
 * Get calendar data of month
 *
 * @param pId
 * @returns {Promise<Object>}
 */
async function getCalendar(pId, input) {
  const [product, fxProduct] = await Promise.all([
    _product(pId),
    _fxProduct(pId),
  ])

  if (!product) {
    return {}
  }

  const data = await _dataCalendar(pId, fxProduct.DevUserId, input, product.platformId)
  return _calendar(data)
}

/**
 * Get calendar data
 *
 * @param data
 * @returns {Array}
 */
function _calendar(data) {
  const calendar = data.reduce((calendar, record) => {
    const closeTime = record.CloseTime || record.close_time
    if (!closeTime) {
      return calendar
    }
    if (!calendar[closeTime]) {
      calendar[closeTime] = 0
    }
    calendar[closeTime] += parseInt(record.Profit || record.profit || 0)
    return calendar
  }, {})

  return Object.keys(calendar).map(key => {
    return { start: key * 1000, title: calendar[key] }
  })
}

/**
 * Convert forward object
 *
 * @param {Object} record
 * @param {Object} symbol
 * @returns {Object}
 */
function _forwardObject(record, symbol) {
  if (record.CloseTime == 0) {
    return {
      status: 1,
    }
  }
  return {
    openTime: record.OpenTime,
    symbol: symbol.Symbol,
    name: symbol.Name || record.Symbol,
    market: symbol.Market,
    orderType: parseInt(record.OrderType),
    openQuantity: parseInt(record.OpenQuantity || record.Lots),
    openPrice: parseInt(record.OpenPrice),
    openSum: parseInt(record.OpenSum),
    closeTime: record.CloseTime,
    closePrice: parseInt(record.ClosePrice),
    runUp: parseInt(record.RunUp),
    closeQuantity: parseInt(record.CloseQuantity),
    closeSum: parseInt(record.CloseSum),
    drowDown: parseInt(record.DrowDown),
    profit: parseInt(record.Profit),
    profitSum: parseInt(record.ProfitSum),
  }
}

/**
 * Get main chart data
 *
 * @param {Array} data
 * @param {Array} subData
 * @param {Number} platformId
 * @param {Number} createdAt
 * @returns {Array}
 */
function _mainChart(data, subData, platformId, createdAt) {
  if (platformId == 9) {
    createdAt = timeUtil.toUnix(subData.LiveStartedAt)
  }
  const result = (platformId != 2 ? data : subData).reduce((result, item) => {
    const time = platformId == 9 ? item.CloseTime : (item.OpenTime || item.DateValue || 0)
      const value1 = parseInt(item.ProfitSum || item.Balance || 0)
      const value2 = parseInt(item.DrowDown || item.Equity || 0)
    if (time <= createdAt) {
      result.before.unshift([time * 1000, value1])
    }
    if (time > createdAt) {
      result.after.unshift([time * 1000, value1])
    }
    if (platformId != 4 && platformId != 9) {
      result.all.unshift([time * 1000, value1 + value2])
    }
    return result
  }, {
    before: [],
    after: [],
    all: [],
  })

  if (result.before.length > 0) {
    result.after.unshift(result.before[result.before.length - 1])
  }

  return Object.keys(NameChart).map(key => {
    return {
      name: NameChart[key],
      tooltip: {
        valueDecimals: 2,
      },
      data: result[key],
    }
  })
}

/**
 * Get Symbol data based on given data
 *
 * @param {Array} Symbol
 * @returns {Array}
 */
async function _symbols(Symbol) {
  return await find('kabu_system', '_info_ticker_symbol', {
    where: {
      Symbol: {
        inq: Symbol,
      },
    },
    fields: {
      Symbol: true,
      Name: true,
      Market: true,
    },
  })
}

/**
 * Get forward data based on given data
 *
 * @param {Array} data
 * @returns {Array}
 */
async function _forwards(data) {
  let symbols = await _symbols(arrayUtil.column(data, 'Symbol'))
  symbols = arrayUtil.index(symbols, 'Symbol')
  return data.reduce((arr, record) => {
    arr.push(_forwardObject(record, symbols[record.Symbol] || []))
    return arr
  }, [])
}

/**
 * Get _subData for forwards & calendar
 *
 * @param {Number} pId
 * @param {Number} platformId
 * @returns {Array}
 */
async function _subData(pId, platformId = 0) {
  if (platformId != 2 && platformId != 9) {
    return []
  }
  if (platformId == 2) {
    const table = `sa_equity_daily_${sprintf('%05d', pId)}`
    const data = await find('kabu_system', table, {
      fields: {
        Balance: true,
        Equity: true,
        DateValue: true,
      },
      order: ['DateValue DESC'],
    })

    return data.map(item => {
      item = item.toJSON()
      item.DateValue = timeUtil.toUnix(item.DateValue)
      return item
    })
  } else if (platformId == 9) {
    const table = 'qtx_collect_total'
    const data = await findOne('kabu_system', table, {
      where: {
        IsValid: 1,
        ProductId: pId,
      },
      fields: {
        LiveStartedAt: true,
      },
    })
    return data
  }
}

/**
 * Get data for forwards & calendar
 *
 * @param {Number} pId
 * @param {Number} oldUId
 * @param {Number} platformId
 * @returns {Array}
 */
async function _data(pId, oldUId, platformId = 0) {
  const table = {
    2: `si_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
    3: `ts_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
    4: `st_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
    9: `qtx_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
  } [platformId]

  const data = await find('kabu_system', table, {
    where: {
      OpenTime: {
        gt: 1,
      },
    },
    order: ['OpenTime DESC', 'CloseTime DESC', 'Id DESC'],
  })
  
  return data.map(item => {
    item = item.toJSON()
    item.OpenTime = timeUtil.toUnix(item.OpenTime)
    item.CloseTime = timeUtil.toUnix(item.CloseTime)
    return item
  })
}

/**
 * Get data for forwards & calendar
 *
 * @param {Number} pId
 * @param {Number} oldUId
 * @param {Number} platformId
 * @returns {Array}
 */
async function _dataPage(pId, oldUId, input, platformId = 0) {
  const table = {
    2: `si_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
    3: `ts_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
    4: `st_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
  } [platformId]

  const page = (input.page || 1)
    const limit = (input.limit || 30)

  const total = await count('kabu_system', table, {
    where: {
      OpenTime: {
        gt: 1,
      },
    },
  })

  let data = await find('kabu_system', table, {
    where: {
      OpenTime: {
        gt: 1,
      },
    },
    limit: input.limit == 0 ? 0 : limit,
    skip: (page - 1 ) * limit,
    order: ['OpenTime DESC', 'CloseTime DESC'],
  })

  data = data.map(item => {
    item = item.toJSON()
    item.OpenTime = timeUtil.toUnix(item.OpenTime)
    item.CloseTime = timeUtil.toUnix(item.CloseTime)
    return item
  })

  data = app.utils.paging.addPagingInformation(data, page, total, limit)
  data.data = await _forwards(data.data)
  return data
}


/**
 * Get data for calendar
 *
 * @param pId
 * @param oldUId
 * @returns {Promise<void>}
 */
async function _dataCalendar(pId, oldUId, input, platformId = 0) {
  const table = {
    2: `si_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
    3: `ts_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
    4: `st_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
    9: `qtx_${sprintf('%04d', pId)}_${sprintf('%04d', oldUId)}_0000`,
  } [platformId]

  let begin, end

  if (input.year && input.month) {
    begin = new Date(Date.UTC(input.year, parseInt(input.month - 1), 1))
    end = new Date(Date.UTC(input.year, input.month, 0, 23, 59, 59))
  } else {
    const date = new Date()
    begin = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1))
    end = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59))
  }

  const data = await find('kabu_system', table, {
    where: {
      and: [
        { 
          OpenTime: {
            gt: 1,
          },
        },
        { 
          CloseTime: {
            gte: begin,
          },
        },
        { 
          CloseTime: {
            lte: end,
          },
        },
      ],
    },
    order: ['OpenTime DESC', 'CloseTime DESC'],
  })
  
  return data.map(item => {
    item = item.toJSON()
    item.OpenTime = timeUtil.toUnix(item.OpenTime)
    item.CloseTime = timeUtil.toUnix(item.CloseTime)
    return item
  })
}


/**
 * Get product data
 *
 * @param {Number} id
 * @returns {Object}
 */
async function _product(id) {
  return await productModel.findOne({
    where: {
      id,
      isValid: 1,
      statusType: 1,
      typeId: 1,
    },
    fields: {
      id: true,
      platformId: true,
      createdAt: true,
    },
  })
}

/**
 * Get Fx Product data
 *
 * @param {Number} Id
 * @returns {Object}
 */
async function _fxProduct(Id) {
  return await fxonInfoProductModel.findOne({
    where: {
      Id,
    },
    fields: {
      IsOperationStop: true,
      DevUserId: true,
    },
  })
}

module.exports = {
  index,
  chart,
  indexPage,
  getCalendar,
}
