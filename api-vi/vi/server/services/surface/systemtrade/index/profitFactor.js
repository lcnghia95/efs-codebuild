const app = require('@server/server')
const helper = require('./helper')

//models
const profitFactorModel = app.models.SystemtradeRankingPfVi

/**
 * index systemtrade ranking profit factor
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  let fields = {
    profitFactor: true
  }

  return await helper.getIndex(input, profitFactorModel, fields)
}

module.exports = {
  index,
}
