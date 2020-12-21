const app = require('@server/server')
const PATTERN = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)/ig
const FXON_BLOG_URL = 'fx-on.com/blog/detail/'
// const SORT_TWITTER_URL = 't.co'
// const TWITTER_URL = 'twitter.com/'
const PROFILE_PREFIX = 'fx-on.com/user/?i='
const siteUtil = app.utils.site
const { SEARCH_ENGINE } = require('@@server/common/data/hardcodedData')
const { oldPartnerId } = require('@ggj/utils/utils/user')

/**
 * Get all registered sites of affiliate user
 *
 * @param {number} affiliateUserId
 * @returns {Object}
 * @private
 */
async function _allSites(affiliateUserId) {
  return await app.models.Sites.find({
    where: {
      isValid: 1,
      statusType: 1,
      userId: affiliateUserId,
      isAffiliate: 1,
    },
    fields: {
      id: true,
      // TODO: do we need to check siteType or not
      // siteType: true,
      siteUrl: true,
    },
  })
}

/**
 * Validate if referer is valid fxon blog or not
 *
 * @param {string} referer
 * @param {string} registeredUrl
 * @param {number} affiliateUserId
 * @returns {Boolean}
 * @private
 */
function _isValidBlogUrl(referer, registeredUrl, affiliateUserId) {
  if (!referer.includes(FXON_BLOG_URL)) {
    return false
  }

  // TODO: REFACTOR THIS BLOCK
  const oldAffiliateUserId = oldPartnerId(affiliateUserId)
    const profileUrl = PROFILE_PREFIX + oldAffiliateUserId + '&t=3'
  return registeredUrl.includes(profileUrl) || false
}

/**
 * Validate if referer is valid twitter url or not
 *
 * @param {string} referer
 * @param {string} registeredUrl
 * @returns {Boolean}
 * @private
 */
function _isValidTwitterUrl(referer, registeredUrl) {
  return siteUtil.TWITTER_URLS.some(e => referer.includes(e)) &&
    siteUtil.TWITTER_URLS.some(e => registeredUrl.includes(e)) || false
}

/**
 * Validate if referer is valid youtube url or not
 *
 * @param {string} referer
 * @param {string} registeredUrl
 * @returns {Boolean}
 * @private
 */
function _isValidYoutubeUrl(referer, registeredUrl) {
  return siteUtil.compare(referer, registeredUrl)
}

/**
 * Validate referer vs registeredUrl
 *
 * @param {string} referer
 * @param {string} registeredUrl
 * @param {number} affiliateUserId
 * @returns {Boolean}
 * @private
 */
function _isValidUrl(referer, registeredUrl, affiliateUserId) {
  // TODO: MODIFY DATABASE TO MAKE SURE THAT URL DON'T EXIST '/' IN THE MOST RIGHT POSITION
  // EX. registeredUrl = 'https://www.gogojungle.co.jp/'
  //      ---> 'https://www.gogojungle.co.jp'
  registeredUrl = registeredUrl.replace(/\/+$/g, '')
  return referer.includes(registeredUrl) ||
    _isValidBlogUrl(referer, registeredUrl, affiliateUserId) ||
    _isValidTwitterUrl(referer, registeredUrl) ||
    _isValidYoutubeUrl(referer, registeredUrl) ||
    false
}

/**
 * Validate referer information
 *
 * @param {string} referer // without http(s)://(www.)
 * @param {number} affiliateUserId
 * @returns {Boolean}
 * @public
 */
async function validateReferer(referer, affiliateUserId) {
  const sites = await _allSites(affiliateUserId)
    const site = sites.find((site) => {
      return _isValidUrl(referer, site.siteUrl.replace(PATTERN, '').toLowerCase(),
        affiliateUserId)
    })
  return site && true
}

/**
 * Check if referer information is from popular search engines or not
 *
 * @param {string} referer // without http(s)://(www.)
 * @param {number} affiliateUserId
 * @returns {Boolean}
 * @public
 */
async function validateSearchEngine(referer) {
  return SEARCH_ENGINE.includes(referer.replace(/\/.*$/g, ''))
}

module.exports = {
  validateReferer,
  validateSearchEngine,
}
