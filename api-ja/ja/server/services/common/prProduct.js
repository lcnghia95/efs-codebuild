const app = require('@server/server')
const {
  sfProductObjects,
} = require('@services/common/surfaceProduct')
const {
  addSrc,
} = require('@@services/common/prProduct')

// models
const commonPrProductModel = app.models.CommonPrProducts

/**
 * Get pr products index
 *
 * @return {Object}
 */
async function index() {
  const data = await sfProductObjects(
    await _data(),
  )

  return addSrc(data)
}

/**
 * get pr products data
 *
 * @return {Array}
 */
async function _data() {
  return await commonPrProductModel.find({
    where: {
      isValid: 1,
    },
    fields: {
      typeId: true,
      categories: true,
      productId: true,
      productName: true,
      catchCopy: true,
      price: true,
      isSpecialDiscount: true,
      specialDiscountPrice: true,
    },
  })
}

module.exports = {
  index,
}
