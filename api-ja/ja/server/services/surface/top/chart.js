const app = require('@server/server')

// models
const commonTechnicalIndicatorModel = app.models.CommonTechnicalIndicators

/**
 * Ids mapping
 */
const MAP_IDS = {
  1: 3,
  2: 10,
  3: 1,
  4: 2,
  5: 5,
  6: 18,
  7: 11,
  8: 13,
}

/**
 * index chart for TopPage
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function index() {
  const data = await _data()

  return data.reduce((result, item) => {
    result[item.currencyPair] = _object(item)
    return result
  }, {
    'USD/JPY': {}, // NOTE: make sure that USD/JPY is show on the 1st position
  })
}

/**
 * Get data for chart
 *
 * @param {Void}
 * @return {Object}
 * @private
 */
async function _data() {
  return await commonTechnicalIndicatorModel.find({
    where: {
      isValid: 1,
    },
  })
}

/**
 * Object item
 *
 * @param {Void}
 * @return {Object}
 * @private
 */
function _object(item) {
  const format = item.currencyPair.indexOf('JPY') != -1 ? 2 : 4
  return {
    id: MAP_IDS[item.id],
    pair: item.currencyPair,
    s1: parseFloat(item.pivotS1).toFixed(format),
    s2: parseFloat(item.pivotS2).toFixed(format),
    s3: parseFloat(item.pivotS3).toFixed(format),
    r1: parseFloat(item.pivotR1).toFixed(format),
    r2: parseFloat(item.pivotR2).toFixed(format),
    r3: parseFloat(item.pivotR3).toFixed(format),
    trend: parseInt(item.trend),
    oscillator: item.oscillator,
    updatedDate: item.updatedAt,
  }
}

module.exports = {
  index,
}
