const app = require('@server/server')
const service = require('@services/surface/market/market')

async function index(req, res) {
  let input = {
    from: req.query.from,
    to: req.query.to,
  }
  res.json(await service.index(input))
}

async function show(req, res) {
  res.json(await service.show(req.params.id))
}

async function chart(req, res) {
  res.json(await service.chart(req.params.id))
}

async function comments(req, res) {
  res.json(await service.comments(req.params.id))
}

async function postComment(req, res) {
  res.json(await service.postComment(req.params.id))
}

async function postRate(req, res) {
  res.json(await service.postRate(app.utils.meta.meta(req).userId || 0, req.params.id, req.body))
}

module.exports = {
  index,
  show,
  chart,
  comments,
  postComment,
  postRate,
}
