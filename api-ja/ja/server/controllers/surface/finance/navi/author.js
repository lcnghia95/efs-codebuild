const app = require('@server/server')
const service = require('@services/surface/finance/navi/author')

module.exports.index = async function(req, res) {
  try {
    res.json(await service.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports.show = async function(req, res) {
  try {
    res.json(await service.show(
      req.params.id,
      app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}
