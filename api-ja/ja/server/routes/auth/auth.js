'use strict'

const auth = require('@controllers/auth/auth')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.post('/auth/validate/email', auth.validateEmail)

  server.use('/api/v3', router)
}
