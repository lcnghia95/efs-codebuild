const app = require('@server/server')
const helper = require('./helper')

//models
const popularModel = app.models.SystemtradeRankingNewPopularVi

/**
 * index systemtrade ranking profit rate
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input = []) {
  let fields = {
      profitRate: true,
      platformId: true,
    },
    popular = await popularModel.find(
      helper.indexCondition(input, fields)
    )
  return popular.map(
    item => helper.indexObject(item, input.type || 0)
  )
}

module.exports = {
  index,
}
