const app = require('@server/server')
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = require('@ggj/utils/utils/object')

const {
  syncDataToFxon,
  newSyncDataToFxon,
} = require('./synchronize')
const _fullProductIds = require('@@services/common/tieup').fullProductIds
const saleModel = app.models.Sales
const DEFAULT_FIELDS = {
  id: true,
  productId: true,
  serviceStartAt: true,
  serviceEndAt: true,
  isFinished: true,
}

const axios = require('axios')

async function getSales(
  typeIds = [],
  userId = 0,
  isCheckPeriod = true,
  includeCancel = false,
  fields = null,
) {
  const conditions = saleConditions(userId, isCheckPeriod, includeCancel)

  if (typeIds.length) {
    conditions.where.typeId = {
      inq: typeIds,
    }
  }

  return await saleModel.find(Object.assign({
    fields: fields || DEFAULT_FIELDS,
  }, conditions))
}

async function getSaleById(
  id,
  typeIds = [4],
  userId = 0,
  isCheckPeriod = true,
  includeCancel = false,
  fields = null,
) {
  const conditions = saleConditions(userId, isCheckPeriod, includeCancel)
  if (typeIds.length) {
    conditions.where.typeId = {
      inq: typeIds,
    }
  }
  conditions.where.id = id

  return await saleModel.findOne(Object.assign({
    fields: fields || DEFAULT_FIELDS,
  }, conditions))
}

/**
 * Get sales conditions for get purchased info
 * Return query object (where + order)
 *
 * @param {Array} productIds
 * @param {Number} userId
 * @param {Boolean} isCheckPeriod
 * @param {Boolean} includeCancel
 * @param {Object|null} fields
 * @returns {Array}
 */
async function getSaleByProductIds(
  productIds,
  userId = 0,
  isCheckPeriod = true,
  includeCancel = false,
  fields = null,
) {
  const conditions = saleConditions(userId, isCheckPeriod, includeCancel)
  if (productIds.length) {
    conditions.where.productId = {
      inq: productIds,
    }
  }
  return await saleModel.find(Object.assign({
    fields: fields || DEFAULT_FIELDS,
  }, conditions))
}

/**
 * Get sales conditions for get purchased info
 * Return query object (where + order)
 *
 * @param userId
 * @param includeCancel
 * @returns {Object}
 */
function saleConditions(userId = 0, isCheckPeriod = true, includeCancel =
false) {
  const condition = objectUtil.deepNullFilter({
    where: {
      isValid: 1,
      userId: userId > 0 ? userId : null,
      userType: 1,
      statusType: 1,
      salesType: 1,
      isCancel: includeCancel ? null : 0,
      cancelType: includeCancel ? null : 0,
      offsetId: 0,
      isRepayment: 0,
    },
    order: 'payAt DESC',
  })

  if (isCheckPeriod) {
    const now = Date.now()
    condition.where.serviceStartAt = {
      lte: now,
    }
    condition.where.serviceEndAt = {
      gt: now,
    }
  }
  return condition
}

/**
 * Check if user buy product or not
 *
 * @param {number} userId
 * @param {Boolean} isCheckPeriod
 * @param {Boolean} includeCancel
 * @returns {Promise<boolean>}
 * @public
 * @param productIds
 * @param tieupFn function for process tieup product
 */
async function isPurchased(
  userId,
  productIds,
  isCheckPeriod = true,
  includeCancel = false,
  tieupFn = _fullProductIds,
) {
  if (!userId || !productIds || (Array.isArray(productIds) && !productIds.length)) {
    return false
  }

  const condition = saleConditions(userId, isCheckPeriod, includeCancel).where
  const productIdsArray = Array.isArray(productIds) ?
    productIds.map(productId => parseInt(productId)) :
    [parseInt(productIds)]

  if (productIdsArray.length > 0) {
    condition.productId = {
      inq: tieupFn(productIdsArray),
    }
  }

  const sale = await saleModel.findOne({
    where: condition,
    fields: {
      id: true,
    },
  }) || {}
  return ((sale.id || 0) > 0)
}

/**
 * Sync sale record to fx-on
 *
 * @param {Array|Object} sales
 * @param {Object|null} data
 * @returns {void}
 * @public
 */
// function syncSaleRecordToFxon(sales) {
//   if (Array.isArray(sales)) {
//     sales.forEach(sale => {syncDataToFxon('sales', sale.id, {is_valid: 1})})
//   } else {
//     syncDataToFxon('sales', sales.id, {is_valid: 1})
//   }
// }

function syncSaleRecordToFxon(sales, data, isNewService = true) {
  // Using new sync service to sync data from sales to _info_shipping
  if(isNewService) {
    const saleIds = arrayUtil.column(sales, 'id', true)
    return newSyncDataToFxon('sales', saleIds)
  } else { // TODO - Long : Remove this case when new sync service stable operation
    sales.forEach(sale => {
      syncDataToFxon('sales', sale.id, data || {
        is_valid: 1,
      })
    })
  }
}

/**
 * Update sales data using new service
 * Format data: [
 *  {
 *    ids: [8, 9, 10],
 *    data: {"is_valid": 1, "status_type": 1 ...}
 *  } 
 *  ...
 * ]
 *
 * @param {object} data
 * @returns {Promise<object>}
 * @public
 */
function updateSalesViaNewService(data) {
  const newSalesServiceHostUrl = process.env.SALES_SERVICE_HOST_URL
  if(!newSalesServiceHostUrl) {
    console.log('Please add config SALES_SERVICE_HOST_URL in gogo.api.ja')
    return
  }
  const url = newSalesServiceHostUrl + '/api/v1/sales'
  return axios({
    method: 'put',
    url,
    data,
  })
}

module.exports = {
  getSales,
  getSaleById,
  saleConditions,
  isPurchased,
  getSaleByProductIds,
  syncSaleRecordToFxon,
  updateSalesViaNewService,
}
