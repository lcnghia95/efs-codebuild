const app = require('@server/server')
const favoriteService = require('@services/mypage/favorite/favorite')

async function favorite(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await favoriteService.favorite(userId, _language(req)))
}

async function alsoBought(req, res) {
  const userId = _userId(req)
  if (!userId) {
    res.json([])
    return
  }
  res.json(await favoriteService.alsoBought(userId, _language(req)))
}

function _userId(req) {
  const {
    userId,
  } = app.utils.meta.meta(req, ['userId'])
  return userId || 0
}

/**
 * Get curent language
 *
 * @returns {number}
 */
function _language(req) {
  return app.utils.meta.meta(req, ['langType']).langType
}


module.exports = {
  favorite,
  alsoBought,
}
