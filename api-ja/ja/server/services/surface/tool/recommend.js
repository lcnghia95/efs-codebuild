const app = require('@server/server')
const helper = require('@services/surface/tool/helper')
const sfProduct = require('@services/common/surfaceProduct')
const commonRecommendModel = app.models.CommonRecommendedProducts

/**
 * Default fields name of recommend product
 * @var {string}
 */
const FIELDS = 'dataType,typeId,categories,productId,productName,price'
  + ',isSpecialDiscount,specialDiscountPrice,reviewsStars,reviewsCount,catchCopy,userId,nickName'

/**
 * Get recommend products for index page
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function index(input = {}) {
  const res = await helper.response(await helper.data(commonRecommendModel, FIELDS, {
    where: {
      typeId: {inq: helper.typeIds()},
    },
    limit: 0,
  }))

  return input.limit == 0
    ? res
    : helper.slice(app.utils.object.filter(res), input.limit)
}

/**
 * Get campaign products
 *
 * @returns {Promise<Object>}
 */
async function campaign() {
  const data = await helper.data(commonRecommendModel, FIELDS, {
    where: {
      typeId: {inq: helper.typeIds()},
      dataType: 1,
    },
    limit: 20,
  })

  const res = await sfProduct.sfProductObjects(data)

  return app.utils.object.filter({campaign: res || []})
}

module.exports = {
  index,
  campaign,
}
