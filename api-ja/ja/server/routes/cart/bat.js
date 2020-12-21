const bat = require('@controllers/cart/bat')

module.exports = function(server) {
  let router = server.loopback.Router()

  //recharge sale
  router.post('/sale/recharge', bat.rechargeSale)
  router.post('/sale/update/freefirstmonth', bat.updateFreeFirstMonth)

  server.use('/api/v3/bat', router)
}
