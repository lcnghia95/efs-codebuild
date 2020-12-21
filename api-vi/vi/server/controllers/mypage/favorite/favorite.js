const app = require('@server/server')
const favoriteService = require('@services/mypage/favorite/favorite')

async function favorite(req, res) {
  let userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await favoriteService.favorite(userId))
}

function _userId(req) {
  let {
    userId
  } = app.utils.meta.meta(req, ['userId'])
  return userId || 0
}

module.exports = {
  favorite,
}
