const model = require('@server/utils/model')

module.exports = function (Blogs) {
  Blogs.observe('before delete', async function (ctx) {
    await Promise.all([
      model.destroyAll(ctx.Model.app.models.Posts, 'blogId', ctx.where.id),
      model.destroyAll(ctx.Model.app.models.BlogRanking, 'blogId', ctx.where.id),
      model.destroyAll(ctx.Model.app.models.StyleBackgroundHeader, 'blogId', ctx.where.id),
      model.destroyAll(ctx.Model.app.models.StyleBackgroundFooter, 'blogId', ctx.where.id),
      model.destroyAll(ctx.Model.app.models.StyleHeaderText, 'blogId', ctx.where.id),
      model.destroyAll(ctx.Model.app.models.StyleLayout, 'blogId', ctx.where.id),
    ])
  })
}
