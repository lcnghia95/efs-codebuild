const request = require('request')
const crypto = require('crypto')

const PUBLIC_KEY = process.env.QX_PUBLIC_KEY
const SECRET_KEY = process.env.QX_SECRET_KEY
const QX_PARTNER_API_V1 = process.env.QX_PARTNER_API_V1

const SYSTEM_PRODUCT_TYPE_ID = 1
const QUANTX_PLATFORM_ID = 9

/**
 * Build header
 *
 * @param {Object} body
 * @returns {Object}
 * @private
 */
function createHeaders(body) {
  const hmac = crypto.createHmac('sha512', SECRET_KEY)
  hmac.update(JSON.stringify(body))
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'X-QuantXToken': PUBLIC_KEY,
    'X-QuantXSignature': hmac.digest('hex'),
    'X-Timestamp': body.timestamp
  }
}

/**
 * Send request to QuantX
 *
 * @param String path
 * @param {Object} param
 * @returns {Object}
 * @private
 */
async function api(path, param = null) {
  let body = {
    timestamp: new Date().getTime() / 1000
  }
  if (param) {
    body = Object.assign(body, param)
  }
  const options = {
    url: `${QX_PARTNER_API_V1}${path}`,
    method: 'POST',
    headers: createHeaders(body),
    json: body
  }

  return new Promise((resolve, reject) => {
    request(options, (err, resp, body)  => {
      if (err || body['code'] !== 200) {
        reject(body)
        return
      }
      resolve(body['results'])
    })
  })
}


/**
 * Get products from QuantX
 *
 * @returns [Array]
 * @private
 */
async function products() {
  return await api('/products/search')
}

/**
 * Get reserves info from QuantX
 *
 * @returns [Array]
 * @private
 */
async function reserves(qxProductId, userId) {
  let params = {
    'live_hash': qxProductId,
    'customer_id': userId,
    'action': 'purchase'
  }
  return await api('/reserve', params)
}

/**
 * Cancel reserves info from QuantX
 *
 * @returns {Promise<unknown>}
 * @private
 * @param qxProductId
 */
async function reservesCancel(reserveHash) {
  return await api(`/reserve/${reserveHash}/cancel`)
}

/**
 * Get signals from QuantX
 *
 * @returns [Array]
 * @private
 */
async function signals(qxProductId) {
  return await api(`/products/${qxProductId}/signals`)
}

/**
 * Check whether product is quantx or not
 * Base on type and platform of the product
 *
 * @param prod
 * @returns {boolean|boolean}
 */
function isQuantXProd(prod) {
  return prod && prod.typeId == SYSTEM_PRODUCT_TYPE_ID &&
    prod.platformId == QUANTX_PLATFORM_ID
}

function quantxProdCondition() {
  return {
    typeId: SYSTEM_PRODUCT_TYPE_ID,
    platformId: QUANTX_PLATFORM_ID
  }
}

module.exports = {
  api,
  products,
  reserves,
  signals,
  reservesCancel,
  isQuantXProd,
  quantxProdCondition,
}
