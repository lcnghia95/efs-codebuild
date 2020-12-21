'use strict'

const payment = require('@controllers/cart/payment')

module.exports = function(server) {
  const router = server.loopback.Router()

  router.post('/complete/sbps', payment.sbpsComplete)
  router.get('/complete/tele', payment.teleComplete)
  router.post('/complete/tele', payment.teleComplete)
  router.get('/complete/meta/online', payment.metaComplete)
  router.get('/complete/meta/online/cancel', payment.metaCancel)
  router.get('/complete/meta/web', payment.metaWeb)
  router.post('/complete/meta/online', payment.metaComplete)
  router.post('/complete/meta/online/cancel', payment.metaCancel)
  router.post('/complete/meta/web', payment.metaWeb)

  server.use('/api/v3/payment/cart', router)
}
