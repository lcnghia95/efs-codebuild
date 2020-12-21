const service = require('@server/services/blog/bat')

async function ranking(req, res) {
  res.json(await service.ranking())
}

async function countPostAccess(req, res) {
  res.json(await service.countPostAccess())
}

async function countPostAccessDaily(req, res) {
  res.json(await service.countPostAccessDaily())
}

async function countPostAccessMonthly(req, res) {
  res.json(await service.countPostAccessMonthly())
}

async function countPostAccessWeekly(req, res) {
  res.json(await service.countPostAccessWeekly())
}

module.exports = {
  countPostAccess,
  countPostAccessDaily,
  countPostAccessMonthly,
  countPostAccessWeekly,
  ranking,
}
