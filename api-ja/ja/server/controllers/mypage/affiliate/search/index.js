const app = require('@server/server')
const service = require('@services/mypage/affiliate/search')

async function index(req, res) {
  const metaInfo = app.utils.meta.meta(req, ['langType', 'userId'])
  res.json(await service.index(req.query, metaInfo))
}

module.exports = {
  index,
}