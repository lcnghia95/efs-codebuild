const app = require('@server/server')
const service = require('@server/services/common/user')

async function getUserInfo(req, res) {
  try {
    res.json(await service.getUser(req.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function getMyInfo(req, res) {
  try {
    res.json(await service.getUser(app.utils.meta.meta(req, ['userId']).userId))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  getUserInfo,
  getMyInfo,
}
