module.exports = function(app) {
  app.use(function(req, res, next) {
    let requestId = Date.now(), // TODO use UUID for unique request Id
      setHeader = function(key, value) {
        if (!res.headersSent) {
          res.setHeader(key, value)
        }
      },
      getHeader = function(key) {
        !key
          ? app.emit('header' + requestId, req.headers)
          : app.emit('header' + requestId, req.headers[key])
      },
      clearCookie = function(key) {
        if (!res.headersSent) {
          res.clearCookie(key)
        }
      }

    // Bind requestId into request
    if (!req.body) {
      req.body = {}
    }
    req.body.requestId = requestId
    req.query.requestId = requestId

    // Bind listener of each request into application
    app.on('setHeader' + requestId, setHeader)
    app.on('getHeader' + requestId, getHeader)
    app.on('clearCookie' + requestId, clearCookie)

    // Remove all listener of current req/res lifecycle after response was finished
    // Avoid trash listener still exist in the next requests
    res.on('finish', function() {
      app.removeListener('setHeader' + requestId, setHeader)
      app.removeListener('getHeader' + requestId, getHeader)
      app.removeListener('clearCookie' + requestId, clearCookie)
    })
    next()
  })
}
