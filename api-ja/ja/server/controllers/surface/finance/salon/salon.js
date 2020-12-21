const app = require('@server/server')
const service = require('@services/surface/finance/salon/salon')
const relatedService = require('@services/surface/finance/salon/related')
const alsoBoughtProductService = require('@services/common/alsoBoughtProduct')
const meta = require('@@server/utils/meta')
function _userId(req) {
  let {
    userId
  } = app.utils.meta.meta(req, ['userId'])
  return userId || 0
}

async function index(req, res) {
  try {
    let limit = parseInt(req.query.limit) || 0
    res.json(await service.index(limit))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function financeSliders(req, res) {
  try {
    res.json(await service.financeSliders())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function show(req, res) {
  try {
    let userId = app.utils.meta.meta(req).userId || 0
    res.json(await service.show(req.params.id, userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function sample(req, res) {
  try {
    let input = req.query
    res.json(await service.sample(req.params.id, input.salonId || 0))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function alsoBought(req, res) {
  try {
    let salonId = req.params.id || 0
    const opt = meta.meta(req, ['userId'])
    if (!salonId) {
      res.json([])
      return
    }

    res.json(await alsoBoughtProductService.alsoBought(salonId, opt.userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function threads(req, res) {
  try {
    res.json(await service.threads(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function reviews(req, res) {
  try {
    res.json(await service.reviews(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function related(req, res) {
  try {
    res.json(await service.related(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getRelatedArticles(req, res) {
  try {
    res.json(await relatedService.getRelatedArticles(
      req.params.id,
      _userId(req),
      req.query,
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}
relatedService

module.exports = {
  index,
  financeSliders,
  show,
  sample,
  reviews,
  threads,
  related,
  getRelatedArticles,
  alsoBought,
}
