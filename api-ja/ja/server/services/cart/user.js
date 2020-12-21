const userAuthService = require('@services/auth/member')
const registerAuthService = require('@services/auth/register')
const nonMemberAuthService = require('@services/auth/nonMember')


async function push(userId, userData, salesSessionId, ipAddress, userAgent) {
  let userType = userData.type || 1

  // Register
  if (userType == 1) {
    if (userId == 0) {
      let {
        user
      } = await registerAuthService.register(
        userData.nickName,
        userData.mailAddress,
        userData.password,
        ipAddress,
        userAgent
      )
      userId = (user || {}).id || 0
    }
    if (userData) {
      await userAuthService.updateAddressInformation(userId, userData)
    }
  } else if (userType == 2) {
    let nonMember = await nonMemberAuthService.add(
      userData,
      salesSessionId,
      ipAddress,
      userAgent
    )
    userId = nonMember.id
  } else {
    return 0
  }
  return userId
}

module.exports = {
  push,
}
