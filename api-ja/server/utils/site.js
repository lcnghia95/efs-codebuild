const punycode = require('punycode')
const PATTERN = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)/ig
const TWITTER_URLS = ['twitter.com', 't.co', 'api.twitter.com', 'mobile.twitter.com']
const YOUTUBE_URLS = ['m.youtube.com', 'youtube.com']

/**
 * Handle URL
 *
 * Ex: https://www.abc.com/2037/40923/ => abc.com/2037/40923
 * @param {String} url
 * @return {String}
 * @private
 */
function _handleUrl(url) {
  // TODO: only accept url as String
  if (typeof url !== 'string') {
    return ''
  }

  let standard = url.replace(PATTERN, '').toLowerCase()
  return standard.replace(/\/+$/g, '')
}

/**
 * OAM-19915,OAM-22192 consistent twitter,youtube url into one
 * @param src
 * @returns {string|*}
 */
function _preProcess(src) {
  if (!src || !src.length) {
    return src
  }

  if (TWITTER_URLS.includes(src[0])) {
    src[0] = 'twitter.com'
  }

  if (YOUTUBE_URLS.includes(src[0])) {
    src[0] = 'youtube.com'
  }

  return src
}

/**
 * Checking source url match with target url
 *
 * @param {String} source
 * @param {String} target
 * @return {Boolean}
 * @public
 */
function compare(source, target) {
  if (source.length == 0 || target.length == 0) {
    return false
  }
  const sourceMembers = _preProcess(_handleUrl(source).split(/(\/|\?)/))
  const targetMembers = _preProcess(_handleUrl(target).split(/(\/|\?)/))

  return punycode.toASCII(sourceMembers[0]) == punycode.toASCII(targetMembers[0])
}

/**
 * Checking source url match with target url
 *
 * @param {String} url
 * @param {String} key
 * @param {String} val
 * @return {String}
 * @public
 */
function addQuerry(url, key, val) {
  const c = url.includes('?') ? '&' : '?'
  return url + c + key + '=' + val
}

module.exports = {
  addQuerry,
  compare,
  TWITTER_URLS,
}
