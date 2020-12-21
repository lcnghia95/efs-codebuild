const search= require('@server/controllers/blog/search')
const album = require('@server/controllers/blog/album')
const file = require('@server/controllers/blog/file')
const blog = require('@server/controllers/blog/blog')
const setting = require('@server/controllers/blog/setting')
const rank = require('@server/controllers/blog/rank')
const bat = require('@server/controllers/blog/bat')
const post = require('@server/controllers/blog/post')
const comment = require('@server/controllers/blog/comment')
const report = require('@server/controllers/blog/report')
const tag = require('@server/controllers/blog/tag')
const auth = require('@server/middlewares/auth')

module.exports = function(server) {
  const router = server.loopback.Router()

  // Routes /search
  router.get('/search/suggest', search.suggestForSearch)

  // Routes /album
  router.get('/album', album.index)
  router.get('/album/selected', album.selectedImages)
  router.post('/album', album.upload)
  router.post('/album/selected', album.changeSelectStatus)
  router.delete('/album/:id(\\d+)', album.destroy)

  // Route /file
  router.get('/file', file.index)
  router.post('/file', file.upload)

  // Route /report
  router.get('/report', report.periodReport)

  // Routes /ranking
  router.get('/ranking', rank.ranking) // Surface
  router.get('/ranking/new', rank.rankingRecentBlog) // Surface
  router.get('/ranking/:id(\\d+)/total', rank.rankingTotalById) // Mypage
  router.get('/ranking/:id(\\d+)/category', rank.rankingCategoryById) // Mypage
  router.get('/ranking/article/recommend', rank.rankingRecommendArticles) // Surface
  router.get('/ranking/article/new', rank.rankingRecentArticles) // Surface
  router.get('/ranking/article', rank.rankingArticle) // surface

  // Routes /edit
  router.get('/edit', blog.getBlogEditIndex)
  router.put('/edit/:id(\\d+)', blog.update)

  // Post routes
  router.get('/post', post.index)
  router.get('/post/:id(\\d+)', post.showEdit) // Get post for mypage (edit)
  router.get('/post/:id(\\d+)/comment', comment.surfaceComment)
  router.get('/post/tag/:tagName', post.searchByTag)
  router.get('/post/:slug', post.show) // Get post for surface
  router.post('/post', post.store)
  router.post('/post/:id(\\d+)/duplicate', post.duplicate)
  router.post('/post/:id(\\d+)/comment', comment.storeComment)
  router.put('/post/:id', post.update)
  router.delete('/post/:id(\\d+)', post.destroy)
  // router.delete('/post/comment/:commentId(\\d+)', comment.destroyCommunity)

  // Comment routes
  router.get('/:id(\\d+)/comments', comment.mypageComment)
  router.post('/comment/block/:id(\\d+)', comment.blockUser)
  router.delete('/comment/block/:id(\\d+)', comment.unblockUser)
  router.post('/comment/:id(\\d+)/hide', comment.hideComment)
  router.post('/reply/:id(\\d+)/hide', comment.hideReply)
  router.delete('/comment/:id(\\d+)', comment.removeComment)

  // Routes for tags service
  router.get('/tags', tag.searchTags)

  // Routes for bat server (run schedule) - We do not using it (use batch v2 instead)
  router.post('/bat/ranking', auth, bat.ranking)
  router.post('/bat/accessCount', auth, bat.countPostAccess)
  router.post('/bat/access-count-daily', auth, bat.countPostAccessDaily)
  router.post('/bat/access-count-weekly', auth, bat.countPostAccessWeekly)
  router.post('/bat/access-count-monthly', auth, bat.countPostAccessMonthly)

  // Blog routes
  router.get('/', blog.index)
  router.get('/list', blog.blogList)
  router.get('/:id(\\d+)/tags', tag.searchTagsByBlog)
  router.get('/:slug', blog.show)
  router.get('/:slug/post', post.surfaceIndex)
  router.get('/:slug/post/tag/:tagName', tag.searchPostsByTagName)
  router.get('/:slug/user', blog.user)
  router.get('/:slug/calendar', blog.calendar)
  router.get('/:slug/monthlyArchive', blog.monthlyArchive)
  router.get('/:slug/lastArticles', blog.lastArticles)
  router.get('/:slug/settings', setting.settings)
  router.post('/:slug/settings', setting.storeSettings)
  router.post('/', blog.store)
  router.post('/validate', blog.validate)
  router.delete('/:id(\\d+)', blog.destroy)
  router.delete('/:id(\\d+)/tags/:tagId(\\d+)', tag.removeTag)

  server.use('/api/v3/blog', router)
}
