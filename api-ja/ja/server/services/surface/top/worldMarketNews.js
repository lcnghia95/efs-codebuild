const app = require('@server/server')

// models
const commonWorldMarketNewsModel = app.models.CommonWorldMarketNews

// Mapping for country
const HCKEYS = {
  'Australia': 'au',
  'Canada': 'ca',
  'Switzerland': 'ch',
  // 'Euro' : '',
  'UK': 'gb',
  'Japan': 'jp',
  'New Zealand': 'nz',
  'America': 'us',
  'South Africa': 'za',
  'Singapore': 'sg',
  'China': 'cn',
  'Hong Kong': 'cn-6655',
}

/**
 * Get index worldMarketNews
 *
 * @param {void}
 * @return {Object}
 * @public
 */
async function index() {
  const data = await _data()
  return data.reduce((result, item) => {
    if (HCKEYS[item.countryNameEn]) {
      result.push(_object(item))
    }
    return result
  }, [])
}

/**
 * get common_world_market_news data
 *
 * @param {Void}
 * @return {Array}
 * @private
 */
async function _data() {
  return await commonWorldMarketNewsModel.find({
    where: {
      isValid: 1,
    },
  })
}

/**
 * Object item
 *
 * @param {Object} item
 * @return {Object}
 */
function _object(item) {
  return {
    id: item.id,
    countryEn: item.countryNameEn,
    countryJp: item.countryNameJp,
    title: item.title,
    titleUrl: item.titleLinkUrl,
    hCKey: HCKEYS[item.countryNameEn],
  }
}

module.exports = {
  index,
}
