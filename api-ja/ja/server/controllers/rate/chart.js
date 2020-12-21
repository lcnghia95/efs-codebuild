const rate = require('@services/rate/chart')

async function index(req, res) {
  res.json(await rate.index(req.query))
}

module.exports = {
  index,
}
