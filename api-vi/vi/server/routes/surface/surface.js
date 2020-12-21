const cms = require('@server/controllers/surface/cms/cms')
const systemtrade = require('@controllers/surface/systemtrade/systemtrade')

module.exports = function(server) {
  const router = server.loopback.Router()

  // CMS
  router.get('/lecture/:cid(\\d+)/:id(\\d+)', cms.show)

  router.get('/systemtrade/fx/:id(\\d+)/backtest', systemtrade.getDirsByProductId)
  router.get('/systemtrade/fx/:id(\\d+)/backtestv2', systemtrade.backtestIndex)

  server.use('/api/v3/surface', router)
}
