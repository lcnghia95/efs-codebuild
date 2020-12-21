const helper = require('@controllers/mypage/helper')
const service = require('@services/mypage/developer/price')

async function isEditable(req, res) {
  res.json(await service.isEditable(parseInt(req.params.id), helper.userId(req)))
}

module.exports = {
  isEditable,
}
