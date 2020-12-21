const sprintf = require('sprintf-js').sprintf
const oldPartnerId = require('@services/common/user').oldPartnerId

const tagService = require('@server/services/mypage/affiliate/tag')
const LIST_IMG_AFF_GIFT_ID = [1, 2, 3, 4]

async function indexGiftPr(userId, ea, prefix) {
  return getShortTag(userId, ea, prefix, LIST_IMG_AFF_GIFT_ID)
}

async function getShortTag(userId, ea, prefix, LIST_IMG_ID) {
  const aid = oldPartnerId(userId)
    const result = {}

  await Promise.all(LIST_IMG_ID.map(async id => {
    return result[id] = await tagService.encryptTag(prefix + sprintf('%05d', ea) + sprintf('%07d', aid) + '0000000' + sprintf('%03d', id) + '027')
  }))
  return result
}

module.exports = {
  indexGiftPr,
}
