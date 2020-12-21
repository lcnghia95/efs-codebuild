const spreadService = require('@server/services/surface/spread/spread')

const MARKET_LIMIT_DEFAULT = 7

async function market(req, res) {
  let limit = parseInt(req.query.limit)
  res.json(await spreadService.market(isNaN(limit) ? MARKET_LIMIT_DEFAULT : limit))
}

async function marketDetail(req, res) {
  res.json(await spreadService.marketDetail())
}

async function company(req, res) {
  res.json(await spreadService.company(req.params.companyId))
}

async function chart(req, res) {
  res.json(await spreadService.chart())
}

async function realtime(req, res) {
  res.json(await spreadService.realtime())
}

module.exports = {
  market,
  marketDetail,
  company,
  chart,
  realtime,
}
