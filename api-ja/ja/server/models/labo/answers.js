module.exports = function (Answers) {
  Answers.observe('before delete', async function (ctx) {
    // TODO: check if best answer, remove best answer
    await Promise.all([
      ctx.Model.app.models.Likes.destroyAll({
        answerId: ctx.where.id
      }),
      ctx.Model.app.models.Bookmarks.destroyAll({
        answerId: ctx.where.id
      }),
    ])
  })
}