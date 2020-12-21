const app = require('@server/server')
const {
  sfProductObjects,
} = require('@services/common/surfaceProduct')
const { indexChart, systemtradeBalanceCurve } = require('@services/surface/systemtrade/index/helper')
const arrayUtil = require('@ggj/utils/utils/array')
const { TOP_SALE_CHANGE_LINK } = require('@@server/common/data/hardcodedData')
// models
const commonRecentSoldModel = app.models.CommonRecentSold

const MAX_LENGTH = 20

/**
 * Get index content
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function index() {
  const data = await _data()
  const [objectData, systemtradeProducts] = await Promise.all([
    sfProductObjects(data.data),
    systemtradeBalanceCurve(arrayUtil.column(data.data || [], 'productId')),
  ])

  return objectData.reduce((result, item) => {

    if (TOP_SALE_CHANGE_LINK[item.id]) {
      // custom for OAM-18059
      item.detailUrl = TOP_SALE_CHANGE_LINK[item.id]
    }

    if (data.systemtrade.indexOf(item.id) != -1) {
      result.systemtrade.push(Object.assign(
        item,
        {
          chart: indexChart(systemtradeProducts[item.id] || {}),
        },
      ))
    }
    if (data.indicator.indexOf(item.id) != -1) {
      result.indicator.push(item)
    }
    if (data.advisor.indexOf(item.id) != -1) {
      result.advisor.push(item)
    }
    if (data.all.indexOf(item.id) != -1) {
      result.all.push(item)
    }

    return result
  }, {
    systemtrade: [],
    indicator: [],
    advisor: [],
    all: [],
  })
}

/**
 * get common_recent_sold data
 *
 * @param {Void}
 * @return {Array}
 * @private
 */
async function _data() {
  const data = await commonRecentSoldModel.find({
    where: {
      isValid: 1,
    },
    fields: {
      typeId: true,
      categories: true,
      productId: true,
      productName: true,
      price: true,
      isSpecialDiscount: true,
      specialDiscountPrice: true,
      reviewsStars: true,
      reviewsCount: true,
    },
  })
  return _groupData(data)
}

/**
 * group data
 *
 * @param {Array} data
 * @return {Array}
 * @private
 */
function _groupData(data) {
  return data.reduce((result, item) => {
    const group = _group(item)
    if (result[group].length < MAX_LENGTH) {
      result[group].push(item.productId)
      result.data.push(item)
    }
    return result
  }, {
    systemtrade: [],
    indicator: [],
    advisor: [],
    all: [],
    data: [],
  })
}

/**
 * get group name
 *
 * @param {Object} item
 * @return {String}
 * @private
 */
function _group(item) {
  if (item.price == 0) {
    // 全ジャンル（無料）
    return 'all'
  }
  if (item.typeId == 4) {
    // 投資サロン（有料）
    return 'advisor'
  }
  if (item.typeId == 1) {
    // システムトレード（有料）
    return 'systemtrade'
  }
  // インジケータ･電子書籍（有料）
  return 'indicator'
}

module.exports = {
  index,
}
