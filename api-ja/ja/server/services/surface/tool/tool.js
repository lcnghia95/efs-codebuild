const app = require('@server/server')
const helper = require('@services/surface/tool/helper')
const commonCart = require('@services/common/cart')
const commonProduct = require('@services/common/product')
const recommendSv = require('@services/surface/tool/recommend')
const popularSv = require('@services/surface/tool/popular')
const alsoBoughtProduct = require('@services/surface/tool/alsoBoughtProduct')

// utils
const stringUtil = require('@server/utils/string')
/**
 * Get detail data for given product
 *
 * @param id
 * @param input
 * @returns {Promise<Object>}
 */
async function show(id, input) {
  if (!input.type) {
    return {}
  }

  input.typeIds = input.type === 'indicators' ? '2' : helper.typeIds(1).join(',')
  const data = await commonProduct.show(id, input)

  // https://gogojungle.backlog.jp/view/OAM-26839
  if (['indicators', 'ebooks', 'rooms'].includes(input.type) && data.statusType === 5) {
    return {}
  }

  if (Object.keys(data).length < 4) {
    return data
  }
  
  return await _object(data)
}

/**
 * Get sub products
 *
 * @param id
 * @param input
 * @returns {Promise<Object>}
 */
async function subProduct(id, input) {
  return await commonProduct.subProduct(id, input)
}

/**
 * Get sub products and ranking products
 *
 * @param id
 * @param input
 * @returns {Promise<Object>}
 */
async function subAndRankProduct(id, input) {
  const [subProducts, campaign, popular] = await Promise.all([
    commonProduct.subProduct(id, input),
    recommendSv.campaign(),
    popularSv.priceAndCountOf3M(),
  ])

  return app.utils.object.filter(Object.assign(subProducts, campaign, popular))
}

/**
 * Convert response object for given data
 *
 * @param data
 * @returns {Promise<Object>}
 * @private
 */
async function _object(data) {
  const replaceOutlines = stringUtil.externalLink(data.productOutline)

  return app.utils.object.nullFilter({
    id: data.id,
    status: data.status,
    name: data.productName,
    typeId: data.typeId,
    description: data.catchCopy,
    platform: data.platformId,
    isPassword: data.passwordType,
    categories: data.categories,
    keywords: data.keywords,
    review: app.utils.object.nullFilter({
      stars: data.reviewsStars,
      count: data.reviewsCount,
    }),
    user: _userObject(data),
    set: data.setProducts,
    outline: stringUtil.expandHyperlink(replaceOutlines) || null,
    cartInfo: await commonCart.show(data.id, data),
  })
}

/**
 * Get user response object for given data
 *
 * @param data
 * @returns {Object}
 * @private
 */
function _userObject(data) {
  if (data.userId) {
    return app.utils.object.nullFilter({
      id: data.userId,
      name: data.nickName,
      transaction: data.isTransaction ? data.transaction : null,
      selfIntroduction: !data.isTransaction || !data.transaction ? data.userSelfIntroduction : null,
      url: data.saleUrl,
    })
  }

  return {}
}

function showAlsoBoughtProducts(userId, selectedProductId) {
  return alsoBoughtProduct.show(selectedProductId, userId)
}

module.exports = {
  show,
  subProduct,
  subAndRankProduct,
  showAlsoBoughtProducts,
}
