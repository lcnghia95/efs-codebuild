const app = require('@server/server')

// models
const followModel = app.models.Follows

// utils
const objectUtil = require('@ggj/utils/utils/object')
const queryUtil = require('@ggj/utils/utils/query')

/**
 * count users have been followed by 'followUserId'
 *
 * @param {Number} followId
 * @returns {Number}
 * @public
 */
async function countFollows(followUserId) {
  return await followModel.count({
    isValid: 1,
    followUserId,
  })
}

/**
 * count Followers follow userId
 *
 * @param {Number} userId
 * @returns {Number}
 * @public
 */
async function countFollowers(userId) {
  return await followModel.count({
    isValid: 1,
    userId,
  })
}


/**
 * check followUserId has follow userId
 *
 * @param {Number} followId
 * @param {Number} MyId
 * @returns {Boolean}
 * @public
 */
async function checkFollow(userId, followUserId) {
  if (!followUserId) {
    return 0
  }

  const count = await followModel.count({
    isValid: 1,
    userId,
    followUserId,
  })
  return (count == 0) ? 0 : 1
}

/**
 * Get follow data by conditions
 *
 * @param {Object} where
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} fields
 * @returns {Promise<Array>}
 * @public
 */
async function getFollows(where, limit = 0, offset = 0, fields) {
  return await followModel.find(objectUtil.deepFilter({
    where: where,
    limit: limit,
    skip: offset,
    fields: queryUtil.fields(fields),
  }))
}

/**
 * Unfollow user
 *
 * @param {Number} userId
 * @param {Number} followUserId
 * @return {Bool}
 * @public
 */
async function unFollow(userId, followUserId) {
  const where = {
    isValid: 1,
    userId,
    followUserId,
  }
  const follows = await getFollows(where, 0, 0, 'id')

  if (!follows || follows.length === 0) {
    return false
  }

  const result = await followModel.destroyById(follows[0].id)
  return result.count == 1 ? true : false
}

/**
 * Create new follow
 *
 * @param {Number} userId
 * @param {Number} followUserId
 * @return {Bool}
 * @public
 */
async function follow(userId, followUserId) {
  const insertStatus = await followModel.findOrCreate({
    isValid: 1,
    userId,
    followUserId,
  })
  return insertStatus[1] // status of create method
}

module.exports = {
  countFollowers,
  countFollows,
  checkFollow,
  getFollows,
  unFollow,
  follow,
}
