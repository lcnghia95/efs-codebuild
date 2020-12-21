const inquiry = require('@server/controllers/surface/inquiry/inquiry')
const cache = require('@server/middlewares/cache')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('/usb/:pId(\\d+)/:devId(\\d+)', cache(90), inquiry.usb)
  router.get('/usa/:pId(\\d+)', cache(90), inquiry.usa)
  router.get('/usl', inquiry.usl)
  router.get('/ust/:id(\\d+)', cache(90), inquiry.ust)

  server.use('/api/v3/surface/inquiry', router)
}
