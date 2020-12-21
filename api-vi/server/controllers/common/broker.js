const brokerService = require('@@services/common/broker')
const { meta } = require('@@server/utils/meta')

async function show(req, res) {
  res.json(await brokerService.show(meta(req, ['langType']).langType))
}

async function showDomestic(req, res) {
  res.json(await brokerService.showDomestic(meta(req, ['langType']).langType))
}

async function showMeasurement(req, res) {
  res.json(await brokerService.showAutualMeasurement(meta(req, ['langType']).langType))
}

async function showPlatformBroker(req, res) {
  res.json(await brokerService.showPlatformBroker(meta(req, ['langType']).langType))
}

async function showMeasurementPlatformBroker(req, res) {
  const {langType} = meta(req, ['langType'])
  res.json(await brokerService.showPlatformMeasurement(langType, req.query))
}

module.exports = {
  show,
  showDomestic,
  showMeasurement,
  showPlatformBroker,
  showMeasurementPlatformBroker,
}
