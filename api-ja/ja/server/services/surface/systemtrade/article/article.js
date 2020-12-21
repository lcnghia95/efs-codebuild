const app = require('@server/server')
const common = require('@services/surface/finance/navi/common')

// Models
const relatedProductModel = app.models.RelatedProductArticles

// Utils
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * get related articles
 * @param {number} id
 * @param {number} userId
 *
 * @returns {array}
 * @public
 */
async function related(id, userId) {
  const relatedProductIds = await _getRelatedProductIds(id)

  if (!relatedProductIds.length) {
    return []
  }

  return await common.getArticles(
    relatedProductIds,
    userId,
    {
      limit: 20,
    },
  )
}

/**
 * get article ids
 *
 * @param {number} articleId
 *
 * @returns {array}
 * @private
 */
async function _getRelatedProductIds(productId) {
  return arrayUtil.column(await relatedProductModel.find({
    where: {
      isValid: 1,
      relatedProductId: productId,
    },
    fields: {
      articleId: true,
    },
  }), 'articleId')
}

module.exports = {
  related,
}
