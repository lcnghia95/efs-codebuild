const systemtrade = require('@controllers/surface/systemtrade/systemtrade')
const fx = require('@server/controllers/surface/systemtrade/fx')
const stock = require('@controllers/surface/systemtrade/stock')
const cache = require('@server/middlewares/cache')

module.exports = function(server) {
  const router = server.loopback.Router()

  router.post('/search', systemtrade.search)
  router.get('/search', systemtrade.search)

  router.get('/:id(\\d+)/chart', systemtrade.getChart)
  router.get('/:id(\\d+)/video', systemtrade.getVideo)

  router.get('/fx/new/product', cache(60), fx.newProduct)
  router.get('/fx/rank/profitrate', cache(60), fx.profitRate)
  router.get('/fx/rank/profit', cache(60), fx.profitTotal)
  router.get('/fx/rank/profitfactor', cache(60), fx.profitFactor)
  router.get('/fx/rank/riskreturn', cache(60), fx.riskReturn)
  router.get('/fx/rank/sell', cache(60), fx.bestSell)

  router.get('/fx/:id(\\d+)', cache(10), fx.showFxProduct)
  router.post('/fx/:id(\\d+)', fx.show) // old
  router.get('/fx/:id(\\d+)/chart', cache(60), fx.chartFx)
  router.get('/fx/:id(\\d+)/chartv2', cache(60), fx.chartFxv2)
  router.get('/fx/:id(\\d+)/forward', cache(60), fx.forward) // old
  router.get('/fx/:id(\\d+)/forwardPage', cache(60), fx.forwardPage)
  router.get('/fx/:id(\\d+)/calendar', cache(60), fx.calendar)
  router.get('/fx/:id(\\d+)/others', cache(60), fx.others)
  router.get('/fx/:id(\\d+)/list/outline', cache(60), fx.listOutline)

  router.get('/stocks/:id(\\d+)', cache(30), stock.show)
  router.post('/stocks/:id(\\d+)', stock.show)
  router.get('/stocks/:id(\\d+)/chart', cache(60), stock.chart)
  router.get('/stocks/:id(\\d+)/forward', cache(60), stock.forward)
  router.get('/stocks/:id(\\d+)/forwardPage', cache(60), stock.forwardPage)
  router.get('/stocks/:id(\\d+)/calendar', cache(60), stock.calendar)
  router.get('/stocks/:id(\\d+)/others', cache(60), stock.others)
  router.get('/stocks/:id(\\d+)/list/outline', cache(60), stock.listOutline)


  server.use('/api/v3/surface/systemtrade', router)
}