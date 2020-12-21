const app = require('@server/server')
const helper = require('@services/surface/tool/helper')
const sfProduct = require('@services/common/surfaceProduct')

// models
const masterToolSearchModel = app.models.MasterToolSearch
const searchKeywordsModel = app.models.SearchKeywords

/**
 * Default fields name of recommend product
 * @var {string}
 */
const FIELDS = 'typeId,categories,keywords,productId,productName,price,'
  + 'isSpecialDiscount,specialDiscountPrice,salesCount,reviewsStars,reviewsCount,forwardAt'

const sortType = [
  'priority ASC',
  'salesCount DESC',
  'forwardAt ASC',
  'price DESC, id DESC',
  'price ASC, id DESC',
]

/**
 * Get new products for index page
 *
 * @returns {Promise<Object>}
 */
async function index() {
  const data = await helper.data(masterToolSearchModel, FIELDS, {
    where: {
      type_id: helper.typeIds(),
    },
    limit: 0,
    order: 'productId DESC',
  })

  return await sfProduct.sfProductObjects(data)
}

/**
 * Get keywords for /tools
 * @param {Object} input
 * @return {Promise<Array>}
 */
async function keywords(input) {
  return await searchKeywordsModel.find({
    where: {
      isValid: 1,
    },
    fields: {
      name: true,
      url: true,
    },
    limit: input.limit || 20,
    order: sortType[input.sortType || 0],
  })
}

module.exports = {
  index,
  keywords,
}
