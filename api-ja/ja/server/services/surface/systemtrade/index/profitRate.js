const app = require('@server/server')
const helper = require('./helper')

// models
const profitRateModel = app.models.SystemtradeRankingProfitRate

/**
 * index systemtrade ranking profit rate
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const fields = {
    profitRate: true,
  }

  return await helper.getIndex(input, profitRateModel, fields)
}

module.exports = {
  index,
}
