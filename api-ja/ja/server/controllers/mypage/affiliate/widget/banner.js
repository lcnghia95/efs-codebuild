const app = require('@server/server')
const service = require('@services/mypage/affiliate/widget/banner')
const NUM_IMG_TRADESTATION = 2
const NUM_IMG_TWOTIER = 15

async function index(req, res) {
  const query = req.query || {}
  if (!query.numberBanner || !query.masterId) {
    return res.json({})
  }

  res.json(await service.index(
    app.utils.meta.meta(req, ['userId']),
    'n_g0000' + query.masterId,
    parseInt(query.numberBanner),
    parseInt(query.startIndex) || 0,
  ))
}

async function indexTwoTier(req, res) {
  res.json(await service.index(
    app.utils.meta.meta(req, ['userId']),
    'n_g0000710',
    NUM_IMG_TWOTIER,
    parseInt(req.query.startIndex) || 0,
  ))
}

async function indexTradestation(req, res) {
  res.json(await service.index(
    app.utils.meta.meta(req, ['userId']),
    'n_g0000752',
    NUM_IMG_TRADESTATION,
  ))
}

module.exports = {
  index,
  indexTwoTier,
  indexTradestation,
}
