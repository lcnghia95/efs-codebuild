const app = require('@server/server')
const cmsService = require('@services/surface/cms/cms')

async function show(req, res) {
  res.json(await cmsService.show(
    req.params.cid,
    req.params.id,
    app.utils.meta.meta(req).userId || 0))
}

module.exports = {
  show,
}
