const app = require('@server/server')

const paging = require('@ggj/utils/utils/paging')
const stringUtil = require('@ggj/utils/utils/string')
const {
  oldDeveloperId,
  marchantUserId,
  oldMarchantId,
  partnerId,
  oldPartnerId,
} = require('@ggj/utils/utils/user')
// models
const userModel = app.models.Users
const userAnswerModel = app.models.UserAnswers
const userSelfIntroductionModel = app.models.UserSelfIntroduction
const userEmailAddressesModel = app.models.UserEmailAddresses

const COMMON_FIELDS = {
  id: true,
  nickName: true,
}

const SUB_EMAIL_TYPE = 2


/**
 * search users
 *
 * @param {Object} input
 * @param {Object} meta
 *
 * @return {Object}
 * @public
 */
async function search(input, meta) {
  const userId = meta.userId || 0
    const page = parseInt(input.page) || 1
    const limit = input.limit === undefined ? 12 : parseInt(input.limit) || 0
    const skip = limit * (page - 1) || 0

  if (!input.keywords) {
    return paging.addPagingInformation([], page, 0, limit)
  }

  const conditions = _searchConditions(userId, stringUtil.getKeywords(input.keywords), limit, skip)
    const [users, total] = await Promise.all([
      userModel.find(conditions),
      userModel.count(conditions.where),
    ])
    const data = users.map(_object)

  return paging.addPagingInformation(data, page, total || 0, limit)
}

/**
 * generate object to show
 *
 * @param {object} user
 *
 * @return {Object}
 * @private
 */
function _object(user) {
  return {
    id: user.id,
    name: user.nickName,
  }
}

/**
 * generate search conditions
 *
 * @param {Number} userId
 * @param {string} keywords
 * @param {number} limit
 * @param {number} skip
 *
 * @return {Object}
 * @private
 */
function _searchConditions(userId, keywords, limit, skip) {
  // add or conditions for each keywords user input (separated by space)
  const orKeys = keywords.split('|')
    const keys = orKeys.reduce((acc, keyword) => {
      acc.push({
        id: {
          like: `%${keyword}%`,
        },
      }, {
        nickName: {
          like: `%${keyword}%`,
        },
      })
      return acc
    }, [])

  return {
    where: {
      isValid: 1,
      statusType: 1,
      id: {
        nin: [userId],
      },
      and: [{
        or: keys,
      }],
    },
    fields: {
      id: true,
      nickName: true,
    },
    limit,
    skip,
  }
}

/**
 * get old userId and mode Id
 *
 * @param {Number} userId
 * @return {Object}
 * @public
 */
async function oldUIdAndModeId(id) {
  const user = await userModel.findOne({
    where: {
      id,
      isValid: 1,
      statusType: 1,
    },
    fields: {
      id: true,
      isBuyuser: true,
      isDeveloper: true,
      isAffiliate: true,
      isMarchant: true,
    },
  })

  if (!user) {
    return {}
  }

  const result = {}
  if (user.isBuyuser == 1) {
    result[1] = id
  }
  if (user.isDeveloper == 1) {
    result[2] = oldDeveloperId(id)
  }
  if (user.isAffiliate == 1) {
    result[3] = oldPartnerId(id)
  }
  if (user.isMarchant == 1) {
    result[4] = oldMarchantId(id)
  }
  return result
}

/**
 * Get users self introduction
 *
 * @param {Array} userIds
 * @return {Promise<Array>}
 * @private
 */
async function usersSelfIntroduction(userIds) {
  return await userSelfIntroductionModel.find({
    where: {
      userId: {
        inq: userIds,
      },
    },
    order: 'id DESC',
    fields: {
      userId: true,
      content: true,
    },
  })
}

/**
 * Get user answer data by user id
 *
 * @param {Number} userId
 * @param {Boolean} isOnlyPublic
 * @return {Promise<Array>}
 * @private
 */
async function userAnswers(userId, isOnlyPublic = true) {
  return await userAnswerModel.find({
    where: {
      userId,
      statusType: isOnlyPublic ? 1 : undefined,
    },
    order: ['questionType ASC', 'id DESC'],
    fields: {
      statusType: true,
      questionType: true,
      answerType: true,
    },
  })
}

/**
 * Get user
 *
 * @param {number} userId
 * @returns {Object}
 * @public
 */
async function getUser(userId, fields = COMMON_FIELDS) {
  if (!userId) {
    return {}
  }
  const users = await getUsers([userId], fields)
  return users[0] || {}
}

/**
 * Get users
 *
 * @param {Array} userIds
 * @returns {Array}
 * @public
 */
async function getUsers(userIds, fields = COMMON_FIELDS) {
  return await userModel.find({
    where: {
      id: {
        inq: userIds,
      },
      isValid: 1,
      statusType: 1,
    },
    fields,
  })
}

/**
 * Get user information
 *
 * @param {number} userId
 * @returns {Object}
 * @public
 */
async function getUserFullInformation(userId, mailAddress = false) {
  // TODO: create log here
  // api, input userid, referer, output userId

  // NOTICE: BE CAREFULL WHEN GET FULL INFORMATION !!!
  const fields = {
    id: true,
    zip: true,
    address1: true,
    address2: true,
    address3: true,
    prefectureId: true,
    tel: true,
    firstName: true,
    lastName: true,
    firstNameKana: true,
    lastNameKana: true,
    nickName: true,
    mailAddress,
  }
  return await userModel.findOne({
    where: {
      id: userId,
      isValid: 1,
      statusType: 1,
    },
    fields,
  })
}

/**
 * Check if given user is match with given conditions
 *
 * @param {number} userId
 * @param {object} conditions
 * @return {Promise<boolean>}
 * @private
 */
async function _checkUser(userId, conditions) {
  const count = userId == 0 ?
    0 :
    await userModel.count(Object.assign({
      id: userId,
      isValid: 1,
      statusType: 1,
    }, conditions))

  return count === 1
}

/**
 * Check if user with id = userId is buy user or not
 *
 * @param {number} userId
 * @returns {Boolean}
 * @public
 */
async function isBuyUser(userId) {
  return await _checkUser(userId, {
    isBuyuser: 1,
  })
}

/**
 * Check if user with id = userId is marchant user or not
 *
 * @param {number} userId
 * @returns {Boolean}
 * @public
 */
async function isMarchantUser(userId) {
  return await _checkUser(userId, {
    isMarchant: 1,
  })
}

/**
 * Check if user with id = userId is dev user or not
 *
 * @param {number} userId
 * @returns {Boolean}
 * @public
 */
async function isDeveloperUser(userId) {
  return await _checkUser(userId, {
    isDeveloper: 1,
  })
}

/**
 * Check if user with id = userId is affiliate user or not
 *
 * @param {number} userId
 * @returns {Boolean}
 * @public
 */
async function isAffiliateUser(userId) {
  return await _checkUser(userId, {
    isAffiliate: 1,
  })
}

/**
 * Get user nickname
 * Ex: [{id: 1, nickName: 'gogojungle'}] => {1: "gogojungle"}
 *
 * @param {Array} users
 * @returns {Object}
 * @public
 */
function name(users) {
  return users.reduce((result, user) => {
    result[user.id] = user.nickName
    return result
  }, {})
}

/**
 * Check if user have address or not
 *
 * @param {Object} user
 * @returns {Boolean}
 * @public
 */
function hasAddress(user) {
  const keys = [
      'firstName',
      'lastName',
      'firstNameKana',
      'lastNameKana',
      'zip',
      'prefectureId',
      'address1',
      'address2',
      'tel',
      // 'nickname', \this fields is alway required
    ]
    const key = keys.find(key => (user[key] || '').length == 0)
  return key ? false : true
}

/**
 * Get email address and sub-email address by userId
 * Eg: => {email: "mypage@gogojungle.co.jp", subEmail "abc@gmail.com"}
 *
 * @param {Number} userId
 * @returns {Promise<Object>}
 * @public
 */
async function getUserEmails(userId) {
  const [email, subEmail] = await Promise.all([
    getEmails([userId]),
    getSubEmails([userId]),
  ])

  return {
    email: email[userId] || '',
    subEmail: subEmail[userId] || '',
  }
}


async function getUserEmailsAndLanguage(userId) {
  const [email, subEmail] = await Promise.all([
    getEmailsAndLanguage([userId]),
    getSubEmails([userId]),
  ])

  return {
    email: email[userId].mailAddress || '',
    subEmail: subEmail[userId] || '',
    languages: email[userId].languages || 1,
  }
}

async function getEmailsAndLanguage(userIds) {
  const users = await userModel.find({
    where: {
      id: {
        inq: userIds,
      },
      isValid: 1,
      statusType: 1,
    },
    fields: {
      id: true,
      mailAddress: true,
      languages: true,
    },
  }) || {}

  return users.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})
}

/**
 * Get emails address by userIds
 * Eg: => {140003: "mypage@gogojungle.co.jp", 156465: "abc@gmail.com", ...}
 *
 * @param {Array} userIds
 * @return {Promise<Object>}
 * @public
 */
async function getEmails(userIds) {
  const users = await userModel.find({
    where: {
      id: {
        inq: userIds,
      },
      isValid: 1,
      statusType: 1,
    },
    fields: {
      id: true,
      mailAddress: true,
    },
  }) || {}

  return users.reduce((acc, user) => {
    acc[user.id] = user.mailAddress || ''
    return acc
  }, {})
}

/**
 * Get sub emails by user ids
 * Eg: => {140003: "mypage@gogojungle.co.jp", 156465: "abc@gmail.com", ...}
 * @param {Array} userIds
 * @return {Promise<Object>}
 * @public
 */
async function getSubEmails(userIds) {
  const subEmails = await userEmailAddressesModel.find({
    where: {
      isValid: 1,
      userId: {
        inq: userIds,
      },
      mailType: SUB_EMAIL_TYPE,
    },
    order: 'id DESC',
    fields: {
      userId: true,
      mailAddress: true,
    },
  }) || {}

  return subEmails.reduce((acc, email) => {
    acc[email.userId] = email.mailAddress || ''
    return acc
  }, {})
}

module.exports = {
  name,
  partnerId,
  getUser,
  getUsers,
  isBuyUser,
  isMarchantUser,
  isDeveloperUser,
  isAffiliateUser,
  hasAddress,
  userAnswers,
  oldPartnerId,
  oldMarchantId,
  oldDeveloperId,
  marchantUserId,
  oldUIdAndModeId,
  usersSelfIntroduction,
  getUserFullInformation,
  search,
  getUserEmails,
  getUserEmailsAndLanguage,
  getEmails,
  getSubEmails,
}
