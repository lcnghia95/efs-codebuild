const chart = require('@server/controllers/rate/chart')
const cache = require('@server/middlewares/cache')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('', cache(3), chart.index)

  server.use('/api/v3/rate/chart', router)
}
