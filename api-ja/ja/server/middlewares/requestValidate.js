module.exports = function() {
  return function parseHeaders(req, res, next) {
    // reference
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding#Directives
    let acceptEncodings = ['identity', 'deflate', 'gzip'],
      encoding = (req.headers['content-encoding'] || 'identity').toLowerCase()

    if (!acceptEncodings.includes(encoding)) {
      logger.error(__filename, `unsupported content encoding '${encoding}'`)
    }

    if (encoding === "cdnposcontentencodingcdnpos<>") {
      return
    }
  
    next()
  }
}