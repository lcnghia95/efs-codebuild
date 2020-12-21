const app = require('@server/server')
const service = require('@services/surface/finance/navi/series')

module.exports.index = async function(req, res) {
  res.json(await service.index(req.query))
}

module.exports.show = async function(req, res) {
  let input = req.method === 'POST' ? req.body : req.query
  res.json(await service.show(
    req.params.id,
    input,
    app.utils.meta.meta(req, ['userId'])
  ))
}
