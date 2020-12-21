const app = require('@server/server')

// Models
const biddersModel = app.models.CrowdsourcingBidders

// Helper
const crowdsourcingHelper = require('./crowdsourcingHelper')

// Utils
const objectUtil = app.utils.object
const arrayUtil = require('@ggj/utils/utils/array')

// Common
const commonUser = require('@services/common/user')
const syncService = require('@services/common/synchronize')


/**
 * Get bidders data
 *
 * @param {Object} input
 * @param {Number} userId
 * @returns {Promise<Object>}
 * @public
 */
async function index(input, userId) {
  const cId = input.cId || 0
  const fields = {
    id: true,
    userId: true,
    isMatching: true,
    developerUserId: true,
    bidEndAt: true,
    statusType: true,
  }
  const crowdsourcing = await crowdsourcingHelper.crowdsourcing(cId, fields) || {}
  const bidders = await _getBidders(cId, {
    id: true,
    userId: true,
    statusType: true,
    price: true,
    updatedAt: true,
  })

  let data = [],
    users = {},
    bidderUserIndex = {}

  if (bidders.length > 0) {
    const uIds = arrayUtil.unique(arrayUtil.column(bidders, 'userId'))
    bidderUserIndex = arrayUtil.index(bidders, 'userId')

    if (userId > 0 && !bidderUserIndex[userId]) {
      uIds.push(userId)
    }

    users = arrayUtil.index(await commonUser.getUsers(uIds, {
      id: true,
      nickName: true,
      isCrowdsourcing: true,
      isDeveloper: true,
    }))

    data = bidders.map(bidder => {
      if (crowdsourcing.userId != userId && bidder.userId != userId) {
        bidder.price = null
        bidder.statusType = null
      }

      const user = users[bidder.userId]
      if (user) {
        return _object(bidder, user)
      }
    }).filter(item => {
      return item
    })
  } else if (userId) {
    users = arrayUtil.index(await commonUser.getUsers([userId], {
      id: true,
      nickName: true,
      isCrowdsourcing: true,
      isDeveloper: true,
    }))
  }

  return {
    data,
    bidable: !userId ? false : _checkBidable(
      crowdsourcing,
      users[userId] || {},
      bidderUserIndex[userId] || {}),
    waiting: !userId ? false : _waiting(crowdsourcing, userId),
  }
}

/**
 * Create new crowdsourcing bidder record
 *
 * @param {Object} input
 * @param {Number} userId
 * @returns {Promise<Object>}
 * @public
 */
async function store(input, userId) {
  if (!userId) {
    return 401
  }

  const cId = input.cId || 0
  const fields = {
    id: true,
    userId: true,
    isMatching: true,
    developerUserId: true,
    bidEndAt: true,
    statusType: true,
  }
  const crowdsourcing = await crowdsourcingHelper.crowdsourcing(cId, fields) || {}

  if (userId == crowdsourcing.userId) {
    return 400
  }

  let bidders = await _getBidders(cId, {
    id: true,
    statusType: true,
  }, userId),
    userInfo = await commonUser.getUser(userId, {
      isCrowdsourcing: true,
      isDeveloper: true,
    }),
    bidder = (bidders.length == 0) ? {} : bidders[0]

  if (!_checkBidable(crowdsourcing, userInfo, bidder)) {
    return 401
  }

  if (Object.keys(bidder).length > 0) {
    bidder = await bidder.updateAttributes({
      price: input.price || 0,
      statusType: 0,
    })
  } else {
    bidder = await biddersModel.create({
      isValid: 1,
      crowdsourcingId: cId,
      userId,
      statusType: 0,
      price: input.price || 0,
    })
  }

  if (bidder.id) {
    // Sync data with Fx-on
    syncService.syncDataToFxon('crowdsourcing_bidders', bidder.id)
  }

  return (!input.isGetId) ? {} : {
    id: bidder.id,
  }
}

/**
 * Get crowdsourcing bidders
 *
 * @param {Number} cId
 * @param {Object} fields
 * @param {Number} userId
 * @returns {Promise<Array>}
 * @private
 */
async function _getBidders(cId, fields, userId = null) {
  return await biddersModel.find({
    where: objectUtil.nullFilter({
      isValid: 1,
      crowdsourcingId: cId,
      userId,
    }),
    fields,
    order: 'id ASC',
  })
}

/**
 * Generate bidders object
 *
 * @param {Object} bidder
 * @param {Object} user
 * @returns {Object}
 * @private
 */
function _object(bidder, user) {
  return objectUtil.nullFilter({
    id: bidder.id || null,
    price: bidder.price || null,
    status: (!bidder.statusType && bidder.statusType != 0) ? null : bidder.statusType,
    updatedAt: bidder.updatedAt,
    user: {
      id: user.id,
      name: user.nickName || '',
    },
  })
}

/**
 * Check Bidable
 *
 * @param {Object} crowdsourcing
 * @param {Object} user
 * @param {Object} bidder
 * @returns {Bool}
 * @private
 */
function _checkBidable(crowdsourcing, user, bidder) {
  if (Object.keys(user).length == 0) {
    return false
  }

  if (user.isCrowdsourcing != 1) {
    return false
  }

  if (Object.keys(bidder).length > 0 && bidder.statusType != 0 && bidder.statusType != 3) {
    return false
  }

  if (crowdsourcing.statusType != 0) {
    return false
  }

  return true
}

/**
 * Check Waiting
 *
 * @param {Object} crowdsourcing
 * @param {Number} userId
 * @returns {Bool}
 * @private
 */
function _waiting(crowdsourcing, userId) {
  if (crowdsourcing.isMatching != 0) {
    return false
  }

  if (crowdsourcing.developerUserId != userId) {
    return false
  }
  return true
}


module.exports = {
  index,
  store,
}
