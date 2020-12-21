const app = require('@server/server')

const favoriteService = require('@server/services/surface/favorite/favorite.js')

const meta = app.utils.meta

async function add(req, res) {
  res.json(await favoriteService.add(req.params.id, meta.meta(req)))
}

async function remove(req, res) {
  res.json(await favoriteService.remove(req.params.id, meta.meta(req)))
}

module.exports = {
  add,
  remove,
}
