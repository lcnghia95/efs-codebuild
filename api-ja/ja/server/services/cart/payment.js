const helper = require('./helper')
const metapsService = require('@services/payment/metaps')
const telecomService = require('@services/payment/telecom')
const softbankService = require('@services/payment/softbank')
const quantxService = require('@@services/common/quantx')
const SALON_PRODUCT_TYPE_ID = 4
const NAVI_PRODUCT_TYPE_ID = 3
const SOFTBANK_PAYMENT_TYPE = 2
const TELECOM_PAYMENT_TYPE = 3
const STORE_PAYMENT_TYPE = 4
const MAX_CONVENIENCE_PAYMENT_AMOUNT = 300000
const maps = {
  1: 'bank',
  2: 'card',
  3: 'card2',
  4: 'store',
  5: 'tran',
}

/**
 * get payments of products
 *
 * @param {Object} productObjects
 * @returns {Object}
 * @private
 */
function getPayments(productObjects) {
  let payIds = [1, 2, 3, 4, 5]
  const productIds = Object.keys(productObjects)

  for(let i = 0; i < productIds.length; i++) {
    const productId = productIds[i]
    const product = productObjects[productId]

    if(!product) {
      continue
    }
    
    let list = [1, 2, 3, 4]

    if (!product.id) {
      continue
    }

    if (product.id == 14359) {
      // TODO: refactor this block later
      list = [2]
    } else if (product.typeId == SALON_PRODUCT_TYPE_ID) {
      list = product.isFreeFirstMonth ? [2] : [2, 5]
    } else if (product.typeId == NAVI_PRODUCT_TYPE_ID && product.isSubscription === 1) {
      list = [2]
    } else if (product.isSubscription === 1) {
      list = [2]
    } else if (quantxService.isQuantXProd(product)) {
      list = [2, 3]
    }

    payIds = payIds.filter(payId => -1 !== list.indexOf(payId))

    if (payIds.length == 0) {
      return []
    }
  }
  
  return payIds.reduce((result, payId) => {
    result[maps[payId]] = 1
    return result
  }, {})
}

/**
 * Process payment API
 *
 * @param {number} payId
 * @param {Array} sales
 * @param {number} salesSessionId
 * @param {Object} products
 * @param {number} userId
 * @param {number} userType
 * @param {number} storeId
 * @returns {Object}
 * @public
 */
async function process(
  payId,
  sales,
  salesSessionId,
  products,
  userId,
  userType,
  storeId,
  langType,
) {
  const total = helper.totalPrice(sales)
  if (payId == STORE_PAYMENT_TYPE) {
    if (total < MAX_CONVENIENCE_PAYMENT_AMOUNT) {
      return metapsService.processPaymentRequest(
        total,
        salesSessionId,
        userId,
        storeId,
      )
    }
  }

  // https://gogojungle.backlog.jp/view/OAM-44533
  const isMonthlyProduct = _checkMonthlyProducts(Object.values(products))
  if(payId == TELECOM_PAYMENT_TYPE && isMonthlyProduct) {
    payId = SOFTBANK_PAYMENT_TYPE
  }

  if (payId == SOFTBANK_PAYMENT_TYPE) {
    return softbankService.checkout(total, salesSessionId, userId, sales)
  }

  if (payId == TELECOM_PAYMENT_TYPE) {
    return telecomService.checkout(total, salesSessionId, userId, langType)
  }
}

/**
 * Check exist monthly products
 * https://gogojungle.backlog.jp/view/OAM-44533
 *
 * @param {Array} products
 * @private
 */
function _checkMonthlyProducts(products) {
  const result = products.find(product => product.isSubscription == 1)
  return !result ? false : true
}

module.exports = {
  process,
  getPayments,
}
