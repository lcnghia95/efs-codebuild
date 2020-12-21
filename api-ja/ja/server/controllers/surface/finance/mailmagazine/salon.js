const app = require('@server/server')
const salonService = require('@services/surface/finance/mailmagazine/salon')

async function show(req, res) {
  let salonId = parseInt(req.params.salonId),
    userId = app.utils.meta.meta(req).userId || 0
  if (!salonId || salonId < 0) {
    res.json({})
    return
  }

  res.json(await salonService.show(salonId, userId))
}

async function threads(req, res) {
  let salonId = parseInt(req.params.salonId)
  if (!salonId || salonId < 0) {
    res.json({})
    return
  }

  res.json(await salonService.threads(salonId))
}

async function reviews(req, res) {
  let salonId = parseInt(req.params.salonId)
  if (!salonId || salonId < 0) {
    res.json({})
    return
  }

  res.json(await salonService.reviews(salonId))
}

async function related(req, res) {
  let salonId = parseInt(req.params.salonId)
  if (!salonId || salonId < 0) {
    res.json({})
    return
  }

  res.json(await salonService.related(salonId))
}

async function sample(req, res) {
  let salonId = parseInt(req.params.salonId)
  if (!salonId || salonId < 0) {
    res.json({})
    return
  }

  res.json(await salonService.sample(salonId))
}

module.exports = {
  show,
  sample,
  threads,
  reviews,
  related,
}
