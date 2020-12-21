const app = require('@server/server')
const commonUser = require('@services/common/user')
const commonSale = require('@services/common/sale')

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
  if(language != 1) {
    return []
  }

  const user = await commonUser.getUser(userId, {
    isBuyuser: true,
  })
  if (user.isBuyuser != 1) {
    return []
  }
  const isPurchased = commonSale.isPurchased(userId)
  if (!isPurchased) {
    return false
  }
  const contactBuyerConditionIds = await _contactBuyerConditionIds(userId)
  if (contactBuyerConditionIds.length == 0) {
    return []
  }
  const messages = await app.models.ContactBuyerMessages.find({
      where: {
        isValid: 1,
        approvedType: 1,
        contactBuyerConditionId: {
          inq: contactBuyerConditionIds,
        },
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

/**
 * Get condition ids
 *
 * @param {number} userId
 * @param {Object} userObjects
 * @returns {Promise<Array>}
 * @private
 */
async function _contactBuyerConditionIds(userId) {
  const targetProductIds = await _targetProductIds(userId)
  if (targetProductIds.length == 0) {
    return []
  }
  const conditions = await app.models.ContactBuyerConditionTargets.find({
    where: {
      isValid: 1,
      productId: {
        inq: targetProductIds,
      },
    },
    fields: {
      contactBuyerConditionId: true,
    },
  })
  return arrayUtil.column(conditions, 'contactBuyerConditionId')
}

/**
 * Get target ids
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 * @private
 */
async function _targetProductIds(userId) {
  const excludeDeveloperIds = await _excludeDeveloperIds(userId)
    const saleConditions = commonSale.saleConditions(userId, false)

  if (excludeDeveloperIds.length > 0) {
    saleConditions.where.developerUserId = {
      nin: excludeDeveloperIds,
    }
  }
  const sales = await app.models.Sales.find({
    where: saleConditions.where,
    fields: {
      productId: true,
    },
  })
  return arrayUtil.column(sales, 'productId', true)
}

/**
 * Get excluded develop user id
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 * @private
 */
async function _excludeDeveloperIds(userId) {
  const excludes = await app.models.ContactBuyerExcludeUsers.find({
    where: {
      isValid: 1,
      excludeUserId: userId,
    },
    fields: {
      userId: true,
    },
  })
  return excludes.length == 0 ? [] : arrayUtil.column(excludes, 'userId', true)
}

module.exports = {
  recent,
}
