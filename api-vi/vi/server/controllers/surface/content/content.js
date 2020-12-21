const service = require('@services/surface/content/content')

async function show(req, res) {
  try {
    res.json(await service.show(3))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  show,
}
