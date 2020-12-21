const app = require('@server/server')
const productModel = app.models.Products
const seriesModel = app.models.Series
const categoriesModel = app.models.Categories
const lodash = require('lodash')
const _isEmpty = lodash.isEmpty


/**
 * Mode type for article 
 * 
 * bit 1 : isPaidContent
 * bit 2 : productId
 * bit 3 : seriesId
 */
const MODETYPE = { 
  '110': 'mode1', // retail
  '000': 'mode2', // free none series
  '101': 'mode3', // sales by series
  '111': 'mode4', // by series and retail
  '001': 'mode5', // 
}

/**
 * Get product of specific developer
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} fields
 * @returns {Promise<Object>}
 * @public
 */
async function product(productId, userId, fields) {
  return await productModel.findOne({
    where: {
      id: productId,
      userId,
      isValid: 1,
    },
    fields: app.utils.query.fields(fields),
  }) || {}
}

function price(product, priceObjects) {
  const priceObject = (priceObjects[product.id] || []).find(price => price.id == product.productPriceId) || {}
  return priceObject.price || 0
}

/**
 * Calcuate statusType of product
 *
 * @param {Object} product
 * @returns {number}
 * @public
 */
function statusType(product) {
  if (product.statusType == 0) {
    return 0
  }
  if (product.statusType == 2) {
    return 2
  }
  if (product.statusType == 1) {
    if (product.isSaleStop == 0) {
      return 1
    }
    return 2
  }
  return 0
}

/**
 * get list id categories
 *
 * @returns {Array}
 * @public
 */
async function getListIdNaviCategories(){ 
   const listId = await categoriesModel.find({ where : {}, fields: { id: true}})
   return listId.map(item => item.id)
}

/**
 * check user available with series
 * @param {number} userId
 * @param {number} seriesId
 * @returns {Array}
 * @public
 */
async function checkUserSeries(userId, seriesId){ 
  const series = await seriesModel.findOne({ where: { id: seriesId }}) || false
  if(!series || _isEmpty(series)){
    return false
  } 

  const product = productModel.findOne({where: { userId, id: series.productId}})
  if(!product || _isEmpty(product)){
    return false
  }
  return true 
}

/**
 * Get Mode for form create article
 * 
 * 
 * @param {number} isPaidContent 
 * @param {number} productId 
 * @param {number} seriesId 
 */
function getModeSaleBy(isPaidContent = 0, productId = 0, seriesId = 0){
  const modeKey = `${isPaidContent}${+(productId != 0)}${+(seriesId != 0)}`
  return MODETYPE[modeKey]
}

function getKeyByMode(mode) { 
  return Object.keys(MODETYPE).find(key => MODETYPE[key] === mode)
}
module.exports = {
  MODETYPE,
  checkUserSeries,
  product,
  price,
  statusType,
  getListIdNaviCategories,
  getModeSaleBy,
  getKeyByMode,
}
