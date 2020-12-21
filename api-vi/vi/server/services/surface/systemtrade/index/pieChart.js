const app = require('@server/server')

//models
const systemtradeChartPieModel = app.models.SystemtradeChartPieVi

/**
 * index pie Chart
 *
 * @param {Object} input
 * @return {array}
 * @public
 */
async function index(input) {
  let pieChart = systemtradeChartPieModel.find({
    where: {
      isValid: 1,
      categoryId: input.categoryId,
    },
    limit: input.limit,
    order: input.order,
    fields: {
      name: true,
      value: true,
    }
  })

  return pieChart.map((item, key) => {
    let result = {
      name: item.name,
      y: item.value
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
