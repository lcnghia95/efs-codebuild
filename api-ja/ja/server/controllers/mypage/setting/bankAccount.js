const app = require('@server/server')
const service = require('@services/mypage/setting/bankAccount')
const meta = app.utils.meta.meta

async function index(req, res) {
  try {
    res.json(await service.index(req.query, meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function update(req, res) {
  try {
    res.json(await service.update(req.params.id, req.body, meta(req, ['userId', 'ipAddress', 'userAgent'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  index,
  update,
}
