const app = require('@server/server')
const service = require('@server/services/blog/report')

async function periodReport(req, res) {
  try {
    res.json(await service.periodReport(req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  periodReport,
}
