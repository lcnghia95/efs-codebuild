/**
 * Middleware for check api access key
 */
function authMiddleware(req, res, next) {
  if (req.headers['api-access-key'] !== process.env.API_ACCESS_KEY) {
    return res.sendStatus(401)
  }
  next()
}

module.exports = authMiddleware
