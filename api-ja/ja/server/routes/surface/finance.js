const cache = require('@server/middlewares/cache')
const navi = require('@controllers/surface/finance/navi/navi')
const series = require('@controllers/surface/finance/navi/series')
const author = require('@controllers/surface/finance/navi/author')
const salon = require('@controllers/surface/finance/salon/salon')
const ggjtv = require('@controllers/surface/finance/ggjtv/ggjtv')
const mailmagazine = require('@controllers/surface/finance/mailmagazine/mailmagazine')
const magazineSalon = require('@controllers/surface/finance/mailmagazine/salon')


module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('/navi/pr', navi.pr)
  router.get('/navi/rank/new', cache(90), navi.newArticles)
  router.get('/navi/rank/article', cache(90), navi.articleRanking)
  router.get('/navi/rank/series', cache(90), navi.seriesRanking)
  router.get('/navi/series', cache(90), series.index)
  router.get('/navi/authors', cache(90), author.index)
  router.get('/navi/:id(\\d+)', navi.articleDetail)
  router.post('/navi/:id(\\d+)', navi.articleDetail)
  router.get('/navi/:id(\\d+)/sameSeries', cache(90), navi.sameSeries)
  router.get('/navi/:id(\\d+)/sameSeriesEx', cache(90), navi.sameSeriesEx)
  router.get('/navi/:id(\\d+)/relatedArticle', cache(90), navi.related)
  router.get('/navi/series/:id(\\d+)', cache(90), series.show)
  router.post('/navi/series/:id(\\d+)', series.show)
  router.get('/navi/authors/:id(\\d+)', cache(90), author.show)
  router.get('/navi/purchased', navi.purchased)
  router.get('/navi/readlater', navi.readLater)
  router.get('/navi/favorite', navi.favorite)
  router.get('/navi/:id(\\d+)/:sid(\\d+)/also-bought', cache(300), navi.alsoBought)

  router.get('/navi/search/article', cache(90), navi.searchArticle)
  router.get('/navi/search/article/top', cache(90), navi.searchArticleList)
  router.get('/navi/search/series', cache(90), navi.searchSeries)
  router.get('/navi/search/series/top', cache(90), navi.searchSeriesList)
  router.get('/navi/search/author', cache(90), navi.searchAuthor)
  router.get('/navi/category', navi.getNaviCategory)

  router.post('/navi/readlater/article', navi.postReadLaterArticle)
  router.post('/navi/favorite/series', navi.postFavoriteSeries)
  router.post('/navi/favorite/article', navi.postFavoriteArticle)

  router.get('/navi/like', navi.getListLikeNavi)
  router.get('/navi/series/:seriesId(\\d+)/like', navi.getLikeSeries)
  router.get('/navi/article/:articleId(\\d+)/like', navi.getLikeArticle)
  router.post('/navi/series/:seriesId(\\d+)/like', navi.postLikeSeries)
  router.post('/navi/article/:articleId(\\d+)/like', navi.postLikeArticle)

  router.get('/navi/top/new', cache(90), navi.newNavi)


  // salons
  router.get('/salons', cache(300), salon.index)
  router.get('/salons/:id(\\d+)', salon.show)
  router.get('/salons/:id(\\d+)/sample', cache(300), salon.sample)
  router.get('/salons/:id(\\d+)/threads', cache(300), salon.threads)
  router.get('/salons/:id(\\d+)/reviews', cache(300), salon.reviews)
  router.get('/salons/:id(\\d+)/related', cache(300), salon.related)
  router.get('/salons/finance/sliders', cache(300), salon.financeSliders)
  router.get('/salons/:id(\\d+)/related/articles', cache(300), salon.getRelatedArticles)
  router.get('/salons/:id(\\d+)/also-bought', cache(300), salon.alsoBought)


  //mailmagazine
  router.get('/mailmagazine', mailmagazine.index)
  router.get('/mailmagazine/:id(\\d+)', mailmagazine.show)
  router.get('/mailmagazine/salon/:salonId(\\d+)', magazineSalon.show)
  router.get('/mailmagazine/salon/:salonId(\\d+)/threads', magazineSalon.threads)
  router.get('/mailmagazine/salon/:salonId(\\d+)/reviews', magazineSalon.reviews)
  router.get('/mailmagazine/salon/:salonId(\\d+)/sample', magazineSalon.sample)
  router.get('/mailmagazine/salon/:salonId(\\d+)/related', magazineSalon.related)

  //GGJTV
  router.get('/ggjtv', ggjtv.index)
  router.get('/ggjtv/new', cache(300), ggjtv.newGGJTV)
  router.get('/ggjtv/premier', cache(90), ggjtv.premier)
  router.get('/ggjtv/free', cache(90), ggjtv.free)
  router.get('/ggjtv/purchased', ggjtv.purchased)
  router.get('/ggjtv/popular', cache(90), ggjtv.popular)
  router.get('/ggjtv/search', cache(90), ggjtv.search)
  router.get('/ggjtv/total', cache(90), ggjtv.total)
  router.get('/ggjtv/:id(\\d+)', ggjtv.show)
  router.get('/ggjtv/:id(\\d+)/others', cache(90), ggjtv.others)
  router.get('/ggjtv/:id(\\d+)/recommend', cache(90), ggjtv.recommend)
  router.get('/ggjtv/:id(\\d+)/related', ggjtv.related)

  server.use('/api/v3/surface', router)
}
