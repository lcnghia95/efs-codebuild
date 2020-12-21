const fxWidgetService = require('@@services/surface/systemtrade/fx/index')

async function getFxWidgetRelatedProducts(req, res) {
  try {
    res.json(await fxWidgetService.getFxWidgetRelatedProducts(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  getFxWidgetRelatedProducts,
}
