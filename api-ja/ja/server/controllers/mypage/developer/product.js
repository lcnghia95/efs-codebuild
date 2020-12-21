const helper = require('@controllers/mypage/helper')
const service = require('@services/mypage/developer/product')
const historyService = require('@services/mypage/developer/history')
const app = require('@server/server')
const meta = app.utils.meta

async function log(req, res) {
  // NOTICE: make sure that data is updated
  await historyService.log(
    parseInt(req.params.id),
    helper.userId(req),
  )
  res.json()
}

async function updateStatus(req, res) {
  const updatedProduct = await service.updateStatus(
    parseInt(req.params.id),
    parseInt(req.params.status),
    helper.userId(req),
    req.body.saleStop,
  )

  res.json(updatedProduct)
}

async function updateMargin(req, res) {
  const result = await service.updateMargin(
    parseInt(req.params.id),
    parseInt(req.body.margin),
    helper.userId(req),
  )
  if (result.code) {
    res.status(result.code)
  }
  res.json(result)
}

async function myProducts(req, res) {
  const {
    langType,

  } = meta.meta(req, ['langType'])
  res.json(await service.myProducts(parseInt(helper.userId(req)), req.query.q, langType))
}

module.exports = {
  log,
  updateStatus,
  updateMargin,
  myProducts,
}
