/*
module.exports = function (Likes) {
  Likes.observe('before delete', async function (ctx) {
    let LikedObject,
      affectedObject = ctx.Model.app.models.Likes.findOne({
        where: {
          id: ctx.where.id,
        },
      })
    // TODO: optimize get affectedObject
    if (type == 0) { // article
      LikedObject = await ctx.Model.app.models.LaboArticles.findOne({
        where: {
          id: affectedObject.articleId,
        },
      })
    } else { // answer
      LikedObject = await ctx.Model.app.models.Answers.findOne({
        where: {
          id: affectedObject.answerId,
        },
      })
    }

    if (LikedObject) {
      LikedObject.bookmarkCount--
      LikedObject.save()
    }
  })
}
*/