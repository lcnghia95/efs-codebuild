const languages = require('@@/server/controllers/common/languages')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.post('/change', languages.change)

  server.use('/api/v3/language', router)
}
