const app = require('@server/server')
const commonUser = require('@services/common/user')
const developerService = require('@services/surface/crowdsourcing/developer')
const commonSync = require('@services/common/synchronize')

// Models
const crowdsourcingModel = app.models.Crowdsourcing
const crowdsourcingBidderModel = app.models.CrowdsourcingBidders

// Utils
const pagingUtil = app.utils.paging
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object

/**
 * show surface crowdsourcing
 *
 * @param {Number} id
 * @return {Object}
 * @public
 */
async function update(input, id, userId) {
  if (!userId || !id) {
    return {}
  }

  const isReviewable = await _isReviewable(id, userId)
  if (!isReviewable) {
    return 400
  }

  isReviewable.isReview = 1
  isReviewable.reviewContent = input.content || ''
  isReviewable.reviewQuality = input.rvQuality || 0
  isReviewable.reviewSpeed = input.rvSpeed || 0
  isReviewable.reviewCommunication = input.rvCommunication || 0
  await isReviewable.save()
  commonSync.syncDataToFxon('crowdsourcing', isReviewable.id)
  return {}
}

/**
 * show surface crowdsourcing
 *
 * @param {Number} id
 * @return {Object}
 * @public
 */
async function show(id) {
  const data = await crowdsourcingModel.findOne({
    where: {
      id,
      isValid: 1,
    },
    fields: {
      id: true,
      title: true,
      bidEndAt: true,
      crowdsourcingTemplateId: true,
      createdAt: true,
      reward: true,
      userId: true,
      isFinish: true,
      content: true,
      deadLineAt: true,
      isMatching: true,
      developerUserId: true,
    },
  })

  if (!data) {
    return {}
  }

  let [user, price] = await Promise.all([
    commonUser.getUser(data.userId),
    _prices([id]),
  ])
  price = price[0] ? (price[0].price || 0) : 0

  return _object(data, user, price)
}

/**
 * index surface crowdsourcing
 *
 * @param {Object} input
 * @return {Object}
 * @public
 */
async function index(input) {
  const page = input.page || 1
  const limit = parseInt(input.limit) || 10
  const offset = pagingUtil.getOffsetCondition(page, limit)
  const conditions = _conditions(input.isFinish, offset)
  const [crowdsourcing, total] = await Promise.all([
    crowdsourcingModel.find(conditions),
    crowdsourcingModel.count(conditions.where),
  ])

  if (!total) {
    return {}
  }

  const [users, prices] = await Promise.all([
    _users(arrayUtil.column(crowdsourcing, 'userId')),
    (!input.isFinish ? {} : _prices(arrayUtil.column(crowdsourcing))),
  ])
  const data = crowdsourcing.reduce((result, item) => {
    if (!users[item.userId]) {
      return result
    }
    result.push(_object(
      item,
      users[item.userId],
      prices[item.id] ? prices[item.id].price : 0,
    ))
    return result
  }, [])

  return pagingUtil.addPagingInformation(data, page, total, limit)
}

/**
 * Get surface crowdsourcing review
 *
 * @param {Number} cId crowdsourcingId
 * @param {Number} userId
 * @return {Null || Array}
 * @public
 */
async function review(cId, userId) {
  const isReviewable = await _isReviewable(cId, userId)
  return isReviewable ? {
    developer: await developerService.show(isReviewable.developerUserId),
    review: {
      title: isReviewable.title,
    },
  } : null
}

/**
 * get prices of crowdsourcing
 *
 * @param {Array} cIds
 * @return {Array}
 * @private
 */
async function _prices(cIds) {
  const data = await crowdsourcingBidderModel.find({
    where: {
      isValid: 1,
      crowdsourcingId: {
        inq: cIds,
      },
      statusType: 1,
    },
    fields: {
      crowdsourcingId: true,
      price: true,
    },
  })
  return arrayUtil.index(data, 'crowdsourcingId')
}

/**
 * get user nickName
 *
 * @param {Array} uIds
 * @return {Array}
 * @private
 */
async function _users(uIds) {
  return arrayUtil.index(await commonUser.getUsers(uIds))
}

/**
 * object crowdsourcing
 *
 * @param {Object} data
 * @param {Object} user
 * @param {Number} price
 * @return {Object}
 * @private
 */
function _object(data, user, price) {
  return objectUtil.nullFilter({
    id: data.id,
    bidEndAt: data.bidEndAt,
    templateId: data.crowdsourcingTemplateId,
    title: data.title,
    content: data.content,
    createdAt: data.createdAt,
    deadlineAt: data.deadLineAt,
    reward: data.reward,
    user: {
      id: user.id,
      name: user.nickName,
    },
    price,
    matched: data.isMatching,
    devId: data.developerUserId,
    isFinish: data.isFinish,
  })
}

/**
 * get index conditions
 *
 * @param {Boolean} isFinish
 * @param {Object} offset
 * @return {Object}
 * @private
 */
function _conditions(isFinish, offset) {
  const conditions = {
    skip: offset.skip,
    limit: offset.limit,
    order: ['bidEndAt DESC', 'id DESC'],
    fields: {
      id: true,
      title: true,
      bidEndAt: true,
      crowdsourcingTemplateId: true,
      reward: true,
      userId: true,
      deadLineAt: true,
      createdAt: true,
    },
  }

  if (isFinish) {
    conditions.where = {
      isValid: 1,
      isFinish: 1,
    }
  } else {
    conditions.where = {
      isValid: 1,
      statusType: 0,
      developerUserId: 0,
      isMatching: 0,
      bidEndAt: {
        gt: Date.now(),
      },
    }
  }
  return conditions
}

/**
 * check is reviewable
 *
 * @param {Number} cId crowdsourcingId
 * @param {Number} userId
 * @return {Object || null}
 * @private
 */
async function _isReviewable(cId, userId) {
  const data = await crowdsourcingModel.findOne({
    where: {
      id: cId,
      isValid: 1,
      statusType: 1,
      userId,
      isReview: 0,
      isDeveloperFinish: 1,
    },
    fields: {
      id: true,
      developerUserId: true,
      title: true,
    },
  })
  return data
}

module.exports = {
  index,
  show,
  update,
  review,
}
