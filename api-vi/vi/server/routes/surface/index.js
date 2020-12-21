const cache = require('@server/middlewares/cache')
const cart = require('@controllers/surface/cart/cart')
const content = require('@server/controllers/surface/content/content')
const favorite = require('@server/controllers/surface/favorite/favorite')
const portfolio = require('@controllers/surface/portfolio/portfolio')

module.exports = function(server) {
  let router = server.loopback.Router()

  // Cart
  router.get('/cart/count', cart.count)

  // Common routes
  router.get('/campaigns', cache(60), content.show)

  //favorite
  router.post('/favorite/:id(\\d+)', favorite.add)
  router.post('/favorite/:id(\\d+)/remove', favorite.remove)

  // Portfolio
  router.post('/portfolio/:id(\\d+)/select', portfolio.onSelect)
  router.post('/portfolio/:id(\\d+)/remove', portfolio.onRemove)

  server.use('/api/v3/surface', router)
}
