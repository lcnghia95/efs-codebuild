const app = require('@server/server')
const helper = require('@services/surface/tool/helper')
const sfProduct = require('@services/common/surfaceProduct')
const commonRecentModel = app.models.CommonRecentProducts
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Default fields name of popular product
 * @var {string}
 */
const FIELDS = 'typeId,categories,productId,productName,price'
  + ',isSpecialDiscount,specialDiscountPrice,reviewsStars,reviewsCount,catchCopy,userId,nickName'

/**
 * Get new products for index page
 *
 * @param input
 * @returns {Promise<Object>}
 */
async function index(input = {}) {
  const res = await response(await helper.data(commonRecentModel, FIELDS, {
    where: {
      typeId: {inq: helper.typeIds()},
    },
    limit: 0,
  }))

  return input.limit == 0
    ? res
    : helper.slice(app.utils.object.filter(res), input.limit)
}

/**
 * Get response data base on given data
 *
 * @param data
 * @returns {Promise<Object>}
 */
async function response(data) {
  const sfProductData = arrayUtil.index(
    await sfProduct.sfProductObjects(data),
    'id',
  )

  data = data.reduce((obj, record) => {
    const idx = _idx(record)
    if (idx.length) {
      idx.map(id => {
        if (!obj[id]) {
          obj[id] = []
        }
        sfProductData[record['productId']]
        && obj[id].push(sfProductData[record['productId']])
      })
    }
    return obj
  }, {})

  return data
}

/**
 * Get array id of given record
 *
 * @param record
 * @returns {Array}
 * @private
 */
function _idx(record) {
  const map = {1: 2, 3: 1}
  const categories = record.categories.split(',')

  return categories.reduce((idx, cat) => {
    const id = map[parseInt(cat)] || 3
    if (!idx.includes(id)) {
      idx.push(id)
    }
    return idx
  }, [])
}

module.exports = {
  index,
}
