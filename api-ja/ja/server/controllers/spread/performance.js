const performanceServices = require('@services/spread/performance')

async function index(req, res) {
  res.json(await performanceServices.index(req.query))
}

module.exports = {
  index,
}
