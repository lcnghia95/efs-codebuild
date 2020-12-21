const communityService = require('@server/services/surface/community/community')
const metaUtil = require('@@server/utils/meta')

async function index(req, res) {
  res.json(await communityService.index(req.query, _meta(req).userId))
}

async function store(req, res) {
  res.json(await communityService.store(req.body, _meta(req)))
}

async function action(req, res) {
  communityService.action(
    req.params.id,
    req.body.type,
    _meta(req),
  )
  res.json()
}

async function destroy(req, res) {
  communityService.destroy(req.params.id, _meta(req).userId)
  res.json()
}

async function lastest(req, res) {
  res.json(await communityService.lastest(req.query))
}

async function count(req, res) {
  res.json(await communityService.count(req.params.id))
}

/**
 * Get meta data
 *
 * @return {Object}
 */
function _meta(req) {
  return metaUtil.meta(req, ['userId', 'ipAddress', 'userAgent'])
}

module.exports = {
  action,
  index,
  lastest,
  count,
  store,
  destroy,
}
