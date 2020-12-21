const app = require('@server/server')
const brokersModel = app.models.Brokers
const platformBrokersModel = app.models.PlatformBrokers
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
 * Get all brokers based on platform in table brokers && platform_brokers
 *
 * @param {Number} langType
 * @returns {Object}
 * @public
 */
async function showPlatformBroker(langType)
{
  const result = {}
  const whereCond = {
    isDomestic: LANGTYPE.includes(langType) ? 0 : 1,
  }

  const brokers = arrayUtils.index(await _getBrokers(whereCond), 'id', 'name')
  if (!brokers){
    return []
  }

  const platformBroker = await _getPlatformBrokers()
  if (!platformBroker){
    return []
  }

  platformBroker.map(broker => {
    if (!result[broker.platformId]) {
      result[broker.platformId] = []
    }
    result[broker.platformId].push([broker.brokerId, brokers[broker.brokerId]])
  })

  Object.keys(result).forEach(key => {
    result[key] = result[key].reduce((o, value) => {
       o[value[0]] = value[1]
      return o
    }, {})
  })
   return result
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
 * Get measurement brokers based on platformId and is_domestic (= 1 with ja, = 0 with en or th)
 *
 * @param {Number} langType
 * @returns {Object}
 * @public
 */
async function showPlatformMeasurement(langType, input = {}) {
  const result = {}
  const whereCond = {
    isValid: 1,
    isDomestic: LANGTYPE.includes(langType) ? 0 : 1,
  }

  const brokers = arrayUtils.index(await _getBrokers(whereCond), 'id', 'name')
  if (!brokers){
    return []
  }

  const pbCond = {
    isDemoForwardTest: 1,
  }
  if (parseInt(input.isHedge || 0)) {
    pbCond.isCrossOrder = 1
    // pbCond.brokerId = {
    //   neq: 203, // 両建てありの場合はOANDAは選択できません。
    // }
  } else {
    pbCond.isCrossOrder = {inq: [0,1]}
  }
  const platformBroker = await _getPlatformBrokers(pbCond)

  if (!platformBroker){
    return []
  }

  platformBroker.map(broker => {
    if (!result[broker.platformId]) {
      result[broker.platformId] = []
    }
    result[broker.platformId].push([broker.brokerId, brokers[broker.brokerId]])
  })

  Object.keys(result).forEach(key => {
    result[key] = result[key].reduce((o, value) => {
      o[value[0]] = value[1]
      return o
    }, {})
  })
  return result
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
/**
 * Get platform brokers in table platform_brokers with condition
 *
 * @param {object} condition
 * @returns {Array}
 * @private
 */
function _getPlatformBrokers(condition = {}) {
  return platformBrokersModel.find({
    where: {
      isValid: 1,
      ...condition,
    },
    fields: {
      brokerId: true,
      platformId: true,
    },
  })
}

async function checkDomesticBroker(id) {
  const broker = await app.models.Brokers.findOne({
    where: {
      id,
    },
  }) || {}
  return broker.isDomestic === 0
}
module.exports = {
  show,
  showDomestic,
  showAutualMeasurement,
  checkDomesticBroker,
  showPlatformBroker,
  showPlatformMeasurement,
}
