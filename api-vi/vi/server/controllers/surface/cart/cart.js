const service = require('@services/surface/cart/cart')
const headerService = require('@services/cart/header')
const metaUtil = require('@@server/utils/meta')

async function count(req, res) {
  const meta = metaUtil.meta(req, ['userId'])
  meta.cartSessionId = headerService.cartSessionId(req, res)
  res.json(await service.count(meta))
}

module.exports = {
  count,
}
