const app = require('@server/server')
const helper = require('./helper')

// models
const profitTotalModel = app.models.SystemtradeRankingProfitTotal

/**
 * index systemtrade ranking profit total
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const fields = {
    profitTotal: true,
  }

  return await helper.getIndex(input, profitTotalModel, fields)
}

module.exports = {
  index,
}
