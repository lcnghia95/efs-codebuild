const app = require('@server/server')

// Models
const userLoginModel = app.models.UserLogin
const PHPUnserialize = require('php-unserialize')

// Utils
const cryptoUtil = require('@@server/utils/crypto')
const encryptUtil = require('@@server/utils/encrypt')

const REMEMBER_TOKEN_LENGTH = 60

/**
 * reset user password
 * @param {string} userEmail
 * @param {string} token
 * @param {string} password
 * return empty
 */
async function reset(userEmail, token, password) {
  const loginId = await _getLoginId(userEmail, token)

  if (!loginId) {
    // Error: invalid token
    return { error: 'ERR000002' }
  }

  _updatePassword(loginId, password)
  // no return, if has any return value client will consider it as error
}

/**
 * get loginId from token
 * @param {string} userEmail
 * @param {string} token
 * return number
 */
async function _getLoginId(userEmail, token) {
  const { email,
    expiry,
    id } = _decode(token)

  if (userEmail != email || !expiry || !id) {
    return 0
  }

  if (expiry * 1000 < Date.now()) {
    return 0
  }

  const userLogin = await userLoginModel.findOne({
    where: {
      id,
    },
    fields: {
      id: true,
    },
  }) || {}

  return userLogin.id || 0
}

/**
 * update new password
 * @param {number} loginId
 * @param {string} password
 * return object
 */
async function _updatePassword(loginId, password) {
  const enPassword = encryptUtil.hashPassword(password)

  return await userLoginModel.updateAll({
    id: loginId,
  }, {
    password: enPassword,
    rememberToken: _randomString(REMEMBER_TOKEN_LENGTH),
  })
}

/**
 * decode token
 * @param {string} token
 * return object
 */
function _decode(token) {
  const data = cryptoUtil.simpleDecode(token)

  return PHPUnserialize.unserialize(data)

}

/**
 * generate random string
 * @param {string} len
 * return string
 */
function _randomString(len) {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return [...Array(len)].reduce(str => str + pool[~~(Math.random() * pool.length)], '')
}

module.exports = {
  reset,
}
