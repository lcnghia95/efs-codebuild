const app = require('@server/server')

// models
const systemtradeChartPieModel = app.models.SystemtradeChartPie

/**
 * index pie Chart
 *
 * @param {Object} input
 * @return {array}
 * @public
 */
async function index(input) {
  const pieChart = systemtradeChartPieModel.find({
    where: {
      isValid: 1,
      categoryId: input.categoryId,
    },
    limit: input.limit,
    order: input.order,
    fields: {
      name: true,
      value: true,
    },
  })

  return pieChart.map((item, key) => {
    const result = {
      name: item.name,
      y: item.value,
    }
    if (key == 0) {
      result.sliced = true
      result.selected = true
    }
    return result
  })
}

module.exports = {
  index,
}
