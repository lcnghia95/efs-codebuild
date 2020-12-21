const app = require('@server/server')
const helper = require('./helper')

// models
const systemtradeRecentReviewModel = app.models.SystemtradeRecentReviews

/**
 * index systemtrade review
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input) {
  const fields = {
    categoryId: true,
    productId: true,
    productName: true,
    reviewUserId: true,
    reviewNickName: true,
    reviewPublishedAt: true,
    reviewStars: true,
    reviewTitle: true,
    reviewContent: true,
  }
  const reviews = await systemtradeRecentReviewModel.find({
    where: {
      isValid: 1,
    },
    order: 'id ASC',
    fields,
    limit: parseInt(input.limit || 10),
  })

  return reviews.map(review => _reviewObject(review))
}

/**
 * generate review Object
 *
 * @param {Object} input
 * @return {Object}
 * @public
 */
function _reviewObject(review) {
  return {
    productId: review.productId,
    productName: review.productName,
    title: review.reviewTitle,
    content: review.reviewContent,
    publishedDate: review.reviewPublishedAt,
    user: {
      id: review.reviewUserId,
      name: review.reviewNickName,
    },
    detailUrl: helper.detailUrl(review.productId, review.categoryId),
    review: {
      stars: review.reviewStars,
    },
  }
}

module.exports = {
  index,
}
