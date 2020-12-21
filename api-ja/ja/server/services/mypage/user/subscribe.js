const app = require('@server/server')
const commonSale = require('@services/common/sale')
const commonEmailV1 = require('@@services/common/emailv1')
const syncService = require('@services/common/synchronize')

// Utils
const objectUtils = app.utils.object
const arrayUtils = require('@ggj/utils/utils/array')
const cryptoUtils = app.utils.crypto
const slackUtils = app.utils.slack
const timeUtils = app.utils.time

// Models
const userModel = app.models.Users
const productModel = app.models.Products
const saleMemoModel = app.models.SalesMemo
const mailmagazineSubscribersModel = app.models.MailmagazineSubscribers
const specialFeePriceStatementModel = app.models.SpecialFeePriceStatement

// Constant
const SALON_TYPE_ID = 4
const NAVI_TYPE_ID = 3
const CANCEL_IMMEDIATELY_TYPE = 2
const COOLING_OFF_TYPE = 3

const MAIL_UNSUB_TEMPLATE_MAP = {
  1: [22, 24],
  2: [22, 24],
  3: [21, 23],
}

const HOOKS = {
  1: process.env.UNSUBSCRIBE_SLACK_WEBHOOK,
  2: process.env.UNSUBSCRIBE_SLACK_WEBHOOK,
  3: process.env.COOLING_OF_SLACK_WEBHOOK,
}

const FALLBACKS = {
  1: 'お客様が継続を停止しました。',
  2: 'お客様が継続を停止しました。',
  3: 'お客様がクーリングオフをしました。',
}

/**
 * Get subscribing products
 *
 * @param userId
 * @param typeIds
 * @return {Promise<*>}
 */
async function subscribe(userId, typeIds = []) {
  const sales = await commonSale.getSales(
    typeIds,
    userId,
    true,
    false,
    {
      id: true,
      productId: true,
      developerUserId: true,
      serviceStartAt: true,
      serviceEndAt: true,
      isFinished: true,
    },
  )

  if (!sales.length) {
    return []
  }

  // Get product, seller, setting information from sale data
  const productIds = arrayUtils.column(sales, 'productId', true)
  const sellerIds = arrayUtils.column(sales, 'developerUserId', true)
  const salesIds = arrayUtils.column(sales, 'id', true)

  let [sellers, products, settings] = await Promise.all([
    userModel.find({
      where: {
        id: {inq: sellerIds},
      },
      fields: {id: true, nickName: true},
    }),
    productModel.find({
      where: {
        id: {inq: productIds},
      },
      fields: {id: true, name: true, isSubscription: true, typeId: true},
    }),
    _getSalonSettings(salesIds, userId), // Setting for salons
  ])

  sellers = arrayUtils.index(sellers, 'id')
  products = arrayUtils.index(products, 'id')

  return sales.reduce((res, sale) => {
    const seller = sellers[sale['developerUserId']]
    const product = products[sale['productId']] || {}
    const setting = settings[sale['id']] || {}

    // If is finished == 1, this salon was unsubscribed
    if (sale.isFinished || !product.isSubscription) {
      return res
    }

    res.push(_subscribeObject(product, sale, seller, setting))
    return res
  }, [])
}

/**
 * Unsubscribe a product
 *
 * @param input
 * @param userId
 * @param typeIds
 * @return {Promise<void>}
 */
async function unsubscribe(input, userId, typeIds = []) {
  const saleId = input.code ? cryptoUtils.simpleDecode(input.code).substr(8) : 0
  const sale = await commonSale.getSaleById(
    saleId,
    typeIds,
    0,
    true,
    false,
    {
      id: true,
      typeId: true,
      productId: true,
      developerUserId: true,
      serviceStartAt: true,
      serviceEndAt: true,
      isFinished: true,
    },
  )
  const cancelType = input.type

  if (
    !sale
    || sale.isFinished
    || !cancelType
    || (cancelType == COOLING_OFF_TYPE && sale.typeId == NAVI_TYPE_ID) // Not allow cooling off from navi
  ) {
    return
  }

  // If input include unsubscribe reason, save it into memo
  if (input.reason) {
    saleMemoModel.create({
      salesId: saleId,
      isValid: 1,
      memo: input.reason,
    })
  }

  sale.isFinished = 1

  // Stop immediately
  if (cancelType == COOLING_OFF_TYPE || cancelType == CANCEL_IMMEDIATELY_TYPE) {
    sale.serviceEndAt = Date.now()
    // Update (soft delete) mailmagazine_subscribers records (if have)
    sale.typeId == SALON_TYPE_ID && await _softDeleteMailSub(saleId, userId)
  }

  // Cooling off
  if (cancelType == COOLING_OFF_TYPE) {
    _coolingOff(sale)
    await _coolingOffTwoTier(saleId)
  }

  await sale.save()
  syncService.syncDataToFxon('sales', sale.id)

  // Get email info of current user & seller
  _sendEmailNotify(sale, cancelType, userId)
  _sendSlackNotify(input, sale, cancelType, userId)
}

/**
 * Delete of all `mailmagazine_subscribers`
 * Based on given sale id & user id
 *
 * @param salesId
 * @param userId
 * @return {Promise<object>}
 * @private
 */
async function _softDeleteMailSub(salesId, userId) {
  const data = await mailmagazineSubscribersModel.find({
    where: {
      salesId,
      userId,
    },
    fields: {
      id: true,
    },
  })
  const ids = arrayUtils.column(data, 'id')

  if (!ids.length) { return }

  await mailmagazineSubscribersModel.updateAll({
    id: { inq: ids },
  }, {
    isValid: 0,
  })

  // Memo: we use api v1 to sync data too
  // data.forEach(record => {
  //   syncService.syncDataToFxon('mailmagazine_subscribers', record.id, {
  //     is_valid: 0
  //   })
  // })
  // return await mailmagazineSubscribersModel.updateAll({
  //   salesId: saleId,
  //   userId: userId,
  // }, {isValid: 0})
}

/**
 *
 * @param product
 * @param sale
 * @param seller
 * @param opt
 * @return {Object}
 * @private
 */
function _subscribeObject(product, sale, seller, opt = {}) {
  const isCoolingOff = +((product.typeId === 4) && (sale.serviceStartAt + 10 * 24 * 60 * 60 > Date.now() / 1000))
  return objectUtils.filter({
    id: opt.id,
    saleId: sale.id,
    sellerName: seller.nickName,
    isCoolingOff,
    title: product.name,
    mailSetting: opt.mailSetting,
    threadSetting: opt.threadSetting,
    startDate: sale.serviceStartAt,
    endDate: sale.serviceEndAt,
    withdrawalCode: cryptoUtils.simpleEncode('41yudnat' + sale.id),
  })
}

/**
 * Get cooling off data for given sale record
 * Note: work based on reference
 *
 * @param data
 * @param cancelType
 * @return {object}
 * @private
 */
function _coolingOff(data, cancelType) {
  data.isCoolingOff = 1
  data.isCancel = 1
  data.cancelType = cancelType
  data.cancelAt = Date.now()
  data.feePrice = 0
  data.developerPrice = 0
  data.affiliatePrice = 0
  data.twotierPrice = 0
  data.ggjSpPrice = 0
  data.ggjSpFeePrice = 0
  data.affiliateSpPrice = 0
  data.affiliateSpFeePrice = 0

  return data
}

/**
 * Cooling off data of all `special_fee_price_statement`
 * Based on given sale id
 *
 * @param saleId
 * @return {Promise<object>}
 * @private
 */
async function _coolingOffTwoTier(saleId) {
  return await specialFeePriceStatementModel.updateAll({
    salesId: saleId,
  }, {price: 0})
}

/**
 * Send notify about cooling off/unsubscribe user to email
 * For both user & seller
 *
 * @param sale
 * @param cancelType
 * @param userId
 * @return {Promise<void>}
 * @private
 */
async function _sendEmailNotify(sale, cancelType, userId) {
  const userTemplateId = MAIL_UNSUB_TEMPLATE_MAP[cancelType][0]
  const devTemplateId = MAIL_UNSUB_TEMPLATE_MAP[cancelType][1]

  let name = await productModel.findOne({
    where: {
      isValid: {inq: [0, 1]},
      id: sale.productId,
    },
    fields: {name: true},
  })

  name = name || {name: ''}

  commonEmailV1.sendNowByUserId(userId, {product_name: name.name}, userTemplateId)
  commonEmailV1.sendNowByUserId(
    sale.developerUserId,
    {
      product_name: name.name,
      user_id: userId,
    },
    devTemplateId,
  )
}

/**
 * Send notify about cooling off/unsubscribe user to slack
 *
 * @param input
 * @param sale
 * @param cancelType
 * @param userId
 * @return {Promise<*>}
 * @private
 */
async function _sendSlackNotify(input, sale, cancelType, userId) {
  const hook = HOOKS[cancelType] || ''
  const fallback = FALLBACKS[cancelType] || ''
  const messages =
    `*${fallback}* \n
    - *user_id*: ${userId} \n
    - *sales_id*: ${sale['id']} \n
    - *product_id*: ${sale['productId']} \n
    - *reason*: ${(input['reason'] || '')} \n
    - *service_end_at*: ${timeUtils.sqlDate(sale['serviceEndAt'] * 1000)}`

  return await slackUtils.send(messages, null, hook)
}

/**
 * Get all subscribed salons of current user
 *
 * @param saleIds
 * @param userId
 * @return {Promise<object>}
 * @private
 */
async function _getSalonSettings(saleIds, userId) {
  const mailSubs = await mailmagazineSubscribersModel.find({
    where: {
      salesId: {inq: saleIds},
      userId,
    },
    order: 'id DESC',
    fields: {
      id: true,
      salonId: true,
      salesId: true,
      isMailMain: true,
      isMailSub: true,
      isMailThreadDeveloper: true,
      isMailThreadSubscriber: true,
    },
  })

  return mailSubs.reduce((res, mailSub) => {
    res[mailSub['salesId']] = {
      id: mailSub.id,
      mailSetting:
        1 + 2 * (mailSub.isMailSub || 0) + (mailSub.isMailMain || 0),
      threadSetting:
        1 + 2 * (mailSub.isMailThreadSubscriber || 0)
        + (mailSub.isMailThreadDeveloper || 0),
    }
    return res
  }, {})
}

module.exports = {
  subscribe,
  unsubscribe,
}
