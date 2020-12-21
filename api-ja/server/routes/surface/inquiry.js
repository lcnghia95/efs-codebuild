const inquiry = require('@@server/controllers/surface/inquiry/inquiry')

module.exports = function(server) {
  let router = server.loopback.Router()
  router.post('/inquiry',inquiry.sendInquiry)

  server.use('/api/v3/surface', router)
}
