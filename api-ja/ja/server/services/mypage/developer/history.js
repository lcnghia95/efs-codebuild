const app = require('@server/server')
const helper = require('./helper')
const ProductHistoryModel = app.models.ProductHistory

/**
 * Get latest product_history record of specific product
 *
 * @param {number} productId
 * @returns {Promise<Object>}
 * @private
 */
async function _lastestHistoryRecord(productId) {
  return await ProductHistoryModel.findOne({
    where: {
      isValid: 1,
      productId,
    },
    order: 'id DESC',
    fields: {
      statusType: true,
      chargeType: true,
      price: true,
      specialDiscountPrice: true,
    },
  }) || {}
}

/**
 * Get log status & price of product to product_history record
 *
 * @param {number} productId
 * @param {number} statusType
 * @param {number} chargeType
 * @param {number} price
 * @param {number} specialDiscountPrice
 * @returns {void}
 * @private
 */
async function logStatusAndPrice(
  productId,
  statusType,
  chargeType,
  price,
  specialDiscountPrice = 0,
) {
  const log = await _lastestHistoryRecord(productId)
  if (
    log.statusType != statusType ||
    log.chargeType != chargeType ||
    log.price != price ||
    log.specialDiscountPrice != specialDiscountPrice
  ) {
    await ProductHistoryModel.create({
      isValid: 1,
      productId,
      statusType,
      chargeType,
      price,
      specialDiscountPrice,
    })
  }
}

/**
 * Check duration of public period of product after change price
 *
 * @param {number} productId
 * @returns {Promise<number>}
 * @public
 */
async function publicDuration(productId) {
  const record = await ProductHistoryModel.findOne({
    where: {
      isValid: 1,
      productId,
      statusType: 1,
    },
    order: 'id ASC',
    fields: {
      id: true,
    },
  })
  if (!record) {
    return 0
  }

  const records = await ProductHistoryModel.find({
      where: {
        id: {
          gte: record.id,
        },
        isValid: 1,
        productId,
      },
      order: 'id DESC',
      fields: {
        id: true,
        statusType: true,
        chargeType: true,
        price: true,
        specialDiscountPrice: true,
        createdAt: true,
      },
    })
  let total = 0
  const length = records.length
  const latestRecord = records[0] || {}

  if (latestRecord.statusType == 1) {
    total += parseInt(parseInt(Date.now() / 1000) - latestRecord.createdAt)
  }

  return total + records.reduce((total, record, idx) => {
    const nextRecord = idx < length - 1 ? records[idx + 1] : {}
    if (nextRecord.statusType == 1) {
      total += record.createdAt - nextRecord.createdAt
    }
    return total
  }, 0)
}

/**
 * Check & log change of statusType & price of product
 *
 * @param {number} productId
 * @returns {Promise<Object>}
 * @private
 */
async function log(productId, userId) {
  if (userId == 0) {
    return
  }
  const fields = 'productPriceId,statusType,isSaleStop'
    const product = await helper.product(productId, userId, fields)
    const statusType = helper.statusType(product)
    const price = await app.models.ProductPrices.findOne({
      where: {
        id: product.productPriceId,
        isValid: 1,
      },
      fields: {
        chargeType: true,
        price: true,
        specialDiscountPrice: true,
      },
    }) || {}
  await logStatusAndPrice(
    productId,
    statusType,
    price.chargeType || 0,
    price.price || 0,
    price.specialDiscountPrice || 0,
  )
}

module.exports = {
  log,
  logStatusAndPrice,
  publicDuration,
}
