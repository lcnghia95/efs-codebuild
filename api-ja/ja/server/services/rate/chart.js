const app = require('@server/server')

//utils
const timeUtil = app.utils.time
const objectUtil = app.utils.object
const modelUtil = require('@server/utils/model')

//
const SUB_TABLE = {
  1: {
    table: 'usdjpy',
    schema: 'fx_chart'
  },
  2: {
    table: 'eurjpy',
    schema: 'fx_chart'
  },
  3: {
    table: 'eurusd',
    schema: 'fx_chart'
  },
  4: {
    table: 'audjpy',
    schema: 'fx_chart'
  },
  5: {
    table: 'gbpjpy',
    schema: 'fx_chart'
  },
  6: {
    table: 'nzdjpy',
    schema: 'fx_chart'
  },
  7: {
    table: 'cadjpy',
    schema: 'fx_chart'
  },
  8: {
    table: 'chfjpy',
    schema: 'fx_chart'
  },
  9: {
    table: 'hkdjpy',
    schema: 'fx_chart'
  },
  10: {
    table: 'gbpusd',
    schema: 'fx_chart'
  },
  11: {
    table: 'usdchf',
    schema: 'fx_chart'
  },
  12: {
    table: 'zarjpy',
    schema: 'fx_chart'
  },
  13: {
    table: 'audusd',
    schema: 'fx_chart'
  },
  14: {
    table: 'nzdusd',
    schema: 'fx_chart'
  },
  15: {
    table: 'euraud',
    schema: 'fx_chart'
  },
  16: {
    table: 'tryjpy',
    schema: 'fx_chart'
  },
  17: {
    table: 'sgdjpy',
    schema: 'fx_chart'
  },
  18: {
    table: 'eurgbp',
    schema: 'fx_chart'
  },
  19: {
    table: 'eurchf',
    schema: 'fx_chart'
  },
  20: {
    table: 'gbpchf',
    schema: 'fx_chart'
  },
  21: {
    table: 'usdhkd',
    schema: 'fx_chart'
  },
  22: {
    table: 'eurdkk',
    schema: 'fx_chart'
  },
  23: {
    table: 'jp225cash',
    schema: 'fx_chart'
  },
  24: {
    table: 'us30cash',
    schema: 'fx_chart'
  },
  25: {
    table: 'us100cash',
    schema: 'fx_chart'
  },
  26: {
    table: 'us500cash',
    schema: 'fx_chart'
  },
  27: {
    table: 'gold',
    schema: 'fx_chart'
  },
  28: {
    table: 'silver',
    schema: 'fx_chart'
  },
  29: {
    table: 'ger30cash',
    schema: 'fx_chart'
  },
  30: {
    table: 'uk100cash',
    schema: 'fx_chart'
  },
  31: {
    table: 'hk50cash',
    schema: 'fx_chart'
  },
  32: {
    table: 'btcjpy',
    schema: 'fx_chart'
  },
  33: {
    table: 'wti',
    schema: 'fx_chart'
  }
}
const TIME_FRAME = {
  1: 1,
  2: 5,
  3: 15,
  4: 30,
  5: 60,
  6: 240,
  7: 1440,
  8: 10080,
}

/**
 * rate chart index
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  let {
    s,
    t,
    d
  } = input

  if (s && !isNaN(s)) {
    if (t && !isNaN(t)) {
      return await _historyData(s, t)
    } else {
      return await _individualAskBid(s)
    }
  } else if (d && !isNaN(d)) {
    return await _askBid(1)
  } else {
    return await _askBid(2)
  }
}

/**
 * detailPageAskBid
 *
 * @param {Void}
 * @return {Array}
 * @private
 */
async function _askBid(type = 1) {
  let sql = _askBidSQL(),
    data = !sql.fx_chart ? [{}] : await modelUtil.excuteQuery('fx_chart', sql.fx_chart)

  return _mappingAskBid(data[0], type)
}

/**
 * mapping DetailPageAskBid
 *
 * @param {Object} data
 * @param {Number} type
 * @return {Array}
 * @private
 */
function _mappingAskBid(data, type = 1) {
  let objectData = Object.keys(data).reduce((result, stringKey) => {
    let arrayKey = stringKey.split('_'),
      resultKey = `object_${arrayKey[0]}`,
      symbol = parseInt(arrayKey[0])

    if (!result[resultKey]) {
      result[resultKey] = {
        symbol
      }
    }

    if (arrayKey[1] != 'time' && (arrayKey[1] != 'open' || type != 2)) {
      result[resultKey][arrayKey[1]] = data[stringKey]
    }

    if (arrayKey[1] == 'time' && type == 2) {
      let diffTime = symbol == 31 ?
        0 : (symbol < 21 ? (3600 * 6) : (3600 * 7))

      result[resultKey].time = timeUtil.format(
        (parseInt(data[stringKey]) + diffTime) * 1000,
        'YYYY-MM-DD HH:mm'
      )
    }

    return result
  }, {})

  return objectUtil.objectToArray(objectData)
}

/**
 * genarate string SQL
 *
 * @param {Void}
 * @return {Object}
 * @private
 */
function _askBidSQL() {
  let sqlArray = Object.keys(SUB_TABLE).reduce((result, key) => {
    let item = SUB_TABLE[key],
      keyAS = key - 1
    result[item.schema].Select.push(
      `${item.table}.time As ${keyAS}_time,` +
      `${item.table}.ask As ${keyAS}_ask, ` +
      `${item.table}.close As ${keyAS}_bid, ` +
      `${item.table}.open As ${keyAS}_open`
    )
    result[item.schema].From.push(
      `(Select * From ${item.table} ORDER BY id DESC LIMIT 1) As ${item.table}`
    )
    return result
  }, {
    fx_chart: {
      Select: [],
      From: [],
    }
  })

  return Object.keys(sqlArray).reduce((result, key) => {
    result[key] = (
      `Select ${sqlArray[key].Select.toString()} ` +
      `From ${sqlArray[key].From.toString()};`
    )
    return result
  }, {})
}

/**
 * individual Ask Bid
 *
 * @param {Number} s
 * @return {Array}
 * @private
 */
async function _individualAskBid(s) {
  let info = SUB_TABLE[s] || SUB_TABLE[1],
    diffTime = s == 32 ? 0 : (3600 * 7),
    data = await modelUtil.findOne(info.schema, info.table, {
      order: 'id DESC',
      fields: {
        time: true,
        ask: true,
        close: true,
      }
    })

  return [{
    time: timeUtil.format(
      (parseInt(data.time) + diffTime) * 1000,
      'YYYY-MM-DD HH:mm'
    ),
    ask: data.ask,
    bid: data.close,
  }]
}

/**
 * history Data
 *
 * @param {Number} s
 * @param {Number} t
 * @return {Array}
 * @private
 */
async function _historyData(s, t) {
  let diffTime = _historyDataDiffTime(s, t),

    info = SUB_TABLE[s] || SUB_TABLE[1],
    data = await modelUtil.find(info.schema, info.table, {
      where: {
        time_frame: TIME_FRAME[t] || 1
      },
      fields: {
        time: true,
        open: true,
        high: true,
        low: true,
        close: true,
      },
      limit: 150,
      order: 'time DESC',
    })

  return data.reduce((result, item) => {
    result.unshift([
      (item.time + diffTime) * 1000,
      parseFloat(item.open),
      parseFloat(item.high),
      parseFloat(item.low),
      parseFloat(item.close),
    ])
    return result
  }, [])
}

/**
 * diffTime
 *
 * @param {Number} s
 * @param {Number} t
 * @return {Array}
 * @private
 */
function _historyDataDiffTime(s, t) {
  let diffTime = 3600 * 15
  if (s == 32) {
    diffTime = 3600 * 9
  }

  if (t == 8) {
    diffTime += 3500 * 24
    // TODO: check
    // 週足対策 これが無いと1週ズレる
    // https://github.com/gogojungle/rate.gogojungle.co.jp/blob/ddd3753c53338fc87f945a648d18e8b2e4d75318/public/chart/index.php#L65
  }
  return diffTime
}

module.exports = {
  index,
}
