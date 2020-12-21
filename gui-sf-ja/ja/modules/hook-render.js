const slack = require('./slack')

module.exports = function(envType) {
  if (!process.env.SLACK_HOOK_URL || !process.env.SLACK_CHANNEL) {
    return
  }
  console.log('Hook render:errorMiddleware', envType)
  this.nuxt.hook('render:errorMiddleware', app =>
    app.use((error, _req, _res, next) => {
      slack(
        envType,
        error,
        _req.originalUrl || _req.url,
        _req.headers && _req.headers['referer']
      )
      next(error)
    })
  )
}
