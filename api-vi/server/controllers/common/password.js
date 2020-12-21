const passwordService = require('@@services/common/password')

async function reset(req, res) {
  let email = req.body.email || '',
    token = req.body.token || '',
    password = req.body.password || ''

  if (!email || !token || !password) {
    // Error: invalid token
    res.json({ error: 'ERR000002' })
    return
  }

  res.json(await passwordService.reset(email, token, password))
}

module.exports = {
  reset,
}
