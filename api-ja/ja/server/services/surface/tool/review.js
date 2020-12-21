const app = require('@server/server')
const helper = require('@services/surface/tool/helper')
const commonRankingReviewCount = app.models.CommonRankingReviewCount

/**
 * Default fields name of review product
 * @var {string}
 */
const FIELDS = 'typeId,productId,productName,price'
  + ',isSpecialDiscount,specialDiscountPrice,reviewsStars,reviewsCount,catchCopy,userId,nickName'

/**
 * Get new products for index page
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function index(input= {}) {
  const [listByReviewStars, listByReviewCount] = await Promise.all([
    list(['reviewsStars DESC', 'reviewsCount DESC']),
    list(['reviewsCount DESC']),
  ])
  const res = {
    1: listByReviewStars,
    2: listByReviewCount,
  }

  return input.limit == 0
    ? res
    : helper.slice(app.utils.object.filter(res), input.limit)
}

/**
 *
 * @param sort
 * @returns {Promise<Object>}
 */
async function list(sort) {
  const data = await helper.response(await helper.data(commonRankingReviewCount, FIELDS, {
    where: {
      typeId: {inq: helper.typeIds()},
    },
    limit: 0,
    order: sort,
  }), _idx)

  return Object.keys(data).length
    ? data[Object.keys(data)[0]] || {}
    : {}
}

/**
 * Get array id of given record
 *
 * @param record
 * @returns {Number}
 * @private
 */
function _idx() {
  return 1
}

module.exports = {
  index,
}
