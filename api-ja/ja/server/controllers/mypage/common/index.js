const pairsService = require('@services/mypage/common/pairs')

async function pairs(req, res) {
  return res.json(await pairsService.index())
}

module.exports = {
  pairs,
}