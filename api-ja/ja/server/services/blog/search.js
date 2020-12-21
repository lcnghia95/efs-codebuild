const app = require('@server/server')
const postModel = app.models.Posts

/**
 *
 *
 * @param input
 * @return {Promise<*>}
 */
async function suggestForSearch(input) {
  if (!input.keyword) {
    return []
  }

  let posts = await postModel.find({
    where: {
      title: {like: `%${input.keyword}%`}
    },
    limit: 5,
    order: 'accessCount DESC',
    fields: { title: true }
  })

  return posts.map(post => post.title)
}

module.exports = {
  suggestForSearch,
}
