const app = require('@server/server')
const ggjtvService = require('@services/surface/finance/ggjtv/ggjtv')

async function index(req, res) {
  let limit = parseInt(req.query.limit) || 5
  res.json(await ggjtvService.index(limit))
}

async function newGGJTV(req, res) {
  res.json(await ggjtvService.newGGJTV(req.query))
}

async function premier(req, res) {
  res.json(await ggjtvService.premier(req.query))
}

async function free(req, res) {
  res.json(await ggjtvService.free(req.query))
}

async function popular(req, res) {
  res.json(await ggjtvService.popular(req.query))
}

async function total(req, res) {
  res.json(await ggjtvService.total(req.query))
}

async function show(req, res) {
  res.json(await ggjtvService.show(req.params.id, _userId(req)))
}

async function others(req, res) {
  let limit = parseInt(req.query.limit) || 0
  res.json(await ggjtvService.others(req.params.id, limit))
}

async function recommend(req, res) {
  let limit = parseInt(req.query.limit) || 0
  res.json(await ggjtvService.recommend(req.params.id, limit))
}

async function search(req, res) {
  let isMobile = req.headers.platform == 'mobile'
  res.json(await ggjtvService.search(req.query, isMobile))
}

async function purchased(req, res) {
  res.json(await ggjtvService.purchased(req.query, _userId(req)))
}

async function related(req, res) {
  let limit = parseInt(req.query.limit) || 0
  res.json(await ggjtvService.related(req.params.id, limit))
}

/**
 * Get login user id
 *
 * @returns {number}
 */
function _userId(req) {
  let {
    userId
  } = app.utils.meta.meta(req, ['userId'])
  return userId || 0
}

module.exports = {
  index,
  newGGJTV,
  premier,
  free,
  popular,
  purchased,
  search,
  total,
  show,
  others,
  recommend,
  related,
}
