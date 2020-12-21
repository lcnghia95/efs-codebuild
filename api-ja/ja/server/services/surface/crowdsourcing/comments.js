const app = require('@server/server')

// Models
const commentModel = app.models.CrowdsourcingComments

// Utils
const objectUtil = app.utils.object
const arrayUtil = require('@ggj/utils/utils/array')

// Common
const commonUser = require('@services/common/user')
const syncService = require('@services/common/synchronize')

// Helper
const crowdsourcingHelper = require('./crowdsourcingHelper')

/**
 * Get surface crowdsourcing comments
 *
 * @param {Object} input
 * @param {Object} meta
 * @returns {Promise<Object>}
 * @public
 */
async function index(input, meta) {
  const crowdsourcingId = input.cId || 0
  const userId = meta.userId

  if(!crowdsourcingId) {
    return {}
  }

  const fields = {
    id: true,
    userId: true,
    isMatching: true,
    developerUserId: true,
  }
  const matching = input.matching || 0
  const crowdsourcing = await crowdsourcingHelper.crowdsourcing(crowdsourcingId, fields)

  if(!crowdsourcing) {
    return {}
  }

  const commentFields = objectUtil.nullFilter({
    id: true,
    userId: true,
    publishedAt: true,
    content: true,
    fileName: true,
    isSecretCommenter: (!userId) ? null : true,
    isSecretUser: (!userId) ? null : true,
    isTopic: true,
    topicCommentId: true,
  })
  const conditions = _commentConditions(userId, crowdsourcing, matching, commentFields)
  const comments = await _getCommentsByConditions(conditions)

  if(comments.length == 0) {
    return {}
  }

  const userIds = arrayUtil.unique(arrayUtil.column(comments, 'userId'))
  const users = arrayUtil.index(await commonUser.getUsers(userIds))
  const replies = {}
  const topics = comments.map(comment => {
    if(users[comment.userId]) {
      if(comment.isTopic == 1) {
        return _object(comment, users[comment.userId])
      } else if(comment.isTopic == 0 && comment.topicCommentId) {
        if(!replies[comment.topicCommentId]) {
          replies[comment.topicCommentId] = []
        }
        replies[comment.topicCommentId].push(_object(comment, users[comment.userId]))
      }
    }
  }).filter(comment => {
    return comment
  })

  if(topics.length == 0) {
    return {}
  }

  return arrayUtil.index(topics.map(topic => {
    if(replies[topic.id]) {
      topic.replies = replies[topic.id]
    }
    return topic
  }))
}

/**
 * Post surface crowdsourcing
 *
 * @param {Object} input
 * @param {Object} meta
 * @returns {Promise<number | any>}
 * @public
 * @param query
 */
async function store(input, meta, query) {
  const crowdsourcingId = input.crowdsourcingId || 0
  const replyId = input.replyId || 0

  if(!crowdsourcingId) {
    return 400
  }

  const crowdsourcing = await crowdsourcingHelper.crowdsourcing(
    crowdsourcingId,
    {id: true, isMatching: true},
  )

  if(!crowdsourcing) {
    return 400
  }

  const userId = meta.userId

  if(!userId) {
    return 401
  }

  const data = {
    isValid: 1,
    crowdsourcingId,
    userId,
    publishedAt: Date.now(),
    content: input.comment.content,
    isMatching: crowdsourcing.isMatching,
    isSecretUser: input.isPrivate || 0,
    topicCommentId: replyId,
    isTopic: (replyId == 0) ? 1 : 0,
    fileName: input.fileName || '',
    ipAddress: meta.ipAddress,
  }
  const insert = await commentModel.create(data)

  if(insert.id) {
    // Sync data with Fxon
    syncService.syncDataToFxon('crowdsourcing_comments', insert.id)
  }

  return query.isGetId ? {id: insert.id} : {}
}

/**
 * Update surface crowdsourcing comments
 *
 * @param {number} id
 * @param {Object} input
 * @param {Object} meta
 * @returns {Promise<Object>}
 * @public
 */
async function update(id, input, meta) {
  const crowdsourcing = await _getCrowdsourcingComment(id, meta.userId, {id: true})
  const secretUser = (!input.secretUser) ? 0 : 1

  if(!crowdsourcing) {
    return 400
  }

  const update = await crowdsourcing.updateAttributes(
    {isSecretUser: secretUser, ipAddress: meta.ipAddress},
  )

  // Sync data with Fxon_message_crowdsourcing
  syncService.syncDataToFxon('crowdsourcing_comments', update.id)

  return update
}

// ==============================================================================

/**
 * Generate crowdsourcing comments conditions
 * @param {number} userId
 * @param {Object} crowdsourcing
 * @param {number} matching
 * @param {Object} fields
 * @returns {Object}
 * @private
 */
function _commentConditions(userId, crowdsourcing, matching, fields){
  let conditions = {
    where: {
      isValid: 1,
      crowdsourcingId: crowdsourcing.id,
      isMatching: matching,
    },
    fields,
  }

  if(!userId) {
    conditions.where.isSecretCommenter = 0
    conditions.where.isSecretUser = 0
    conditions.where.isDelete = 0
    conditions.where.isDeleteAsp = 0
  } else {
    if(userId == crowdsourcing.userId) {
      return conditions
    } else {
      conditions = {
        where: {
          and: [
            conditions.where,
            {
              or: [
                {
                  isSecretCommenter: 0,
                  isSecretUser: 0,
                  isDelete: 0,
                  isDeleteAsp: 0,
                },
                {
                  userId,
                },
              ],
            },
          ],
        },
        fields,
      }
    }
  }

  return conditions
}

/**
 * Get crowdsourcing comments by conditions
 * @param {Object} conditions
 * @returns {Promise<Array>}
 * @private
 */
async function _getCommentsByConditions(conditions) {
  return await commentModel.find(conditions)
}

/**
 * Get crowdsourcing comment record
 * @param {Number} id
 * @param {Number} userId
 * @param {Object} fields
 * @returns {Promise<Object> || null}
 * @private
 */
async function _getCrowdsourcingComment(id, userId, fields) {
  return await commentModel.findOne({
    where: {
      isValid: 1,
      statusType: 1,
      id,
      userId,
    },
    fields,
  })
}

/**
 * Generate response object
 * @param {Object} comment
 * @param {Object} user
 * @returns {Object}
 * @private
 */
function _object(comment, user) {
  return objectUtil.nullFilter({
    id: comment.id || null,
    content: comment.content || null,
    fileName: comment.fileName || null,
    publishedDate: comment.publishedAt || null,
    user: {
      id: user.id,
      name: user.nickName,
    },
    secretCommenter: comment.isSecretCommenter || null,
    secretUser: comment.isSecretUser || null,
    isTopic: comment.isTopic || null,
  })
}


module.exports = {
  index,
  store,
  update,
}
