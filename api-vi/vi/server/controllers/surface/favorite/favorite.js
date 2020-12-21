const favoriteService = require('@server/services/surface/favorite/favorite.js')

const metaUtil = require('@@server/utils/meta')

async function add(req, res) {
  res.json(await favoriteService.add(req.params.id, metaUtil.meta(req)))
}

async function remove(req, res) {
  res.json(await favoriteService.remove(req.params.id, metaUtil.meta(req)))
}

module.exports = {
  add,
  remove,
}
