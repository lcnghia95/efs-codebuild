const app = require('@server/server')
const siteService = require('./site')
const PATTERN = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)/ig
const DEFAULT_AFFILIATE_USER_ID = 0
const GOGO_AFFILIATE_USER_ID = 120001

/**
 * Normalize referer
 *
 * @param {string} referer
 * @returns {string}
 * @private
 */
function _normalizeReferer(referer) {
  return referer.replace(PATTERN, '')
}

/**
 * Default affiliate information
 *
 * @param {string} referer
 * @returns {Object}
 * @private
 */
function _default(referer) {
  return {
    affiliateUserId: DEFAULT_AFFILIATE_USER_ID,
    referer: referer,
  }
}

/**
 * Gogojungle affiliate information
 *
 * @param {string} referer
 * @returns {Object}
 * @private
 */
function _gogo(referer) {
  return {
    affiliateUserId: GOGO_AFFILIATE_USER_ID,
    referer: referer,
  }
}

/**
 * Get valid user record of affiliate user
 *
 * @param {number} affiliateUserId
 * @returns {Boolean}
 * @private
 */
async function _validateAffiliateUser(affiliateUserId) {
  if (affiliateUserId == 0) {
    return false
  }
  const count = await app.models.Users.count({
    id: affiliateUserId,
    isValid: 1,
    statusType: 1,
    isAffiliate: 1,
  })
  return count == 1
}

/**
 * Default affiliate information
 *
 * @param {Object} rawAffiliateData: affiliate data get from cookie (of fx-on)
 * @returns {Promise<Object | {referer: string, affiliateUserId: number}>}
 * @public
 */
async function affiliateInformation(rawAffiliateData) {
  const referer = (rawAffiliateData.referer || '').toLowerCase()
    const affiliateUserId = rawAffiliateData.affiliateUserId || 0

  // No referer information
  if (referer.length == 0 && affiliateUserId == 0) {
    return _default(referer)
  }

  const normalizeReferer = _normalizeReferer(referer)
    const validateResult = await siteService.validateSearchEngine(normalizeReferer)
  if (validateResult) {
    // https://gogojungle.backlog.jp/view/OAM-13027
    return _gogo(referer)
  }

  const isAffiliateUser = await _validateAffiliateUser(affiliateUserId)
  // Invalid affiliate user
  if (!isAffiliateUser) {
    // OAM-48785
    return _default(referer)
  }
  return rawAffiliateData
}

/**
 * Validate affiliate information data in sales records
 *
 * @param {Array} sales
 * @returns {void}
 * @public
 */
async function validateAffiliateData(sales) {
  sales = sales.filter(sale => {
    if (sale.affiliateUserId == DEFAULT_AFFILIATE_USER_ID) {
      return false
    }
    if (sale.affiliateUserId == GOGO_AFFILIATE_USER_ID) {
      return false
    }
    return true
  })
  if (!sales.length) {
    return
  }
  const cache = {}
  for (let i = 0, l = sales.length; i < l; i++) {
    const sale = sales[i]
    let affiliateUserId
    if (cache[sale.referer] !== undefined) {
      affiliateUserId = cache[sale.referer]
    } else {
      const information = await affiliateInformation({
        affiliateUserId: sale.affiliateUserId,
        referer: sale.referer,
      })
      affiliateUserId = information.affiliateUserId || 0
      cache[sale.referer] = affiliateUserId
    }
    if (affiliateUserId != sale.affiliateUserId) {
      sale.affiliateUserId = affiliateUserId
      await sale.save()
    }
  }
}

module.exports = {
  affiliateInformation,
  validateAffiliateData,
}
