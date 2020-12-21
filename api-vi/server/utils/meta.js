const cookie = require('cookie')
const crypto = require('crypto')
const cryptoUtil = require('./crypto')
const CHECK_SUM_KEY = process.env.CHECK_SUM_KEY
const ONE_HOUR = 3600000
const VERSION = 20190110
const LANG_MAP = {
  ja: 1,
  en: 2,
  th: 3,
  vi: 4,
  ch: 5,
  tw: 6,
}

const maps = {
  userId: function(req) {
    let cookies = cookie.parse(req.headers.cookie || '')
    return _userId(cookies)
  },
  loginType: function(req) {
    let cookies = cookie.parse(req.headers.cookie || '')
    return parseInt(cookies['lgt'] || 1)
  },
  information: function(req) {
    let cookies = cookie.parse(req.headers.cookie || ''),
      usrinfo = cookies['usrinfo']
    if (usrinfo) {
      try {
        usrinfo = cryptoUtil.decrypt(usrinfo)
        let data = JSON.parse(usrinfo)
        if (data.version == VERSION && data.updated + ONE_HOUR > Date.now()) {
          return data
        }
      } catch (e) {
        // do nothing
      }
    }
    return {}
  },
  referer: function(req) {
    return req.headers['referer'] || ''
  },
  ipAddress: function(req) {
    return req.headers['remote-addr'] ||
      ((req.headers['x-forwarded-for'] || '').split(',')[0] || '')
  },
  userAgent: function(req) {
    return req.headers['user-agent'] || ''
  },
  langType: function(req) {
    let cookies = cookie.parse(req.headers.cookie || '')
    return LANG_MAP[cookies['lang'] || 'ja'] || 1
  },
  platform: function(req) {
    return req.headers['platform'] || ''
  },
}

/**
 * Add specific cookie
 *
 * @param {Object} res
 * @param {string} key
 * @param {any} value
 * @param {number} maxAge
 * @param {Boolean} isHttpOnly
 * @private
 */
function _addCookie(res, key, value, maxAge, isHttpOnly = true) {
  res.cookie(key, value, {
    maxAge: maxAge || ONE_HOUR,
    httpOnly: isHttpOnly,
  })
}

/**
 * Get & validate user from given cookies
 *
 * @param {Object} cookies
 * @return {number}
 * @private
 */
function _userId(cookies) {
  let uId = parseInt(cookies['uid'] || 0),
    corsToken = cookies['corsToken']
  if (uId == 0 || !corsToken) {
    return 0
  }
  let checkSum = crypto.createHash('md5')
    .update(uId + CHECK_SUM_KEY)
    .digest('hex')
  return checkSum == corsToken ? uId : 0
}
module.exports.userId = _userId

/**
 * Save user info into cookie
 *
 * @param res
 * @param information
 */
module.exports.saveUserInformation = function(res, information) {
  information.updated = Date.now()
  information.version = VERSION
  _addCookie(res, 'usrinfo', cryptoUtil.encrypt(JSON.stringify(information)), ONE_HOUR, false)
}

/**
 * Get meta data from request headers
 *
 * @param req
 * @param fields
 * @returns Ojbect
 */
module.exports.meta = function(req, fields = ['userId']) {
  return fields.reduce((obj, key) => {
    let func = maps[key] || false
    func && (obj[key] = func(req))
    return obj
  }, {})
}

/**
 * Get current user id using node event-driven architecture
 *
 * @param {Object} app
 * @param {String | Number} requestId
 * @returns {Promise<number>}
 */
module.exports.asyncUserId = async function(app, requestId) {
  return new Promise((function(resolve) {
    app.once('header' + requestId, function(header) {
      let cookies = cookie.parse(header || '')
      resolve(_userId(cookies))
    })
    app.emit('getHeader' + requestId, 'cookie')
  }))
}
