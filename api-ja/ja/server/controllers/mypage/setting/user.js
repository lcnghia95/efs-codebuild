const app = require('@server/server')
const subscribeService = require('@services/mypage/user/subscribe')
const meta = app.utils.meta.meta

async function subscribe(req, res) {
  const metaData = meta(req, ['userId'])
  res.json(await subscribeService.subscribe(metaData.userId))
}

async function unsubscribe(req, res) {
  const metaData = meta(req, ['userId'])
  res.json(await subscribeService.unsubscribe(req.body, metaData.userId))
}

module.exports = {
  subscribe,
  unsubscribe,
}
