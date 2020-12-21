const product = require('@controllers/mypage/developer/product')
const price = require('@controllers/mypage/developer/price')
const article = require('@controllers/mypage/developer/article')
const series = require('@controllers/mypage/developer/series')

const event = require('@controllers/mypage/developer/event')

module.exports = function(server) {
  const router = server.loopback.Router()

  router.put('/products/:id(\\d+)/status/:status(\\d+)', product.updateStatus)
  router.get('/products/:id(\\d+)/price/editable', price.isEditable)
  router.post('/products/:id(\\d+)/log', product.log)
  router.put('/products/:id(\\d+)/margin', product.updateMargin)
  router.get('/products', product.myProducts)

  router.put('/articles/:id(\\d+)/status/:status(\\d+)', article.updateStatus)
  router.get('/navi', article.index)

  router.get('/navi/series-search',series.seriesSearch)
  router.get('/navi/article', article.getArticles)

  router.get('/navi/series', series.getSeries)
  router.get('/navi/article-search', article.getListArticleBySeriesId)

  router.get('/navi/series/:id(\\d+)/edit', series.show )
  router.get('/navi/article/:id(\\d+)/edit', article.show)

  router.get('/navi/series/salesStop/:id(\\d+)', series.salesStop)
  router.get('/navi/article/salesStop/:id(\\d+)', article.salesStop)

  router.put('/navi/article/resell/:id(\\d+)', article.resell)
  router.put('/navi/series/resell/:id(\\d+)', series.resell)

  router.put('/navi/article/:id(\\d+)', article.update)
  router.put('/navi/series/:id(\\d+)', series.update)

  router.post('/navi/article', article.create)
  router.post('/navi/series', series.create)

  router.delete('/navi/article/:id(\\d+)', article.destroy)
  router.delete('/navi/series/:id(\\d+)', series.destroy)

  router.put('/events/:id(\\d+)/status/:status(\\d+)', event.updateStatus)
  router.get('/events', event.index)
  router.post('/events', event.create)
  router.get('/events/:id(\\d+)/edit', event.show)
  router.put('/events/:id(\\d+)', event.update)

  server.use('/api/v3/mypage/developer', router)
}
