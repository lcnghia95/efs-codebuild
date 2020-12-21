const service = require('@services/surface/product/prProduct')
async function pr(req, res) {
  try {
    res.json(await service.index((req.query.limit)))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  pr,
}
