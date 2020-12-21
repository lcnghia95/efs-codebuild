const app = require('@server/server')

function revokeUser(requestId) {
  let eventKey = 'clearCookie' + requestId

  // Clear auth cookies
  app.emit(eventKey, 'rm_token') // REMEMBER_TOKEN_COOKIE
  app.emit(eventKey, 'uid') // USER_ID_COOKIE
  app.emit(eventKey, 'uname') // USER_NAME_COOKIE
  app.emit(eventKey, 'llt') // BUY_USER_LAST_LOGIN_TIME_COOKIE
  app.emit(eventKey, 'isaff') // IS_AFFILIATE_COOKIE
  app.emit(eventKey, 'corsToken') // CORS_TOKEN_COOKIE
  app.emit(eventKey, 'lgt') // LOGIN_TYPE_COOKIE
  app.emit(eventKey, 'usrinfo') // USER_INFORMATION_COOKIE
}


module.exports = {
  revokeUser,
}
