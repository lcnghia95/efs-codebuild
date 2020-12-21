const app = require('@server/server')
const helper = require('./helper')

//models
const bestSellersModel = app.models.SystemtradeRankingBestSellers

/**
 * index systemtrade ranking best seller
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  let fields = {
    profitTotal: true
  }

  return await helper.getIndex(input, bestSellersModel, fields)
}

module.exports = {
  index,
}
