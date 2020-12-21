const affiliateSiteService = require('@services/mypage/manage/affiliateSite')
const { meta } = require('@@server/utils/meta')

async function update(req, res) {
  const userId = meta(req, ['userId']).userId
  if (!userId) {
    res.json({})
    return
  }

  try {
    res.json(await affiliateSiteService.update(
      userId,
      parseInt(req.params.id),
      req.body,
    ))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function bulkUpdate(req, res) {
  const userId = meta(req, ['userId']).userId
  if (!userId) {
    res.json({})
    return
  }

  try {
    res.json(await affiliateSiteService.bulkUpdate(userId, req.body))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  update,
  bulkUpdate,
}
