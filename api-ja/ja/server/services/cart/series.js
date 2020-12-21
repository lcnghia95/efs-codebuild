const app = require('@server/server')

/**
 * Get product Id of series form productId of article
 *
 * @param {number} productId
 * @returns {number}
 * @public
 */
async function seriesPId(productId) {
  const article = await app.models.Articles.findOne({
    where: {
      isValid: 1,
      status: 1,
      productId,
    },
    fields: {
      seriesId: true,
    },
  })

  if (article == null) {
    return 0
  }
  const series = await app.models.Series.findOne({
    where: {
      id: article.seriesId,
      isValid: 1,
      status: 1,
    },
    fields: {
      productId: true,
    },
  })
  return series && series.productId || 0
}

module.exports = {
  seriesPId,
}
