let config = require('../nuxt.config')
const fs = require('fs')
const path = require('path')

let str = fs.readFileSync('./desktop/app/ext-router.json'),
  extRouter = JSON.parse(str)

module.exports = Object.assign(
  {
    router: {
      middleware: ['route-change', 'auxiliary-tag'],
      extRouter,
    },
  },
  config('desktop', [
    path.join(__dirname, './pages/**/*.vue'),
    path.join(__dirname, './components/**/*.vue'),
    path.join(__dirname, './assets/**/*.scss'),
    path.join(__dirname, './layouts/*.vue')
    ], ['@/assets/desktop.css']),
)
