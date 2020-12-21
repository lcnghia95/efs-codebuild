const top = require('@server/controllers/surface/top/top')
const cache = require('@server/middlewares/cache')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('/top', cache(60), top.top)

  server.use('/api/v3/surface', router)
}
