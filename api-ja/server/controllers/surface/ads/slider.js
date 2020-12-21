const helper = require('./helper')
const sliderService = require('@@/server/services/surface/ads/slider')

async function index(req, res) {
  res.json(await sliderService.index(
    helper.servicePath(req),
    helper.languageAndPlatform(req)
  ))
}

async function updateServicePath(req, res) {
  res.json(await sliderService.updateServicePath())
}


module.exports = {
  index,
  updateServicePath,
}
