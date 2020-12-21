const app = require('@server/server')
const service = require('@services/surface/cart/cart')
const headerService = require('@services/cart/header')

async function count(req, res) {
  let meta = app.utils.meta.meta(req, ['userId'])
  meta.cartSessionId = headerService.cartSessionId(req, res)
  res.json(await service.count(meta))
}

module.exports = {
  count
}
