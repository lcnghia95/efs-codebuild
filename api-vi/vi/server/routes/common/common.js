const term = require('@controllers/common/term')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('/terms/privacy', term.privacy)
  router.get('/terms/service', term.service)
  router.get('/terms/display', term.display)
  router.get('/terms/affiliate', term.affiliate)
  router.get('/terms/operation', term.operation)
  router.get('/terms/transaction', term.transaction)
  router.get('/terms/user', term.user)
  router.get('/terms/crowdsourcing', term.crowdsourcing)
  router.get('/terms/contract', term.index)
  router.get('/terms/contract/:id(\\d+)/:saleId(\\d+)', term.contract)
  server.use('/api/v3', router)
}
