const cartErrors = require('@services/cart/errors')
const axios = require('axios')
const userCommonService = require('@services/common/user')
const cartMailService = require('@services/cart/mail')
const qs = require('qs')
const encoder = require('qs-iconv/encoder')('shift_jis')

const FAMIMYMART_STORE_ID = 3
const ONLINE_STORE_ID = 73
const METAPS_URL = process.env.METAPS_URL
const METAPS_IP = process.env.METAPS_IP

/**
 * Get user information
 *
 * @param {number} userId
 * @returns {Promise<Object>}
 * @private
 */
async function _user(userId) {
  return await userCommonService.getUserFullInformation(userId, true) || {}
}

/**
 * Generate post data
 *
 * @param {number} total
 * @param {string} salesSessionId
 * @param {Object} user
 * @param {number} storeId
 * @returns {Object}
 * @private
 */
function _generatePostData(total, salesSessionId, user, storeId) {
  return {
    IP: METAPS_IP,
    SID: salesSessionId,
    NAME1: '会員ID ' + user.id,
    NAME2: '会員ID ' + user.id,
    MAIL: user.id + '@gogojungle.co.jp',
    N1: 'GogoJungle ' + salesSessionId,
    K1: total,
    STORE: (storeId == 1 ? FAMIMYMART_STORE_ID : ONLINE_STORE_ID),
    TEL: '000000000',
    FUKA: user.id,
  }
}

/**
 * Send payment request to metaps
 *
 * @param {Object} data
 * @returns {Object}
 * @private
 */
async function _sendPaymentRequest(data) {
  let res = await axios.get(METAPS_URL, {
    params: data,
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'brackets', encoder })
    },
  },
  {
    responseType: 'text',
    headers: {
      'charset': 'Shift_JIS',
    },
  })
  return _formatData(res.data, data.SID)
}

/**
 * Generate response for metaps payment request
 *
 * @param {string} response
 * @param {string} salesSessionId
 * @returns {Object}
 * @private
 */
function _formatData(response, sessionId) {
  // Sample  "OK\r\n56411_5293309\r\n50000\r\n10985725515\r\n20190319\r\n56411\r\nhttps://www.paydesign.jp/settle/settle3/conv/cpt/settle_wn_cpt.jsp?settle_seq=103588833&settle_req_crypt=b5352dd3c74f9f4a&sub=94806580
  let result = response.split("\r\n")
  if (result[0] != 'OK') {
    return {
      failed: true
    }
  }
  let payId = 4,
    code = result[3].split('-'),
    confirmUrl = result[6],
    expired = result[4].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
    expiredAt = (new Date(expired)).getTime() / 1000

  if (code.length == 1) {
    return {
      payId,
      code: code[0],
      expiredAt,
      sessionId,
      confirmUrl,
    }
  } else if (code.length == 2) {
    return {
      payId,
      code1: code[0],
      code2: code[1],
      expiredAt,
      sessionId,
      confirmUrl,
    }
  }

  return {
    failed: true
  }
}

/**
 * Send checkout request to metaps
 *
 * @param {number} storeType
 * @param {number} total
 * @param {string} salesSessionId
 * @param {number} userId
 * @param {number} storeId
 * @returns {Boolean}
 * @public
 */
async function processPaymentRequest(total, salesSessionId, userId, storeId = 1) {
  let user = await _user(userId)
  if (!user.id) {
    return cartErrors.cartError011
  }
  let data = await _sendPaymentRequest(_generatePostData(total, salesSessionId, user, storeId))
  cartMailService.sendMailToBuyer(salesSessionId, userId, 45, data)
  return data
}

/**
 * Analyze incoming request and get payment data
 *
 * @param {Object} input
 * @returns {Object}
 * @public
 */
function receive(input) {
  return {
    userId: parseInt(input.FUKA),
    total: parseInt(input.KINGAKU),
    sessionId: input.SID || '',
    memo: 'SEQ = ' + input.SEQ || '',
  }
}

/**
 * Success response content to metaps server
 *
 * @param {object} input
 * @returns {string}
 * @public
 */
async function success(input) {
  let data = receive(input)
  cartMailService.sendMailToBuyer(data.sessionId, data.userId, 46)
  return "0\r\n"
}

/**
 * Failed response content to metaps server
 *
 * @param {input}
 * @returns {string}
 * @public
 */
function failed() {
  return 'NG'
}

module.exports = {
  failed,
  success,
  receive,
  processPaymentRequest,
}
