const app = require('@server/server')
const service = require('@services/mypage/download/download')

async function index(req, res) {
  const meta = _meta(req)
  if (!meta.userId) {
    res.json({})
    return
  }
  res.json(await service.index(meta.userId, meta.langType || 1))
}

/**
 * Get login user id
 *
 * @returns {number}
 */
function _meta(req) {
  return app.utils.meta.meta(req, ['userId', 'langType'])
}

module.exports = {
  index,
}
