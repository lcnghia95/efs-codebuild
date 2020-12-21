'use strict'

const { isLocal } = require('../utils/dev')
const app = require('../common')

const { Nuxt, Builder } = require('nuxt')

// Import and Set Nuxt.js options
let mobileConfig = require('./mobile/nuxt.config')
let desktopConfig = require('./desktop/nuxt.config')

// Init Nuxt.js
const nuxtMobile = new Nuxt(mobileConfig)
const nuxtDesktop = new Nuxt(desktopConfig)
const server = require('./modules/server')
function isReady(nuxt) {
  return new Promise(resolve => {
    nuxt.hook('ready', function() {
      resolve()
    })
  })
}

const promise = Promise.all([
  isLocal() ? new Builder(nuxtMobile).build() : isReady(nuxtMobile),
  isLocal() ? new Builder(nuxtDesktop).build() : isReady(nuxtDesktop),
])

promise
  .then(async () => {
    // !isLocal() && (await require('../common/plugins/http-proxy/nats-connect')())

    server(app, nuxtMobile, nuxtDesktop)

    // Listen the server
    const port = 7997
    app.listen(port)
    console.log(`Listening on http://localhost:${port}`)
    // Here we send the ready signal to PM2
    process.send && process.send('ready')
    // Close connect
    process.on('SIGINT', function() {
      process.nats && process.nats.close()
      console.log('Server stopping. Close NATS...')
    })
  })
  .catch(reason => {
    console.error(reason)
  })
