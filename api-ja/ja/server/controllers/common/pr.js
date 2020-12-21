const app = require('@server/server')
const prService = require('@services/advertise/pr')

module.exports.index = async function(req, res) {
  res.json(await prService.index(app.utils.meta.meta(req, ['langType']).langType))
}
