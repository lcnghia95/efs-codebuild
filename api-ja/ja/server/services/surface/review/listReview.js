const app = require('@server/server')
const productUrlSv = require('@services/common/productUrl')
const productModel = app.models.Products
const reviewModel = app.models.Reviews
const userModel = app.models.Users

const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get detail data for specific product
 *
 * @param {Object} input
 * @return {Promise<Object>}
 */
async function index(input) {
  if (input.typeId == 2) {
    input.typeId = '2,6,9,19,70'
  }

  const limit = !input.limit ? (input.limit == 0 ? 0 : 10) :
    (isNaN(input.limit) ? 10 : parseInt(input.limit))
  const page = parseInt(input.page) || 1
  const pagingInfo = app.utils.paging.getOffsetCondition(page, limit)
  const [total, reviews] = await _reviews(input, limit, pagingInfo.skip)
  const userIds = arrayUtil.column(reviews, 'userId')
  const productIds = arrayUtil.column(reviews, 'productId')

  let [users, products] = await Promise.all([
    userModel.find({
      where: {
        id: {inq: userIds},
      },
      fields: {id: true, nickName: true},
    }),
    productModel.find({
      where: {
        id: {inq: productIds},
      },
      fields: {id: true, typeId: true},
    }),
  ])

  const detailUrls = await productUrlSv.productDetailUrls(products)

  // Indexing users array and get response data
  users = arrayUtil.index(users)

  const res = reviews.map(review => _object(
    review,
    users[review.userId] || {},
    detailUrls[review.productId] || '',
  ))

  return app.utils.paging.addPagingInformation(res, page, total, limit)
}

/**
 * Get list reviews data
 *
 * @param input
 * @param limit
 * @param skip
 * @return {Promise<Array>}
 * @private
 */
async function _reviews(input, limit, skip) {
  const where = app.utils.object.nullFilter({
    typeId: !input.typeId ? null : {inq: input.typeId.split(',')},
  })

  return await Promise.all([
    reviewModel.count(where),
    reviewModel.find({
      where,
      limit,
      skip,
      order: 'id DESC',
      fields: app.utils.query.fields(
        'userId,productId,typeId,publishedAt,reviewStars,title,content',
      ),
    }),
  ])
}

/**
 * Review response object
 *
 * @param record
 * @param user
 * @param detailUrl
 * @return {Object}
 * @private
 */
function _object(record, user, detailUrl) {
  return {
    productId: record.productId,
    reviewNickName: user.nickName,
    reviewUserId: record.userId,
    reviewPublishedDate: record.publishedAt,
    reviewTitle: record.title,
    reviewContent: record.content,
    reviewStars: record.reviewStars,
    detailUrl: detailUrl,
  }
}

module.exports = {
  index,
}
