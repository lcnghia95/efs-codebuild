const app = require('@server/server')
const helper = require('@services/surface/tool/helper')
const commonRecentSold = app.models.CommonRecentSold

/**
 * Default fields name of recent sold product
 * @var {string}
 */
const FIELDS = 'typeId,categories,productId,productName,price'
  + ',isSpecialDiscount,specialDiscountPrice,reviewsStars,reviewsCount,catchCopy,userId,nickName'

/**
 * Get new products for index page
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function index(input = {}) {
  const res = await helper.response(await helper.data(commonRecentSold, FIELDS, {
    where: {
      typeId: {inq: helper.typeIds()},
    },
    limit: 0,
  }), _idx)

  return input.limit == 0
    ? res
    : helper.slice(app.utils.object.filter(res), input.limit)
}

/**
 * Get array id of given record
 *
 * @param record
 * @returns {Number}
 * @private
 */
function _idx(record) {
  if (record.price === 0) {
    return 2
  }
  return 1
}

module.exports = {
  index,
}
