const app = require('@server/server')

// models
const systemtradeChartColumnModel = app.models.SystemtradeChartColumn

/**
 * index column Chart
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const columns = await systemtradeChartColumnModel.find({
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

  return columns.map(column => {
    return {
      name: column.name,
      y: column.value,
    }
  })
}

module.exports = {
  index,
}
