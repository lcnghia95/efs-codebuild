const cmsService = require('@services/surface/cms/cms')
const metaUtil = require('@@server/utils/meta')

async function show(req, res) {
  res.json(await cmsService.show(
    req.params.cid,
    req.params.id,
    metaUtil.meta(req).userId || 0))
}

module.exports = {
  show,
}
