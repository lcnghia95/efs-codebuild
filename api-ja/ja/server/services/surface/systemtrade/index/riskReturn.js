const app = require('@server/server')
const helper = require('./helper')

// models
const riskReturnModel = app.models.SystemtradeRankingRiskReturn

/**
 * index systemtrade ranking risk return rate
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const fields = {
    riskReturnRate: true,
  }

  return await helper.getIndex(input, riskReturnModel, fields)
}

module.exports = {
  index,
}
