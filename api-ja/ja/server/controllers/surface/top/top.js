const app = require('@server/server')
const sliderService = require('@services/surface/top/slider')
const chartService = require('@services/surface/top/chart')
const worldMarketNewsService = require('@services/surface/top/worldMarketNews')
const contentService = require('@services/surface/top/content')
const topSaleService = require('@services/surface/top/topSale')
const topRankingService = require('@services/surface/top/topRanking')
const prProductService = require('@services/common/prProduct')
const newProductService = require('@services/surface/top/newProduct')
const scatterChartService = require('@services/surface/top/scatterChart')
const rankingActiveService = require('@services/surface/systemtrade/index/rankingActive')
const rtRankingService = require('@@services/surface/systemtrade/index/realtradeRanking')

async function sliders(req, res) {
  try {
    res.json(await sliderService.index())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function charts(req, res) {
  try {
    res.json(await chartService.index())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function news(req, res) {
  try {
    res.json(await worldMarketNewsService.index())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function contents(req, res) {
  try {
    res.json(await contentService.index())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function products(req, res) {
  try {
    if (req.headers.platform === 'mobile') {
      const [sold, rtRanking, pr, newProduct] = await Promise.all([
        topSaleService.index(),
        rtRankingService.index(req.query),
        prProductService.index(),
        newProductService.mobileIndex(),
      ])
      return res.json({
        sold,
        rtRanking,
        'new': newProduct,
        pr,
      })
    }

    const [sold, ranking, pr, newProduct] = await Promise.all([
      topSaleService.index(),
      topRankingService.index(req.query),
      prProductService.index(),
      newProductService.index(),
    ])
    res.json({
      sold,
      ranking,
      pr,
      'new': newProduct,
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function scatter(req, res) {
  try {
    res.json(await scatterChartService.index())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function rankingActive(req, res) {
  try {
    const meta = app.utils.meta.meta(req, ['userId'])
    res.json(await rankingActiveService.index(meta.userId, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  sliders,
  charts,
  news,
  contents,
  products,
  scatter,
  rankingActive,
}
