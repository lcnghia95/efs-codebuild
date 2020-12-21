const slack = require('@@server/utils/slack')
Error.stackTraceLimit = 10

const ERROR_SLACK_CHANNEL = process.env.ERROR_SLACK_CHANNEL

module.exports = function() {
  // eslint-disable-next-line
  return function logError(err, req, res, next) {
    if (!ERROR_SLACK_CHANNEL) {
      throw err
    }

    const preContent = `:boom:
    Request url: \`${req.originalUrl}\`
    Referer: \`${req.headers.referer || 'empty'}\`
    User agent: \`${req.headers['user-agent'] || 'empty'}`

    const message = err.stack

    slack.sendV2(message, preContent, ERROR_SLACK_CHANNEL)
    res.json({})
  }
}
