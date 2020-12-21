const app = require('@server/server')
const commonUser = require('@services/common/user')

// Models
const userModel = app.models.Users
const crowdsourcingModel = app.models.Crowdsourcing
const crowdsourcingTemplateModel = app.models.CrowdsourcingTemplates

// Utils
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * check user is crowdsourcing
 *
 * @param {Number} userId
 * @return {Object}
 * @public
 */
async function check(userId) {
  if (!userId) {
    return 0
  }
  const user = await _users([userId])
  return user.length == 0 ? 0 : 1
}

/**
 * dataTab developer
 *
 * @param {Number} id
 * @return {Object}
 * @public
 */
async function dataTab(id) {
  const crowdsourcing = await _crowdsourcing([id], false)
  if (!crowdsourcing.length) {
    return {}
  }

  const templates = await _crowdsourcingTemplate(
    arrayUtil.column(crowdsourcing, 'crowdsourcingTemplateId'),
  )

  return crowdsourcing.reduce((result, item) => {
    result.all.push({
      id: item.id,
      title: item.title,
      period: Math.ceil((item.completedAt - item.depositAt) / 86400),
      template: (templates[item.crowdsourcingTemplateId] || {}).title,
    })
    if (!item.reviewQuality || !item.reviewSpeed || !item.reviewCommunication) {
      return result
    }

    result.reviews.push({
      id: item.id,
      title: item.title,
      rvContent: item.reviewContent,
      rvQuality: item.reviewQuality,
      rvSpeed: item.reviewSpeed,
      rvCommunication: item.reviewCommunication,
    })
    return result
  }, {
    reviews: [],
    all: [],
  })
}

/**
 * show developer
 *
 * @param {Number} id
 * @return {Object}
 * @public
 */
async function show(id) {
  let [data, user, introduction] = await Promise.all([
    _crowdsourcing([id]),
    _users([id]),
    commonUser.usersSelfIntroduction([id]),
  ])
  if (!user.length) {
    return {}
  }

  data = data[id] || {}
  user = user[0] || {}
  introduction = introduction[0] || {}

  return {
    id: user.id,
    total: data.total || 0,
    count: data.count || 0,
    star: data.count ? +(data.stars / data.count).toFixed(0) : 0,
    introdution: introduction.content, // TODO: fix client and remove
    introduction: introduction.content,
    name: user.nickName,
  }
}

/**
 * index developer
 *
 * @param {Object} input
 * @return {Object}
 * @public
 */
async function index(input) {
  const users = await _users()
  if (!users.length) {
    return []
  }

  const crowdsourcing = await _crowdsourcing(arrayUtil.column(users))
  const data = users.map(user => {
    const item = crowdsourcing[user.id] || {}
    return {
      userId: user.id,
      userName: user.nickName,
      total: item.total || 0,
      count: item.count || 0,
      stars: item.count ? +(item.stars / item.count).toFixed(1) : 0,
    }
  })

  data.sort((a, b) => {
    return (b.total - a.total) || (b.stars - a.stars)
  })

  const limit = parseInt(input.limit)
  
  return limit ? data.slice(0, limit) : data
}

/**
 * crowdsourcing Template
 *
 * @param {Array} ids
 * @return {Object}
 * @private
 */
async function _crowdsourcingTemplate(ids) {
  const data = crowdsourcingTemplateModel.find({
    where: {
      id: {
        inq: ids,
      },
      isValid: 1,
    },
    fields: {
      id: true,
      title: true,
    },
  })
  return arrayUtil.index(data)
}

/**
 * get and mapping crowdsourcing
 *
 * @param {Array} userIds
 * @param {Boolean} isCount
 * @return {Object}
 * @private
 */
async function _crowdsourcing(userIds, isCount = true) {
  const data = await crowdsourcingModel.find({
    where: {
      isValid: 1,
      statusType: 1,
      isFinish: 1,
      developerUserId: {
        inq: userIds,
      },
    },
    fields: isCount ? {
      id: true,
      developerUserId: true,
      reviewQuality: true,
      reviewSpeed: true,
      reviewCommunication: true,
    } : undefined,
    order: 'id DESC',
  })

  return isCount ? data.reduce((result, item) => {
    if (!result[item.developerUserId]) {
      result[item.developerUserId] = {
        total: 0,
        count: 0,
        stars: 0,
      }
    }

    result[item.developerUserId].total++
    if (!item.reviewQuality || !item.reviewSpeed || !item.reviewCommunication) {
      return result
    }

    result[item.developerUserId].count++
    result[item.developerUserId].stars += +(
      (item.reviewQuality + item.reviewSpeed + item.reviewCommunication) / 3
    ).toFixed(2)
    return result
  }, {}) : data
}

/**
 * users are crowdsourcing
 *
 * @param {Array || undefined} userIds
 * @return {Array}
 * @private
 */
async function _users(userIds = undefined) {
  return userModel.find({
    where: {
      id: userIds ? {
        inq: userIds,
      } : undefined,
      isValid: 1,
      isCrowdsourcing: 1,
      // isDeveloper: 1,
    },
    fields: {
      id: true,
      nickName: true,
    },
  })
}

module.exports = {
  index,
  show,
  dataTab,
  check,
}
