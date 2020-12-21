const app = require('@server/server')
const searchService = require('@services/surface/systemtrade/index/search')
const profitRateService = require(
  '@services/surface/systemtrade/index/profitRate')
const profitTotalService = require(
  '@services/surface/systemtrade/index/profitTotal')
const profitFactorService = require(
  '@services/surface/systemtrade/index/profitFactor')
const riskReturnService = require(
  '@services/surface/systemtrade/index/riskReturn')
const bestSellService = require('@services/surface/systemtrade/index/bestSell')
const bannerService = require('@services/surface/systemtrade/index/banner')
const reviewService = require('@services/surface/systemtrade/index/review')
const newSellService = require('@services/surface/systemtrade/index/newSell')
const newProductService = require(
  '@services/surface/systemtrade/index/newProduct')
const chartDetailService = require('@services/surface/systemtrade/detail/chart')
const backTestService = require('@services/surface/systemtrade/index/backtest')
const devService = require('@services/surface/systemtrade/developers/developers')
const videoService = require('@services/surface/systemtrade/video/video')
const articleService = require('@services/surface/systemtrade/article/article')
const rankingActiveService = require('@services/surface/systemtrade/index/rankingActive')
const rtRankingService = require('@@services/surface/systemtrade/index/realtradeRanking')

const metaUtils = app.utils.meta
const {
  pick,
} = require('lodash')

async function search(req, res) {
  try {
    const input = req.body
    if (req.headers.platform != 'mobile') {
      input.type = 1
    }
    res.json(await searchService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function top(req, res) {
  try {
    const [rate, amount, banner, bestsell] = await Promise.all([
      profitRateService.index({
        limit: 5,
      }),
      profitTotalService.index({
        limit: 5,
      }),
      bannerService.index(),
      bestSellService.index({
        limit: 30,
      }),
    ])
    res.json({
      rate,
      amount,
      banner,
      bestsell,
    })
  } catch (e) {
    res.sendStatus(e)
  }
}

async function criterial(req, res) {
  try {
    const input = {
      limit: 5,
    }
    const [rate, amount, profit, risk] = await Promise.all([
      profitRateService.index(input),
      profitTotalService.index(input),
      profitFactorService.index(input),
      riskReturnService.index(input),
    ])
    res.json({
      rate,
      amount,
      profit,
      risk,
    })
  } catch (e) {
    res.sendStatus(e)
  }
}

async function profitRate(req, res) {
  try {
    res.json(await profitRateService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function profitTotal(req, res) {
  try {
    res.json(await profitTotalService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function profitFactor(req, res) {
  try {
    res.json(await profitFactorService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function riskReturn(req, res) {
  try {
    res.json(await riskReturnService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function bestSell(req, res) {
  try {
    res.json(await bestSellService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function review(req, res) {
  try {
    res.json(await reviewService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function newSell(req, res) {
  try {
    res.json(await newSellService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function newProduct(req, res) {
  try {
    res.json(await newProductService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function realAsset(req, res) {
  try {
    res.json(await rtRankingService.realAsset(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function banner(req, res) {
  try {
    res.json(await bannerService.index())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function sideBanner(req, res) {
  try {
    res.json(await bannerService.sideBanner())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function chart(req, res) {
  try {
    res.json(await chartDetailService.show(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getChart(req, res) {
  try {
    res.json(await chartDetailService.showChart(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getVideo(req, res) {
  try {
    res.json(await videoService.show(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function related(req, res) {
  try {
    const id = req.params.id || 0
      const userId = metaUtils.meta(req, ['userId']).userId || 0

    if (!id) {
      res.json([])
      return
    }

    res.json(await articleService.related(id, userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function backTest(req, res) {
  try {
    res.send(await backTestService.show(
      req.params.id,
      req.query,
      req.params.number,
      app.utils.meta.meta(req, ['langType']).langType,
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getDirsByProductId(req, res) {
  try {
    res.send(await backTestService.getDirsByProductId(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function backtestIndex(req, res) {
  try {
    res.send(await backTestService.backtestIndex(req.params.id, req.query, app.utils.meta.meta(req).userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function userBackTest(req, res) {
  try {
    res.send(await backTestService.renderUserBackTest(
      req.params.id,
      req.query,
      req.params.user_id,
      req.params.number,
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function userBackTestv2(req, res) {
  try {
    res.send(await backTestService.renderUserBackTestv2(
      req.params.id,
      req.query,
      req.params.user_id,
      req.params.count,
      req.params.number,
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function index(req, res) {
  // default response desktopIndex
  res.json(req.headers.platform == 'mobile' ? await _mobileIndex(req) : await _desktopIndex(req))
}

async function _desktopIndex(req) {
  const reviewFields = ['productId', 'productName', 'content', 'detailUrl', 'review']
  const query = req.query
  const [rate,
    amount,
    bestsell,
    profitFactor,
    risk,
    newSell,
    newProduct,
    review,
    developers,
    banner,
    rankingActive,
    rtRanking,
  ] = await Promise.all([
    _index(profitRateService, 5, query, null),
    _index(profitTotalService, 5, query, null),
    _index(bestSellService, 30, query, null),
    _index(profitFactorService, 5, query, null),
    _index(riskReturnService, 5, query, null),
    _index(newSellService, 20, query, null),
    _index(newProductService, 8, query, null),
    _index(reviewService, 20, query, reviewFields),
    devService.newTop(15),
    bannerService.index(),
    rankingActiveService.index(),
    rtRankingService.index(req.query),
  ])

  return {
    rate,
    amount,
    bestsell,
    profitFactor,
    risk,
    newSell,
    newProduct,
    review,
    developers,
    banner,
    rankingActive,
    rtRanking,
  }
}

async function _mobileIndex(req) {
  const reviewFields = ['title', 'productId', 'detailUrl', 'review', 'publishedDate', 'content']
  const bestsellFields = ['id', 'name', 'prices', 'chart', 'review', 'detailUrl']
  const newProductFields = ['id', 'name', 'prices', 'detailUrl']
  const query = req.query
  const [bestsell,
    newProduct,
    reviews,
    banner,
    rtRanking,
  ] = await Promise.all([
    _index(bestSellService, 20, query, bestsellFields),
    _index(newProductService, 20, query, newProductFields),
    _index(reviewService, 3, query, reviewFields),
    bannerService.index(),
    rtRankingService.index(req.query),
  ])

  return {
    bestsell,
    newProduct,
    reviews,
    banner,
    rtRanking,
  }
}

/**
 * Get data from function index of service
 *
 * @param {service} service
 * @param {number} limit
 * @param {object} input
 * @param {array} fields
 *
 * @return {Array}
 * @public
 */
async function _index(service, limit, input, fields = null) {
  input.limit = limit
  let data = await service.index(input)

  if (fields) {
    data = data.map(object => pick(object, fields))
  }
  return data
}

module.exports = {
  search,
  top,
  criterial,
  profitRate,
  profitTotal,
  profitFactor,
  riskReturn,
  bestSell,
  review,
  newSell,
  newProduct,
  realAsset,
  banner,
  sideBanner,
  chart,
  getVideo,
  related,
  backTest,
  index,
  getChart,
  getDirsByProductId,
  userBackTest,
  userBackTestv2,
  backtestIndex,
}
