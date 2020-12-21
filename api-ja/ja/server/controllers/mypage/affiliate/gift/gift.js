const service = require('@services/mypage/affiliate/gift/gift')

async function indexGiftPr(req, res) {
  res.json(await service.indexGiftPr(
    req.params.id,
    req.params.pr,
    'n_p00',
  ))
}

module.exports = {
  indexGiftPr,
}
