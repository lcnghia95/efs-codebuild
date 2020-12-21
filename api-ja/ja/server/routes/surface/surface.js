const cache = require('@server/middlewares/cache')
const information = require('@controllers/surface/information/information')
const cart = require('@controllers/surface/cart/cart')
const newProduct = require('@controllers/surface/newProduct/product')
const systemtrade = require('@controllers/surface/systemtrade/systemtrade')
const developers = require('@controllers/surface/systemtrade/developers')
const fx = require('@controllers/surface/systemtrade/fx')
const stock = require('@controllers/surface/systemtrade/stock')
const content = require('@server/controllers/surface/content/content')
const cms = require('@server/controllers/surface/cms/cms')
const community = require('@controllers/surface/community/community')
const company = require('@server/controllers/surface/company/company')
const favorite = require('@server/controllers/surface/favorite/favorite')
const product = require('@server/controllers/surface/product/product')
const portfolio = require('@controllers/surface/portfolio/portfolio')
const fxWidgetService = require('@@controllers/surface/systemtrade/fx/relatedProductWidget')
const realtradeController = require('@controllers/surface/systemtrade/realtrade')

module.exports = function(server) {
  const router = server.loopback.Router()

  // Info routes
  router.get('/info', cache(60), information.index)
  router.get('/info/:id(\\d+)', cache(60), information.show)

  // Product routes
  router.get('/product/*', cache(60))
  router.get('/product/new', newProduct.index)
  router.get('/product/ranking/ebook', newProduct.ebook)
  router.get('/product/ranking/ea', newProduct.ea)

  // Count communities
  router.get('/products/communities/:id(\\d+)/count', community.count)

  // Common routes
  router.get('/campaigns', cache(60), content.show)

  // Cart
  router.get('/cart/count', cart.count)

  // Systemtrade
  router.post('/systemtrade/search', systemtrade.search)
  router.get('/systemtrade/rank/criterial', cache(60), systemtrade.criterial)
  router.get('/systemtrade/rank/profit', cache(60), systemtrade.profitTotal)
  router.get('/systemtrade/rank/profitfactor', cache(60), systemtrade.profitFactor)
  router.get('/systemtrade/rank/sell', cache(60), systemtrade.bestSell)
  router.get('/systemtrade/rank/realasset', cache(60), systemtrade.realAsset)
  router.get('/systemtrade/developers', cache(60), developers.index) // old
  router.get('/systemtrade/ads/banner', cache(60), systemtrade.banner)
  router.get('/systemtrade/side/banner', cache(60), systemtrade.sideBanner)
  router.get('/systemtrade/all', cache(60), systemtrade.index)
  router.get('/systemtrade/top', cache(60), systemtrade.top)
  router.get('/systemtrade/rank/profitrate', cache(60), systemtrade.profitRate)
  router.get('/systemtrade/rank/riskreturn', cache(60), systemtrade.riskReturn)
  router.get('/systemtrade/developers/top', developers.top) // old
  router.get('/systemtrade/review', cache(60), systemtrade.review)
  router.get('/systemtrade/new/sell', cache(60), systemtrade.newSell)
  router.get('/systemtrade/new/product', cache(60), systemtrade.newProduct)

  router.get('/systemtrade/old/:id(\\d+)/chart', systemtrade.chart)
  router.get('/systemtrade/:id(\\d+)/chart', systemtrade.getChart)
  router.get('/systemtrade/:id(\\d+)/video', systemtrade.getVideo)
  router.get('/systemtrade/:id(\\d+)/related', systemtrade.related)
  router.get('/systemtrade/fx/:id(\\d+)/backtest', systemtrade.getDirsByProductId)
  router.get('/systemtrade/fx/:id(\\d+)/backtestv2', systemtrade.backtestIndex)

  // router.get('/systemtrade/:id(\\d+)/backtest', systemtrade.backTest)
  // router.get('/systemtrade/render/:id(\\d+)/backtest', systemtrade.backTest)

  router.get('/systemtrade/fx/rank/realtrade', cache(60), fx.realtrade)
  router.get('/systemtrade/fx/top', cache(60), fx.top)
  router.get('/systemtrade/fx/new/product', cache(60), fx.newProduct)
  router.get('/systemtrade/fx/chart/pie/scatter', cache(60), fx.pieScatterChart)
  router.get('/systemtrade/fx/chart/column/scatterline', cache(60), fx.columnScatterlineChart)
  router.get('/systemtrade/fx/rank/criterial', cache(60), fx.criterial)
  router.get('/systemtrade/fx/rank/profitrate', cache(60), fx.profitRate)
  router.get('/systemtrade/fx/rank/profit', cache(60), fx.profitTotal)
  router.get('/systemtrade/fx/rank/profitfactor', cache(60), fx.profitFactor)
  router.get('/systemtrade/fx/rank/riskreturn', cache(60), fx.riskReturn)
  router.get('/systemtrade/fx/rank/sell', cache(60), fx.bestSell)
  router.get('/systemtrade/fx/rank/economics/1', cache(60), fx.unemploy)
  router.get('/systemtrade/fx/rank/economics/2', cache(60), fx.financial)
  router.get('/systemtrade/fx/rank/economics', cache(60), fx.economics)

  router.get('/systemtrade/fx/old/:id(\\d+)', cache(10), fx.show) // old
  router.get('/systemtrade/fx/:id(\\d+)', cache(10), fx.showFxProduct)
  router.post('/systemtrade/fx/:id(\\d+)', fx.showFxProduct) // old
  router.get('/systemtrade/fx/old/:id(\\d+)/chart', cache(60), fx.chart)
  router.get('/systemtrade/fx/:id(\\d+)/chart', cache(60), fx.chartFx)
  router.get('/systemtrade/fx/:id(\\d+)/chartv2', cache(60), fx.chartFxv2)
  router.get('/systemtrade/fx/:id(\\d+)/forward', cache(60), fx.forward) // old
  router.get('/systemtrade/fx/:id(\\d+)/forwardPage', cache(60), fx.forwardPage)
  router.get('/systemtrade/fx/:id(\\d+)/calendar', cache(60), fx.calendar)
  router.get('/systemtrade/fx/:id(\\d+)/others', cache(60), fx.others)
  router.get('/systemtrade/fx/:id(\\d+)/list/outline', cache(60), fx.listOutline)
  router.get('/systemtrade/fx/:id(\\d+)/widgets', cache(60), fxWidgetService.getFxWidgetRelatedProducts)
  router.get('/systemtrade/fx/:id(\\d+)/realtrade/widgets', realtradeController.listWidgets)

  router.get('/systemtrade/stocks/top', cache(60), stock.top)
  router.get('/systemtrade/stocks/rank/criterial', cache(60), stock.criterial)
  router.get('/systemtrade/stocks/rank/profitrate', cache(60), stock.profitRate)
  router.get('/systemtrade/stocks/rank/profit', cache(60), stock.profitTotal)
  router.get('/systemtrade/stocks/rank/profitfactor', cache(60), stock.profitFactor)
  router.get('/systemtrade/stocks/rank/riskreturn', cache(60), stock.riskReturn)
  router.get('/systemtrade/stocks/rank/sell', cache(60), stock.bestSell)
  router.get('/systemtrade/stocks/chart/pie/column', cache(60), stock.pieColumnChart)
  router.get('/systemtrade/stocks/new/product', cache(60), stock.newProduct)
  router.get('/systemtrade/stocks/ads', cache(60), stock.ads)

  router.get('/systemtrade/stocks/:id(\\d+)', cache(30), stock.show)
  router.post('/systemtrade/stocks/:id(\\d+)', stock.show)
  router.get('/systemtrade/stocks/:id(\\d+)/chart', cache(60), stock.chart)
  router.get('/systemtrade/stocks/:id(\\d+)/chartv2', cache(60), stock.chart)
  router.get('/systemtrade/stocks/:id(\\d+)/forward', cache(60), stock.forward)
  router.get('/systemtrade/stocks/:id(\\d+)/forwardPage', cache(60), stock.forwardPage)
  router.get('/systemtrade/stocks/:id(\\d+)/calendar', cache(60), stock.calendar)
  router.get('/systemtrade/stocks/:id(\\d+)/others', cache(60), stock.others)
  router.get('/systemtrade/stocks/:id(\\d+)/list/outline', cache(60), stock.listOutline)


  // GET: api/surface/systemtrade/bitcoin/top
  // GET: api/surface/systemtrade/bitcoin/new/product
  // GET: api/surface/systemtrade/bitcoin/chart/column/scatterline
  // GET: api/surface/systemtrade/bitcoin/rank/criterial
  // GET: api/surface/systemtrade/bitcoin/rank/profitrate
  // GET: api/surface/systemtrade/bitcoin/rank/profit
  // GET: api/surface/systemtrade/bitcoin/rank/profitfactor
  // GET: api/surface/systemtrade/bitcoin/rank/riskreturn
  // GET: api/surface/systemtrade/bitcoin/rank/sell
  // GET: api/surface/systemtrade/bitcoin/{id}
  // POST: api/surface/systemtrade/bitcoin/{id}
  // GET: api/surface/systemtrade/bitcoin/{id}/forward
  // GET: api/surface/systemtrade/bitcoin/{id}/others
  // GET: api/surface/systemtrade/bitcoin/{id}/list/outline

  // CMS
  router.get('/lecture/:cid(\\d+)/:id(\\d+)', cms.show)

  // Company
  router.get('/company/campaign', company.campaign)
  router.get('/company/campaign-v2', company.campaignv2)
  router.get('/company/present', company.present)
  router.get('/company/stocks', company.stocks)
  router.get('/company/bitcoin', company.bitcoin)
  router.get('/company/compare/reviews', company.reviews)
  router.get('/company/compare/spreads', company.spreads)
  router.get('/company/compare/swaps', company.swaps)
  router.get('/company/:id(\\d+)', company.show)
  router.get('/company/:id(\\d+)/review', company.review)
  router.post('/company/:id(\\d+)/review', company.postReview)
  router.get('/company/urls', company.companyUrls)

  // favorite
  router.post('/favorite/:id(\\d+)', favorite.add)
  router.post('/favorite/:id(\\d+)/remove', favorite.remove)

  // Portfolio
  router.post('/portfolio/:id(\\d+)/select', portfolio.onSelect)
  router.post('/portfolio/:id(\\d+)/remove', portfolio.onRemove)

  // Products
  router.get('/products/pr', cache(60), product.pr)

  // TODO - phat tran:REMOVE LATER
  router.get('/click', require('@controllers/surface/click').clickHandler)

  server.use('/api/v3/surface', router)
}
