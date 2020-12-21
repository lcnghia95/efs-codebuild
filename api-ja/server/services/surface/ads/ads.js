const app = require('@server/server')
const helper = require('./helper')

// Models
const advertiseBannersModel = app.models.AdvertiseBanners

// Utils
const arrayUtil = require('@ggj/utils/utils/array')

const DEFAULT_TYPE_IDS = [0, 1, 2]


/**
 * Get index advertise banner
 *
 * @param {String} servicePath
 * @param {Object} languageAndPlatform
 * @return {Object}
 */
async function index(servicePath, languageAndPlatform) {
  const conditions = _conditionsForAdvertiseBanners(servicePath, languageAndPlatform)
  const advertiseBanners = await advertiseBannersModel.find(conditions)

  if(advertiseBanners.length == 0) {
    return {}
  }

  const banners = advertiseBanners.filter(banner => {
    return (banner.langType == languageAndPlatform.langType) && (banner.servicePath == servicePath)
  })

  return (banners.length > 0)
    ? arrayUtil.groupArray(banners, 'position')
    : arrayUtil.groupArray(advertiseBanners.filter(e => e.langType == 1), 'position')
}

/**
 * Generate conditions for get advertise banner
 *
 * @param {String} servicePath
 * @param {Object} languageAndPlatform
 * @return {Object}
 */
function _conditionsForAdvertiseBanners(servicePath, languageAndPlatform) {
  const languages = [1]
  if(languageAndPlatform.langType != 1) {
    languages.push(languageAndPlatform.langType)
  }

  const servicePaths = helper.handleServicePath(servicePath)
  const now = Date.now()

  return {
    where: {
      isValid: 1,
      servicePath: {inq: servicePaths},
      deviceType: languageAndPlatform.platform,
      langType: { inq: languages },
      typeId: { inq: DEFAULT_TYPE_IDS},
      startedAt: {
        lt: now,
      },
      endedAt: {
        gt: now,
      },
    },
    fields: {
      id: true,
      bannerUrl: true,
      landingPageUrl: true,
      langType: true,
      position: true,
      servicePath: true,
      startedAt: true,
      endedAt: true,
    },
    order: 'id DESC',
  }
}


module.exports = {
  index,
}
