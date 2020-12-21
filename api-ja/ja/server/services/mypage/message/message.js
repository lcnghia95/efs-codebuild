const app = require('@server/server')
const commonUser = require('@services/common/user')

// models
const messageModel = app.models.Messages

// utils
const paging = app.utils.paging
const arrayUtil = require('@ggj/utils/utils/array')

const SEND_MESSAGE_TYPE = 1
const RECEIVE_MESSAGE_TYPE = 2
const MESSAGE_SENT_STATUS = 1
const NO_TITLE = 'タイトルなし'
const LIMIT = 20
const DAY_INTERVAL = 1000 * 60 * 60 * 24 // 24 hours in milliseconds

/**
 * Get messages data
 *
 * @param {Object} condition
 * @param {string} fields
 * @param {number} page
 * @returns {Promise<Array>}
 * @private
 */
async function _find(condition, fields, page, limit) {
  const offset = paging.getOffsetCondition(page, limit)
  return await messageModel.find({
    where: condition,
    limit: offset.limit,
    skip: offset.skip,
    order: 'publishedAt DESC',
    fields: app.utils.query.fields(fields),
  })
}

/**
 * Generate index data
 *
 * @param {Object} where
 * @param {number} page
 * @returns {Promise<Object>}
 * @private
 */
async function _index(where, page, fields) {
  const [total, messages] = await Promise.all([
    messageModel.count(where),
    _find(where, fields, page, LIMIT),
  ])
  if (!messages || messages.length === 0) {
    return []
  }

  const fromUserIds = arrayUtil.column(messages, 'fromUserId', true)
    const toUserIds = arrayUtil.column(messages, 'toUserId', true)
    const userIds = (fromUserIds.length === 0) ? toUserIds : fromUserIds
    const users = await commonUser.getUsers(userIds)
    const userObjects = arrayUtil.index(users)
    const data = _convertData(messages, userObjects)
  return paging.addPagingInformation(data, page, total, LIMIT)
}

/**
 * Convert data to response objects
 *
 * @param  {array}  messages
 * @param  {Object}  userObjects
 * @return {Object}
 * @private
 */
function _convertData(messages, userObjects) {
  return messages.map(message => {
    const from = userObjects[message.fromUserId] || {}
      const to = userObjects[message.toUserId] || {}
    return _object(message, from, to)
  })
}

/**
 * Message object
 *
 * @param {Object} message
 * @param {Object} from
 * @param {Object} to
 * @return {Object}
 * @private
 */
function _object(message, from, to) {
  return app.utils.object.nullFilter({
    id: message.id,
    date: message.publishedAt,
    title: message.title || NO_TITLE,
    content: message.content,
    statusType: message.statusType || 0,
    sender: from.nickName,
    receiverId: message.toUserId,
    receiver: to.nickName,
    replyId: parseInt(message.replyId || 0),
    senderId: from.id,
    isSent: message.isSent,
  })
}

/**
 * New message objects (check null for message title)
 *
 * @param messages
 * @return {array}
 * @private
 */
function _newMessageObjects(messages) {
  return messages.map(message => {
    if (!message.title) {
      message.title = NO_TITLE
    }
    return message
  })
}

/**
 * Get inbox message
 *
 * @param {Object} input
 * @param {Object} meta
 * @returns {Promise<Object>}
 * @public
 */
async function index(input, meta) {
  const userId = parseInt(meta.userId)
  if (userId > 0) {
    const fields = 'id,fromUserId,publishedAt,title,statusType,replyId'
      const page = parseInt(input.page || 1)
      const where = {
        isValid: 1,
        toUserId: userId,
        isToDisplay: 1,
        isSent: MESSAGE_SENT_STATUS,
      }
    return await _index(where, page, fields)
  }
  return []
}

/**
 * Get message by status: sent or draft
 *
 * @param {number} status: 1 is sent, 0 is draft
 * @param {Object} input
 * @param {Object} meta
 * @returns {Promise<Object>}
 * @public
 */
async function getMessageByStatus(status, input, meta) {
  const userId = parseInt(meta.userId)
  if (userId > 0) {
    const fields = 'id,toUserId,publishedAt,title,statusType,replyId'
      const page = parseInt(input.page || 1)
      const where = {
        isValid: 1,
        fromUserId: userId,
        isFromDisplay: 1,
        isSent: status,
      }
    return await _index(where, page, fields)
  }
  return []
}

/**
 * Get message by id
 *
 * @param {number} id
 * @param {Object} meta
 * @returns {Promise<Object>}
 * @public
 */
async function show(id, meta) {
  const userId = parseInt(meta.userId)
  // NULL
  if (userId == 0) {
    return {}
  }

  // Get message
  const message = await messageModel.findOne({
    where: {
      isValid: 1,
      id: id,
    },
  })
  // NULL
  if (!message || message.length === 0) {
    return {}
  }

  // Get partner user id
  let partnerUserId = 0,
    message_type = 0
  if (message.fromUserId == userId) {
    message_type = SEND_MESSAGE_TYPE
    partnerUserId = message.toUserId
  } else if (message.toUserId == userId) {
    message_type = RECEIVE_MESSAGE_TYPE
    partnerUserId = message.fromUserId
  }
  // NULL
  if (message_type == 0) {
    return {}
  }
  // Mark read
  if (message_type == RECEIVE_MESSAGE_TYPE && !message.statusType) {
    messageModel.upsert({
      id: message.id,
      statusType: 1,
    })
  }

  const users = await commonUser.getUsers([partnerUserId, userId])
    const userObjects = arrayUtil.index(users)
    const from = userObjects[message.fromUserId] || {}
    const to = userObjects[message.toUserId] || {}
  return _object(message, from, to)
}

/**
 * Get new messages
 *
 * @param {Object} meta
 * @returns {Promise<Object>}
 * @public
 */
async function newMessage(userId) {
  if (userId == 0) {
    return {}
  }

  const startOfDay = Math.floor(Date.now() / DAY_INTERVAL) * DAY_INTERVAL
  const order = 'publishedAt DESC'
  const fields = {
      id: true,
      publishedAt: true,
      title: true,
    }
  const condition = {
      toUserId: userId,
      isToDisplay: 1,
      isSent: 1,
      statusType: 0,
    }

  const [today, lastest] = await Promise.all([
      messageModel.find({
        where: Object.assign({
          publishedAt: {
            gte: startOfDay,
          },
        }, condition),
        order,
        fields,
      }),
      messageModel.find({
        where: Object.assign({
          publishedAt: {
            lt: startOfDay,
          },
        }, condition),
        order,
        fields,
      }),
    ])

  return {
    today: today.length > 0 ? _newMessageObjects(today) : undefined,
    lastest: lastest.length > 0 ? _newMessageObjects(lastest) : undefined,
  }
}

module.exports = {
  new: newMessage,
  show,
  index,
  getMessageByStatus,
}
