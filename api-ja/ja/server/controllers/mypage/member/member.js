
const member = require('@server/services/mypage/member/member')

async function checkRss(req, res) {
  const data = await member.validateRss(req.body.url)

  res.json({
    status: data ? 1 : 0,
  })
}

module.exports = {
  checkRss,
}
