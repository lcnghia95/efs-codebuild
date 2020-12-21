const brokerService = require('@services/common/broker')
const app = require('@server/server')

async function show(req, res) {
  res.json(await brokerService.show(app.utils.meta.meta(req, ['langType']).langType))
}

async function showDomestic(req, res) {
  res.json(await brokerService.showDomestic(app.utils.meta.meta(req, ['langType']).langType))
}

async function showMeasurement(req, res) {
  res.json(await brokerService.showAutualMeasurement(app.utils.meta.meta(req, ['langType']).langType))
}

module.exports = {
  show,
  showDomestic,
  showMeasurement,
}
