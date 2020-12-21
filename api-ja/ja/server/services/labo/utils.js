const app = require('@server/server')
const arrayUtil = require('@ggj/utils/utils/array')
const userCommonService = require('@services/common/user')

/**
 * Create query string for relations: likes, bookmarks, answers
 * @param {String} inputStr
 * @param {Object} options {
 *  isIncludeAnswers : true if query articles
 *  isIncludeUser: true if query user nickname
 * }
 */
function statsRelationString(options) {
  const scope = {
      fields: {
        id: true,
      },
    }
    const arrRelations = [
      {
        relation: 'hasLikes',
        scope,
      },
      {
        relation: 'hasBookmarks',
        scope,
      },
    ]
  if (options.isIncludedAnswers) {
    arrRelations.push({
      relation: 'hasAnswers',
      scope,
    })
  }
  if (options.isIncludedComments) {
    arrRelations.push({
      relation: 'hasComments',
      scope,
    })
  }
  return arrRelations
}

/**
 * Get stats count of likes, bookmarks, and answers
 * @param {*} data
 * @param {*} isIncludeAnswers
 */
function getStats(data, options = {
  isIncludeAnswers: false,
  isIncludeComments: false,
}) {
  let filteredData
  // TODO: new function
  if (Array.isArray(data)) {
    filteredData = []
    for (let i = 0; i < data.length; i ++) {
      filteredData[i] = app.utils.object.nullFilter(data[i].toObject())
      filteredData[i].likesCount = (data[i].hasLikes() || []).length
      filteredData[i].bookmarksCount = (data[i].hasBookmarks() || []).length
      delete filteredData[i].hasLikes
      delete filteredData[i].hasBookmarks

      if (options.isIncludeAnswers) {
        filteredData[i].answersCount = data[i].hasAnswers() ? data[i].hasAnswers().length : 0
        delete filteredData[i].hasAnswers
      }
      if (options.isIncludeComments) {
        filteredData[i].commentsCount = data[i].hasComments() ? data[i].hasComments().length : 0
        delete filteredData[i].hasComments
      }
    }
  } else {
    filteredData = app.utils.object.nullFilter(data.toObject())
    filteredData.likesCount = (data.hasLikes() || []).length
    filteredData.bookmarksCount = (data.hasBookmarks() || []).length
    delete filteredData.hasLikes
    delete filteredData.hasBookmarks

    if (options.isIncludeAnswers) {
      filteredData.answersCount = (data.hasAnswers() || []).length
      delete filteredData.hasAnswers
    }
    if (options.isIncludeComments) {
      filteredData.commentsCount = (data.hasComments() || []).length
      delete filteredData.hasComments
    }
  }
  return filteredData
}

async function addUserInfo(data) {
  if (Array.isArray(data)) {
    const userIds = arrayUtil.column(data, 'userId')
      const users = await userCommonService.getUsers(userIds)
      const usersMap = app.utils.object.arrayToObject(users)

    return data.forEach(item => {
      if (!item.contributor) {
        item.contributor = {}
        item.contributor.id = item.userId
      }
      item.contributor.id && (
        item.contributor.nickName = (usersMap[item.contributor.id] || {}).nickName
      )
    })
  } else {
    data.contributor = await userCommonService.getUser(data.userId)
  }
}

module.exports = {
  statsRelationString,
  getStats,
  addUserInfo,
}
