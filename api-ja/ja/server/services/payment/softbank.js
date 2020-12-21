const _markCheckoutSuccess = require('@services/cart/sale').markCheckoutSuccess
const format = require('date-fns/format')
const sha1 = require('sha1')
// const axios = require('axios')
const HOST = process.env.GOGO_HOST_URL
// const SOFTBANK_USER = process.env.SOFTBANK_USER
// const SOFTBANK_PASS = process.env.SOFTBANK_PASS
const SOFTBANK_URL = process.env.SOFTBANK_URL
const SOFTBANK_REGISTER_URL = process.env.SOFTBANK_REGISTER_URL
// const SOFTBANK_CONFIRMATION_URL = process.env.SOFTBANK_CONFIRMATION_URL
const HASH_KEY = process.env.SOFTBANK_HASH_KEY
const SERVICE_ID = process.env.SOFTBANK_SERVICE_ID
const MERCHANT_ID = process.env.SOFTBANK_MERCHANT_ID
const PAY_METHOD = 'credit'
const PAID_SALE_STATUS = 1
const PAY_TYPE = 0
const SERVICE_TYPE = '0'
const LIMIT_SECOND = '600'
const SUCCESS_URL = HOST + 'cart/complete?ssid='
const CANCEL_URL = HOST + 'cart/cancel?ssid='
const ERROR_URL = HOST + 'cart/error?ssid='
const CALLBACK_URL = HOST + 'payment/cart/complete/sbps'
const {
  map,
  uniq,
} = require('lodash')

/**
 * SoftBank hash function
 *
 * @param {Object} data
 * @returns {string}
 * @private
 */
function _spsHashcode(data) {
  // let str = Object.keys(data).reduce((str, key) => str + data[key], '')
  let str = data.reduce((str, record) => str + record[1], '')
  return sha1(str + HASH_KEY)
}

/**
 * Add hash code to data
 *
 * @param {Object} data
 * @returns {Object}
 * @private
 */
function _addHashcode(data) {
  data.push(['request_date', format(new Date(), 'YYYYMMDDHHmmss')])
  data.push(['limit_second', LIMIT_SECOND])
  let sps_hashcode = _spsHashcode(data)
  data.push(['sps_hashcode', sps_hashcode])
  return data
}

/**
 * Generate customer code to send to softbank
 *
 * @param {number} userId
 * @param {string} salesSessionId
 * @returns {string}
 * @private
 */
function _custCode(userId, salesSessionId) {
  return salesSessionId.charAt(0) === 'n' ? 'N' + userId : userId
}

/**
 * Generate data to process softbank credit registration
 *
 * @param {number} userId
 * @param {string} salesSessionId
 * @returns {Object}
 * @private
 */
function _sbRegisterResponse(userId, salesSessionId) {
  const suffix = salesSessionId
  const res = {
    paymentUrl: SOFTBANK_REGISTER_URL,
    data: _addHashcode([
      ['pay_method', PAY_METHOD],
      ['merchant_id', MERCHANT_ID],
      ['service_id', SERVICE_ID],
      ['cust_code', _custCode(userId, salesSessionId)],
      ['success_url', SUCCESS_URL + suffix],
      ['cancel_url', CANCEL_URL + suffix],
      ['error_url', ERROR_URL + suffix],
      ['pagecon_url', CALLBACK_URL],
    ])
  }
  return res
}

/**
 * Generate data to process softbank checkout
 *
 * @param {number} total
 * @param {string} salesSessionId
 * @param {number} userId
 * @param {Array} sales
 * @returns {Object}
 * @private
 */
function _sbPaymentResponse(total, salesSessionId, userId, sales) {
  let suffix = salesSessionId,
    data = [
      ['pay_method', PAY_METHOD],
      ['merchant_id', MERCHANT_ID],
      ['service_id', SERVICE_ID],
      ['cust_code', _custCode(userId, salesSessionId)],
      ['order_id', salesSessionId],
      ['item_id', userId],
      ['item_name', uniq(map(sales, 'productId')).join(',').substring(0, 40)],
      ['amount', total],
      ['pay_type', PAY_TYPE],
      ['service_type', SERVICE_TYPE],
      ['success_url', SUCCESS_URL + suffix],
      ['cancel_url', CANCEL_URL + suffix],
      ['error_url', ERROR_URL + suffix],
      ['pagecon_url', CALLBACK_URL],
    ]
  for (let idx in sales) {
    let sale = sales[idx]
    data.push(['dtl_rowno', parseInt(idx) + 1])
    data.push(['dtl_item_id', sale.productId])
    data.push(['dtl_item_name', 'Product ' + sale.productId])
    data.push(['dtl_item_count', 1])
    data.push(['dtl_amount', sale.price])
  }
  return {
    paymentUrl: SOFTBANK_URL,
    data: _addHashcode(data),
  }
}

async function _isCreditCardRegistered() {
  return false // TODO: remove this block
  // let data = _addHashcode([
  //     ['merchant_id', MERCHANT_ID],
  //     ['service_id', SERVICE_ID],
  //     ['cust_code', _custCode(userId, salesSessionId)],
  //     ['response_info_type', 2],
  //     ['encrypted_flg', 1],
  //   ]),
  //   xml =
  //   `<sps-api-request id="MG02-00104-101">${_buildXml(data)}</sps-api-request>`,
  //   res = await axios.post(SOFTBANK_CONFIRMATION_URL, xml, {
  //     headers: {
  //       'Content-Type': 'text/xml',
  //     },
  //     auth: {
  //       username: SOFTBANK_USER,
  //       password: SOFTBANK_PASS,
  //     },
  //   })
  // return res.data.includes('cc_number')
}

// function _buildXml(data, str = '') {
//   data.forEach(e => {
//     if (!Array.isArray(e[1])) {
//       str += `<${e[0]}>${e[1]}</${e[0]}>`
//     } else {
//       str += `<${e[0]}>${_buildXml([e[1]])}</${e[0]}>`
//     }
//   })
//   return str
// }

/**
 * Get checkout information for softbank payment method
 *
 * @param {number} total
 * @param {string} salesSessionId
 * @param {number} userId
 * @param {Array} sales
 * @returns {Object}
 * @public
 */
async function checkout(total, salesSessionId, userId, sales) {
  if (total > 0) {
    return _sbPaymentResponse(total, salesSessionId, userId, sales)
  }

  let hasCreditCartInformation = await _isCreditCardRegistered(userId)
  if (hasCreditCartInformation) {
    sales.forEach(sale => {
      sale.statusType = PAID_SALE_STATUS
    })
    _markCheckoutSuccess(salesSessionId)
    return {}
  }

  // Register card information only
  return _sbRegisterResponse(userId, salesSessionId)
}

/**
 * Success response content to softbank server
 *
 * @param {input}
 * @returns {string}
 * @public
 */
function success() {
  return 'OK,'
}

/**
 * Failed response content to softbank server
 *
 * @param {input}
 * @returns {string}
 * @public
 */
function failed() {
  return 'NG,'
}

/**
 * Analyze incoming request and get payment data
 *
 * @param {Object} input
 * @returns {Object}
 * @public
 */
function receive(input) {
  let userId = input.cust_code
  if (userId.charAt(0) === 'N') {
    userId = userId.substring(1)

  }
  return {
    userId: parseInt(userId),
    total: input.amount || 0,
    sessionId: input.order_id,
    memo: input.res_tracking_id,
  }
}

module.exports = {
  failed,
  receive,
  success,
  checkout,
}
