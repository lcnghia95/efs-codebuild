const app = require('@server/server')
const bookmarksModel = app.models.Bookmarks
const likesModel = app.models.Likes
const positionBookmarksModel = app.models.PositionBookmarks

const arrayUtil = require('@ggj/utils/utils/array')

const {
  remove,
} = require('lodash')

const TYPE = {
  ARTICLE: 0,
  ANSWER: 1,
  REF_ARTICLE: 2,
  REF_COMMENT: 3,
}

const TypeMap = [
  'articleId',
  'answerId',
  'refArticleId',
  'refCommentId',
]

/**
 * Create new bookmark or remove if already bookmarked
 * @param {*} input
 * @param {*} type
 * @param {*} meta
 * @returns {Promise<Object>}
 */
async function bookmark(id, type, meta) {
  const userId = meta.userId
  id = parseInt(id)
  if (!userId || !id) {
    console.log('Not enough input or invalid data!')
    return {
      status: -1,
    }
  }

  const newRecord = {
    userId: userId,
    type: type,
  }
  if (!TypeMap[type]) {
    console.log('bookmark type not existed!')
    return {
      status: -1,
    }
  }
  newRecord[TypeMap[type]] = parseInt(id)
  const existedRecord = await bookmarksModel.findOne({
    where: newRecord,
  })
  if (existedRecord) {
    try {
      await Promise.all([
        _removePositionBookmark(existedRecord.id, userId),
        bookmarksModel.destroyById(existedRecord.id),
      ])
    } catch (e) {
      return {
        status: -1,
      }
    }
    return {
      status: 0,
      id: existedRecord.id,
    }
  }

  const res = {
    status: 1,
    id: 0,
  }

  try {
    const [newBookmarkId, positionBookmark] = await Promise.all([
        bookmarksModel.create(newRecord),
        positionBookmarksModel.findOne({
          where: {
            userId,
            isValid: 1,
          },
        }),
      ])
      const listBookmarkId = positionBookmark ?
        newBookmarkId.id + ',' + positionBookmark.arrangement :
        id.toString()

    res.id = newBookmarkId.id
    await saveBookmarkList(listBookmarkId, userId)
  } catch (e) {
    return {
      status: -1,
    }
  }
  return res
}

/**
 * Count number of bookmarks of an article or answer
 * @param {*} id
 * @param {*} type
 * @returns {Promise<Number>}
 */
async function countBookmarks(id, type) {
  if (!id) {
    console.log('Not enough input data!')
    return 0
  }

  const query = {}
  if (!TypeMap[type]) {
    console.log('bookmark type not existed!')
    return 0
  }
  query[TypeMap[type]] = parseInt(id)
  return await bookmarksModel.count(query)
}

/**
 * Unbookmark an article or answer
 * @param {*} id
 * @param {*} meta
 * @return {Promise<1: successful, 0: failed like not exist>}
 */
async function removeBookmark(id, meta) {
  const userId = meta.userId
  if (!userId || !id) {
    console.log('Not logged in or no bookmark id!')
    return 0
  }

  const [res] = await Promise.all([
    bookmarksModel.destroyAll({
      id: id,
      userId: userId,
    }),
    _removePositionBookmark(id, userId),
  ])

  return res
}

/**
 * remove position bookmark
 * @param {number} removeId
 * @param {number} userId
 * @return string
 */
async function _removePositionBookmark(removeId, userId) {
  const positionBookmark = await positionBookmarksModel.findOne({
      where: {
        userId,
        isValid: 1,
      },
    })
  let listBookmarkId = ''

  if (positionBookmark && positionBookmark.arrangement) {
    const arrListBookmark = positionBookmark.arrangement.split(',')
    remove(arrListBookmark, (bookmarkId) => {
      return bookmarkId == removeId
    })
    listBookmarkId = arrListBookmark.toString()
  }

  return await saveBookmarkList(listBookmarkId, userId)
}

/**
 * check if list bookmark id in Bookmarks and PositionBookmarks is equal (containt same bookmarkId)
 * @param {array} listBookmarkId
 * @param {array} listPositionBookmarkId
 * @return boolean
 */
function _listBookmarkCompare(listBookmarkId, listPositionBookmarkId) {
  if (listBookmarkId.length != listPositionBookmarkId.length) {
    return false
  }

  let flag = true
  listBookmarkId.map(bookmarkId => {
    if (flag == false) {
      return
    }
    if (!listPositionBookmarkId.includes(bookmarkId)) {
      flag = false
    }
  })

  return flag
}

/**
 * Get bookmarks list of user to show in bookmark popup
 * @param {*} input
 * @param {*} meta
 * @return {Promise<Object>}
 */
async function getBookmarks(input, meta) {
  const userId = meta.userId
  if (!userId) {
    console.log('Not logged in: no userId found!')
    return {}
  }
  const query = {
    where: {
      userId: userId,
    },
    include: [{
      relation: 'ofArticle',
      scope: {
        include: [{
          relation: 'ofCategory',
          scope: {
            fields: {
              id: true,
              name: true,
            },
          },
        }],
        /* fields: {
          id: true,
          title: true,
          categoryId: true,
        }, */
      },
    }, {
      relation: 'ofAnswer',
      scope: {
        include: [{
          relation: 'ofArticle',
          scope: {
            include: [{
              relation: 'ofCategory',
              scope: {
                fields: {
                  id: true,
                  name: true,
                },
              },
            }],
          },
        }],
      },
    }, {
      relation: 'ofRefArticle',
      scope: {
        include: [{
          relation: 'ofRefCategory',
          scope: {
            fields: {
              id: true,
              name: true,
            },
          },
        }],
      },
    }, {
      relation: 'ofRefComment',
      scope: {
        include: [{
          relation: 'ofRefArticle',
          scope: {
            include: [{
              relation: 'ofRefCategory',
              scope: {
                fields: {
                  id: true,
                  name: true,
                },
              },
            }],
          },
        }],
      },
    }],
    order: 'createdAt DESC',
  }
  if (input.limit > 0) {
    query.limit = input.limit
  }

  const [data, positionBookmark] = await Promise.all([
      bookmarksModel.find(query),
      positionBookmarksModel.findOne({
        where: {
          userId: userId,
          isValid: 1,
        },
      }),
    ])
    let listBookmarkId = arrayUtil.column(data, 'id')
    const indexBookmark = arrayUtil.index(data, 'id')

  if (positionBookmark && positionBookmark.arrangement) {
    // clone array listBookmarkId
    const arrId = listBookmarkId.slice(0)
    listBookmarkId = positionBookmark.arrangement.split(',').map(id => parseInt(id))
    if (!_listBookmarkCompare(arrId, listBookmarkId)) {
      listBookmarkId = arrId
      await saveBookmarkList(listBookmarkId.toString(), userId)
    }
  } else {
    await saveBookmarkList(listBookmarkId.toString(), userId)
  }

  return listBookmarkId.reduce((acc, bookmarkId) => {
    const item = indexBookmark[bookmarkId]
    const article = item.ofArticle()
    const categoryArticle = article ? article.ofCategory() : undefined

    const answer = item.ofAnswer()
    const articleAnswer = answer ? answer.ofArticle() : undefined
    const categoryAnswer = articleAnswer ? articleAnswer.ofCategory() :undefined

    const refArticle = item.ofRefArticle()
    const categoryRefArticle = refArticle ? refArticle.ofRefCategory() :undefined

    const refComment = item.ofRefComment()
    const refArticleRefComment = refComment ? refComment.ofRefArticle() :undefined
    const categoryRefComment = refArticleRefComment ? refArticleRefComment.ofRefCategory() : undefined

    switch (item.type) {
      case TYPE.ARTICLE:
        if (article && categoryArticle) {
          acc.push({
            id: item.id,
            type: item.type,
            title: article.title,
            articleId: article.id,
            createdAt: item.createdAt,
            category: categoryArticle.name,
          })
        }
        break
      case TYPE.ANSWER:
        if (answer && articleAnswer && categoryAnswer) {
          acc.push({
            id: item.id,
            type: item.type,
            title: answer.content.substring(0, 32),
            articleId: articleAnswer.id,
            answerId: answer.id,
            createdAt: item.createdAt,
            category: categoryAnswer.name, // especially this (>.<)
          })
        }
        break
      case TYPE.REF_ARTICLE:
        if (refArticle && categoryRefArticle) {
          acc.push({
            id: item.id,
            type: item.type,
            title: refArticle.title,
            refArticleId: refArticle.id,
            createdAt: item.createdAt,
            category: categoryRefArticle.name,
          })
        }
        break
      case TYPE.REF_COMMENT:
        if (refComment && refArticleRefComment && categoryRefComment) {
          acc.push({
            id: item.id,
            type: item.type,
            title: refComment.content.substring(0, 32),
            refArticleId: refArticleRefComment.id,
            refCommentId: refComment.id,
            createdAt: item.createdAt,
            category: categoryRefComment.name, // and this (>.<)
          })
        }
        break

      default:
        acc.push({
          id: 0,
          title: '',
          articleId: 0,
          answerId: 0,
          createdAt: 0,
          category: '',
        })
    }
    return acc
  }, [])
}

/**
 * Create new like
 * @param {*} input
 * @param {*} type
 * @param {*} meta
 * @returns {Promise<Object>}
 */
async function like(id, type, meta) {
  if (!meta.userId || !id) {
    console.log('Not enough input data!')
    return -1
  }

  const newRecord = {
    userId: meta.userId,
    type: type,
  }

  if (!TypeMap[type]) {
    console.log('bookmark type not existed!')
    return -1
  }
  newRecord[TypeMap[type]] = parseInt(id)

  const existedRecord = await likesModel.findOne({
    where: newRecord,
  })
  if (existedRecord) {
    try {
      await likesModel.destroyById(existedRecord.id)
    } catch (e) {
      return -1
    }
    return 0
  }

  try {
    await likesModel.create(newRecord)
  } catch (e) {
    return -1
  }
  return 1
}

/**
 * Count number of likes of an article or answer
 * @param {*} id
 * @param {*} type
 * @returns {Promise<Number>}
 */
async function countLikes(id, type) {
  if (!id) {
    console.log('Not enough input data!')
    return 0
  }

  const query = {}
  if (!TypeMap[type]) {
    console.log('bookmark type not existed!')
    return 0
  }
  query[TypeMap[type]] = parseInt(id)
  return await likesModel.count(query)
}

/**
 * Unlike an article or answer
 * @param {*} id
 * @param {*} meta
 * @return {Promise<1: successful, 0: failed like not exist>}
 */
async function removeLike(id, meta) {
  if (!meta.userId || !id) {
    console.log('Not logged in or no like id!')
    return 0
  }

  return await likesModel.destroyAll({
    id: id,
    userId: meta.userId,
  })
}

/**
 * save list bookmark
 * @param {string} listBookmarkId
 * @param {number} userId
 * @return string
 */
async function saveBookmarkList(listBookmarkId, userId) {
  const positionBookmarks = await positionBookmarksModel.upsertWithWhere({
    userId: userId,
    isValid: 1,
  }, {
    isValid: 1,
    arrangement: listBookmarkId,
    userId: userId,
  })

  return positionBookmarks.bookmarks
}

module.exports = {
  TYPE,
  bookmark,
  countBookmarks,
  removeBookmark,
  getBookmarks,
  like,
  countLikes,
  removeLike,
  saveBookmarkList,
}
