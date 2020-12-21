const app = require('@server/server')
const biddersService = require('@services/surface/crowdsourcing/bidders')


async function index(req, res) {
  res.json(await biddersService.index(req.query, _userId(req)))
}

async function store(req, res) {
  res.json(await biddersService.store(req.body, _userId(req)))
}


/**
 * Get current login user id
 *
 * @returns {Number}
 */
function _userId(req) {
  let meta = app.utils.meta.meta(req, ['userId'])
  return meta.userId || 0
}


module.exports = {
  index,
  store,
}
