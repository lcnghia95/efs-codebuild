const app = require('@server/server')

const articlesModel = app.models.RefArticles
const commentsModel = app.models.RefComments
const fileUtils = app.utils.file
const utils = require('./utils')
const articlesService = require('./refArticles')
const notifService = require('./notifications')
const spliter = '*'

/**
 * Get all comments in an article
 * @param {*} input
 * @param {*} meta
 */
async function getByArticle(refArticleId, input, meta) {
  console.log('getCommentsByArticle: ', refArticleId)
  if (!refArticleId) {
    return {}
  }
  // TODO: add paging
  const query = {
      where: {
        refArticleId,
      },
      include: [
        {
          relation: 'hasLikes',
          scope: {
            fields: {
              id: true,
              userId: true,
            },
          },
        },
        {
          relation: 'hasBookmarks',
          scope: {
            fields: {
              id: true,
              userId: true,
            },
          },
        },
      ],
      order: 'createdAt DESC',
    }
    const currentUserId = meta.userId || null
  if(input && input.limit) {
    query.limit = input.limit
  }
  let dataComments = await commentsModel.find(query)
  if (Array.isArray(dataComments)) {
    dataComments = dataComments.map(item => {
      const dataResult = app.utils.object.nullFilter(item.toObject())
        const bookmarks = item.hasBookmarks() || []
        const likes = item.hasLikes() || []
      // Count and check if current user has already bookmarked
      dataResult.bookmarksCount = bookmarks.length
      dataResult.likesCount = likes.length
      dataResult.isBookmarked = 0
      dataResult.isLiked = 0
      if (currentUserId) {
        bookmarks.forEach(bookmark => {
          if (bookmark.userId == currentUserId) {
            dataResult.isBookmarked = 1
            return
          }
        })
        likes.forEach(like => {
          if (like.userId == currentUserId) {
            dataResult.isLiked = 1
            return
          }
        })
      }
      dataResult.attachment = (dataResult.attachment || '').split(spliter)
      dataResult.attachmentName = (dataResult.attachmentName || '').split(spliter)
      delete dataResult.hasBookmarks
      delete dataResult.hasLikes
      return dataResult
    })
    await utils.addUserInfo(dataComments)
    return dataComments
  }

  return []
}

/**
 * Save a new comment
 * @param {*} input
 * @param {*} meta
 */
async function store(input, file, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !input.refArticleId
  ) {
    console.log('Not enough input: ', input)
    return {}
  }
  // TODO: validate userId

  const article = await articlesModel.findById(input.refArticleId)

  if (!article || (article.isCommentEnabled === 0)) {
    console.log('article is not exist or locked!')
    return {}
  }

  // TODO: performance
  const newComment = await commentsModel.create({
    content: input.content,
    userId: meta.userId,
    refArticleId: input.refArticleId,
  })
  // TODO: create url to new comment/article
  if (file && file.length) {
    const att = []; const attName = []
    for (let i = 0, l = file.length; i < l; i++) {
      const a = await fileUtils.upload(file[i], `labo/article/${input.refArticleId}`,
        file[i].mimetype.includes('image'))
      att.push(a.url)
      attName.push(file[i].originalname)
    }
    newComment.attachment = att.join(spliter)
    newComment.attachmentName = attName.join(spliter)
    await newComment.save()
  }
  // no need to await here to increase speed of response
  notifyRelatedUsers(input.refArticleId, newComment.id, meta.userId)
  return newComment
}

/**
 * Create notifications to all users in article whenever an comment created
 * @param {Number} refArticleId
 * @param {Number} excludedUserId
 */
async function notifyRelatedUsers(refArticleId, commentId, excludedUserId) {
  const [article, relatedUsers] = await Promise.all([
      articlesModel.findOne({where: {
        id: refArticleId,
      }, fields: {
        id: true,
        title: true,
      }}),
      articlesService.getRelatedUsers(refArticleId, excludedUserId),
    ])
    const numCreated = (await notifService.createArticleNotification(relatedUsers, {
      articleId: refArticleId,
      type: 1,
      targetId: commentId,
      title: article.title,
    })).length
  return numCreated
}

/**
 * Update an comment
 * @param {*} input
 * @param {*} meta
 */
async function update(commentId, input, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !commentId
  ) {
    return {}
  }
  // TODO: validate userId

  const comment = await commentsModel.findOne({
    where: {
      id: commentId,
      userId: meta.userId,
    },
  })
  if (!comment) {
    console.log('Comment does not exist: ', commentId)
    return {}
  }
  comment.content = input.content || comment.content
  await comment.save()
  return comment
}

module.exports = {
  getByArticle,
  store,
  update,
}
