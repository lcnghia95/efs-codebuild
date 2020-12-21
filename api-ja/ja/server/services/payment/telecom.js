const HOST = process.env.GOGO_HOST_URL
const TELECOM_URL = process.env.TELECOM_URL
const CLIENT_IP = process.env.TELECOM_CLIENT_IP
const CLIENT_IP_EN = process.env.TELECOM_CLIENT_IP_EN
const REDIRECT_URL = HOST + process.env.PAYMENT_COMPLETE_URL
const JAPANESE_LANG_TYPE = 1

/**
 * get client ip
 *
 * @returns {string}
 * @private
 */
function _getClientIp(langType = 1) {
  return langType == JAPANESE_LANG_TYPE ? CLIENT_IP : CLIENT_IP_EN
}

/**
 * Success response content to telecom server
 *
 * @returns {string}
 * @public
 */
function success() {
  return 'SuccessOK'
}

/**
 * Failed response content to telecom server
 *
 * @returns {string}
 * @public
 */
function failed() {
  return 'NG'
}

/**
 * Analyze incoming request and get payment data
 *
 * @param {Object} input
 * @returns {Object}
 * @public
 */
function receive(input) {
  if (input.rel != 'yes') {
    return {}
  }

  let clientIp = parseInt(input.clientip)
  if (clientIp != CLIENT_IP && clientIp != CLIENT_IP_EN) {
    return {}
  }

  return {
    userId: parseInt(input.sendid),
    total: parseInt(input.money),
    sessionId: input.option || ''
  }
}

/**
 * Generate data for telecom payment form
 *
 * @param {number} total
 * @param {string} salesSessionId
 * @param {number} userId
 * @returns {Object}
 * @public
 */
async function checkout(total, salesSessionId, userId, langType) {
  return {
    paymentUrl: TELECOM_URL,
    data: [
      ['clientip', _getClientIp(langType)],
      ['money', total],
      ['sendid', parseInt(userId)],
      ['option', salesSessionId],
      ['redirect_url', REDIRECT_URL + '?ssid=' + salesSessionId],
    ]
  }
}

module.exports = {
  failed,
  receive,
  success,
  checkout,
}
