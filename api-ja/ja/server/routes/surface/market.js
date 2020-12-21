const market = require('@controllers/surface/market/market')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('', market.index)
  router.get('/:id(\\d+)', market.show)
  router.get('/:id(\\d+)/chart', market.chart)
  router.get('/:id(\\d+)/comments', market.comments)
  router.post('/:id(\\d+)/comment', market.postComment)
  router.post('/:id(\\d+)/rate', market.postRate)

  server.use('/api/v3/surface/market', router)
}
