const cache = require('@server/middlewares/cache')
const review = require('@controllers/surface/review/review')
const newReview = require('@controllers/surface/review/newReview')

module.exports = function(server) {
  let router = server.loopback.Router()

  // Review
  router.get('/popular/new', cache(90), review.newReview)
  router.get('/popular/reviewer', cache(90), review.reviewer)
  router.get('/popularer', cache(90), review.reviewer)
  router.get('/systemtrade', cache(90), review.systemtrade)
  router.get('/ebook', cache(90), review.ebook)
  router.get('/salon', cache(90), review.salon)
  router.get('/ranking/ea', cache(90), review.topEA)
  router.get('/ranking/ebook', cache(90), review.topEbook)
  router.get('/product/:id(\\d+)', cache(90, { separateQuery: true }),
    review.index)
  // TODO: add cache mechanism later
  router.get('/product/:id(\\d+)/info', review.show)
  router.get('/list', cache(90), review.listReview)
  router.get('/myreview', review.myReviewIndex)
  router.get('/myreview/:id(\\d+)', review.myReviewDetail)
  router.post('/myreview/:id(\\d+)', review.myReviewUpdate)

  // New period review
  router.get('/popular', cache(90), newReview.popular)
  router.get('/highscore/:type(systemtrade|kabu|tools|navi|salons|emagazine|others)?/:month(12|all)?', cache(90), newReview.highScore)
  router.get('/highpost/:type(systemtrade|kabu|tools|navi|salons|emagazine|others)?/:month(3|12|all)', cache(90), newReview.highPost)

  //Detail page (new)

  //List A
  router.get('/popular/detail', cache(90), newReview.popularDetail)
  router.get('/new/detail', cache(90), newReview.newPopularDetail)

  // Get full data without type
  router.get('/highpost/detail', cache(90), newReview.fullhighPost)
  router.get('/highscore/detail', cache(90), newReview.fullhighScore)

  // Input page
  router.get('/:id(\\d+)/also-bought', cache(300), newReview.alsoBought)
  router.get('/:id(\\d+)/recommend', cache(300), newReview.recommend)

  server.use('/api/v3/surface/review', router)
}
