'use strict'

const configs = require('@ggj/configs')

async function start() {
  const value = await configs.getConfigs()
  configs.setEnvVariables(value)

  await configs.getDbConfigs(
    Object.keys(require('./datasources.json')),
    true,
  )
  require('module-alias/register')

  const fs = require('fs')
  const loopback = require('loopback')
  const boot = require('loopback-boot')
  const utils = require('@server/utils')
  const app = module.exports = loopback()
  require('@@server/utils/logger')
  require('@@server/utils/const')
  const logger = require('morgan')
  const modelConfig = require('./model-config')
  const exchangeRate = require('@server/utils/exchange-rate')

  // Register custom middleware
  require('@@server/middlewares/event')(app)

  // Use logger
  logger.token('remote-addr', function(req) {
    return req.headers['client-ip-address'] || req.headers['x-real-ip']
  })
  app.use(logger(':remote-addr ":method :url HTTP/:http-version" :status :response-time ms :res[content-length] ":referrer" ":user-agent"',
    {
      skip: function(req) { return req.originalUrl.startsWith('/health') },
    }),
  )

  // Generate model-config.json
  try {
    fs.writeFileSync('server/model-config.json', JSON.stringify(modelConfig))
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  // set the view engine to ejs
  app.set('view engine', 'ejs')

  // set info
  process.api = {}

  // Get exchange rate
  exchangeRate()

  // Binding utils
  app.utils = utils
  app.start = function() {
    // start the web server
    return app.listen(function() {
      app.emit('started')
      const baseUrl = app.get('url').replace(/\/$/, '')
      console.log('Web server listening at: %s', baseUrl)
      if (app.get('loopback-component-explorer')) {
        const explorerPath = app.get('loopback-component-explorer').mountPath
        console.log('Browse your REST API at %s%s', baseUrl, explorerPath)
      }
    })
  }

  let shutdownFlg = false
  app.use(function(req, res, next) {
    if(shutdownFlg) {
      res.sendStatus(503)
    } else {
      next()
    }
  })

  let server
  // Bootstrap the application, configure models, datasources and middleware.
  // Sub-apps like REST API are mounted via boot scripts.
  boot(app, __dirname, function(err) {
    if (err) {throw err}

    // start the server if `$ node server.js`
    if (require.main === module){
      server = app.start()
      // Ensure all inactive connections are terminated by the ALB, by setting this a few seconds higher than the ALB idle timeout
      server.keepAliveTimeout = 125000
      // Ensure the headersTimeout is set higher than the keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363
      server.headersTimeout = 126000
    }
  })

  // Trap for signal SIGINT - graceful shutdown
  process.on('SIGINT', function() {
    console.info('SIGINT signal received.')
    shutdownFlg = true
    server.close(function(err) {
      console.info('close go here!.')
      if (err) {
        console.error('server.close got error ' + err)
        process.exit(1)
      } else {
        process.exit(0)
      }
    })
  })
}
start()
