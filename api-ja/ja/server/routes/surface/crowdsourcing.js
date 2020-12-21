const comment = require('@server/controllers/surface/crowdsourcing/comments')
const bidders = require('@server/controllers/surface/crowdsourcing/bidders')
const crowdsourcing = require('@server/controllers/surface/crowdsourcing/crowdsourcing')
const developer = require('@server/controllers/surface/crowdsourcing/developer')

module.exports = function(server) {
  let router = server.loopback.Router()

  // Comments
  router.get('/comments', comment.index)
  router.post('/comments', comment.store)
  router.put('/comments/:id(\\d+)', comment.update)

  // Bidders
  router.get('/bidders', bidders.index)
  router.post('/bidders', bidders.store)

  // Crowdsourcing
  router.get('', crowdsourcing.index)
  router.get('/:id(\\d+)', crowdsourcing.show)
  router.put('/:id(\\d+)', crowdsourcing.update)
  router.get('/:id(\\d+)/review', crowdsourcing.review)

  // Developer
  router.get('/developers', developer.index)
  router.get('/developers/:id(\\d+)', developer.show)
  router.get('/developers/:id(\\d+)/tab', developer.dataTab)
  router.get('/user', developer.check)

  server.use('/api/v3/surface/crowdsourcing', router)
}
