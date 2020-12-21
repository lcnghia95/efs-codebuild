const app = require('@server/server')
const favoriteSv = require('@services/common/favorite')
const productUrlSv = require('@services/common/productUrl')
const productModel = app.models.Products
const surfaceProductDetailsModel = app.models.SurfaceProductDetails
const reviewModel = app.models.Reviews
const userModel = app.models.Users
const commonCart = require('@services/common/cart')

const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get detail data for specific product
 *
 * @param id: Product id
 * @param {Object} input
 * @return {Promise<Object>}
 */
async function show(id, input) {
  if (!parseInt(id)) {
    return {}
  }

  const userId = await app.utils.meta.asyncUserId(app, input.requestId)
  const [product, isFavorite] = await Promise.all([
    surfaceProductDetailsModel.findOne({
      where: {id},
      fields: {
        id: true,
        typeId: true,
        userId: true,
        productName: true,
        catchCopy: true,
        reviewsStars: true,
        reviewsCount: true,
        updatedAt: true,
        categories: true,
        nickName: true,
      },
    }),
    favoriteSv.isFavorite(id, userId),
  ])

  // Get user Info
  const detailUrl = !product  ? null : await productUrlSv.productDetailUrls([product])

  return !product ? {} : {
    id: product.id,
    typeId: product.typeId,
    categories: product.categories,
    name: product.productName,
    description: product.catchCopy,
    userId: product.userId,
    nickname: product.nickName || '',
    detailUrl: !detailUrl[product.id] ? '' : detailUrl[product.id],
    reviewStars: product.reviewsStars,
    reviewCount: product.reviewsCount,
    updatedAt: product.updatedAt,
    isFavorite: isFavorite ? 1 : 0,
    cartInfo: await commonCart.show(product.id, product, userId),
  }
}

/**
 * Get reviews index data of specific product
 *
 * @param id
 * @param {object} input
 * @param {number} objectType
 * @param {boolean} isPaging
 * @return {Promise<Object>}
 */
async function index(id, input, objectType = 1, isPaging = true) {
  const limit = input.limit || 10
  const page = input.page || 1

  const pagingInfo = app.utils.paging.getOffsetCondition(page, limit)
  const reviewWhere = {
    productId: id,
    content: {neq: ''},
  }

  let [product, reviews, totalReview] = await Promise.all([
    productModel.findOne({
      where: {id: id},
      fields: {id: true, typeId: true, userId: true, name: true},
    }),
    reviewModel.find({
      where: reviewWhere,
      skip: pagingInfo.skip,
      limit: pagingInfo.limit,
      order: 'publishedAt DESC',
      fields: app.utils.query.fields('id,userId,publishedAt,reviewStars,title,content'),
    }),
    reviewModel.count(reviewWhere),
  ])

  if (!totalReview || !product) {
    return {}
  }

  // Get users data and then mapping into reviews response
  const users = arrayUtil.index(await userModel.find({
    where: {
      id: {inq: arrayUtil.column(reviews, 'userId')},
    },
    fields: {id: true, nickName: true},
  }))

  reviews = reviews.map(review => {
    const user = users[review.userId] || {}
    return _object(review, user, objectType)
  })

  return isPaging
    ? app.utils.paging.addPagingInformation(reviews, page, totalReview, limit)
    : reviews
}

/**
 * Convert review response object
 *
 * @param record
 * @param user
 * @param objectType
 * @return {Object}
 * @private
 */
function _object(record, user, objectType = 1) {
  return objectType === 1 ? {
    id: record.id,
    reviewUserId: record.userId,
    reviewNickName: user.nickName,
    reviewPublishedDate: record.publishedAt,
    reviewStars: record.reviewStars,
    reviewTitle: record.title,
    reviewContent: record.content,
  } : {
    title: record.title,
    content: record.content,
    review: {
      stars: record.reviewStars,
    },
    publishedDate: record.publishedAt,
    user: {
      id: record.userId,
      name: user.nickName,
    },
  }
}

module.exports = {
  index,
  show,
}
