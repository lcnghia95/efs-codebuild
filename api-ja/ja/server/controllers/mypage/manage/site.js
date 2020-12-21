const app = require('@server/server')
const siteService = require('@services/mypage/manage/site')
const meta = app.utils.meta.meta

async function sites(req, res) {
  const userId = meta(req, ['userId']).userId
  if (!userId) {
    res.json({})
    return
  }

  try {
    res.json(await siteService.sites(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  sites,
}
