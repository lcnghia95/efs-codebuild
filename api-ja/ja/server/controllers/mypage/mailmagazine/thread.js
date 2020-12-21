const app = require('@server/server')
const meta = app.utils.meta.meta
const threadService = require('@services/mypage/mailmagazine/thread')

async function index(req, res) {
  const userId = meta(req, ['userId']).userId
  if (!userId) {
    res.json({})
    return
  }

  try {
    res.json(await threadService.index(userId, req.params))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function sub(req, res) {
  const userId = meta(req, ['userId']).userId
  if (!userId) {
    res.json({})
    return
  }

  try {
    res.json(await threadService.sub(2532, req.params, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function store(req, res) {
  const userId = meta(req, ['userId']).userId
  if (!userId) {
    res.json({})
    return
  }

  try {
    res.json(await threadService.store(userId, req.params, req.body))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  index,
  sub,
  store,
}
