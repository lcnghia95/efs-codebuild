const app = require('@server/server')
const commonPrice = require('@services/common/price')
const commonProductUrl = require('@services/common/productUrl')

// models
const productModel = app.models.Products
const favoriteProductModel = app.models.FavoriteProducts
const productMultilanguageModel = app.models.ProductMultiLanguages
const alsoBoughtProductService = require('@services/common/alsoBoughtProduct')
const reviewStarsModel = app.models.ReviewStars

// utils
const arrayUtil = require('@ggj/utils/utils/array')

const LANG_SUPPORT = [1]

/**
 * Get favorite products
 *
 * @param {Number} userId
 * @param {Number} language
 * @returns {Promise<Object>}
 * @public
 */
async function favorite(userId, language = 1) {
  const favorite = await _getFavoriteProducts(userId)

  if (favorite.length == 0) {
    return {}
  }

  const productIds = arrayUtil.column(favorite, 'productId', true)
  let products = await productModel.find({
      where: {
        id: {
          inq: productIds,
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
    const [prices, productDetailUrls, multiLanguageProducts, reviewStars] = await Promise.all([
      commonPrice.getPrices(productPriceIds),
      commonProductUrl.productDetailUrls(products),
      _getProductMultiLanguages(arrayUtil.column(products, 'id'), language),
      reviewStarsModel.find({
        where: {
          productId: {
            inq: productIds,
          },
          isValid: 1,
        },
        fields: {
          productId: true,
          reviewStars: true,
          reviewCount: true,
        }
      })
    ])
    const productPrices = await commonPrice.priceObjects(
      prices,
      arrayUtil.index(products),
    )
  const reviewStarsIdx = arrayUtil.index(reviewStars, 'productId')
  if (language != 1) {
    if (multiLanguageProducts.length == 0) {
      return {}
    }
    products = products.reduce((result, item) => {
      if (multiLanguageProducts[item.id]) {
        item.name = multiLanguageProducts[item.id].name
        result.push(item)
      }
      return result
    }, [])
  }
  
  products = products.map(item => {
    const productId = item.id
    item.detailUrl = productDetailUrls[productId] || ''
    item.type = item.typeId
    item.reviews = reviewStarsIdx[productId]
    if (!productPrices[productId]) {
      item.prices = []
    } else {
      const price = productPrices[productId][0].price || 0
      const oldPrice = productPrices[productId][0].oldPrice || 0
      const objectPrice = !price ? {} : (oldPrice ? {
        discountPrice: price,
        price: oldPrice,
      } : {
        price: price,
      })

      item.prices = [objectPrice]
    }
    return item
  })

  return products.map(_object)
}

/**
 * get also bought
 *
 * @param {number} userId
 * @return {array}
 * @public
 */
async function alsoBought(userId, language = 1) {
  if (!LANG_SUPPORT.includes(language)) {
    return []
  }

  const favorites = await _getFavoriteProducts(userId)

  if (favorites.length == 0) {
    return []
  }

  const productIds = arrayUtil.column(favorites, 'productId', true)
    const alsoBoughtProducts = await alsoBoughtProductService.alsoBought(productIds, userId)
  return alsoBoughtProducts
}

/**
 * get favorite products
 *
 * @param {number} userId
 * @return {array}
 * @private
 */
async function _getFavoriteProducts(userId) {
  return await favoriteProductModel.find({
    where: {
      userId: userId,
      isValid: 1,
    },
    fields: {
      productId: true,
    },
    order: 'updatedAt DESC',
  })
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
    reviews: products.reviews || {}
  }
}

/**
 * Get product multi language
 *
 * @param {Array} productIds
 * @param {Number} language
 * @return {Object}
 * @private
 */
async function _getProductMultiLanguages(productIds, language) {
  const products = await productMultilanguageModel.find({
    where: {
      productId: {
        inq: productIds,
      },
      isValid: 1,
      languages: language,
    },
    fields: {
      productId: true,
      name: true,
    },
  })
  return (products.length == 0) ? {} : arrayUtil.index(products, 'productId')
}

module.exports = {
  favorite,
  alsoBought,
}
