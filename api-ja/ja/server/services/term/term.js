const termHelper = require('@@services/term/helper')

const DEFAULT_PRIVACY_IDS = [8]
const DEFAULT_SERVICE_IDS = [1]
const DEFAULT_DISPLAY_IDS = [2, 3, 4, 5, 10]
const DEFAULT_AFFILIATE_IDS = [5, 6]
const DEFAULT_OPERATION_IDS = [13]
const DEFAULT_TRANSACTION_USERID = 110001
const DEFAULT_CROWDSOURCING_IDS = [7]
const DEFAULT_CONTRACT_LIMIT = 30
const MONTHLY_SECONDS = 2678400 // 60*60*24*31
const USER_SERVICE_TYPE = 1

/**
 * Get term privacy
 *
 * @param {Void}
 * @returns {Array}
 * @public
 */
async function privacy() {
  return await termHelper.getTermsData(DEFAULT_PRIVACY_IDS, {
    publishedAt: true
  })
}

/**
 * Get term service
 *
 * @param {Void}
 * @returns {Array}
 * @public
 */
async function service() {
  return await termHelper.getTermsData(DEFAULT_SERVICE_IDS)
}

/**
 * Get term display
 *
 * @param {Void}
 * @returns {Array}
 * @public
 */
async function display() {
  return await termHelper.getTermsData(DEFAULT_DISPLAY_IDS)
}

/**
 * Get term affiliate
 *
 * @param {Void}
 * @returns {Array}
 * @public
 */
async function affiliate() {
  return await termHelper.getTermsData(DEFAULT_AFFILIATE_IDS)
}

/**
 * Get term operation
 *
 * @param {Void}
 * @returns {Array}
 * @public
 */
async function operation() {
  return await termHelper.getTermsData(DEFAULT_OPERATION_IDS, {
    publishedAt: true
  })
}

/**
 * Get term transaction
 *
 * @param {Void}
 * @returns {Array}
 * @public
 */
async function transaction() {
  return await termHelper.transaction(DEFAULT_TRANSACTION_USERID)
}

/**
 * Get term crowdsourcing
 *
 * @param {Void}
 * @returns {Array}
 * @public
 */
async function crowdsourcing() {
  return await termHelper.getTermsData(DEFAULT_CROWDSOURCING_IDS)
}

/**
 * Get term contract index
 *
 * @param {Number} userId
 * @param {Object} input
 * @returns {Array}
 * @public
 */
async function index(userId, input) {
  return await termHelper.index(userId, input, DEFAULT_CONTRACT_LIMIT)
}

/**
 * Get term contract detail
 *
 * @param {Number} userId
 * @param {Number} id
 * @param {Number} saleId
 * @param {Object} input
 * @returns {Object}
 * @public
 */
async function contract(uId, id, saleId, input) {
  return await termHelper.contract(uId, id, saleId, input, MONTHLY_SECONDS)
}

/**
 * get user terms
 *
 * return {string}
 *
 * @public
 */
async function user() {
  return await termHelper.user(USER_SERVICE_TYPE)
}


module.exports = {
  privacy,
  service,
  display,
  affiliate,
  operation,
  transaction,
  crowdsourcing,
  index,
  contract,
  user,
}
