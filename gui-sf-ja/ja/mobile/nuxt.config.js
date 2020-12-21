let config = require('../nuxt.config')
const fs = require('fs')
const path = require('path')

let str = fs.readFileSync('./mobile/app/ext-router.json'),
  extRouter = JSON.parse(str)

module.exports = Object.assign(
  {
    router: {
      middleware: ['auxiliary-tag'],
      extRouter,
    },
  },
  config('mobile', [
    path.join(__dirname, './pages/**/*.vue'),
    path.join(__dirname, './components/**/*.vue'),
    path.join(__dirname, './assets/**/*.scss'),
    path.join(__dirname, './layouts/*.vue'),
  ], ['@/assets/mobile.css']),
)
