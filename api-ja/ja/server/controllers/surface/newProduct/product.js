const service = require('@services/surface/newProduct/product')

async function index(req, res) {
  try {
    res.json(await service.index(req.query))
  } catch (e) {
    res.sendStatus(500)
  }
}

async function ebook(req, res) {
  res.json(await service.ebook(req.query))
}

async function ea(req, res) {
  try {
    res.json(await service.ea(req.query))
  } catch (e) {
    res.sendStatus(500)
  }
}

module.exports = {
  index,
  ebook,
  ea,
}
