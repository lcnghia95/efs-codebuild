const app = require('@server/server')
const helper = require('@services/surface/systemtrade/index/helper')

const {
  sfProductObjects,
} = require('@services/common/surfaceProduct')


// models
const surfaceProductDetailsModel = app.models.SurfaceProductDetails
const alsoBoughtProductsModel = app.models.AlsoBoughtProducts
const systemtradeSearchModel = app.models.SystemtradeSearch
const saleModel = app.models.Sales
// utils
const arrayUtil = require('@ggj/utils/utils/array')
/**
 * get also bought product for list of product
 *
 * @param {Number | Array} productIDs
 * @return {Array}
 * @public
 */
async function alsoBought(productIDs, userId, isSystemProduct = true) {
  if (!productIDs)
    {return []}

  if (!Array.isArray(productIDs))
    {productIDs = [productIDs]}

  productIDs = productIDs.filter(productId => !!productId)
  if (!productIDs.length)
    {return []}

  const data = []
  let systemtradeProductsObj = [],
    purchasedProductIds = []
  if (userId)
    {purchasedProductIds = arrayUtil.column(await saleModel.find({
      where: {
        userId,
        userType: 1,
        statusType: 1,
        salesType: 1,
      },
      order: 'id DESC',
      fields: {productId: true},
    }), 'productId')}
  const alsoBoughtProducts = await _alsoBoughtPData(productIDs, purchasedProductIds, 100)
  let alsoBoughtProductIds = arrayUtil.column(alsoBoughtProducts, 'boughtProductId')
  alsoBoughtProductIds = arrayUtil.unique(alsoBoughtProductIds)


  let [surfaceProducts, systemtradeProducts] = isSystemProduct ? await Promise.all([
    _getSurfaceProduct(alsoBoughtProductIds), _getSystemProduct(alsoBoughtProductIds)])
    : [await _getSurfaceProduct(alsoBoughtProductIds), []]


  if (systemtradeProducts.length) {
    systemtradeProducts = systemtradeProducts.map(
      item => helper.indexObject(item),
    )
    systemtradeProductsObj = arrayUtil.index(systemtradeProducts, 'id')
  }

  const surfaceProductObj = await sfProductObjects(surfaceProducts)
  const products = arrayUtil.index(surfaceProductObj, 'id')

  isSystemProduct ?
    alsoBoughtProductIds.map(
      item => {
        if (systemtradeProductsObj[item])
          {data.push(systemtradeProductsObj[item])}
        else if (products[item])
          {data.push(products[item])}
      },
    )
    :
    alsoBoughtProductIds.map(
      item => {
        if (products[item])
          {data.push(products[item])}
      })
  // Add query src=recommended for also bought product
  // https://gogojungle.backlog.jp/view/OAM-28296
  data.forEach(product => {
    product.detailUrl && (product.detailUrl += product.detailUrl.includes('?') ? '&src=recommended' : '?src=recommended')
  })
  return data
}

/**
 * get also bought data
 *
 * @param  {Number} salonId
 * @param  {Number} limit
 * @return {array}
 * @private
 */
function _alsoBoughtPData(productIds, purchasedProductIds, limit) {
  const ignoreProductIds = productIds.concat(purchasedProductIds)
  return alsoBoughtProductsModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
      boughtProductId: {
        nin: ignoreProductIds,
      },
    },
    fields: {
      productId: true,
      boughtProductId: true,
      boughtProductCount: true,
    },
    order: 'boughtProductCount DESC',
    limit,
  })
}

/**
 * get systemtrade product
 *
 * @param  {Array} productIds
 * @return {array}
 * @private
 */
function _getSystemProduct(productIds) {
  return systemtradeSearchModel.find({
    where: {
      productId: {
        inq: productIds,
      },
      isValid: 1,
      months: 0,
    },
  })
}

/**
 * get surface product
 *
 * @param  {Array} productIds
 * @return {array}
 * @private
 */
function _getSurfaceProduct(productIds) {
  return surfaceProductDetailsModel.find({
    where: {
      id: {
        inq: productIds,
      },
      isValid: 1,
    },
  })
}

module.exports = {
  alsoBought,
}
