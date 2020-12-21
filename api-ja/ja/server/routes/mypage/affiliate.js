const search = require('@controllers/mypage/affiliate/search')

module.exports = function(server) {
  const router = server.loopback.Router()

  router.get('/search', search.index)

  server.use('/api/v3/mypage/affiliate', router)
}
