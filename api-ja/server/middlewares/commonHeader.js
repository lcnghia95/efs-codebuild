const metaUtils = require('@@server/utils/meta')

module.exports = function() {
  return function finalRequest(req, res, next) {
    let meta = metaUtils.meta(req, ['userId'])

    // https://gogojungle.backlog.jp/view/OAM-6982
    // handle specific case
    if (req.path.includes('/api/v3/payment/cart/complete/meta/online')) {
      /* convert raw header
       BEFORE
        content-type: application/x-www-form-urlencoded; charset=sjis
       AFTER
         content-type: application/x-www-form-urlencoded
         charset: sjis
      */
      req.headers['content-type'] = 'application/x-www-form-urlencoded'
      req.headers['charset'] = 'sjis'
    }
    // Set common header
    res.set('ugxxgdv2un7zftysjcnvnw', meta.userId)
    next()
  }
}
