const top = require('@server/controllers/surface/top/top')
const cache = require('@server/middlewares/cache')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('/sliders', cache(60), top.sliders)
  router.get('/charts', cache(60), top.charts)
  router.get('/world/market/news', cache(60), top.news)
  router.get('/contents', cache(60), top.contents)
  router.get('/products', cache(60), top.products)
  router.get('/charts/scatter', top.scatter)
  router.get('/rankingActive', top.rankingActive)

  server.use('/api/v3/surface/top', router)
}
