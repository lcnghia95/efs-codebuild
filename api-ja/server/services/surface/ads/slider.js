const app = require('@server/server')
const topSliderModel = app.models.TopSliders

// Utils
const objectUtil = require('@ggj/utils/utils/object')

const SPECIAL_SLIDER_IDS = [4,6]

/**
 * Get top sliders
 *
 * @param {String} servicePath
 * @param {Object} languageAndPlatform
 * @return {Array}
 */
async function index(servicePath, languageAndPlatform) {
  const conditions = _generateTopSliderConditions(servicePath, languageAndPlatform)
  const topSliders = await topSliderModel.find(conditions)

  if(topSliders.length == 0) {
    return []
  }

  const sliders = topSliders.filter(e => e.langType == languageAndPlatform.langType)

  if (sliders.length > 0) {
    return sliders.map(slider => objectUtil.deepNullFilter(slider))
  }

  return topSliders.filter(e => e.langType == 1).map(slider => objectUtil.deepNullFilter(slider))
}

/**
 * Generate conditions for get top sliders
 *
 * @param {String} servicePath
 * @param {Object} languageAndPlatform
 * @return {Array}
 */
function _generateTopSliderConditions(servicePath, languageAndPlatform) {
  const languages = [1]
  if(languageAndPlatform.langType != 1) {
    languages.push(languageAndPlatform.langType)
  }

  return {
    where: {
      servicePath,
      isValid: 1,
      deviceType: languageAndPlatform.platform,
      langType: { inq: languages },
    },
    fields: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      linkUrl: true,
      langType: true,
    },
  }
}

/**
 * Update service path for top_sliders id = 4 & 6 (index page)
 *
 * @return {Bool}
 */
async function updateServicePath() {
  const data = await topSliderModel.find({
    where: {
      isValid: 1,
      id: {inq: SPECIAL_SLIDER_IDS},
    },
    fields: {
      id: true,
    },
  })

  if(data.length == 0) {
    return 400
  }

  data.map(item => {
    return item.updateAttribute('servicePath', '/')
  })

  return true
}


module.exports = {
  index,
  updateServicePath,
}
