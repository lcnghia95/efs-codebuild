const service = require('@services/surface/event/event')

async function index(req, res) {
  try {
    res.json(await service.index(req.query))
  } catch (e) {
    res.sendStatus(500)
  }
}

async function show(req, res) {
  try {
    res.json(await service.show(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(500)
  }
}

async function counts(req, res) {
  try {
    res.json(await service.counts(req.query))
  } catch (e) {
    res.sendStatus(500)
  }
}

module.exports = {
  index,
  show,
  counts,
}
