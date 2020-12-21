const eventService = require('@services/mypage/developer/event')
const helper = require('@controllers/mypage/helper')
const DEFAULT_LIMIT = 30
const DEFAULT_PAGE = 1

async function index(req, res) {
  const pagingOpt = {
    limit: req.query.limit == 0 ? 0 : (parseInt(req.query.limit) || DEFAULT_LIMIT),
    page: parseInt(req.query.page) || DEFAULT_PAGE,
  }
  res.json(await eventService.index(helper.userId(req), pagingOpt))
}

async function create(req, res) {
  res.json(await eventService.create(req.body, helper.meta(req)))
}

async function show(req, res) {
  res.json(await eventService.show(helper.userId(req), req.params.id))
}

async function update(req, res) {
  res.json(await eventService.update(req.params.id, req.body, helper.meta(req)))
}

async function updateStatus(req, res) {
  eventService.updateStatus(
    parseInt(req.params.id),
    parseInt(req.params.status),
    helper.userId(req),
  )
  res.json()
}

module.exports = {
  index,
  show,
  create,
  update,
  updateStatus,
}
