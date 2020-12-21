const articles = require('@server/controllers/labo/articles')
const answers = require('@server/controllers/labo/answers')
const categories = require('@server/controllers/labo/categories')
const social = require('@server/controllers/labo/socials')
const notifications = require('@server/controllers/labo/notifications')
const refArticles = require('@server/controllers/labo/refArticles')
const refComments = require('@server/controllers/labo/refComments')
const refCategories = require('@server/controllers/labo/refCategories')

module.exports = function(server) {
  const router = server.loopback.Router()

  // article's routes
  router.get('/articles/cat/:id(\\d+)', articles.listByCategory)
  router.get('/articles/top', articles.listTopArticle)
  router.get('/articles/subcates', articles.listBySubCategories)
  router.get('/articles/subcate/:category(\\d+)/:id(\\d+)', articles.listBySubCategory)
  router.get('/articles/:id(\\d+)', articles.getDetail)
  router.get('/articles/:id(\\d+)/related', articles.getRelatedArticles)
  router.post('/articles/addview', articles.increaseView)
  router.get('/articles/search', articles.search)
  router.get('/articles/search', articles.search)
  router.post('/articles', articles.store)
  router.patch('/articles/:id', articles.edit)
  router.get('/articles/:articleId(\\d+)/best/:answerId(\\d+)', articles.setBestAnswer)

  // answer's routes
  router.get('/articles/:id(\\d+)/answers', answers.getByArticle)
  router.post('/answers', answers.store)
  router.patch('/answers/:id(\\d+)', answers.edit)

  // categories routes
  router.get('/cat', categories.listCategories)
  router.get('/cat/waitlist', categories.getWaitList) // admin only
  router.get('/cat/:id(\\d+)/subcates', categories.listSubCategories)
  router.post('/cat', categories.newCategory)
  router.patch('/cat/:id(\\d+)', categories.updateCategory)
  router.post('/subcat', categories.newSubCategory)
  router.patch('/subcat/:id(\\d+)', categories.updateSubCategory)
  router.get('/subcat/waitlist', categories.getSubWaitList) // admin only

  // routes for social actions: bookmarks, like
  router.post('/article/:id(\\d+)/bookmark', social.bookmarkArticle)
  router.get('/article/:id(\\d+)/bookmark/count', social.countArticleBookmarks)
  router.post('/answer/:id(\\d+)/bookmark', social.bookmarkAnswer)
  router.get('/answer/:id(\\d+)/bookmark/count', social.countAnswerBookmarks)
  router.delete('/bookmark/:id(\\d+)', social.removeBookmark)
  router.get('/bookmarks', social.getBookmarks)
  router.post('/article/:id(\\d+)/like', social.likeArticle)
  router.get('/article/:id(\\d+)/like/count', social.countArticleLikes)
  router.post('/answer/:id(\\d+)/like', social.likeAnswer)
  router.get('/answer/:id(\\d+)/like/count', social.countAnswerLikes)
  router.delete('/like/:id(\\d+)', social.removeLike)

  router.post('/bookmark/position', social.saveBookmarkList)
  router.put('/bookmark/position', social.saveBookmarkList)


  // routes for notifications
  router.post('/notif/view', notifications.markViewed)
  router.get('/notif', notifications.getNotifications)
  router.get('/notif/new', notifications.countNewNotifications)
  router.post('/notif/system', notifications.storeSystemNotif)

  // ------------------------------
  // REFERENCES
  // ------------------------------
  // reference article:
  router.get('/refs/categories', refArticles.getCategories)
  router.get('/refs/articles/latest', refArticles.listLatest)
  router.get('/refs/articles/cat/:id(\\d+)', refArticles.listByCategory)
  router.get('/refs/articles/subject/:id(\\d+)', refArticles.listBySubject)
  router.get('/refs/articles/:category(\\d+)/:subject(\\d+)/:id(\\d+)', refArticles.getDetail)
  // router.get('/refs/articles/:id(\\d+)/related', refArticles.getRelatedArticles)
  router.post('/refs/articles/addview', refArticles.increaseView)
  router.get('/refs/articles/search/', refArticles.search)
  // router.get('/refs/articles/search/', refArticles.search)
  router.post('/refs/articles', refArticles.store)
  router.patch('/refs/articles/:id', refArticles.edit)

  // reference comment:
  router.get('/refs/articles/:id(\\d+)/comments', refComments.getByArticle)
  router.post('/refs/comments', refComments.store)
  router.patch('/refs/comments/:id(\\d+)', refComments.edit)

  // reference categories and subjects:
  router.get('/refs/cates/:id(\\d+)/subjects', refCategories.listSubjects)
  router.get('/refs/cates', refCategories.listRefCategories)
  router.get('/refs/subject/:category(\\d+)/:id(\\d+)', refCategories.refSubjectInfo)

  // bookmark references:
  router.post('/refs/article/:id(\\d+)/bookmark', social.bookmarkRefArticle)
  router.get('/refs/article/:id(\\d+)/bookmark/count', social.countRefArticleBookmarks)
  router.post('/refs/comment/:id(\\d+)/bookmark', social.bookmarkRefComment)
  router.get('/refs/comment/:id(\\d+)/bookmark/count', social.countRefCommentBookmarks)

  // like references:
  router.post('/refs/article/:id(\\d+)/like', social.likeRefArticle)
  router.get('/refs/article/:id(\\d+)/like/count', social.countRefArticleLikes)
  router.post('/refs/comment/:id(\\d+)/like', social.likeRefComment)
  router.get('/refs/comment/:id(\\d+)/like/count', social.countRefCommentLikes)

  server.use('/api/v3/labo', router)
}
