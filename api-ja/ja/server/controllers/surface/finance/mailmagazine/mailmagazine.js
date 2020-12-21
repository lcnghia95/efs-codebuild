const app = require('@server/server')
const mailmagazine = require('@services/surface/finance/mailmagazine/mailmagazine')

const meta = app.utils.meta

async function index(req, res) {
  let page = parseInt(req.query.page) || 1,
    sortType = parseInt(req.query.sortType) || 1,
    userId = meta.meta(req).userId,
    limit = parseInt(req.query.limit) || 20

  res.json(await mailmagazine.index(userId, page, sortType, limit))
}

async function show(req, res) {
  let id = parseInt(req.params.id),
    salonId = parseInt(req.query.salonId),
    userId = meta.meta(req).userId

  if (!id || id < 0 || !salonId || salonId < 0) {
    res.json({})
  } else {
    res.json(await mailmagazine.show(id, userId, salonId))
  }
}

module.exports = {
  index,
  show,
}
