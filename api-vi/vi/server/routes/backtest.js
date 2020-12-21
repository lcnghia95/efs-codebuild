const {
  backTest,
  userBackTest,
  userBackTestv2,
} = require('@controllers/surface/systemtrade/systemtrade')

module.exports = function(server) {
  const router = server.loopback.Router()

  router.get('/render/:id(\\d+)/:number(\\d+)?', backTest)
  router.get('/render/:id(\\d+)/user/:user_id(\\d+)/:number(\\d+)?', userBackTest)
  router.get('/render/:id(\\d+)/user/:user_id(\\d+)/:count(\\d+)/:number(\\d+)?', userBackTestv2)
  router.get('*', (req, res) => {
    res.sendStatus(200)
  })

  server.use('/vi/backtest', router)
}
