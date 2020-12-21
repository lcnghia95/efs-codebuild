const app = require('@server/server')
const errors = require('./errors')
const syncService = require('../common/synchronize')

const userModel = app.models.Users
const userLoginModel = app.models.UserLogin

/**
 * Check if mail address existed in system or not
 *
 * @param {string} mailAddress
 * @returns {Boolean}
 * @private
 */
async function _existed(mailAddress) {
  let condition = {
      isValid: 1,
      mailAddress,
    },
    [user, userLogin] = await Promise.all([
      userModel.count(condition),
      userLoginModel.count(condition)
    ])
  return user > 0 || userLogin > 0
}

/**
 * Register new user
 *
 * @param {string} nickName
 * @param {string} mailAddress
 * @param {string} password
 * @param {string} ipAddress
 * @param {string} userAgent
 * @returns {Object}
 * @public
 */
async function register(
  nickName,
  mailAddress,
  password,
  ipAddress,
  userAgent
) {
  let existed = await _existed(mailAddress)

  if (mailAddress == '' || password == '') {
    return errors.authError001
  }

  if (existed) {
    return errors.authError002
  }

  let user = {};
  [user, password] = await Promise.all([
    userModel.create({
      isValid: 1,
      statusType: 1,
      isBuyuser: 1,
      isDelivery: 0,
      nickName,
      mailAddress,
      ipAddress,
      userAgent,
    }),
    app.utils.encrypt.hashPassword(password),
  ])
  syncService.syncDataToFxon('users', user.id)

  let userLogin = await userLoginModel.create({
    isValid: 1,
    statusType: 1,
    userId: user.id,
    loginType: 1,
    mailAddress,
    password,
    ipAddress,
    userAgent,
  })
  syncService.syncDataToFxon('user_login', userLogin.id)

  return {
    user,
    userLogin
  }
}

module.exports = {
  register,
}
