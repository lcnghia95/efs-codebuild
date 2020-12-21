const model = require('@server/utils/model')

module.exports = function (Comments) {
  Comments.observe('before delete', async function (ctx) {
    await model.destroyAll(ctx.Model.app.models.Replies, 'commentId', ctx.where.id)
  })
}
