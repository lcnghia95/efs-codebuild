const randomstring = require('randomstring')
const cookie = require('cookie')
const userCommonService = require('@services/common/user')
const crypto = require('@server/utils/crypto')

/**
 * Get cookies from request
 *
 * @param {Object} req
 * @returns {Object}
 * @private
 */
function _cookies(req) {
  let cookies = cookie.parse(req.headers.cookie || '')
  Object.keys(cookies).forEach(name => {
    if (cookies[name] == 'null') {
      delete cookies[name]
    }
  })
  return cookies
}

/**
 * Get data from cookie
 *
 * @param {Object} req
 * @param {string} name
 * @param {mixed} _default
 * @returns {mixed}
 * @private
 */
function _cookie(req, name, _default = '') {
  return _cookies(req)[name] || _default
}

/**
 * Get affiliate information from auxTag
 *
 * @param {Object} auxTag
 * @returns {Object}
 * @public
 */
function _getAffiliateInformationFromAuxTag(auxTag) {

  const deAuxTag = crypto.decrypt(auxTag)
  const seperateCharacterIndex = deAuxTag.indexOf('_')
  const aid = parseInt(deAuxTag.substr(0, seperateCharacterIndex + 1))
  const ref = deAuxTag.substr (seperateCharacterIndex + 1)
  return {
    referer: ref || '',
    affiliateUserId: userCommonService.partnerId(aid || 0)
  }
}
/**
 * Get affiliate information from cookie
 *
 * @param {Object} req
 * @returns {Object}
 * @public
 */
function affiliateInformation(req) {
  // Memo: client
  // $_COOKIE['fxoncomasp']['aid'] -> aid
  // $_COOKIE['fxoncomasp']['ref'] -> ref

  //Memo: get affiliate from auxTag if have auxTag in req.body
  const auxTag = req.body.auxTag
  if(auxTag)
    return _getAffiliateInformationFromAuxTag(auxTag)
  let cookies = _cookies(req)
  return {
    referer: cookies.ref || '',
    affiliateUserId: userCommonService.partnerId(parseInt(cookies.aid || 0))
  }
}

function cartSessionId(req, res) {
  // Parse the cookies on the request
  let csid = _cookie(req, 'csid')
  if (csid) {
    return csid
  }

  // Generate new pseudo session id and save it to cookie
  // TODO: ADD microtime to suffix of session id
  csid = randomstring.generate(40)
  res.cookie('csid', csid, {
    httpOnly: false,
    maxAge: 2592000000, // 1 months
  })
  return csid
}

/**
 * Get selected dvd option from cookie
 *
 * @param {Object} req
 * @returns {number}
 * @public
 */
function dvdOption(req) {
  return _cookie(req, 'cdvdoption', 0)
}

/**
 * Get selected payId from cookie
 *
 * @param {Object} req
 * @returns {number}
 * @public
 */
function payId(req) {
  return parseInt(_cookie(req, 'cpayid', 0))
}

/**
 * Get salesSessionId from cookie
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {string}
 * @public
 */
function salesSessionId(req, res) {
  let ssid = _cookie(req, 'ssid')
  res.clearCookie('ssid')
  return ssid
}

/**
 * Post checkout process when checkout cart items
 *
 * @param {Object} res
 * @returns {void}
 * @public
 */
function postCheckoutHandler(res) {
  res.clearCookie('csid')
  res.clearCookie('cpayid')
  res.clearCookie('cdvdoption')
}

module.exports = {
  payId,
  dvdOption,
  cartSessionId,
  salesSessionId,
  postCheckoutHandler,
  affiliateInformation,
}
