'use strict'

const common = require('@controllers/common/help')

module.exports = function (server) {
  enableSafeRouter(server)
  let router = server.loopback.Router()

  // Install a `/` route that returns server status
  router.get('/', server.loopback.status())
  router.get('/help/6261985919/routes', common.routes)

  // Health check for aws
  router.get('/health', common.health)

  // Surfaces
  require('@/server/routes/surface/surface')(server)
  require('@server/routes/surface/index')(server)
  require('@server/routes/surface/top')(server)
  require('@server/routes/surface/systemtrade')(server)
  require('@server/routes/surface/community')(server)
  require('@@/server/routes/surface/ads')(server)
  require('@@/server/routes/surface/inquiry')(server)
  require('@@/server/routes/surface/surface')(server)

  // mypage
  require('@server/routes/mypage/mypage')(server)

  // Term
  require('@server/routes/common/common')(server)

  // Backtest
  require('@server/routes/backtest')(server)

  // Broker
  require('@@server/routes/common/broker')(server)

  // languages
  require('@@/server/routes/common/languages')(server)

  // common
  require('@@server/routes/common/common')(server)

  server.use(router)
}

/**
 * Override default Router function of loopback (express)
 * Call router wrapper function for each router that was call from lb.Router()
 *
 * @param server
 */
function enableSafeRouter(server) {
  server.loopback.getRouter = server.loopback.Router
  server.loopback.Router = function() {
    return wrapRouter(server.loopback.getRouter())
  }
}

/**
 * Add wrapper function for each route & middleware in given router
 *
 * @param router
 * @return {*}
 */
function wrapRouter(router) {
  // Wrapper function that will catch all error from routes & middlewares
  let wrap = fn => (...args) => fn(...args).catch(args[2])

  // Add wrapper function into each route & middleware
  router.GET = router.get
  router.get = function (...args) {
    let arg1 = isAsync(args[1]) ? wrap(args[1]) : args[1],
      arg2 = isAsync(args[2]) ? wrap(args[2]) : args[2]

    // Has middleware
    if (arg2) {
      return router.GET(args[0], arg1, arg2)
    }
    router.GET(args[0], arg1)
  }

  return router
}

/**
 * Check given function is async function
 *
 * @param fn
 * @return {boolean}
 */
function isAsync(fn) {
  if (!fn || !fn.constructor) {
    return false
  }

  return fn.constructor.name === 'AsyncFunction'
}
