const cache = require('@@server/utils/cache')

/**
 * Middleware for caching response base of request route
 *
 * @param time
 * @param opt
 *  separateQuery: don't use query param as key when setting cache
 */
function cacheMiddleware(time = 60, opt = {}) {
  return async function(req, res, next) {
    // Only cache GET method
    if (req.method !== 'GET') {
      return next()
    }

    let k, secondK
    if (opt.separateQuery) {
      k = `${req.baseUrl}/${req._parsedUrl.pathname}`
      let q = Object.assign(req.query)
      delete q['requestId']
      secondK = Object.keys(q).sort().reduce((acc, cur) => {
        acc += cur + q[cur]
        return acc
      }, '')
    } else {
      k = req.originalUrl
    }
    // Get fingerprint
    let key = cache.fingerprint(k, req.headers),
      cacheData = await cache.get(key)
    // If data of current request was cached, response it
    if (cacheData) {
      if (opt.separateQuery && cacheData[[secondK]]) {
        return res.json(cacheData[[secondK]])
      } else if (!opt.separateQuery) {
        return res.json(cacheData)
      }
    }

    // Get response data and set cache before response to client
    res.sendJsonResponse = res.json
    res.json = async function(data) {
      if (res.getHeader('no-cache')) {
        res.removeHeader('no-cache')
      }

      // If data != empty, cache it
      else if (data && (typeof data !== 'object' || Object.keys(data).length)) {
        let d = data
        if (opt.separateQuery) {
          let result = await cache.get(key)
          if (result) {
            result[[secondK]] = data
            d = result
          } else {
            d = { [secondK]: data }
          }
        }
        await cache.set(key, d, time)
      }
      res.sendJsonResponse(data)
    }
    next()
  }
}

module.exports = cacheMiddleware
