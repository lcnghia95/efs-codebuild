const app = require('@server/server')
const naviCommon = require('@services/surface/finance/navi/common')

// models
const relatedModel = app.models.RelatedProductArticles

// utils
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get related article for tool detail page
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function getRelatedArticles(pId, userId, input={}) {
  const limit = input.limit || 20
  const relatedProducts = await relatedModel.find({
    where: {
      relatedProductId: pId,
      isValid: 1,
    },
    fields: {articleId: true, relatedProductId: true},
  })

  if (!relatedProducts.length) {
    return []
  }

  return await naviCommon.getArticles(
    arrayUtil.column(relatedProducts, 'articleId'),
    userId,
    {limit},
  )
}

module.exports = {
  getRelatedArticles,
}
