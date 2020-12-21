const app = require('@server/server')
const cacheUtils = app.utils.cache

module.exports.index = async function(req, res) {
  res.json(await cacheUtils.clear())
}
