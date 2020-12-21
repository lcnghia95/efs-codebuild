const app = require('@server/server')
const commonUser = require('@services/common/user')

// utils
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get contact from sellers to partners
 *
 * @param {number} userId
 * @param {number} limit
 * @param {number} language
 * @returns {Promise<Array>}
 * @public
 */
async function recent(userId, limit, language = 1) {

  // Only display with japanese language
  if(language != 1) {
    return []
  }
  const user = await commonUser.getUser(userId, {
    isAffiliate: true,
  })
  if (user.isAffiliate != 1) {
    return []
  }
  const messages = await app.models.ContactPartnerMessages.find({
      where: {
        isValid: 1,
        approvedType: 1,
      },
      limit,
      order: 'publishedAt DESC',
      fields: {
        id: true,
        title: true,
        publishedAt: true,
        userId: true,
      },
    })
    const userIds = arrayUtil.column(messages, 'userId')
    const users = await commonUser.getUsers(userIds)
    const userObjects = arrayUtil.index(users)
  return messages.map(message => _object(message, userObjects))
}

/**
 * Contact object
 *
 * @param {Object} message
 * @param {Object} userObjects
 * @return {Object}
 * @private
 */
function _object(message, userObjects) {
  return {
    id: message.id,
    title: message.title,
    date: message.publishedAt,
    seller: (userObjects[message.userId] || {}).nickName,
  }
}

module.exports = {
  recent,
}
