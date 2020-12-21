const app = require('@server/server')
const {
  markCheckoutSuccess,
  cancelCheckout,
} = require('@services/cart/sale')
const cartHelper = require('@services/cart/helper')
const syncService = require('@services/common/synchronize.js')
const cartMailService = require('@services/cart/mail')
const softbankService = require('./softbank')
const telecomService = require('./telecom')
const metapsService = require('./metaps')
const _sqlDate = app.utils.time.sqlDate
const SOFTBANK_PAYMENT_TYPE = 2
const COMPLETE_OPERATION_TYPE = 1
const CANCEL_OPERATION_TYPE = 2
const UNPAID_SALE_STATUS = 0
const NORMAL_SALE_TYPE = 1
const SOFTBANK_FLAG = 0
const TELECOM_FLAG = 1
const META_FLAG = 2
const SERVICES = [
  softbankService,
  telecomService,
  metapsService,
]
const PAY_IDS = [
  2,
  3,
  4,
]

/**
 * Mark sales records as PAID after finish 3rd party payment
 *
 * @param {string} sessionId
 * @returns {void}
 * @private
 */
function _markComplete(sessionId) {
  markCheckoutSuccess(sessionId)
}

/**
 * Mark sales records as CANCEL
 *
 * @param {string} sessionId
 * @returns {void}
 * @private
 */
function _markCancel(sessionId) {
  cancelCheckout(sessionId)
}

/**
 * Add sales memo
 *
 * @param {Array} sales
 * @param {string} memo
 * @returns {void}
 * @private
 */
async function _addMemo(sales, memo) {
  const memoData = sales.map(sale => {
      return {
        isValid: 1,
        salesId: sale.id,
        memo,
      }
    })
    const salesMemo = await app.models.SalesMemo.create(memoData)
  salesMemo.forEach(memo => {
    syncService.syncDataToFxon('sales_memo', memo.id)
  })
}

/**
 * Get total price of sales records
 *
 * @param {Array} sales
 * @returns {number}
 * @private
 */
function _price(sales) {
  return sales.reduce((total, sale) => (total + sale.price || 0), 0)
}

/**
 * Validate confirm request from 3rd party payment company
 *
 * @param {number} userId
 * @param {number} total
 * @param {string} sessionId
 * @param {string} memo
 * @param {string} operationType // 1: COMPLETE, 2: CANCEL
 * @param {number} payId
 * @returns {Boolean}
 * @private
 */
async function _proccess(
  userId,
  total,
  sessionId,
  memo,
  operationType,
  payId = null,
) {
  if (!userId || !sessionId || !payId) {
    return false
  }

  const sales = await _sales(userId, sessionId)
    const price = _price(sales)

  if (total != price) {
    return false
  }

  _addMemo(sales, memo)
  if (operationType == COMPLETE_OPERATION_TYPE) {
    if (payId == 2 || payId == 3) {
      // Send mail to buyuser
      // payId == 3 || 2 send template undefined
      cartMailService.sendMailToBuyer(sessionId, userId, 0)
    }
    _markComplete(sessionId)
    // Send mail to seller
    cartMailService.sendMailToSeller(sales, 48)
  } else if (operationType == CANCEL_OPERATION_TYPE) {
    _markCancel(sessionId)
  }
  return true
}

/**
 * Get sales record data
 *
 * @param {number} userId
 * @param {string} sessionId
 * @returns {Array}
 * @private
 */
async function _sales(userId, sessionId) {
  if (!userId || !sessionId) {
    return []
  }
  return await app.models.Sales.find({
    where: {
      isValid: 1,
      statusType: UNPAID_SALE_STATUS,
      salesType: NORMAL_SALE_TYPE,
      userId,
      sessionId,
    },
    fields: {
      id: true,
      price: true,
      productId: true,
      developerUserId: true,
      langType: true,
    },
  })
}

/**
 * Validate confirm request from 3rd party service
 *
 * @param {Object} input
 * @param {number} flag
 * @returns {string}
 * @public
 */
async function _receive(input, flag) {
  const service = SERVICES[flag]
    const payId = PAY_IDS[flag]
  if (!service) {
    return 'NG,'
  }

  let {
    userId,
    total,
    sessionId,
    memo,
  } = service.receive(input)
  if (!memo) {
    memo = 'completed on ' + _sqlDate(new Date(),
      'YYYY-MM-DD HH:mm:ss')
  }

  const check = await _proccess(
      userId || 0,
      total || 0,
      cartHelper.validateSalesSessionId(sessionId || ''),
      memo,
      1,
      payId,
    )
    const result = check ? service.success(input) : service.failed(input)
  return result
}

/**
 * Handle confirm request from softbank
 *
 * @param {Object} input
 * @returns {string}
 * @public
 */
async function sbpsReceive(input) {
  if (input.amount) {
    return await _receive(input, SOFTBANK_FLAG)
  } else {
    return await sbpsReceiveRegister(input)
  }
}

/**
 * Handle confirm request from softbank for register card information
 *
 * @param {Object} input
 * @returns {string}
 * @public
 */
async function sbpsReceiveRegister(input) {
  const sessionId = await _getSessionId(input.cust_code)
  if (sessionId.length > 0) {
    input.order_id = sessionId
    return await _receive(input, SOFTBANK_FLAG)
  }
  return softbankService.failed(input)
}

async function _getSessionId(userId) {
  if (!userId) {
    return ''
  }
  const sale = await app.models.Sales.findOne({
    where: {
      isValid: 1,
      charge_type: SOFTBANK_PAYMENT_TYPE,
      statusType: UNPAID_SALE_STATUS,
      salesType: NORMAL_SALE_TYPE,
      price: 0,
      isFree: 0,
      userId,
    },
    fields: {
      id: true,
      productId: true,
      sessionId: true,
      developerUserId: true,
    },
    order: 'id DESC',
  }) || {}
  return sale.sessionId || ''
}

/**
 * Handle confirm request from telecom
 *
 * @param {Object} input
 * @returns {string}
 * @public
 */
async function teleReceive(input) {
  return await _receive(input, TELECOM_FLAG)
}

/**
 * Handle confirm request from metaps-payment
 *
 * @param {Object} input
 * @returns {string}
 * @public
 */
async function metaReceive(input) {
  return await _receive(input, META_FLAG)
}

/**
 * Handle cancel request from metaps-payment
 *
 * @param {Object} input
 * @returns {string}
 * @public
 */
function metaCancel(input) {
  const {
    userId,
    total,
    sessionId,
    memo,
  } = metapsService.receive(input)
  _proccess(userId, total, sessionId, memo, 2)
  return metapsService.success()
}

module.exports = {
  metaReceive,
  metaCancel,
  teleReceive,
  sbpsReceive,
  sbpsReceiveRegister,
}
