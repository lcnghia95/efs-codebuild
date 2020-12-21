const app = require('@server/server')
const productModel = app.models.Products
const sfProductDetailModel = app.models.SurfaceProductDetails
const systemtradeDetailModel = app.models.SurfaceSystemtradeDetails
const _urls = require('@services/common/productUrl').productDetailUrls
const _map = require('lodash').map
const NO_DISPLAY_GROUP = 0
const ON_SALES_GROUP = 1
const POST_SALES_GROUP = 2
const PRE_SALES_GROUP = 3

const { IGNORE_PRODUCTS_MAP, DISPLAYPRODUCT_TYPE_IDS } = require('@@server/common/data/hardcodedData')

/**
 * Get query condition to get data from `privacy.products`
 *
 * @param {Number} userId
 * @return {Object}
 * @private
 */
function _condition(userId) {
  const productIds = IGNORE_PRODUCTS_MAP[parseInt(userId)] || []

  return {
    where: {
      id: productIds.length == 0 ? undefined : { nin: productIds },
      isValid: 1,
      typeId: {inq: DISPLAYPRODUCT_TYPE_IDS},
      userId,
      statusType: {
        inq: [1, 2],
      },
    },
    fields: {
      id: true,
      typeId: true,
      statusType: true,
      isSaleStop: true,
      name: true,
    },
  }
}

/**
 * Get product data from `privacy.products`
 *
 * @param {Number} userId
 * @return {Array}
 * @private
 */
async function _products(userId) {
  return await productModel.find(_condition(userId))
}

/**
 * Check group of product
 *
 * @param {Object} product
 * @return {Number}
 * @private
 */
function _group(product) {
  const statusType = product.statusType
    const isSaleStop = product.isSaleStop

  if (statusType == 1 && isSaleStop == 0) {
    return ON_SALES_GROUP
  }

  if ([3, 4, 5, 19].includes(product.typeId)) {
    return NO_DISPLAY_GROUP
  }

  if (product.statusType == 2 && isSaleStop == 0) {
    return PRE_SALES_GROUP
  }

  return POST_SALES_GROUP
}

/**
 * Get profit information of products
 *
 * @param {Array} productIds
 * @return {Promise<Object>}
 * @private
 */
async function _profits(productIds) {
  const data = await systemtradeDetailModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    fields: {
      productId: true,
      profitTotal: true,
    },
  })
  return data.reduce((res, record) => {
    res[record.productId] = record.profitTotal
    return res
  }, {})
}

/**
 * Get detail information of products
 *
 * @param {Array} productIds
 * @return {Promise<Object>}
 * @private
 */
async function _details(productIds) {
  const data = await sfProductDetailModel.find({
    where: {
      isValid: 1,
      id: {
        inq: productIds,
      },
    },
    fields: {
      id: true,
      price: true,
      specialDiscountPrice: true,
      salesCount: true,
    },
  })
  return data.reduce((res, record) => {
    res[record.id] = record
    return res
  }, {})
}

/**
 * Check if user have viewable product or not
 *
 * @param {Number} userId
 * @return {Promise<Number>}
 * @public
 */
async function hasProduct(userId) {
  const product = await productModel.findOne(_condition(userId)) || {}
  return +(0 < (product.id || 0))
}

/**
 * Get list of viewable products of user
 *
 * @param {Number} userId
 * @return {Promise<Object>}
 * @public
 */
async function list(userId) {
  const products = await _products(userId)
    const ids = _map(products, 'id')
    const [urls, profits, details] = await Promise.all([
      _urls(products),
      _profits(ids),
      _details(ids),
    ])

  return products
    .map(product => {
      const id = product.id
        const detailObj = details[id] || {}
        const discountPrice = detailObj.specialDiscountPrice || 0
        const price = detailObj.price || 0
      return {
        id,
        group: _group(product),
        name: product.name,
        typeId: product.typeId || 0,
        profit: profits[id] || 0,
        price: {
          price: discountPrice > 0 ? discountPrice : price,
          oldPrice: discountPrice > 0 ? price : undefined,
        },
        detailUrl: urls[id],
        count: parseInt(detailObj.salesCount || 0),
      }
    })
    .sort((a, b) => {
      const _a = a.count || 0
        const _b = b.count || 0
      if (_a > _b) {
        return -1
      }
      if (_a < _b) {
        return 1
      }
      return 0
    })
    .reduce((res, product) => {
      if (product.group === ON_SALES_GROUP) {
        res.onSales.push(product)
      } else if (product.group === PRE_SALES_GROUP) {
        res.preSales.push(product)
      } else if (product.group === POST_SALES_GROUP) {
        res.postSales.push(product)
      }
      delete product.group
      delete product.count
      return res
    }, {
      preSales: [], // 販売開始前
      onSales: [], // 出品中の商品
      postSales: [], // 過去の出品商品
    })
}

/**
 * Get list of viewable products of user
 *
 * @param {Number} userId
 * @return {Promise<Object>}
 * @public
 */
async function countList(userId) {
  const products = await _products(userId)
  return (products || []).length
}

module.exports = {
  list,
  hasProduct,
  countList,
}
