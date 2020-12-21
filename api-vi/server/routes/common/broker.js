const broker = require('@@/server/controllers/common/broker')

module.exports = function(server) {
  const router = server.loopback.Router()

  // Brokers
  router.get('/brokers/all', broker.show)
  router.get('/brokers/domestic', broker.showDomestic)
  router.get('/brokers/measurement', broker.showMeasurement)

  router.get('/platform-brokers/all', broker.showPlatformBroker)
  router.get('/platform-brokers/measurement', broker.showMeasurementPlatformBroker)

  server.use('/api/v3', router)
}
