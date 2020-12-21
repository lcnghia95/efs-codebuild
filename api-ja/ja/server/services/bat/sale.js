const app = require('@server/server')
const commonSale = require('@services/common/sale')
const commonUser = require('@services/common/user')
const commonSfProduct = require('@services/common/surfaceProduct')
const commonSynchronize = require('@services/common/synchronize')

// models
const saleModel = app.models.Sales
const productModel = app.models.Products

// utils
const timeUtil = app.utils.time
const objectUtil = app.utils.object

/**
 * recharge sale
 *
 * @param {Object} input
 * @return {Object}
 * @public
 */
async function recharge(input) {
  const id = isNaN(input.id) ? 0 : parseInt(input.id || 0)
  if (id == 0) {
    return {
      msg: 'empty sale id',
    }
  }

  let sale = await _sale(id)
  if (!sale) {
    return {
      msg: 'empty sale',
    }
  }

  const [product, user] = await Promise.all([
    _product(sale.productId),
    _user(sale.userId),
  ])

  if (!product) {
    return {
      msg: 'empty product',
    }
  }

  if (!user) {
    return {
      msg: 'empty user',
    }
  }

  delete sale.id
  delete sale.createdAt
  delete sale.updatedAt

  sale = Object.assign(sale, {
    payAt: Date.now(),
    serviceStartAt: sale.serviceEndAt * 1000, // create data time need to * 1000
    serviceEndAt: timeUtil.addMonths(1, sale.serviceEndAt * 1000, true) * 1000, // create data time need to * 1000
    parentSalesId: id,
  })

  const newSale = await saleModel.create(objectUtil.filter(sale))

  if (newSale.id) {
    commonSynchronize.syncDataToFxon('sales', newSale.id)
  }

  return newSale || {
    msg: 'create sales error',
  }
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
  conditions.where.isSubscription = 1
  conditions.fields = {
    id: true,
  }
  return await productModel.findOne(conditions)
}

/**
 * get user
 *
 * @param {Number} userId
 * @return {Object}
 * @private
 */
async function _user(userId) {
  return await commonUser.getUser(userId, {
    id: true,
  })
}

/**
 * get sale
 *
 * @param {Number} id
 * @return {Object}
 * @private
 */
async function _sale(id) {
  const sales = await saleModel.find(_saleConditions(id))
    const sale = sales.find(item => {
      return item.id == id
    })

  if (sales.length == 1 && sale) {
    return sale.toJSON()
  }
  return null
}

/**
 * get sale conditions
 *
 * @param {Number} id
 * @return {Object}
 * @public
 */
function _saleConditions(id) {
  const conditions = commonSale.saleConditions(0, false, false)

  conditions.where = Object.assign(conditions.where, {
    chargeType: 2,
    isFinished: 0,
    payId: {
      inq: [2, 3],
    },
    userId: {
      gt: 0,
    },
    productId: {
      gt: 0,
    },
    or: [{
      id: id,
    },
    {
      parentSalesId: id,
    },
    ],
  })

  return conditions
}

module.exports = {
  recharge,
}
