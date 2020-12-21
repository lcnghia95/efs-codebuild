const app = require('@server/server')
const service = require('@services/mypage/setting/withdrawal')
const meta = app.utils.meta.meta

async function withdrawal(req, res) {
  const response = await service.withdraw(req.body, meta(req, ['userId']))

  if (response.code === 400) {
    return res.sendStatus(400)
  }
  res.end()
}

module.exports = {
  withdrawal,
}
