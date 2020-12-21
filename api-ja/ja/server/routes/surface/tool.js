const cache = require('@server/middlewares/cache')
const tool = require('@server/controllers/surface/tool/tool')

module.exports = function(server) {
  const router = server.loopback.Router()

  router.get('/*', cache(60))
  router.get('/', tool.index)

  router.get('/:id(\\d+)', tool.show)
  router.post('/:id(\\d+)', tool.postShow)
  router.get('/:id(\\d+)/related', tool.subAndRankProduct)
  router.get('/:id(\\d+)/sub', tool.subProduct)

  router.get('/recommend', tool.recommend)
  router.get('/popular/price', tool.popularPrice)
  router.get('/popular/count', tool.popularCount)
  router.get('/popular/free', tool.popularFree)
  router.get('/new', tool.newProduct)
  router.get('/recent', tool.recent)
  router.get('/review', tool.review)
  router.get('/search/all', tool.searchAll)
  router.get('/slider', tool.slider)
  router.get('/:id(\\d+)/also/buy', tool.showAlsoBoughtProducts)
  // Get video urls
  router.get('/:id(\\d+)/video', tool.getVideos)

  router.get('/:id(\\d+)/realtrade/widgets', tool.realtradeWidgets)

  // Get related data for detail page
  router.get('/:id(\\d+)/related/articles', tool.relatedProductArticles)

  router.get('/search/keywords', tool.searchKeywords)

  server.use('/api/v3/surface/tools', router)
}
