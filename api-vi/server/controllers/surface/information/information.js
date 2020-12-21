const infoService = require('@@services/surface/information/information')
const { meta } = require('@@server/utils/meta')

async function index(req, res) {
  try {
    res.json(await infoService.index(req.query, meta(req, ['langType'])))
  } catch (e) {
    res.sendStatus(500)
  }
}

async function show(req, res) {
  try {
    res.json(await infoService.show(req.params.id, meta(req, ['langType'])))
  } catch (e) {
    res.sendStatus(500)
  }
}

module.exports = {
  index,
  show,
}
