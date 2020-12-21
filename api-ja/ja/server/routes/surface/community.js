const community = require('@controllers/surface/community/community')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('', community.index)
  router.post('', community.store)
  router.put('/:id(\\d+)/action', community.action)
  router.delete('/:id(\\d+)', community.destroy)
  router.get('/:id(\\d+)/lastest', community.lastest)
  router.get('/lastest', (req, res) => {
    res.json([])
  })

  server.use('/api/v3/surface/communities', router)
}
