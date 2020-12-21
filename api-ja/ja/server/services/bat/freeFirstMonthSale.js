const app = require('@server/server')
const commonSfProduct = require('@services/common/surfaceProduct')
const commonSynchronize = require('@services/common/synchronize')

// models
const saleModel = app.models.Sales
const productModel = app.models.Products

// utils
const timeUtil = app.utils.time

/**
 * update freeFirstMonth Sale
 *
 * @param {Object} input
 * @return {Object}
 * @public
 */
async function update(input) {
  const id = isNaN(input.id) ? 0 : parseInt(input.id || 0)
  if (id == 0) {
    return {
      msg: 'empty sale id',
    }
  }

  const sale = await _sale(id)
  if (!sale) {
    return {
      msg: `sale: ${id} is not exist`,
    }
  }

  const [product, sales] = await Promise.all([
    _product(sale.productId),
    _sales(sale.productId, sale.userId),
  ])
  if (!product) {
    return {
      msg: `product: ${sale.productId} of sale: ${id} is not exist`,
    }
  }
  if (_checkSale(sales)) {
    return {
      msg: `sale: ${sale.id} has been changed before`,
    }
  }

  _updateAndSync(sale)
  return {
    id: sale.id,
    msg: `sale: ${sale.id} has just been changed`,
  }
}

/**
 * update sale.serviceEndAt and sync
 *
 * @param {Object} sale
 * @return {Object}
 * @private
 */
async function _updateAndSync(sale) {
  const months = sale.payId == 5 ? 4 : 2
  sale.serviceEndAt = timeUtil.addMonths(months, sale.serviceStartAt * 1000)

  await sale.save()
  commonSynchronize.syncDataToFxon('sales', sale.id)
}

/**
 * checkSale sales has updated
 *
 * @param {Array} sales
 * @return {Object}
 * @private
 */
function _checkSale(sales) {
  return sales.reduce((check, sale) => {
    const period = parseInt((sale.serviceEndAt - sale.serviceStartAt) / 86400)

    // max date of 3 months = 92
    if (sales.payId == 5 && period > 92) {
      check = true
    }

    // max date of 1 month = 31
    if (sales.payId != 5 && period > 31) {
      check = true
    }
    return check
  }, false)
}

/**
 * get sale
 *
 * @param {Number} productId
 * @param {Number} userId
 * @return {Object}
 * @private
 */
async function _sales(productId, userId) {
  return await saleModel.find(_saleConditions(undefined, productId, userId))
}

/**
 * get product
 *
 * @param {Number} pId
 * @return {Object}
 * @private
 */
async function _product(pId) {
  const conditions = commonSfProduct.onSaleConditions()
  conditions.where.id = pId
  conditions.where.isFreeFirstMonth = 1
  conditions.fields = {
    id: true,
  }
  return await productModel.findOne(conditions)
}

/**
 * get sale
 *
 * @param {Number} id
 * @return {Object}
 * @private
 */
async function _sale(id) {
  return await saleModel.findOne(_saleConditions(id))
}

/**
 * get sale conditions
 *
 * @param {Number} id
 * @return {Object}
 * @public
 */
function _saleConditions(id, productId, userId) {
  return {
    where: {
      id,
      isValid: 1,
      statusType: 1,
      productId: productId || {
        gt: 0,
      },
      userId: userId || {
        gt: 0,
      },
      isCancel: 0,
      offsetId: 0,
      isRepayment: 0,
      parentSalesId: 0,
    },
    fields: {
      id: true,
      productId: true,
      userId: true,
      payId: true,
      serviceStartAt: true,
      serviceEndAt: true,
    },
  }
}

module.exports = {
  update,
}
