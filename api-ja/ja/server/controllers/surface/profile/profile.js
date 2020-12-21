const app = require('@server/server')
const productServices = require('@services/surface/profile/products')
const profileService = require('@services/surface/profile/profile')
const gogoBlogService = require('@services/surface/profile/gogoBlog')
const fxonBlogService = require('@services/surface/profile/fxonBlog')
const realtradeService = require('@services/surface/realtrade')
async function show(req, res) {
  let userId = _userId(req)
  res.json(await profileService.show(req.params.id, userId))
}

async function review(req, res) {
  res.json(await profileService.review(req.params.id))
}

async function products(req, res) {
  res.json(await productServices.list(req.params.id))
}

async function follow(req, res) {
  let userId = _userId(req)
  res.json(await profileService.follow(req.params.id, userId))
}

async function unFollow(req, res) {
  let userId = _userId(req)
  res.json(await profileService.unFollow(req.params.id, userId))
}

async function follows(req, res) {
  res.json(await profileService.follows(req.params.id, req.query))
}

async function followers(req, res) {
  res.json(await profileService.followers(req.params.id, req.query))
}

async function realtrade(req, res) {
  res.json(await realtradeService.getRealTradeAccount(req.params.id, req.query))
}

async function blog(req, res) {
  let input = req.query,
    type = parseInt(input.type),
    [gogoArticles, fxonArticles] = await Promise.all([
      gogoBlogService.gogoBlog(req.params.id, input, type),
      fxonBlogService.fxonBlog(req.params.id, input),
    ]),
    data = gogoArticles.concat(fxonArticles)

  // If type == 1, response data will include rss articles
  // so we must sort combined response data by publishedDate
  if (type) {
    data.sort((a, b) => {
      return b.publishedDate - a.publishedDate
    })
  }
  res.json(data)
}

/**
 * Get login user id
 *
 * @returns {number}
 */
function _userId(req) {
  let {
    userId,
  } = app.utils.meta.meta(req, ['userId'])
  return userId || 0
}

module.exports = {
  show,
  review,
  products,
  follows,
  followers,
  unFollow,
  follow,
  blog,
  realtrade,
}
