const devService = require(
  '@services/surface/systemtrade/developers/developers')

async function top(req, res) {
  try {
    res.json(await devService.top(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function index(req, res) {
  try {
    res.json(await devService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  top,
  index,
}
