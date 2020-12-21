const app = require('@server/server')
const developerService = require('@services/surface/crowdsourcing/developer')

async function index(req, res) {
  res.json(await developerService.index(req.query))
}

async function show(req, res) {
  res.json(await developerService.show(req.params.id))
}

async function dataTab(req, res) {
  res.json(await developerService.dataTab(req.params.id))
}

async function check(req, res) {
  let userId = app.utils.meta.meta(req, ['userId']).userId
  res.json(await developerService.check(userId))
}

module.exports = {
  index,
  show,
  dataTab,
  check,
}
