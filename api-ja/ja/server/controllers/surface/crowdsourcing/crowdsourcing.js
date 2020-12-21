const app = require('@server/server')
const crowdsourcingService = require('@services/surface/crowdsourcing/crowdsourcing')

async function index(req, res) {
  res.json(await crowdsourcingService.index(req.query))
}

async function show(req, res) {
  res.json(await crowdsourcingService.show(req.params.id))
}

async function update(req, res) {
  res.json(await crowdsourcingService.update(req.body, req.params.id, _meta(req).userId))
}

async function review(req, res) {
  res.json(await crowdsourcingService.review(req.params.id, _meta(req).userId))
}

/**
 * Get meta data
 *
 * @return {Object}
 */
function _meta(req, query = ['userId']) {
  return app.utils.meta.meta(req, query)
}

module.exports = {
  index,
  show,
  update,
  review,
}
