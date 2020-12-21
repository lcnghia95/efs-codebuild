const app = require('@server/server')
const serialService = require('@services/mypage/serial/serial')


async function index(req, res) {
  try {
    res.json(await serialService.index(
      req.query,
      app.utils.meta.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  index,
}
