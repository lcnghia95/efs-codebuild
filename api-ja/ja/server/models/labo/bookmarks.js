/*
module.exports = function (Bookmarks) {
  Bookmarks.observe('before delete', async function (ctx) {
    let bookmarkedObject,
      affectedObject = ctx.Model.app.models.Bookmarks.findOne({
        where: {
          id: ctx.where.id
        },
      })
    // TODO: optimize get affectedObject
    if (affectedObject.type == 0) { // article
      bookmarkedObject = await ctx.Model.app.models.LaboArticles.findOne({
        where: {
          id: affectedObject.articleId
        },
      })
    } else { // answer
      bookmarkedObject = await ctx.Model.app.models.Answers.findOne({
        where: {
          id: affectedObject.answerId
        },
      })
    }

    if (bookmarkedObject) {
      bookmarkedObject.bookmarkCount--
      bookmarkedObject.save()
    }
  })
}
*/