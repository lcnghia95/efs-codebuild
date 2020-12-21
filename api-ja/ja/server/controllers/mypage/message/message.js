const app = require('@server/server')
const service = require('@services/mypage/message/message')

const MESSAGE_DRAFT_STATUS = 0
const MESSAGE_SENT_STATUS = 1

async function index(req, res) {
  try {
    res.json(await service.index(req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function sent(req, res) {
  try {
    res.json(await service.getMessageByStatus(
      MESSAGE_SENT_STATUS,
      req.query,
      app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function draft(req, res) {
  try {
    res.json(await service.getMessageByStatus(
      MESSAGE_DRAFT_STATUS,
      req.query,
      app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function show(req, res) {
  try {
    res.json(await service.show(req.params.id, app.utils.meta.meta(req, [
      'userId',
    ])))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  index,
  sent,
  draft,
  show,
}
