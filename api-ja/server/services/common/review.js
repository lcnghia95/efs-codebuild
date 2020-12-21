const app = require('@server/server')

const reviewStarsModel = app.models.ReviewStars

const queryUtil = require('@ggj/utils/utils/query')

/**
 * Get review data by user id
 *
 * @param {Number} userId
 * @param {String} fields
 * @return {Promise<Array>}
 * @public
 */
async function getReviews(userId, fields) {
  return await app.models.Reviews.find({
    where: {
      isValid: 1,
      userId,
    },
    order: 'publishedAt DESC',
    fields: queryUtil.fields(fields),
  })
}

/**
 * Get review stars data by product_id
 *
 * @param {Array} productIds
 * @param {Object} fields
 * @return {Promise<Array>}
 * @public
 */
async function getReviewStars(productIds, fields) {
  return await reviewStarsModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    limit: 0,
    fields,
  })
}


module.exports = {
  getReviews,
  getReviewStars,
}
