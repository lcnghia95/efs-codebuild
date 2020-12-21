const app = require('@server/server')
const helper = require('./helper')
const permitService = require('./permit')
const userCommonService = require('@services/common/user')
const errors = require('./errors')
const NAVI_PRODUCT_TYPE_ID = 3
const SALON_PRODUCT_TYPE_ID = 4
const VIDEO_PRODUCT_TYPE_ID = 5
const {getPassword} = require('@services/common/product')
const { isQuantXProd } = require('@@services/common/quantx')
// Models
const productModel = app.models.Products
const cartModel = app.models.Carts
const salesModel = app.models.Sales

// Utils
const arrayUtils = require('@ggj/utils/utils/array')

// Checklists
const commonCheckList = [
  _checkBuyUser,
  _checkDeveloper,
  _checkValidProduct,
  _checkMustSingleProduct,
  _checkArticleAndSeries,
  _checkPermission,
  _checkPagePassword,
  _checkPermitPurchase,
]
const changeQuantityCheckList = [
  _checkQuantity,
]

/**
 * User add to cart
 * Validate add to cart: check the current user has permission
 * Throw error if no permission: message will get from `permit_purchase.message`
 * https://gogojungle.backlog.jp/view/OAM-36597
 * @returns {Promise<void>}
 * @private
 */
async function _checkPermitPurchase({userId, productId}) {
  const permitPurchaseProduct = await permitService.getPermitPurchaseByProductId(productId)

  if(!permitPurchaseProduct) {
    return _resolved()
  }

  if(!userId) {
    return _reject(errors.cartError001)
  }

  const startDate = !permitPurchaseProduct.serviceStartAt ? 0 : permitPurchaseProduct.serviceStartAt * 1000
  const endDate = !permitPurchaseProduct.serviceEndAt ? 0 : permitPurchaseProduct.serviceEndAt * 1000
  const extendConditions = []

  if(startDate) {
    extendConditions.push({payAt: {gte: startDate}})
  }

  if(endDate) {
    extendConditions.push({payAt: {lte: endDate}})
  }

  const saleCount = await salesModel.count({
    isValid: 1,
    userId,
    isFree: 0,
    statusType: 1,
    isFinished: 0,
    isCancel: 0,
    and: extendConditions,
  })

  if(!saleCount) {
    const error = errors.cartError015
    error.msg = permitPurchaseProduct.message || error.msg
    return _reject(error)
  }

  return _resolved()
}

async function _checkPagePassword({product, input}) {
  if (!product.isPassword) {
    return _resolved()
  }
  const password = await getPassword(product.id ,input)
  return (password.password || '') != product.pagePassword ?
    _reject(errors.cartError014) :
    _resolved()
}

/**
 * Check if current user is buyer
 *
 * @param {number} userId
 * @return {Promise<*>}
 * @private
 */
async function _checkBuyUser({
  userId,
}) {
  const isBuyUser = userId == 0 ? true : await userCommonService.isBuyUser(userId)
  return isBuyUser ? _resolved() : _reject(errors.cartError001)
}

/**
 * Check if product owner is developer
 *
 * @param product
 * @return {Promise<*>}
 * @private
 */
async function _checkDeveloper({
  product,
}) {
  const isDeveloper = await _isDeveloper(product.userId)
  if (!isDeveloper) {
    return _reject(errors.cartError002)
  }
  return _resolved()
}

/**
 * Check if given product is valid
 *
 * @param {number} userId
 * @param {number} productId
 * @return {Promise<*>}
 * @private
 */
async function _checkValidProduct({
  product,
}) {
  return product ? _resolved() : _reject(errors.cartError002)
}

/**
 * Check if given product is must single product
 * If given product is must single, user can't buy/add same product
 *
 * @param {number} userId
 * @param {number} productId
 * @param product
 * @param {string} cartSessionId
 * @param {boolean} isCheckDuplicateCart
 * @return {Promise<*>}
 * @private
 */
async function _checkMustSingleProduct({
  userId,
  productId,
  product,
  cartSessionId,
  isCheckDuplicateCart = true,
}) {
  if (!product || !_isPurchaseOnlyOne(product)) {
    return _resolved()
  }

  const checkPeriod = product.typeId != VIDEO_PRODUCT_TYPE_ID
  const [isPurchased, cartCount] = await Promise.all([
    helper.purchased(productId, userId, checkPeriod), !isCheckDuplicateCart ?
      0 : helper.countProductInCart(
        productId,
        userId,
        cartSessionId,
      ),
  ])

  // Only allow purchase one time for this type
  if (isPurchased) {
    return _reject(errors.cartError003)
  }
  // Only allow add to cart one time for this type

  if (cartCount > 0) {
    return _reject(errors.cartError004)
  }
}

/**
 *
 * @param {number} userId
 * @param {number} productId
 * @param product
 * @param {string} cartSessionId
 * @return {Promise<*>}
 * @private
 */
async function _checkArticleAndSeries({
  userId,
  productId,
  product,
  cartSessionId,
  limit,
}) {
  if (!product || !_isArticle(product)) {
    return _resolved()
  }

  const seriesProductId = await helper.seriesProductId(product.id)
  const [isPurchased, cartCount] = await Promise.all([
    helper.purchased(seriesProductId, userId),
    helper.countProductInCart(
      productId,
      userId,
      cartSessionId,
    ),
  ])

  // Doesn't allow if current user was purchased series of this article (product)
  if (isPurchased) {
    return _reject(errors.cartError005)
  }

  // Doesn't allow if current user was added series of this article (product) into cart
  if (cartCount > (limit || 0)) {
    return _reject(errors.cartError006)
  }
}

/**
 *
 * @param {number} userId
 * @param {number} productId
 * @param product
 * @param {string} cartSessionId
 * @return {Promise<*>}
 * @private
 */
async function _checkPermission({
  userId,
  productId,
  cartSessionId,
}) {
  // TODO: remove this block after finish campaign for 18725
  if (productId == 18725 && userId > 0) {
    const isPurchased = await helper.purchased([15153, 18725], userId, true, true)
    if (isPurchased) {
      return _reject({
        statusType: 0,
        error: 'cartError010-18725',
      })
    }
  }
  // let limit = await permitService.limit(product, userId, cartSessionId)
  const [permissionResult, {limit,upperLimit}] = await Promise.all([
    permitService.checkPermision(productId, userId, cartSessionId),
    permitService.upperLimit(productId, userId, cartSessionId),
  ])

  // https://gogojungle.backlog.jp/view/OAM-11855
  const error = Object.assign({}, errors.cartError010)

  if (limit <= 0) {
    error.error = error.error + '-over'
    error.upperLimit = upperLimit
    return _reject(error)
  }

  if (permissionResult.permission == 0) {
    error.error = error.error + '-' + productId
    if (permissionResult.overLimit == 1) {
      error.error = error.error + '-2'
    }
    return _reject(error)
  }
}

/**
 *
 * @param {number} userId
 * @param {number} productId
 * @param product
 * @param {string} cartSessionId
 * @return {Promise<never>}
 * @private
 */
async function _checkQuantity({
  userId,
  productId,
  product,
  cartSessionId,
}) {
  const count = await helper.countProductInCart(
    productId,
    userId,
    cartSessionId,
  )

  if (count == 0) {
    return _reject(errors.cartError007)
  }

  if (_isArticle(product) || _isPurchaseOnlyOne(product)) {
    return _reject(errors.cartError008)
  }
}

/**
 * Check if product is salon/series/videos/subscription/quantx or not
 * For these kind of these product, we can only buy one
 *
 * @param {Object} product
 * @returns {Boolean}
 * @private
 */
function _isPurchaseOnlyOne(product) {
  if (product.isSubscription === 1) {
    return true
  }

  return [
    SALON_PRODUCT_TYPE_ID,
    VIDEO_PRODUCT_TYPE_ID,
    NAVI_PRODUCT_TYPE_ID,
  ].includes(product.typeId) || isQuantXProd(product)
}

/**
 * Check if product is salon/series or not
 *
 * @param {Object} product
 * @returns {Boolean}
 * @private
 */
function _isArticle(product) {
  return (product.typeId == NAVI_PRODUCT_TYPE_ID && product.isSubscription ===
    0)
}

/**
 * Check if user is developer or not
 *
 * @returns {Boolean}
 * @private
 */
async function _isDeveloper(userId) {
  const user = await userCommonService.getUser(userId, {
    id: true,
    statusType: true,
    isDeveloper: true,
  })
  return user.statusType == 1 && user.isDeveloper == 1
}

/**
 * Get onsale product
 *
 * @param {number} productId
 * @returns {Object|null}
 * @private
 */
async function _product(productId) {
  return await productModel.findOnSale(productId, {
    id: true,
    typeId: true,
    platformId: true,
    userId: true,
    isSubscription: true,
    isAdvising: true,
    pagePassword: true,
    isPassword: true,
  })
}

/**
 *
 * @param {number} productIds
 * @param {object} fields
 * @return {Promise<*>}
 * @private
 */
async function _products(productIds, fields = {
  id: true,
  typeId: true,
  platformId: true,
}) {
  return arrayUtils.index(await productModel.find({
    where: {
      id: {
        inq: productIds,
      },
    },
    fields,
  }))
}

/**
 *
 * @param carts
 * @param products
 * @return {Promise<void | number>}
 * @private
 */
async function _checkDuplicate(carts, products) {
  const [duplicateIds, remaining] = carts.reduce((res, cart) => {
    const productId = cart.productId
    const product = products[productId]

    if (!res[1][productId]) {
      res[1][productId] = cart
      return res
    }

    if ([SALON_PRODUCT_TYPE_ID, NAVI_PRODUCT_TYPE_ID].includes(product.typeId)) {
      res[1][productId].isRemaining = 1
      res[0].push(cart.id)
    }
    return res
  }, [
    [], {},
  ])

  // If have duplicate salon
  // Delete newer cart record and add warning to remaining record
  if (duplicateIds.length) {

    // Update remaining cart record
    const promises = Object.keys(remaining).map(async productId => {
      const cart = remaining[productId]

      if (cart.isRemaining) {
        cart.warningCode = errors.cartWarning001.warning
        await cart.save()
      }
    })

    await Promise.all([
      promises,
      cartModel.destroyAll({
        id: {
          inq: duplicateIds,
        },
      }),
    ])

    return 1 // has error
  }
}

/**
 * Check productId vs productPriceId
 *
 * @param {number} productId
 * @param {number} productPriceId
 * @returns {Boolean}
 * @public
 */
async function _checkProductVsPrice(productId, productPriceId) {
  const count = await app.models.ProductPrices.count({
    id: productPriceId,
    productId,
    isValid: 1,
    statusType: 1,
  })
  return (count == 1)
}

/**
 *
 * @return {Promise<void>}
 * @private
 */
function _resolved() {
  return Promise.resolve()
}

/**
 *
 * @param err
 * @return {Promise<never>}
 * @private
 */
function _reject(err) {
  return Promise.reject(err)
}

/**
 *
 * @param {number} userId
 * @param {number} productId
 * @param {string} cartSessionId
 * @param {Array} checkList
 * @return {Promise<*>}
 * @private
 */
async function _validate(userId, productId, cartSessionId, checkList, input) {
  const product = await _product(productId)

  if (!product) {
    return errors.cartError002
  }

  const promises = checkList.map(fn => fn({
    userId,
    productId,
    cartSessionId,
    product,
    input,
  }))

  try {
    await Promise.all(promises)
  } catch (error) {
    return error
  }

  return {
    statusType: 1,
  }
}

/**
 *
 * @param {number} userId
 * @param {number} productId
 * @param {string} cartSessionId
 * @return {Promise<*>}
 */
async function addToCart(userId, productId, cartSessionId, input) {
  return await _validate(userId, productId, cartSessionId, commonCheckList, input)
}

/**
 *
 * @param {number} userId
 * @param {number} productId
 * @param {string} cartSessionId
 * @return {Promise<*>}
 */
async function changeQuantity(userId, productId, cartSessionId) {
  const [common, quantity] = await Promise.all([
    _validate(userId, productId, cartSessionId, commonCheckList),
    _validate(userId, productId, cartSessionId, changeQuantityCheckList),
  ])

  if (common.error) {
    return common
  }

  if (quantity.error) {
    return quantity
  }

  return {
    statusType: 1,
  }
}

/**
 *
 * @param {number} userId
 * @param {number} productId
 * @param {string} cartSessionId
 * @return {Promise<*>}
 */
async function checkout(userId, productId, cartSessionId) {
  return await _validate(userId, productId, cartSessionId, commonCheckList)
}

/**
 *
 * @param {number} userId
 * @param {string} cartSessionId
 * @return {Promise<void>}
 */
async function sync(userId, cartSessionId) {
  const carts = await cartModel.find({
    where: helper.cartQueryCondition(userId, cartSessionId, null),
    order: 'id ASC',
  })
  const productIds = arrayUtils.column(carts, 'productId')
  const products = await _products(productIds, {
    id: true,
    typeId: true,
    isSubscription: true,
  })

  let hasError = 0
  const limit = 1

  // Check articles and series
  await Promise.all(carts.map(async cart => {
    const product = products[cart.productId]
    const [result1, result2] = await Promise.all([
      _checkArticleAndSeries({
        userId,
        productId: cart.productId,
        product,
        cartSessionId,
        limit,
      }).catch(e => e),
      _checkMustSingleProduct({
        userId,
        productId: cart.productId,
        product,
        cartSessionId,
        isCheckDuplicateCart: false, // Duplicate items will be handle below
      }).catch(e => e),
    ])

    if (result1 || result2) {
      cart.errorCode = (result1 || result2).error
      hasError = 1
      await cart.save()
    }
  }))

  // Check duplicate and remaining cart records
  const duplicateError = await _checkDuplicate(carts, products)
  return hasError || duplicateError
}

/**
 * Add cart record when user click add_to_cart button
 *
 * @param {number} productId
 * @param {number} userId
 * @returns {Object}
 * @private
 */
async function changePrice(productId, priceId) {
  // Validate productId vs priceId
  const checkPrice = await _checkProductVsPrice(productId, priceId)

  if (checkPrice) {
    return {
      statusType: 1,
    }
  }

  // Validate seriePriceId in case of article
  const product = await _product(productId)

  if (_isArticle(product)) {
    const seriesProductId = await helper.seriesProductId(product.id)
    if (await _checkProductVsPrice(seriesProductId, priceId)) {
      return {
        statusType: 1,
      }
    }
  }

  return errors.cartError009
}

/**
 * check user has full information
 *
 * @param {number} userId
 * @returns {Boolean}
 * @public
 */
async function checkUserInformation(userId, user = {}) {
  const length = Object.keys(user).length

  if (!userId && !length) {
    return false
  }

  const hasAddress = userCommonService.hasAddress(user)

  return hasAddress ? true : false
}

module.exports = {
  checkout,
  addToCart,
  changePrice,
  changeQuantity,
  checkUserInformation,
  sync,
}
