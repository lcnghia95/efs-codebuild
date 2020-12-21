const app = require('@server/server')
const commentService = require('@services/surface/crowdsourcing/comments')

async function index(req, res) {
  res.json(await commentService.index(req.query, _meta(req)))
}

async function store(req, res) {
  res.json(await commentService.store(req.body, _meta(req), req.query))
}

async function update(req, res) {
  res.json(await commentService.update(req.params.id, req.body, _meta(req)))
}

/**
 * Get meta data
 *
 * @returns {object}
 */
function _meta(req) {
  let meta = app.utils.meta.meta(req, ['userId', 'ipAddress'])
  return {
    userId: meta.userId || 0,
    ipAddress: meta.ipAddress || ''
  }
}


module.exports = {
  index,
  store,
  update,
}
