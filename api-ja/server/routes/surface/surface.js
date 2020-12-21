const cache = require('@@server/middlewares/cache')
const information = require('@@controllers/surface/information/information')

module.exports = function(server) {
  let router = server.loopback.Router()

  // Info routes
  router.get('/info', cache(60), information.index)
  router.get('/info/:id(\\d+)', cache(60), information.show)

  server.use('/api/v3/surface', router)
}
