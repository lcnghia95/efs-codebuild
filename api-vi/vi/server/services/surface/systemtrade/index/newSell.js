const app = require('@server/server')
const helper = require('./helper')

// models
const systemtradeRecentSoldModel = app.models.SystemtradeRecentSold

/**
 * index systemtrade recent sold
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const fields = {
      profitRate: true,
    }
    const newSell = await systemtradeRecentSoldModel.find(
      helper.indexCondition(input, fields),
    )

  return newSell.map(
    item => helper.indexObject(item, input.type || 0),
  )
}

module.exports = {
  index,
}
