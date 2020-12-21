const app = require('@server/server')

/**
 * Get advertising banner information
 *
 * @param {string} servicePath
 * @returns {Object}
 */
async function show(servicePath) {
  const now = Date.now()
  const banner = await app.models.AdvertiseBanners.findOne({
      where: {
        isValid: 1,
        servicePath,
        startedAt: {
          lte: now,
        },
        endedAt: {
          gt: now,
        },
      },
      order: 'id DESC',
      fields: {
        bannerUrl: true,
        landingPageUrl: true,
        startedAt: true,
        endedAt: true,
      },
    })
  return banner || {}
}

module.exports = {
  show,
}
