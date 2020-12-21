const service = require('@server/services/blog/search')

async function suggestForSearch(req, res) {
  res.json(await service.suggestForSearch(req.query))
}

module.exports = {
  suggestForSearch,
}
