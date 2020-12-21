const languagesService = require('@@services/common/languages')
const { meta } = require('@@server/utils/meta')

async function change(req, res) {
  res.json(await languagesService.change(meta(req, ['userId', 'langType'])))
}

module.exports = {
  change,
}
