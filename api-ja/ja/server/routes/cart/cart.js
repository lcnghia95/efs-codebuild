'use strict'

const cart = require('@controllers/cart/cart')

module.exports = function(server) {
  const router = server.loopback.Router()

  router.get('', cart.index)
  router.post('/add/:pId', cart.add)
  router.post('/edit/:pId', cart.edit)
  router.delete('/remove/salons', cart.removeSalons)
  router.delete('/remove/:pId(\\d+)', cart.remove)
  router.post('/select', cart.select)
  router.post('/confirm', cart.confirm)
  router.post('/checkout', cart.checkout)
  router.post('/rollback', cart.rollback)
  router.post('/complete', cart.complete)
  router.get('/sync', cart.sync)
  router.get('/also-bought', cart.alsoBought)

  server.use('/api/v3/cart', router)
}
