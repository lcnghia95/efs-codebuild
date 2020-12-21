const app = require('@server/server')

//utils
const model = require('@server/utils/model')
const timeUtil = app.utils.time

const SETTING = ['Low', 'Avg', 'High']

/**
 * performance index
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  if (!_validateInput(input)) {
    return []
  }

  let conditions = _conditions(input),
    data = await model.find('fx_spread', `performance_${input.id}`, conditions)

  return data.map(item => {
    return [
      timeUtil.toUnix(item.Date) * 1000,
      item[input.setting]
    ]
  })
}

/**
 * validate Input
 *
 * @param {Object} input
 * @return {Boolean}
 * @private
 */
function _validateInput(input) {
  if (!input.id || isNaN(input.id)) {
    return false
  }
  if (!input.symbol || isNaN(input.symbol)) {
    return false
  }
  if (!SETTING.includes(input.setting)) {
    return false
  }
  if (!input.dayago || isNaN(input.dayago)) {
    return false
  }
  return true
}

/**
 * genrate condition
 *
 * @param {Object} input
 * @return {Object}
 * @private
 */
function _conditions(input) {
  return {
    where: {
      Symbol: input.symbol,
      Date: {
        gt: timeUtil.addDays(-parseInt(input.dayago))
      }
    },
    fields: {
      Date: true,
      [input.setting]: true
    },
    order: 'Date ASC',
  }
}

module.exports = {
  index,
}
