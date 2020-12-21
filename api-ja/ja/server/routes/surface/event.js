const cache = require('@server/middlewares/cache')
const event = require('@controllers/surface/event/event')

module.exports = function(server) {
  let router = server.loopback.Router()

  // Review
  router.get('/:id(\\d+)', cache(90), event.show)
  router.get('/counts', cache(90), event.counts)
  router.get('', cache(90), event.index)

  server.use('/api/v3/surface/event', router)
}
