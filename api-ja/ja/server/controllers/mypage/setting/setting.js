const app = require('@server/server')
const userService = require('@services/mypage/setting/user')
const metaUtil = app.utils.meta

async function user(req, res) {
  res.json(await userService.show(_userId(req)))
}

async function information(req, res) {
  let {
    userId,
    loginType,
    information,
  } = metaUtil.meta(req, ['userId', 'loginType', 'information'])
  if (userId == 0) {
    res.json({})
  } else if (!information.id || information.id != userId) {
    information = await userService.information(userId, loginType)
    metaUtil.saveUserInformation(res, information)
    res.json(information)
  } else {
    information.loginType = loginType
    res.json(information)
  }
}

/**
 * Get login user id
 *
 * @returns {number}
 */
function _userId(req) {
  const {
    userId,
  } = metaUtil.meta(req, ['userId'])
  return userId || 0
}

module.exports = {
  user,
  information,
}
