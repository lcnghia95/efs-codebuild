const helper = require('@controllers/mypage/helper')
const giftService = require('@services/mypage/gift/gift')

async function index(req, res){
  res.json(await giftService.index(helper.userId(req)))
}

module.exports = {
  index,
}
