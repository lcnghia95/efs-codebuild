const app = require('@server/server')
const pickupDevelopersModel = app.models.SystemtradePickupDevelopers
const rankingBestSellersModel = app.models.SystemtradeRankingBestSellers

const {
  uniqBy,
  unionBy,
  shuffle,
  slice
} = require('lodash')

/**
 * Get all dev users
 *
 * @param {Array} input
 * @return {Array}
 * @public
 */
async function index(input) {
  let name = input.name || null,
    limit = input.limit || null,
    where = app.utils.object.nullFilter({
      isValid: 1,
      nickName: !name ? null : {
        like: '%' + name + '%'
      },
    }),
    users = await pickupDevelopersModel.find({
      where,
      limit: !parseInt(limit) ? null : parseInt(limit),
      order: 'id ASC',
      fields: {
        userId: true,
        nickName: true
      }
    })

  if (!users || users.length === 0) {
    return []
  }

  return users.map(user => {
    return _developersObject(user)
  })
}

/**
 * Get user information from `surfaces.systemtrade_ranking_best_sellers`
 *
 * @param {number} limit
 * @returns {Array}
 * @private
 */
async function _users(limit) {
  let users = await rankingBestSellersModel.find({
    where: {
      isValid: 1,
    },
    limit,
    order: 'id ASC',
    fields: {
      userId: true,
      nickName: true
    }
  })

  if (!users || users.length === 0) {
    return []
  }

  // Remove all dupplicate of array
  return uniqBy(users, 'userId')
}

/**
 * Get top 5 developers
 *
 * @param {Array} input
 * @return {Array}
 * @public
 */
async function top() {
  let users = await _users(30)

  // Get all record if total record after filter < 5
  if (users.length < 5) {
    users = await _users()
  }

  let data = slice(shuffle(users), 0, 5)

  return data.map(user => {
    return _developersObject(user)
  })
}

/**
 * Get top developers 
 *
 * oldFlow(function top()): 
 * 1. Get 30 "ranking Best Sellers" first
 * 2. if users < 5 => get all "ranking Best Sellers"
 * 
 * newFlow:
 * 1. Get 30 "ranking Best Sellers"
 * 2. if users < number => back to step 1
 *
 * @param {number} number
 * @return {Array}
 * @public
 */
async function newTop(number = 5) {
  let limit = 30,
    skip = 0,
    users = [],
    loop = true
  while (loop) {
    let tempUsers = await _getUsers(limit, skip)
    users = unionBy(users, tempUsers, 'userId')
    if (users.length >= number || tempUsers.length === 0) {
      loop = false
    }

    skip += limit
  }

  let data = slice(shuffle(users), 0, number)

  return data.map(user => {
    return _developersObject(user)
  })

}

/**
 * get users from `surfaces.systemtrade_ranking_best_sellers`
 *
 * @param {number} limit
 * @param {number} skip
 * 
 * @return {Array}
 * @private
 */
async function _getUsers(limit = 30, skip = 0) {
  let users = await rankingBestSellersModel.find({
    where: {
      isValid: 1,
    },
    limit,
    skip,
    order: 'id ASC',
    fields: {
      userId: true,
      nickName: true
    }
  })
  if (users.length === 0) {
    return []
  }
  // Remove all dupplicate of array
  return uniqBy(users, 'userId')
}

/**
 * Generate developer object
 *
 * @param {Array} input
 * @return {Array}
 * @private
 */
function _developersObject(input) {
  return app.utils.object.nullFilter({
    id: input.userId || 0,
    name: input.nickName || ''
  })
}

module.exports = {
  top,
  newTop,
  index,
}
