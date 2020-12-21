const app = require('@server/server')
const userCommonService = require('@services/common/user')
const saleCommonService = require('@services/common/sale')
const TKOOL_PRODUCT_ID_1 = [5735, 5941]
const TKOOL_PRODUCT_ID_2 = [7560]
const SUB_EMAIL_TYPE = 2
const answerMap = {
  1: 'jobType',
  2: 'bloodType',
  3: 'styleAdvise',
  4: 'adviseExperience',
  5: 'adviseMoneyAmount',
}

const attributes = [
  'firstName',
  'lastName',
  'firstNameKana',
  'lastNameKana',
  'zip',
  'prefectureId',
  'address1',
  'address2',
  'tel',
]

/**
 * Get user data
 *
 * @param {number} userId
 * @param {Object} fields
 * @returns {Promise<Object>}
 * @private
 */
async function _user(userId, fields) {
  const user = await app.models.Users.findOne({
    where: {
      id: userId,
      isValid: 1,
      statusType: 1,
    },
    fields,
  })

  if (userId != ((user || {}).id || 0)) {
    return {}
  }

  return user || {}
}

/**
 * Check if user can access tkool menu
 *
 * @param {number} userId
 * @returns {Promise<number>}
 * @private
 */
async function _isTkool(userId) {
  const [tkool1, tkool2] = await Promise.all([
    saleCommonService.isPurchased(userId, TKOOL_PRODUCT_ID_1, false),
    saleCommonService.isPurchased(userId, TKOOL_PRODUCT_ID_2),
  ])
  return +(tkool1 || tkool2)
}

/**
 * Check if developer has address info or not
 *
 * @param {Object} user
 * @returns {number}
 * @private
 */
function _hasInfo(user) {
  if (user.isDeveloper != 1) {
    return 0
  }
  // TODO: use this
  // return userCommonService.hasAddress(user)
  const result = +attributes.map(attribute => (user[attribute] || '').length).includes(
    0)
  return 1 - result
}

/**
 * Check if privileges of marchant user
 *
 * @param {Object} user
 * @returns {number}
 * @private
 */
async function _getPrivileges(user) {
  if (user.isMarchant != 1) {
    return 0
  }
  const privileges = await app.models.MarchantPrivileges.findOne({
    where: {
      isValid: 1,
      userId: user.id,
      marchantCompanyId: user.companyId,
    },
    fields: {
      privilegeType: true,
    },
  })
  return (privileges || {}).privilegeType || 0
}

/**
 * Get user setting information
 *
 * @param {number} userId
 * @returns {Promise<Object>}
 * @public
 */
async function show(userId) {
  if (userId == 0) {
    return {}
  }

  const user = await _user(userId)
  if (!user) {
    return {}
  }

  const isDeveloper = user.isDeveloper == 1
  const condition = {
      where: {
        isValid: 1,
        userId,
      },
      order: 'id DESC',
      fields: {
        content: true,
      },
    }
    const [
      answers,
      feeds,
      subEmail,
      intro,
      transaction,
      conclusion,
      conclusionBefore,
    ] = await Promise.all([
      app.models.UserAnswers.find({
        where: {
          isValid: 1,
          userId,
        },
        order: 'id ASC',
        fields: {
          statusType: true,
          questionType: true,
          answerType: true,
        },
      }),
      app.models.Feeds.find({
        where: {
          isValid: 1,
          userId,
        },
        order: 'id ASC',
        fields: {
          feedUrl: true,
          categoryType: true,
        },
      }),
      app.models.UserEmailAddresses.findOne({
        where: {
          isValid: 1,
          userId,
          mailType: SUB_EMAIL_TYPE,
        },
        order: 'id DESC',
        fields: {
          mailAddress: true,
        },
      }),
      app.models.UserSelfIntroduction.findOne(condition),
      isDeveloper ? app.models.Transaction.findOne(condition) : {},
      isDeveloper ? app.models.ConclusionBefore.findOne(condition) : {},
      isDeveloper ? app.models.Conclusion.findOne(condition) : {},
    ])

    let obj = answers.reduce((result, answer) => {
    const idx = answerMap[answer.questionType]
      if (idx && !result[idx]) {
        result[idx] = answer.answerType
      }
      if (result.isPublic == 1 && answer.statusType == 0) {
        result.isPublic = 0
      }
      return result
    }, {
      isPublic: 1,
    }),

     idx = 0
    obj = feeds.reduce((result, feed) => {
    if (feed.categoryType > 0 && feed.feedUrl.length > 0) {
      idx++
      result['rssUrl' + idx] = feed.feedUrl
      result['rssCat' + idx] = feed.categoryType
    }
    return result
  }, obj)

  const res = Object.assign({
    id: userId,
    detailUrl: '/users/' + userId,
    mailPR: user.isDelivery,
    nickName: user.nickName,
    email: user.mailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    firstNameKana: user.firstNameKana,
    lastNameKana: user.lastNameKana,
    corporateName: user.corporateName,
    registrationNumber: user.registrationNumber,
    zip: user.zip,
    prefectureId: user.prefectureId,
    address1: user.address1,
    address2: user.address2,
    address3: user.address3,
    tel: user.tel,
    fax: user.fax,
    sexType: user.sexType,
    birthday: user.birthday,
    selfIntroduction: (intro || {}).content,
    transaction: (transaction || {}).content,
    conclusion: (conclusion || {}).content,
    conclusionBefore: (conclusionBefore || {}).content,
    subEmail: (subEmail || {}).mailAddress,
  }, obj)
  return res
}

/**
 * Get user information
 *
 * @param {number} userId
 * @returns {Promise<Object>}
 * @public
 */
async function information(userId, loginType) {
  if (userId == 0) {
    return {}
  }

  const [user, isTkool] = await Promise.all([
    _user(userId, {
      id: true,
      isBuyuser: true,
      isDeveloper: true,
      isAffiliate: true,
      isMarchant: true,
      isCrowdsourcing: true,
      companyId: true,
      mailAddress: true,
      nickName: true,
      firstName: true,
      lastName: true,
      firstNameKana: true,
      lastNameKana: true,
      zip: true,
      prefectureId: true,
      address1: true,
      address2: true,
      tel: true,
      createdAt: true,
    }),
    _isTkool(userId),
  ])

  if (!user.id) {
    return {}
  }

  const privileges = await _getPrivileges(user)

  return {
    id: userId,
    aid: user.isAffiliate == 1 ? userCommonService.oldPartnerId(userId) : 0,
    name: user.nickName,
    loginType,
    isBuyuser: user.isBuyuser == 1 ? 1 : 0,
    isMarchant: user.isMarchant == 1 ? 1 : 0,
    isPartner: user.isAffiliate == 1 ? 1 : 0,
    isDeveloper: user.isDeveloper == 1 ? 1 : 0,
    isCrowdsourcing: user.isCrowdsourcing == 1 ? 1 : 0,
    isTkool,
    email: user.mailAddress,
    hasInfo: _hasInfo(user),
    privileges,
    createdAt: user.createdAt,
  }
}

module.exports = {
  show,
  information,
}
