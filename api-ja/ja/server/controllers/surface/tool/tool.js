const app = require('@server/server')
const service = require('@services/surface/tool/tool')
const recommendService = require('@services/surface/tool/recommend')
const popularService = require('@services/surface/tool/popular')
const newProductService = require('@services/surface/tool/newProduct')
const recentSoldService = require('@services/surface/tool/recentSold')
const reviewService = require('@services/surface/tool/review')
const sliderService = require('@services/surface/tool/sliders')
const searchService = require('@services/surface/tool/search')
const videoService = require('@services/surface/tool/video')
const relatedService = require('@services/surface/tool/related')
const realtradeService = require('@services/surface/systemtrade/fx/realtrade')

function _userId(req) {
  const {
    userId,
  } = app.utils.meta.meta(req, ['userId'])
  return userId || 0
}

async function index(req, res) {
  try {
    const [
      recommend,
      popularPrice,
      popularCount,
      popularFree,
      newProduct,
      recent,
      review,
    ] = await Promise.all([
      recommendService.index(),
      popularService.index({type: 1}),
      popularService.index({type: 2}),
      popularService.index({type: 3}),
      newProductService.index(),
      recentSoldService.index(),
      reviewService.index(),
    ])

    res.json(app.utils.object.nullFilter({
      recommend,
      popularPrice,
      popularCount,
      popularFree,
      new: newProduct,
      recent,
      review,
      sliders: !parseInt(req.query.isMobile || 0)
        ? await sliderService.index()
        : null,
    }))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function show(req, res) {
  try {
    res.json(await service.show(req.params.id, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function postShow(req, res) {
  try {
    res.json(await service.show(req.params.id, req.body))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function subProduct(req, res) {
  try {
    res.json(await service.subProduct(req.params.id, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function subAndRankProduct(req, res) {
  try {
    res.json(await service.subAndRankProduct(req.params.id, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function recommend(req, res) {
  try {
    res.json(await recommendService.index(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function popularPrice(req, res) {
  try {
    req.query.type = 1
    res.json(await popularService.index(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function popularCount(req, res) {
  try {
    req.query.type = 2
    res.json(await popularService.index(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function popularFree(req, res) {
  try {
    req.query.type = 3
    res.json(await popularService.index(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function newProduct(req, res) {
  try {
    req.query.type = 3
    res.json(await newProductService.index(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function recent(req, res) {
  try {
    req.query.type = 3
    res.json(await recentSoldService.index(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function review(req, res) {
  try {
    res.json(await reviewService.index(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function searchAll(req, res) {
  try {
    res.json(await searchService.index())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function slider(req, res) {
  try {
    res.json(await sliderService.index())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function getVideos(req, res) {
  try {
    res.json(await videoService.getVideos(req.params.id, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function relatedProductArticles(req, res) {
  try {
    res.json(await relatedService.getRelatedArticles(
      req.params.id,
      _userId(req),
      req.query,
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function showAlsoBoughtProducts(req, res) {
  try {
    res.json(await service.showAlsoBoughtProducts(_userId(req),req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function searchKeywords(req, res) {
  try {
    res.json(await searchService.keywords(
      req.query,
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function realtradeWidgets(req, res) {
  try {
    res.json(await realtradeService.listWidgetsByProductSeller(req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  index,
  show,
  postShow,
  review,
  recent,
  newProduct,
  popularPrice,
  popularCount,
  popularFree,
  recommend,
  subProduct,
  subAndRankProduct,
  searchAll,
  slider,
  getVideos,
  relatedProductArticles,
  showAlsoBoughtProducts,
  searchKeywords,
  realtradeWidgets,
}
