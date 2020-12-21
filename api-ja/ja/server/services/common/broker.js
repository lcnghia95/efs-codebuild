const app = require('@server/server')
const brokersModel = app.models.Brokers
const arrayUtils = require('@ggj/utils/utils/array')

const LANGTYPE = [2, 3, 4]

/**
 * Get all brokers in table Brokers
 *
 * @returns {Array}
 * @public
 */
async function show(langType)
{
  const whereCond = {
    isDomestic: LANGTYPE.includes(langType) ? 0 : 1,
  }
  return arrayUtils.index(await _getBrokers(whereCond), 'id', 'name')
}

/**
 * Get brokers with is_domestic (= 1 with ja, = 0 with en or th)
 *
 * @returns {Array}
 * @public
 */
async function showDomestic(langType) {
  const whereCond = {
    isValid: 1,
    isDomestic: LANGTYPE.includes(langType) ? 0 : 1,
  }
  return arrayUtils.index(await _getBrokers(whereCond), 'id', 'name')
}

/**
 * Get brokers with is_demo_forward_test = 1 and is_domestic (= 1 with ja, = 0 with en or th)
 *
 * @param {object} model model
 * @param {object} condition condition
 * @returns {Array}
 * @public
 */
async function showAutualMeasurement(langType) {
  const whereCond = {
    isValid: 1,
    isDomestic: LANGTYPE.includes(langType) ? 0 : 1,
    isDemoForwardTest: 1,
  }

  return arrayUtils.index(await _getBrokers(whereCond), 'id', 'name')
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
