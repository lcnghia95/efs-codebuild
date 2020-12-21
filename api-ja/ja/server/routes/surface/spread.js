const spread = require('@controllers/surface/spread/spread')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('/market', spread.market)
  router.get('/marketDetail', spread.marketDetail)
  router.get('/company', spread.company)
  router.get('/chart', spread.chart)
  router.get('/realtime', spread.realtime)
  router.get('/company/:companyId(\\d+)', spread.company)

  server.use('/api/v3/surface/spread', router)

}