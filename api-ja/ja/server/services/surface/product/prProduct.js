const app = require('@server/server')
const surfaceProductService = require('@services/common/surfaceProduct')
const DEFAULT_LIMIT = 5
const {
  addSrc,
} = require('@@services/common/prProduct')

const arrayUtil = require('@ggj/utils/utils/array')

// models
const commonPrProductModel = app.models.CommonPrProducts

/**
 * Get random list of pr products
 *
 * @returns {Array}
 */
async function index(limit) {
  limit = limit || DEFAULT_LIMIT
  const data = await _data()
  const records = arrayUtil.shuffle(data, limit)
  const products = await surfaceProductService.sfProductObjects(records)

  return addSrc(products)
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
