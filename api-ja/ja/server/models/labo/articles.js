module.exports = function (LaboArticles) {
  LaboArticles.observe('before delete', async function (ctx) {
    await Promise.all([
      ctx.Model.app.models.Answers.destroyAll({
        articleId: ctx.where.id
      }),
      ctx.Model.app.models.Likes.destroyAll({
        articleId: ctx.where.id
      }),
      ctx.Model.app.models.Bookmarks.destroyAll({
        articleId: ctx.where.id
      }),
      ctx.Model.app.models.ArticleNotification.destroyAll({
        articleId: ctx.where.id
      }),
    ])
  })
}