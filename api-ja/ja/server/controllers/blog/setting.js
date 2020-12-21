const app = require('@server/server')
const service = require('@server/services/blog/setting')

async function settings(req, res) {
  try {
    res.json(await service.settings(req.params.slug))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function storeSettings(req, res) {
  try {
    res.json(await service.storeSettings(req.params.slug, req.body, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  settings,
  storeSettings,
}
