const pr = require('@controllers/common/pr')
const user = require('@controllers/common/user')
const cache = require('@controllers/common/cache')
const term = require('@controllers/common/term')
const test = require('@controllers/common/test')
const search = require('@controllers/common/search')
const broker = require('@controllers/common/broker')

module.exports = function (server) {
  const router = server.loopback.Router()

  // Pr product
  router.get('/pr', pr.index)
  // Get user name
  router.get('/me', user.getMyInfo)

  // Clear cache
  router.post('/cache/purge', cache.index)

  // terms privacy
  router.get('/terms/privacy', term.privacy)
  router.get('/terms/service', term.service)
  router.get('/terms/display', term.display)
  router.get('/terms/affiliate', term.affiliate)
  router.get('/terms/operation', term.operation)
  router.get('/terms/transaction', term.transaction)
  router.get('/terms/crowdsourcing', term.crowdsourcing)
  router.get('/terms/contract', term.index)
  router.get('/terms/contract/:id(\\d+)/:saleId(\\d+)', term.contract)
  router.get('/terms/user', term.user)

  // search
  router.get('/search/users', search.searchUsers)

  // test
  router.get('/test', test.show)

  // Brokers
  router.get('/brokers/all', broker.show)
  router.get('/brokers/domestic', broker.showDomestic)
  router.get('/brokers/measurement', broker.showMeasurement)

  server.use('/api/v3', router)
}
