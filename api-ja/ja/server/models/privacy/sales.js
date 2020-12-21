// TODO: HARDCODE HERE
const begin = '2007-01-01 00:00:00'

/**
 * Get query condition to get valid sales records
 *
 * @param {number|null} productId
 * @returns {Object}
 * @private
 */
function _basicSaleCondition(productId = null) {
  const condition = {
    isValid: 1,
    statusType: 1,
    salesType: 1,
    payAt: {
      gt: begin,
    },
    // TODO: confirm the logic here
    isCancel: 0,
  }

  if (productId != null) {
    condition.productId = productId
  }
  return condition
}

function _saleCountCondition(productId = null) {
  const condition = {
    isValid: 1,
    statusType: {
      inq: [1, 4],
    },
    salesType: {
      inq: [1, 5],
    },
    typeId: {
      neq: 79,
    },
    productId: {
      neq: 0,
    },
    affiliateId: 0,
    isCancel: 0,
    isRepayment: 0,
    isCoolingOff: 0,
    isMonitor: 0,
    parentSalesId: 0,
    payAt: {
      gt: begin,
    },
  }

  if (productId != null) {
    condition.productId = productId
  }
  return condition
}

/**
 * Get query condition for valid service period
 *
 * @returns {Object}
 * @private
 */
function _periodCondition() {
  const now = Date.now()
  return {
    serviceStartAt: {
      lt: now,
    },
    serviceEndAt: {
      gt: now,
    },
  }
}

/**
 * Get query condition for valid user
 *
 * @param {number} userId
 * @returns {Object}
 * @private
 */
function _userCondition(userId) {
  return {
    userType: 1,
    userId: userId,
  }
}

module.exports = function(Sales) {
  /**
   * Get sales count of a product
   *
   * @param {number} productId
   * @returns {Promise<number>}
   * @public
   */
  Sales.salesCount = async function(productId) {
    return await Sales.count(_saleCountCondition(productId))
  }

  /**
   * Check if user purchased product or not
   *
   * @param {number} productId
   * @param {number} userId
   * @param {Boolean} checkPeriod
   * @returns {Promise<Boolean>}
   * @public
   */
  Sales.purchased = async function(productId, userId, checkPeriod = false) {
    if (userId == 0) {
      return false
    }
    const where = Object.assign(
        _basicSaleCondition(productId),
        _userCondition(userId),
        checkPeriod ? _periodCondition() : {},
      )
      const count = await Sales.count(where)
    return count > 0
  }

  /**
   * Get valid query condition
   *
   * @param {number} userId
   * @param {Boolean} checkPeriod
   * @returns {Object}
   * @public
   */
  Sales.validCondition = function(userId, checkPeriod = false) {
    return Object.assign(
      _basicSaleCondition(),
      _userCondition(userId),
      checkPeriod ? _periodCondition() : {},
    )
  }
}
