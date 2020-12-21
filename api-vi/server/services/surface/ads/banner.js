const app = require('@server/server')
const helper = require('./helper')

// models
const topImpactModel = app.models.TopImpacts
const topImpactBannerDisplayModel = app.models.TopImpactBannerDisplay
const topImpactBannerModel = app.models.TopImpactBanners

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = require('@ggj/utils/utils/object')

// Default values
const MOBILE_POSITION_TYPES = [7, 8]


/**
 * Get index banner
 *
 * @param {String} referer
 * @param {Number} platform
 * @return {Object}
 * @public
 */
async function index(referer, platform) {
  let servicePaths = helper.handleServicePath(referer),
    topImpacts = await _topImpacts()

  if (topImpacts.length == 0) {
    return _default()
  }

  // Handle banner for mobile
  if(platform == 2) {
    return await _generateBannerForMobile(topImpacts, servicePaths)
  }

  const display = await _displays(arrayUtil.column(topImpacts, 'id'), servicePaths)
  if (display.length == 0) {
    return _default()
  }

  topImpacts = arrayUtil.index(topImpacts)

  const displayFillRate = _groupBannerDisplayByTopImpactId(display, topImpacts)
    const topImpactId = _randomTopImpactId(display, displayFillRate)

  if (topImpactId == 0) {
    return _default()
  }

  const banners = await _banner([topImpactId])
  if (banners.length == 0) {
    return _default()
  }

  let data = _randomBanners(topImpacts, topImpactId, displayFillRate, banners)

  if (data.length == 0) {
    return _default()
  }

  data = data.map(item => {
    return _bannerObject(item)
  })

  return arrayUtil.index(data, 'positionType')
}

/**
 * Get banner top
 *
 * @return {Object}
 * @public
 */
async function top() {
  let topImpacts = await _topImpacts()
  if (!topImpacts) {
    return {}
  }

  const displays = arrayUtil.shuffle(
      await _displays(arrayUtil.column(topImpacts, 'id')),
    )
    const banners = await _banner(arrayUtil.column(displays, 'topImpactId'))

  topImpacts = arrayUtil.index(topImpacts)
  const displayFillRate = _groupBannerDisplayByTopImpactId(displays, topImpacts)

  topImpacts = banners.reduce((topImpacts, banner) => {
    let topImpactId = banner.topImpactId,
      displayRate = displayFillRate[topImpactId]

    if (!topImpacts[topImpactId].banners) {
      let rates = arrayUtil.column(displayRate, 'rate'),
        maxRate = 0
      if(rates.length > 0) {
        maxRate = Math.max(...rates)
      }

      topImpacts[topImpactId].displayFillRate = maxRate
      topImpacts[topImpactId].banners = {}
    }

    displayRate = arrayUtil.index(displayRate, 'bannerId')
    topImpacts[topImpactId].banners[banner.positionType] = objectUtil.nullFilter({
      bannerUrl: banner.bannerUrl,
      bannerType: banner.bannerType,
      positionType: banner.positionType,
      landingPageUrl: banner.landingPageUrl,
      description: (banner.bannerType == 2) ? banner.catchCopy : null,
      fillRate: !displayRate[banner.id] ? (topImpacts[topImpactId].fillRate ||
        0) : displayRate[banner.id].rate,
    })
    return topImpacts
  }, topImpacts)

  return topImpacts
}

/**
 * Generate response data for banner
 *
 * @param {Object} item
 * @return {Object}
 */
function _bannerObject(item) {
  return {
    id: item.id,
    bannerType: item.bannerType,
    positionType: item.positionType,
    bannerUrl: item.bannerUrl,
    landingPageUrl: item.landingPageUrl,
    description: (item.bannerType == 2) ? item.catchCopy : null,
  }
}

/**
 * Generate banners for mobile
 *
 * @param {Array} topImpacts
 * @param {Array} servicePaths
 * @return {Promise <Object>}
 */
async function _generateBannerForMobile(topImpacts, servicePaths) {
  let topImpactIds = arrayUtil.column(topImpacts),
    banners = await _banner(topImpactIds, {positionType: {inq: MOBILE_POSITION_TYPES}})

  if(banners.length == 0) {
    return _default()
  }

  const impactIds = arrayUtil.column(banners, 'topImpactId', true)
    const topImpactBannerIds = arrayUtil.column(banners)

  topImpacts = topImpacts.reduce((result, item) => {
    if(impactIds.includes(item.id)) {
      result.push(item)
    }
    return result
  }, [])

  let display = await _displays(arrayUtil.column(topImpacts), servicePaths, {topImpactBannerId: {inq: topImpactBannerIds}}),
    topImpactId = parseInt(_caculatetopImpactIdForMobile(topImpacts, display))

  if(topImpactId == 0) {
    return _default()
  }

  display = arrayUtil.groupArray(display, 'topImpactId')
  banners = arrayUtil.groupArray(banners, 'topImpactId')

  const data = !display[topImpactId]
    ? _randomMobileBanner(banners[topImpactId])
    : _randomMobileBanner(banners[topImpactId], display[topImpactId])

  if(Object.keys(data).length == 0) {
    return _default()
  }

  return {
    [data.positionType] : _bannerObject(data),
  }
}

/**
 * Caculate random data for mobile
 *
 * @params {Array} topImpacts
 * @params {Array} display
 * @return {Number}
 */
function _caculatetopImpactIdForMobile(topImpacts, display) {
  let topImpactId = 0,
    rand = Math.floor(Math.random() * 100),
    data = _groupBannerForMobile(display, topImpacts)

  Object.keys(data).every(id => {
    rand -= parseInt(data[id].rate)
    if (rand < 0) {
      topImpactId = id
      return false
    }
    return true
  })

  return topImpactId
}

/**
 * Group and caculate rate of top_impact_banners by top_impact_id for mobile
 *
 * @params {Array} display
 * @params {Array} topImpacts
 * @return {Object}
 */
function _groupBannerForMobile(display, topImpacts) {
  display = arrayUtil.groupArray(display, 'topImpactId')
  return topImpacts.reduce((result, item) => {
    const id = item.id
      const data = {}
    if (!result[id]) {
      result[id] = {}
    }

    data.bannerId = id

    if(!display[id]) {
      data.rate = item.fillRate
    } else {
      const bannerDisplays = arrayUtil.column(display[id], 'fillRate')
      data.rate = (bannerDisplays.length > 0) ? Math.max(...bannerDisplays) : 0
    }
    result[id] = data
    return result
  }, {})
}

/**
 * Random Mobile banner
 *
 * @params {Object || Array} banners
 * @params {Array} rate
 * @return {Object}
 */
function _randomMobileBanner(banners, rate = []) {
  // Random
  if(rate.length == 0) {
    return banners[Math.floor(Math.random() * banners.length)]
  }

  // Return if array have only one record
  if(rate.length == 1) {
    return banners[rate[0].topImpactBannerId]
  }

  // Random by rate
  let maxRating = Math.max(...arrayUtil.column(rate, 'fillRate')),
    rand = Math.floor(Math.random() * maxRating),
    bannerId = 0

  for (let i = 0; i < rate.length; i++) {
    if(rand - parseInt(rate[i].fillRate) < 0) {
      bannerId = rate[i].topImpactBannerId
      break
    }
  }

  banners = arrayUtil.index(banners)
  return banners[bannerId] || {}

}

/**
 * Group top impact banner display by top impact id
 *
 * @params {Array} display
 * @params {Array} topImpacts
 * @return {Object}
 */
function _groupBannerDisplayByTopImpactId(display, topImpacts) {
  return display.reduce((result, item) => {
    const id = item.topImpactId
      const rate = (item.fillRate == 0) ? (topImpacts[id].fillRate || 0) : item.fillRate
    if (!result[id]) {
      result[id] = []
    }
    result[id].push({
      bannerId: item.topImpactBannerId,
      rate,
    })
    return result
  }, {})
}

/**
 * Random top impact id by weight
 *
 * @params {Array} display
 * @params {Object} displayFillRate
 * @return {Number}
 */
function _randomTopImpactId(display, displayFillRate) {
  let topImpactId = 0,
    rand = Math.floor(Math.random() * 100), // returns a random integer from 0 to 99
    topImpactIds = arrayUtil.column(display, 'topImpactId', true)

  topImpactIds.every(id => {
    let rates = arrayUtil.column(displayFillRate[id], 'rate'),
      impactFillRate = 0

    if(rates.length > 0) {
      impactFillRate = Math.max(...rates)
    }

    rand -= impactFillRate

    if (rand < 0) {
      topImpactId = id
      return false
    }
    return true
  })

  return topImpactId
}

/**
 * Random banner by weight
 *
 * @params {Object} topImpacts
 * @params {Number} topImpactId
 * @params {Object} displayFillRate
 * @params {Array} banners
 * @return {Array}
 */
function _randomBanners(topImpacts, topImpactId, displayFillRate, banners) {
  const displayRate = arrayUtil.index(displayFillRate[topImpactId], 'bannerId')
    const maxDisplayNumber = Math.max(...arrayUtil.column(displayFillRate[topImpactId],
      'rate'))
    // returns a random integer from 0 to maxDisplayNumber - 1
    const bannerRand = Math.floor(Math.random() * maxDisplayNumber)
    const data = []

  banners.map(banner => {
    const bannerRate = !displayRate[banner.id] ? (topImpacts[topImpactId].fillRate ||
      0) : displayRate[banner.id].rate
    if (bannerRand - parseInt(bannerRate) < 0) {
      data.push(banner)
    }
  })

  return data
}

/**
 * Get Banners
 *
 * @param {Array} ids
 * @param {Object} conditions
 * @return {Promise <Array>}
 */
async function _banner(ids, conditions = {}) {
  return await topImpactBannerModel.find({
    where: Object.assign({
      isValid: 1,
      topImpactId: {
        inq: ids,
      },
    }, conditions),
    fields: {
      id: true,
      positionType: true,
      bannerUrl: true,
      bannerType: true,
      landingPageUrl: true,
      topImpactId: true,
      catchCopy: true,
    },
  })
}

/**
 * Get Impact Banner Display
 *
 * @param {Array} ids
 * @param {Array} servicePath
 * @param {Object} extConditions
 * @return {Promise <Array>}
 */
async function _displays(ids, servicePath = '', extConditions = {}) {
  if(!servicePath) {
    servicePath = ['/']
  }

  return await topImpactBannerDisplayModel.find({
    where: Object.assign({
      isValid: 1,
      topImpactId: {
        inq: ids,
      },
      servicePath: { inq: servicePath },
    }, extConditions),
    fields: {
      id: true,
      topImpactId: true,
      topImpactBannerId: true,
      fillRate: true,
    },
  })
}

/**
 * Get top Impacts
 *
 * @return {Promise <Array>}
 */
async function _topImpacts() {
  // TODO: cache here for 90s
  const now = Date.now()
  return await topImpactModel.find({
    where: {
      isValid: 1,
      startedAt: {
        lt: now,
      },
      endedAt: {
        gt: now,
      },
    },
    fields: {
      id: true,
      fillRate: true,
    },
  })
}

/**
 * Generate default data
 *
 * @return {Object}
 */
function _default() {
  return {}
}


module.exports = {
  index,
  top,
}
