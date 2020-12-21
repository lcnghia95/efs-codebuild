const password = require('@@server/controllers/common/password')

module.exports = function (server) {
  let router = server.loopback.Router()

  //account
  router.post('/account/password/reset', password.reset)

  server.use('/api/v3', router)
}
