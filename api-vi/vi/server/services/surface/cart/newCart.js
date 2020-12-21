const app = require('@server/server')
const helper = require('@services/cart/helper')

const objectUtil = require('@ggj/utils/utils/object')

const BUY_NOW_STATUS_TYPE = 1
const BUY_LATER_STATUS_TYPE = 0

/**
 * Get total item in cart of current user
 *
 * @param {Object} meta
 * @returns {Promise<Object>}
 */
async function count(meta) {
  const userId = meta.userId
  const cartSessionId = meta.cartSessionId
  const total = await _total(userId, cartSessionId)
  return objectUtil.filter({
    count: total,
  })
}

/**
 * Get number of `common.cart` records
 *
 * @param {number} userId
 * @param {number} cartSessionId
 * @returns {number}
 * @private
 */
async function _total(userId, cartSessionId) {
  const condition = helper.cartQueryCondition(userId, cartSessionId)
  condition.statusType = {inq: [BUY_NOW_STATUS_TYPE, BUY_LATER_STATUS_TYPE]}
  return await app.models.Carts.count(condition)
}

module.exports = {
  count,
}
