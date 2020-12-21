const banner = require('@@/server/controllers/surface/ads/banner')
const slider = require('@@/server/controllers/surface/ads/slider')
const ads = require('@@/server/controllers/surface/ads/ads')

module.exports = function(server) {
  let router = server.loopback.Router()

  // Banner
  router.get('/banner/top', banner.top)
  router.get('/banner', banner.index)

  // Slider
  router.get('/sliders', slider.index)
  // TODO post service_path for top_sliders 4 & 6
  router.put('/sliders', slider.updateServicePath)

  // Ads
  router.get('/ads', ads.index)

  // Get full data banner top, sliders & ads
  router.post('/advertisement', banner.advertisement)


  server.use('/api/v3/surface', router)
}
