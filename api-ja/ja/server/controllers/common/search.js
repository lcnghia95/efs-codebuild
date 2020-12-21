const app = require('@server/server')
const userService = require('@services/common/user')
const meta = app.utils.meta

async function searchUsers(req, res) {
  res.json(await userService.search(req.query, meta.meta(req)))
}

module.exports = {
  searchUsers,
}
