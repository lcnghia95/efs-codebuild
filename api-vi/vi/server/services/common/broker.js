const app = require('@server/server')
const brokersModel = app.models.Brokers
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get all brokers in table Brokers
 *
 * @returns {Array}
 * @public
 */
async function show() {
  return arrayUtil.index(await _getBrokers(), 'id', 'name')
}

/**
 * Get brokers with is_domestic = 1
 *
 * @returns {Array}
 * @public
 */
async function showDomestic() {
  const whereCond = {
    isValid: 1,
    isDomestic: 1,
  }

  return arrayUtil.index(await _getBrokers(whereCond), 'id', 'name')
}

/**
 * Get brokers with is_domestic = 1 and is_demo_forward_test = 1
 *
 * @param {object} model model
 * @param {object} condition condition
 * @returns {Array}
 * @public
 */
async function showAutualMeasurement() {
  const whereCond = {
    isValid: 1,
    isDomestic: 1,
    isDemoForwardTest: 1,
  }

  return arrayUtil.index(await _getBrokers(whereCond), 'id', 'name')
}

/**
 * Get brokers in table Brokers with condition
 *
 * @param {object} condition condition
 * @returns {Array}
 * @private
 */
async function _getBrokers(condition = {}) {
  return await brokersModel.find({
    where: condition,
    fields: {
      id: true,
      name: true,
    },
  })
}

module.exports = {
  show,
  showDomestic,
  showAutualMeasurement,
}
