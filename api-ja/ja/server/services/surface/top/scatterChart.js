const app = require('@server/server')

// models
const systemtradeChart3dScatterModel = app.models.SystemtradeChart3dScatter

// utils
const arrayUtil = require('@ggj/utils/utils/array')

//
const SCATTER_ELEMENTS = 100
const { SYSTEMTRADE_CATEGORY_IDS, SYSTEMTRADE_PRODUCT_URL } = require('@@server/common/data/hardcodedData')

/**
 * Get Recent Products index
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function index() {
  const data = arrayUtil.shuffle(await _data(), SCATTER_ELEMENTS)
  return data.map(item => _object(item))
}

/**
 * get Recent Products data
 *
 * @param {Void}
 * @return {Array}
 * @private
 */
async function _data() {
  return await systemtradeChart3dScatterModel.find({
    where: {
      isValid: 1,
      categoryId: {
        inq: SYSTEMTRADE_CATEGORY_IDS,
      },
    },
    fields: {
      categoryId: true,
      productId: true,
      productName: true,
      operatingMonths: true,
      profitRate: true,
      maximalDrawdown: true,
    },
  })
}

/**
 * object item
 *
 * @param {Object} item
 * @return {Object}
 * @private
 */
function _object(item) {
  return {
    name: item.productName,
    url: (SYSTEMTRADE_PRODUCT_URL[item.categoryId] || '') + item.productId + '?src=chart',
    data: [
      [item.operatingMonths, item.profitRate, item.maximalDrawdown],
    ],
  }
}

module.exports = {
  index,
}
