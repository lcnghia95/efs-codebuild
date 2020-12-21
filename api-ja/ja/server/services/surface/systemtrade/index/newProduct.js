const app = require('@server/server')
const helper = require('./helper')

// models
const systemtradeRecentProductModel = app.models.SystemtradeRecentProducts

/**
 * index systemtrade new product
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const fields = {
    profitTotal: true,
  }
  const newProduct = await systemtradeRecentProductModel.find(
    helper.indexCondition(input, fields),
  )

  return newProduct.map(
    item => helper.indexObject(item, input.type || 0),
  )
}

module.exports = {
  index,
}
