const app = require('@server/server')
const helper = require('@services/surface/tool/helper')
const sfProduct = require('@services/common/surfaceProduct')
const commonPopularModel = app.models.CommonPopularProducts

/**
 * Default fields name of popular product
 * @var {string}
 */
const FIELDS = 'dataType,days,typeId,productId,productName,price'
  + ',isSpecialDiscount,specialDiscountPrice,reviewsStars,reviewsCount,userId,nickName,catchCopy'

/**
 * Get popular products for index page
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function index(input) {
  const res = await helper.response(await helper.data(commonPopularModel, FIELDS, {
    where: {
      typeId: {inq: helper.typeIds()},
      dataType: input.type,
    },
    limit: 0,
    // order: 'sales_count DESC',
  }), _idx)

  return input.limit == 0
    ? res
    : helper.slice(app.utils.object.filter(res), input.limit)
}

/**
 * Get price and count of 3 month nearest
 * @param input
 * @returns {Promise<Object>}
 */
async function priceAndCountOf3M() {
  const data = await helper.data(commonPopularModel, FIELDS, {
    where: {
      typeId: {inq: helper.typeIds()},
      dataType: {inq: [1, 2]},
      days: 90,
    },
    limit: 0,
  })
  const subRes = data.reduce((obj, record) => {
    const dataType = record.dataType || 0
    if (obj[dataType] && obj[dataType].length < 20) {
      obj[dataType].push(record)
    }
    return obj
  }, {1: [], 2: []})

  const [popularPrice, popularCount] = await Promise.all([
    sfProduct.sfProductObjects(subRes[1]),
    sfProduct.sfProductObjects(subRes[2]),
  ])

  return  app.utils.object.filter({
    popularPrice,
    popularCount,
  })
}

function _idx(record) {
  const sub = {90: 1, 30: 2, 7: 3, 0: 4}
  const days = record.days
  return sub[days] || 0
}

module.exports = {
  index,
  priceAndCountOf3M,
}
