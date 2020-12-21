const app = require('@server/server')
const helper = require('@services/surface/systemtrade/index/helper')

// models
const systemtradeChart3dScatterModel = app.models.SystemtradeChart3dScatterVi

// utils
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * index scatter Chart
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  let data = await systemtradeChart3dScatterModel.find({
    where: {
      isValid: 1,
      categoryId: input.categoryId,
    },
    fields: {
      productId: true,
      productName: true,
      operatingMonths: true,
      profitRate: true,
      maximalDrawdown: true,
    },
  })

  if ((input.limit || 0) != 0) {
    data = arrayUtil.shuffle(data)
    data = data.slice(0, input.limit)
  }

  return data.map(item => {
    return {
      name: item.productName,
      url: helper.detailUrl(item.productId, input.categoryId),
      data: [
        [item.operatingMonths, item.profitRate, item.maximalDrawdown],
      ],
    }
  })
}

module.exports = {
  index,
}
