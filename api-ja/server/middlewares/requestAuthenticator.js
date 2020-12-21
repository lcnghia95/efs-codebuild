const app = require('@server/server')

module.exports = function() {
  return function parseHeaders(req, res, next) {
    setUserIdLogCtx('-')
    try {
      let rqHeaderParsedData = app.utils.meta.meta(req, ['userId'])
      logger.debug(__filename, 'Authenticator returns user id: %s', rqHeaderParsedData['userId'])
      req.metaData = {}
      if (rqHeaderParsedData['userId'] === 0) {
        logger.debug(__filename, 'Authenticator returns failed result!')
      } else {
        setUserIdLogCtx(rqHeaderParsedData['userId'])
        // Append header data to request
        req.metaData = rqHeaderParsedData
        logger.debug(__filename, 'Authenticator gets successful!')
      }
    } catch (e) {
      logger.error(__filename, 'Error occurred: ', e)
    }
    next()
  }
}
  