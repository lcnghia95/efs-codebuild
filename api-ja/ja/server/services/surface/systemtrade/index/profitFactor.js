const app = require('@server/server')
const helper = require('./helper')

// models
const profitFactorModel = app.models.SystemtradeRankingPf

/**
 * index systemtrade ranking profit factor
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const fields = {
    profitFactor: true,
  }

  return await helper.getIndex(input, profitFactorModel, fields)
}

module.exports = {
  index,
}
