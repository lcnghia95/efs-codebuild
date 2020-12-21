const app = require('@server/server')
const _isEmpty = require('lodash').isEmpty
const helper = require('./helper')
const historyService = require('./history')
const productPriceModel = app.models.ProductPrices
const syncService = require('@services/common/synchronize')

const THIRTY_DAYS = 2592000

/**
 * Check if product price can be edited or not
 *
 * @param {number} priceId
 * @param {number} productId
 * @param {number} userId
 * @returns {Promise<Object>}
 * @public
 */
async function isEditable(productId, userId) {
  const product = await helper.product(productId, userId,
      'typeId,productPriceId,isSubscription,statusType,isSaleStop')
    const typeId = parseInt(product.typeId)

  // Only change price of indicator, ebook or article
  if ([2, 3, 6, 70].indexOf(typeId) < 0) {
    return {
      editable: 0,
    }
  }

  // Cannot change price of series
  if (typeId == 3 && product.isSubscription == 1) {
    return {
      editable: 0,
    }
  }

  const price = await priceById(product.productPriceId)
    const duration = await historyService.publicDuration(productId)
  // Cannot update price within 30 days (public duration only)
  if (duration > 0 && duration < THIRTY_DAYS) {
    return {
      editable: 0,
    }
  }

  // In case of no duration information, check status
  //  and allow update price when product not on sale
  const statusType = helper.statusType(product)
  if (duration == 0) {
    if (statusType == 0 || statusType == 2) {
      return {
        editable: 1,
      }
    }
  }

  // When there's no history record check price createdDate
  if (duration == 0 && price.createdAt) {
    if (parseInt(parseInt(Date.now() / 1000) - price.createdAt) < THIRTY_DAYS) {
      return {
        editable: 0,
      }
    }
  }

  return {
    editable: 1,
  }
}

/**
 * Get price by id
 *
 * @param {number} priceId
 * @returns {Promise<Object>}
 * @public
 */
async function priceById(priceId) {
  if(priceId == 0) {
    return 0
  }
  return await productPriceModel.findOne({
    where: {
      id: priceId,
      isValid: 1,
      statusType: 1,
    },
    fields: {
      chargeType: true,
      price: true,
      specialDiscountPrice: true,
      createdAt: true,
    },
    order: 'id DESC',
  }) || {}
}

/**
 * Get product price by id
 * 
 * @param {number} userId 
 * @param {number} priceId 
 * @param {object} fields 
 */
async function getPriceById(userId, priceId, fields ) { 
  if(priceById == 0) { 
    return {}
  }
  return (await productPriceModel.findOne({
    where: { 
      userId,
      isValid: 1,
      id: priceId,
    },
    fields: app.utils.query.fields(fields),
  })) || {}
}

/**
 * Get product price by productId
 * @param {number} productId 
 */
async function getPriceByProductId (productId) { 
  if(productId == 0 ) {
    return { }
  }
  return await productPriceModel.findOne({
    where: {
      productId,
      isValid: 1,
    },
    fields: {
      id: true, 
      price :true, 
      specialDiscountPrice: true,
    },
  })
}

/**
 * Get list product price by list product id
 * @param {array} productIds 
 */
async function getListPriceByProductId(productIds){
  return await productPriceModel.find({
    where: {
      productId: { inq: productIds },
      isValid: 1,
    },
    fields: { 
      price: true,
      productId: true,
    },
  })
}

/**
 * create product price
 * @param {object} data 
 */
async function createProductPrice(data = {}){ 
  if(_isEmpty(data)){
    return {}
  }
  data.isValid = 1
  return await productPriceModel.create(data)
}

/**
 * Update product price
 * @param {number} userId 
 * @param {number} id 
 * @param {object} data 
 */
async function updateProductPrice(userId, id, data = {}){
  if(_isEmpty(data) || !id){
    return {}
  }
  const resultUpdate = await productPriceModel.updateAll({ id }, data)
  if(!resultUpdate.count){
    return {}
  }
  syncService.syncDataToFxon('product_prices',id)
  return await getPriceById(userId,id,'price,specialDiscountPrice')
}

/**
 * Delete product price
 * @param {number} userId 
 * @param {number} id 
 */
async function deleteProductPrice(userId, id){ 
  const resultDelete = await productPriceModel.updateAll({ id, userId }, { isValid : 0})
  if(!resultDelete.count){
    return false
  }
  syncService.syncDataToFxon('product_prices',id, {is_valid: 0})
  return true
}


module.exports = {
  priceById,
  isEditable,
  getPriceById,
  createProductPrice,
  updateProductPrice,
  deleteProductPrice,
  getPriceByProductId,
  getListPriceByProductId,
}
