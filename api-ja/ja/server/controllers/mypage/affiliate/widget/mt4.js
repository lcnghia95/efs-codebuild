const app = require('@server/server')
const mt4Service = require('@services/mypage/affiliate/widget/mt4')
const metaUtil = app.utils.meta

async function accounts(req, res) {
  res.json(await mt4Service.accounts(req.params.id, metaUtil.meta(req)))
}

async function magicNumber(req, res) {
  const accountId = req.params.accountId || 0
  if (!accountId) {
    res.json([])
    return
  }

  res.json(await mt4Service.magicNumber(accountId))
}

module.exports = {
  accounts,
  magicNumber,
}
