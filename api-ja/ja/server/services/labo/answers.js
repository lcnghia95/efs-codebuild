const app = require('@server/server')

const articlesModel = app.models.LaboArticles
const answersModel = app.models.Answers
const fileUtils = app.utils.file
const utils = require('./utils')
const articlesService = require('./articles')
const notifService = require('./notifications')
const spliter = '*'

/**
 * Get all answers in an article
 * @param {*} input
 * @param {*} meta
 */
async function getByArticle(articleId, input, meta) {
  console.log('getAnswersByArticle: ', articleId)
  if (!articleId) {
    return {}
  }
  // TODO: add paging
  const query = {
      where: {
        articleId,
      },
      include: [
        /* {
          relation: 'contributor',
          scope: {
            fields: {
              id: true,
              nickName: true,
            },
          },
        }, */
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
      order: 'createdAt ASC',
    }
    const currentUserId = meta.userId || null
  if(input && input.limit) {
    query.limit = input.limit
  }
  let dataAnswers = await answersModel.find(query)
  if (Array.isArray(dataAnswers)) {
    dataAnswers = dataAnswers.map(item => {
      const books = (item.hasBookmarks() || [])
        const likes = (item.hasLikes() || [])
        const dataResult = app.utils.object.nullFilter(item.toObject())
      // Count and check if current user has already bookmarked
      dataResult.bookmarksCount = books.length
      dataResult.likesCount = likes.length
      dataResult.isBookmarked = 0
      dataResult.isLiked = 0
      if (currentUserId) {
        books.forEach(bookmark => {
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
    await utils.addUserInfo(dataAnswers)
    return dataAnswers
  }

  return []
}

/**
 * Save a new answer
 * @param {*} input
 * @param {*} meta
 */
async function store(input, file, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !input.articleId
  ) {
    console.log('Not enough input: ', input)
    return {}
  }
  // TODO: validate userId

  const article = await articlesModel.findById(input.articleId)

  if (!article || !article.isCommentEnabled) {
    console.log('article is not exist or locked!')
    return {}
  }

  // TODO: performance
  const newAnswer = await answersModel.create({
    content: input.content,
    userId: meta.userId,
    articleId: input.articleId,
  })
  // no need to await here to increase speed of response
  // TODO: create url to new answer/article
  if (file && file.length) {
    const att = []; const attName = []
    for (let i = 0, l = file.length; i < l; i++) {
      const a = await fileUtils.upload(file[i], `labo/article/${input.articleId}`,
        file[i].mimetype.includes('image'))
      att.push(a.url)
      attName.push(file[i].originalname)
    }
    newAnswer.attachment = att.join(spliter)
    newAnswer.attachmentName = attName.join(spliter)
    await newAnswer.save()
  }
  notifyRelatedUsers(input.articleId, newAnswer.id, meta.userId)
  return newAnswer
}

/**
 * Create notifications to all users in article whenever an answer created
 * @param {Number} articleId
 * @param {Number} excludedUserId
 */
async function notifyRelatedUsers(articleId, answerId, excludedUserId) {
  const [article, relatedUsers] = await Promise.all([
      articlesModel.findOne({where: {
        id: articleId,
      }, fields: {
        id: true,
        title: true,
      }}),
      articlesService.getRelatedUsers(articleId, excludedUserId),
    ])
    const numCreated = (await notifService.createArticleNotification(relatedUsers, {
      articleId: articleId,
      type: 0,
      targetId: answerId,
      title: article.title,
    })).length
  return numCreated
}

/**
 * Update an answer
 * @param {*} input
 * @param {*} meta
 */
async function update(answerId, input, meta) {
  if (
    !Object.keys(input).length ||
    !meta.userId ||
    !answerId
  ) {
    return {}
  }
  // TODO: validate userId

  const answer = await answersModel.findOne({
    where: {
      id: answerId,
      userId: meta.userId,
    },
  })
  if (!answer) {
    console.log('Answer does not exist: ', answerId)
    return {}
  }
  answer.content = input.content || answer.content
  await answer.save()
  return answer
}

module.exports = {
  getByArticle,
  store,
  update,
}
