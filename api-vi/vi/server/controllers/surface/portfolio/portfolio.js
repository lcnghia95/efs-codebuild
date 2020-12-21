const service = require('@services/surface/portfolio/portfolio')
const metaUtil = require('@@server/utils/meta')

async function onSelect(req, res) {
  res.json(await service.onSelect(req.params.id, metaUtil.meta(req)))
}

async function onRemove(req, res) {
  res.json(await service.onRemove(req.params.id, metaUtil.meta(req)))
}

module.exports = {
  onSelect,
  onRemove,
}
