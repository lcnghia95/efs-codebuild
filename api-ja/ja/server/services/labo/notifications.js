const app = require('@server/server')

const articleNotifModel = app.models.ArticleNotification
const systemNotifModel = app.models.SystemNotification
const systemNotifUserModel = app.models.SystemNotifUser
const refArticlesModel = app.models.RefArticles

const NOTIF_TYPE = {
  ARTICLE: 0,
  SYSTEM: 1,
}

/**
 * Utility to notify all user in an article when a new answer has been posted
 * @param {Array} usersList
 * @param {String} url
 */
async function createArticleNotification(usersList, options) {
  if(!usersList
    || !options.articleId
    || !Array.isArray(usersList)
  ) {
    console.log('createArticleNotification: Not enough inputs')
    return false
  }
  let targetUrl
  if (options.type) {
    const query = {
        fields: {
          id: true,
          subjectId: true,
          refCategoryId: true,
        },
      }
      const article = await refArticlesModel.findOne(query)
    if (!article) {
      return false
    }
    targetUrl = `/references/${article.refCategoryId}/${article.subjectId}/${options.articleId}?comment=${options.targetId}`
  } else {
    targetUrl = `/articles/${options.articleId}?comment=${options.targetId}`
  }
  const newRecordsList = usersList.map( userId => {
      return {
        articleId: options.articleId,
        type: options.type,
        targetId: options.targetId || 0,
        userId: userId,
        targetUrl: targetUrl,
        title: options.title || `New answer from article id: ${options.articleId}`,
      }
    })
    const createdObjs = await articleNotifModel.create(newRecordsList)
  return createdObjs.length
}

/**
 * Mark notification when user viewed
 * @param {Number | Array} ids
 * @param {NOTIF_TYPE} type
 * @param {Object} meta
 */
async function markViewed(ids, type, meta) {
  if (!ids || !meta.userId) {
    console.log('markViewed: wrong ids! ', ids)
    return 0
  }

  let result = 0
  const targetedModel = type === NOTIF_TYPE.SYSTEM
      ? systemNotifUserModel
      : articleNotifModel
  if (Array.isArray(ids)) {
    const resultObj =
      await targetedModel.updateAll({
        id: { inq: ids },
      },
      {
        isViewed: 1,
      })
    result = resultObj.length
  } else {
    const targetedObj = await targetedModel.findById(ids)
    await targetedObj.updateAttribute('isViewed', 1)
    result = 1
  }
  return result
}

/**
 * Create new system notifications for all labo users
 * @param {Object} input
 * @param {Object} meta
 */
async function storeSystemNotif(input) {
  if(!input) {
    console.log('storeSystemNotif: Wrong inputs: ', input)
    return {}
  }
  // TODO: validate user is admin to create system notification
  return await systemNotifModel.create({
    title: input.title,
    content: input.content,
  })
}

/**
 * Get notifications list to show in menu
 * @param {Object} input
 * @param {NOTIF_TYPE} type
 * @param {Object} meta
 */
async function getNotifications(input, type, meta) {
  if (!meta.userId) {
    console.log('getNotifications: userId not found!')
    return []
  }
  const query = {
      where: {
        userId: meta.userId,
        limit: input.limit || 10,  // default limit: 10
      },
      fields: {
        updatedAt:false,
      },
      order: 'createdAt DESC',
    }
    const targetedModel =
      type === NOTIF_TYPE.SYSTEM
        ? systemNotifUserModel
        : articleNotifModel
  if (type === NOTIF_TYPE.ARTICLE) {
    query.include = [
      {
        relation: 'ofArticle',
        scope: {
          fields: {
            id: true,
            title: true,
          },
        },
      },
    ]
  } else {
    query.include = [
      {
        relation: 'ofSystemNotif',
        scope: {
          fields: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
      },
    ]
  }
  // Mark viewed:
  if (parseInt(input.viewed) === 1) {
    targetedModel.updateAll({
      userId: meta.userId,
    },
    {
      isViewed: 1,
    })
  }
  return await targetedModel.find(query)
}

/**
 * Count unread notifications
 * @param {NOTIF_TYPE} type
 * @param {Object} meta
 */
async function countNewNotifications(type, meta) {
  if (!meta.userId) {
    console.log('countNewNotifications: userId not found!')
    return 0
  }
  console.log('userid: ', meta.userId)
  const targetedModel =
    type === NOTIF_TYPE.SYSTEM
      ? systemNotifUserModel
      : articleNotifModel
  return await targetedModel.count({
    userId: meta.userId,
    isViewed: 0.,
  })
}

module.exports = {
  NOTIF_TYPE,
  createArticleNotification,
  markViewed,
  storeSystemNotif,
  getNotifications,
  countNewNotifications,
}
