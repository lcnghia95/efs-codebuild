const app = require('@server/server')
const service = require('@services/surface/portfolio/portfolio')
const meta = app.utils.meta

async function onSelect(req, res) {
  res.json(await service.onSelect(req.params.id, meta.meta(req)))
}

async function onRemove(req, res) {
  res.json(await service.onRemove(req.params.id, meta.meta(req)))
}

module.exports = {
  onSelect,
  onRemove,
}
