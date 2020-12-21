const app = require('@server/server')
const syncService = require('@services/common/synchronize')

const productOutlineModel = app.models.ProductOutlines

/**
 * create product outline
 * @param {object} meta 
 * @param {number} productId 
 * @param {object} data 
 */
async function createProductOutline(meta, productId, data = {}){
  const { userId, userAgent, ipAddress } = meta
  if(!productId || !userId){
    return {}
  }
  const resultCreate = await productOutlineModel.create({
    userId,
    productId,
    outline: data.content,
    isValid: 1,
    userAgent,
    ipAddress,
    statusType: data.statusType,
  })
  syncService.syncDataToFxon('product_outlines', resultCreate.id)
  return resultCreate
}

/**
 * update product outline
 * @param {number} userId
 * @param {number} productId
 * @param {Object} data
 * @returns {Object}
 * @public
 */
async function updateProductOutline(userId, productId, data = {}) { 
  const product = await productOutlineModel.updateAll({userId, productId, isValid: 1}, data)
  if(!product.count){
    return {}
  }
  const outline = await getOutlines(productId)
  syncService.syncDataToFxon('product_outlines', outline.id)
  return outline

} 

/**
 * get product outline by productId
 * @param {number} productId
 * @returns {Object}
 * @public
 */
async function getOutlines(productId){
  const product = await productOutlineModel.findOne({
    where: {
      productId,
    },
  })
  return product || {}
}

/**
 * delete product outline by productId
 * @param {number} userId
 * @param {number} productId
 * @returns {Boolean}
 * @public
 */
async function deleteOutlineByProductId(userId, productId){
  const product = await productOutlineModel.updateAll({ userId, productId}, { isValid: 0})
  if(!product.count){
    return false
  }

  const outline = await getOutlines(productId)
  syncService.syncDataToFxon('product_outlines', outline.id, { is_valid: 0 })
  return true
}

module.exports = {
  getOutlines,
  updateProductOutline,
  createProductOutline,
  deleteOutlineByProductId,
}
