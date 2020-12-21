const helper = require('./helper')
const adsService = require('@@/server/services/surface/ads/ads')

async function index(req, res) {
  res.json(await adsService.index(
    helper.servicePath(req),
    helper.languageAndPlatform(req)
  ))
}


module.exports = {
  index,
}
