const app = require('@server/server')
const {
  sfProductObjects,
} = require('@services/common/surfaceProduct')

// models
const commonRecentProductModel = app.models.CommonRecentProducts

// utils
const objectUtils = app.utils.object

// limit new products for TopPage
const LIMIT = 6

/**
 * index new products
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function index() {
  const data = await _data()
  return await sfProductObjects(data)
}

/**
 * index new products
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function mobileIndex() {
  const [systemtrade, indicator, navi] = await Promise.all([
    _data(1),
    _data(2),
    _data(3),
  ])
  const data = _groupData(systemtrade.concat(indicator).concat(navi))
  const objectData = await sfProductObjects(data.data)

  return objectData.reduce((result, item) => {
    if (data.navi.indexOf(item.id) != -1) {
      result.navi.push(item)
    }
    if (data.systemtrade.indexOf(item.id) != -1) {
      result.systemtrade.push(item)
    }
    if (data.indicator.indexOf(item.id) != -1) {
      result.indicator.push(item)
    }

    return result
  }, {
    navi: [],
    systemtrade: [],
    indicator: [],
  })
}

/**
 * get common_recent_products data
 *
 * @param {number} type
 * @return {Array}
 * @private
 */
async function _data(type = null) {
  return await commonRecentProductModel.find({
    where: objectUtils.nullFilter({
      isValid: 1,
      typeId: type,
    }),
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
    limit: LIMIT,
  })
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
    result[group].push(item.productId)
    result.data.push(item)

    return result
  }, {
    navi: [],
    systemtrade: [],
    indicator: [],
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
  if (item.typeId == 3) {
    // 投資サロン（有料）
    return 'navi'
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
  mobileIndex,
}
