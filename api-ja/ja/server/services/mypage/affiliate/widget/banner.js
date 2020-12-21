const sprintf = require('sprintf-js').sprintf
const oldPartnerId = require('@services/common/user').oldPartnerId
const tagService = require('@server/services/mypage/affiliate/tag')

/**
 * Return shortTags for images banner
 *
 * @param {Object} meta get UserId from meta data
 * @param {String} prefix prefix of original tag
 * @param {Number} bannerList number of image
 * @returns {Object}
 * @public
 */
async function index(meta, prefix, bannerList, startIndex = 0) {
  return _getShortTag(meta, prefix, _getArrayImgIndex(bannerList, startIndex))
}

/**
 * Get shortTags
 *
 * @param {Object} meta get UserId from meta data
 * @param {String} prefix prefix of original tag
 * @param {Array} list_img_id Array index of array images
 * @returns {Object}
 * @private
 */
async function _getShortTag(meta, prefix, list_img_id) {
  const aid = oldPartnerId(meta.userId)
    const result = {}

  await Promise.all(list_img_id.map(async id => {
    return result[id] = await tagService.encryptTag(prefix + sprintf('%07d', aid) + '0000000' + sprintf('%03d', id) + '006')
  }))

  return result
}

/**
 * Get array index of images
 *
 * @param {Number} bannerList number of image
 * @returns {Array}
 * @private
 */
function _getArrayImgIndex(bannerList, startIndex = 0) {
  return [...Array(bannerList).keys()].map(i => i += 1 + startIndex)
}

module.exports = {
  index,
}
