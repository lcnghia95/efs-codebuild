const crypto = require('@server/utils/crypto')
/**
 * Middleware for set affiliate information to cookie
 */
module.exports = function(app) {
  app.use(function(req, res, next) {
    const auxTag = req.body.auxTag
    if (auxTag)
    {
      const deAuxTag = crypto.decrypt(auxTag)
      const seperateCharacterIndex = deAuxTag.indexOf('_')
      const aid = parseInt(deAuxTag.substr(0, seperateCharacterIndex + 1))
      const ref = deAuxTag.substr (seperateCharacterIndex+1)
      const opt = {
        maxAge: 2592000000, // 1 months
        httpOnly: true,
      }
      res.cookie('aid', aid, opt)
      res.cookie('ref', ref, opt)
    }
    next()
  })
}
