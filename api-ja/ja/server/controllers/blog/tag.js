const app = require('@server/server')
const service = require('@server/services/blog/tag')

async function searchTags(req, res) {
  try {
    res.json(await service.searchTags(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function searchTagsByBlog(req, res) {
  try {
    res.json(await service.searchTagsByBlog(
      req.params.id,
      req.query
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function searchPostsByTagName(req, res) {
  try {
    res.json(await service.searchPostsByTagName(
      req.params.slug,
      req.params.tagName,
      req.query
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function removeTag(req, res) {
  try {
    res.json(await service.removeTag(
      req.params.id,
      req.params.tagId,
      app.utils.meta.meta(req, ['userId'])
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  searchTags,
  searchTagsByBlog,
  searchPostsByTagName,
  removeTag,
}
