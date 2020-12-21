const commonProduct = require('@services/common/product')
const detailHelper = require('@services/surface/systemtrade/detail/helper')
const popularServices = require('@services/surface/systemtrade/index/popular')
const bestSellServices = require(
  '@services/surface/systemtrade/index/bestSell')
const profitRateServices = require(
  '@services/surface/systemtrade/index/profitRate')
const profitTotalServices = require(
  '@services/surface/systemtrade/index/profitTotal')

const STOCK_CATEGORY_ID = 3

/**
 * show systemtrade others
 *
 * @param {Number} productId
 * @return {Object}
 * @public
 */
async function show(productId) {
  let product = await commonProduct.product(productId, {
      userId: true
    }),
    userId = product.userId || undefined
  if (!product || !userId) {
    return {}
  }

  let [popular, userProducts, ranking] = await Promise.all([
      popularServices.index(),
      detailHelper.userProducts(userId, productId),
      _ranking(),
    ]),
    mt4 = _mt4()

  return {
    popular,
    userProducts,
    ranking,
    mt4,
  }
}

/**
 * show systemtrade others
 *
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
  let input = {
      type: 2,
      categoryId: STOCK_CATEGORY_ID,
      limit: 5,
    },
    [bestSell, returnRate, profit] = await Promise.all([
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
  show
}
