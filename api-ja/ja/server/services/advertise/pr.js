const app = require('@server/server')
const surfaceProductService = require('@services/common/surfaceProduct')
const {
  addSrc,
} = require('@@services/common/prProduct')
const LIMIT = 5
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get random list of pr products
 *
 * @params {Number} lang
 * @returns {Array}
 */
async function index(lang) {
  let data = await app.models.CommonPrProducts.find({
      where: {
        isValid: 1,
        languages: lang,
      },
      fields: {
        typeId: true,
        productId: true,
        productName: true,
        languages: true,
        catchCopy: true,
        price: true,
        isSpecialDiscount: true,
        specialDiscountPrice: true,
      },
    }),
    records = arrayUtil.shuffle(data, LIMIT),
    products = await surfaceProductService.sfProductObjects(records)

  products = addSrc(products)
  return products
}

module.exports = {
  index,
}
