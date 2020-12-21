const NonMemberModel = require('@server/server').models.NonMembers
const syncDataToFxon = require('@services/common/synchronize').syncDataToFxon
const map = {
  1:'北海道',
  2:'青森県',
  3:'岩手県',
  4:'宮城県',
  5:'秋田県',
  6:'山形県',
  7:'福島県',
  8:'茨城県',
  9:'栃木県',
  10:'群馬県',
  11:'埼玉県',
  12:'千葉県',
  13:'東京都',
  14:'神奈川県',
  15:'新潟県',
  16:'富山県',
  17:'石川県',
  18:'福井県',
  19:'山梨県',
  20:'長野県',
  21:'岐阜県',
  22:'静岡県',
  23:'愛知県',
  24:'三重県',
  25:'滋賀県',
  26:'京都府',
  27:'大阪府',
  28:'兵庫県',
  29:'奈良県',
  30:'和歌山県',
  31:'鳥取県',
  32:'島根県',
  33:'岡山県',
  34:'広島県',
  35:'山口県',
  36:'徳島県',
  37:'香川県',
  38:'愛媛県',
  39:'高知県',
  40:'福岡県',
  41:'佐賀県',
  42:'長崎県',
  43:'熊本県',
  44:'大分県',
  45:'宮崎県',
  46:'鹿児島県',
  47:'沖縄県',
}

/**
 * Register new non members
 *
 * @param {Object} data
 * @param {Object} salesSessionId
 * @returns {Object}
 * @public
 */
async function add(data, salesSessionId, ipAddress, userAgent) {
  const record = await NonMemberModel.create({
    isValid: 1,
    statusType: 1,
    isDelivery: 0,
    mailAddress: data.mailAddress,
    firstName: data.firstName,
    lastName: data.lastName,
    firstNameKana: data.firstNameKana,
    lastNameKana: data.lastNameKana,
    nickName: data.nickName,
    zip: data.zip,
    city: map[parseInt(data.prefectureId)] || '',
    address1: data.address1,
    address2: data.address2,
    address3: data.address3,
    tel: data.tel,
    ipAddress,
    userAgent,
  })
  syncDataToFxon('non_members', record.id, {is_valid: 1})
  return record
}

/**
 * Remove `privacy.non_members` data
 *
 * @param {number} id
 * @returns {void}
 * @public
 */
async function remove(id) {
  const record = await NonMemberModel.findOne({
    where: {id,},
    fields: {id: true, isValid: true},
  })
  if (record) {
    syncDataToFxon('non_members', record.id, {is_valid: 0})
  }
}

module.exports = {
  add,
  remove,
}
