const app = require('@server/server')
const userModel = app.models.Users
const userLoginModel = app.models.UserLogin

async function validateEmail(req, res) {
  let condition = {
      isValid: 1,
      mailAddress: req.body.email,
    },
    // TODO: use findOne instead of count
    [user, userLogin] = await Promise.all([
      userModel.count(condition),
      userLoginModel.count(condition)
    ])
  res.json({
    res: 1 - (user > 0 || userLogin > 0)
  })
}

module.exports = {
  validateEmail
}
