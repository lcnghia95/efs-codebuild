const app = require('@server/server')

// models
const systemtradeChartScatterLineModel = app.models.SystemtradeChartScatterLine

/**
 * index scatterline Chart
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const data = await systemtradeChartScatterLineModel.find({
    where: {
      isValid: 1,
      categoryId: input.categoryId,
    },
    limit: input.limit,
    order: input.order,
    fields: {
      operatingMonths: true,
      price: true,
      riskReturnRate: true,
    },
  })
  
  return [{
    name: ' ',
    data: data.map(item => {
      return [item.operatingMonths, item.price, item.riskReturnRate]
    }),
  }]
}

module.exports = {
  index,
}
