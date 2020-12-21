const model = require('@server/utils/model')

module.exports = function (Posts) {
  Posts.observe('before delete', async function (ctx) {
    await Promise.all([
      model.destroyAll(ctx.Model.app.models.Comments, 'postId', ctx.where.id),
      model.destroyAll(ctx.Model.app.models.PostAccess, 'postId', ctx.where.id),
      model.destroyAll(ctx.Model.app.models.PostTags, 'postId', ctx.where.id),
    ])
  })
}
