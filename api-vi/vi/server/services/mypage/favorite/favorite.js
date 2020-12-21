const app = require('@server/server')
const commonPrice = require('@@services/common/price')
const commonProductUrl = require('@@services/common/productUrl')

// models
const productModel = app.models.Products
const favoriteProductModel = app.models.FavoriteProducts
const productMultiLanguages = app.models.ProductMultiLanguages

// utils
const arrayUtil = require('@ggj/utils/utils/array')

// "en":2, "th" : 3, "vi" : 4
const LANGUAGE_TYPE = 4

/**
 * Get favorite products
 *
 * @returns {Promise<Object>}
 * @public
 */
async function favorite(userId) {
  if (userId == 0) {
    return {}
  }

  const fields = {
    productId: true,
  }
  const condition = {
    userId: userId,
    isValid: 1,
  }
  const order = 'updatedAt DESC'
  const favorite = await favoriteProductModel.find({
    where: condition,
    fields,
    order: order,
  })
  const productIds = arrayUtil.column(favorite, 'productId', true)

  let productNames = await productMultiLanguages.find({
    where: {
      productId: {
        inq: productIds,
      },
      languages: LANGUAGE_TYPE,
    },
    fields: {
      id: true,
      name: true,
      productId: true,
    },
  })

  const productNameIds = arrayUtil.column(productNames, 'productId', true)

  let products = await productModel.find({
    where: {
      id: {
        inq: productNameIds,
      },
      statusType: {
        neq: 0,
      },
    },
    fields: {
      id: true,
      typeId: true,
      name: true,
      productPriceId: true,
      isSpecialDiscount: true,
      specialDiscountCount: true,
      specialDiscountStartAt: true,
      specialDiscountEndAt: true,
      isSaleStop: true,
      statusType: true,
    },
  })

  const productPriceIds = arrayUtil.column(products, 'productPriceId')
  const prices = await commonPrice.getPrices(productPriceIds)
  const productDetailUrls = await commonProductUrl.productDetailUrls(products)
  const productPrices = await commonPrice.priceObjects(
    prices,
    arrayUtil.index(products),
  )

  productNames = arrayUtil.index(productNames, 'productId')
  products = products.map(item => {
    item.detailUrl = productDetailUrls[item.id] || ''
    item.type = item.typeId

    if (!productPrices[item.id]) {
      item.prices = []
    } else {
      const price = productPrices[item.id][0].price || 0
      const oldPrice = productPrices[item.id][0].oldPrice || 0
      const objectPrice = !price ? null : (oldPrice ? {
        discountPrice: price,
        price: oldPrice,
      } : {
        price: price,
      })

      item.prices = [objectPrice]
    }

    // get name by language
    item.name = productNames[item.id].name
    return item
  })

  return products.map(_object)
}

/**
 * Message object
 *
 * @param {Object} products
 * @return {Object}
 * @private
 */
function _object(products) {
  return {
    id: products.id,
    name: products.name,
    detailUrl: products.detailUrl,
    type: products.type,
    prices: products.prices,
    showButton: (products.statusType == 1 && products.isSaleStop == 0) ? true : false,
  }
}

module.exports = {
  favorite,
}
