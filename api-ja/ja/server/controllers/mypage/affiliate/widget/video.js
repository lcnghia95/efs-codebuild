const app = require('@server/server')
const service = require('@services/mypage/affiliate/widget/video')


async function index(req, res) {
  try {
    res.json(await service.index(
      app.utils.meta.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  index,
}
