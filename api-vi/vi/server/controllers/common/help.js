const app = require('@server/server')
const listEndpoints = require('express-list-endpoints')

async function routes(req, res) {
  let routes = listEndpoints(app),
    host = req.get('host')
  res.send(
    routes.filter(route => route.path.includes('/api/v3/')).reduce((result, route) => {
      result += route.methods.reduce((m, method) => m += method, '')
      result += ': ' + host + route.path + '\r\n'
      return result
    }, '')
  )
}

function health(req, res) {
  res.sendStatus(200)
}

module.exports = {
  routes,
  health,
}
