const commonProduct = require('@services/common/product')
const detailHelper = require('@services/surface/systemtrade/detail/helper')
const popularServices = require('@services/surface/systemtrade/index/popular')
const bestSellServices = require(
  '@services/surface/systemtrade/index/bestSell')
const profitRateServices = require(
  '@services/surface/systemtrade/index/profitRate')
const profitTotalServices = require(
  '@services/surface/systemtrade/index/profitTotal')
const alsoBoughtProductService = require('@services/common/alsoBoughtProduct')
const STOCK_CATEGORY_ID = 3

/**
 * show systemtrade others
 *
 * @param {Number} productId
 * @return {Object}
 * @public
 */
async function show(productId, opt) {
  const product = await commonProduct.product(productId, {
    userId: true,
  })
  const userId = product.userId || undefined

  if (!product || !userId) {
    return {}
  }

  const [popular, userProducts, ranking, alsoBought] = await Promise.all([
    popularServices.index(),
    detailHelper.userProducts(userId, productId),
    _ranking(),
    alsoBoughtProductService.alsoBought(productId, opt.userId),
  ])
  const mt4 = _mt4()

  return {
    popular,
    userProducts,
    ranking,
    mt4,
    alsoBought,
  }
}

/**
 * show systemtrade others
 *
 * @param {Number} id
 * @return {Array}
 * @private
 */
function _mt4() {
  return [
    'https://www.youtube.com/watch?v=zzaX40ORnKY',
    'https://www.youtube.com/watch?v=WtSEBEGcPxA',
    'https://www.youtube.com/watch?v=zzaX40ORnKY',
    'https://www.youtube.com/watch?v=zzaX40ORnKY',
  ]
}

/**
 * show systemtrade others
 *
 * @param {Void}
 * @return {Object}
 * @private
 */
async function _ranking() {
  const input = {
    type: 2,
    categoryId: STOCK_CATEGORY_ID,
    limit: 5,
  }
  const [bestSell, returnRate, profit] = await Promise.all([
    bestSellServices.index(input),
    profitRateServices.index(input),
    profitTotalServices.index(input),
  ])

  return {
    bestSell,
    returnRate,
    profit,
  }
}

module.exports = {
  show,
}
