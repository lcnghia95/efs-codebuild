const performance = require('@server/controllers/spread/performance')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('', performance.index)

  server.use('/api/v3/spread/performance', router)
}
