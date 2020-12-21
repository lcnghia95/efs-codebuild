const app = require('@server/server')
const randomstring = require('randomstring')
const {isPurchased} = require('@services/common/sale')
const _fullProductIds = require('@services/common/tieup').fullProductIds
const cartModel = app.models.Carts
const NORMAL_SALE_TYPE = 1
const dvdProIds = [8030, 8031]
const dvdInformation = {
  1: {
    productId: dvdProIds[0],
    price: 550,
  },
  2: {
    productId: dvdProIds[1],
    price: 1100,
  },
}

/**
 * Get condition to querry carts table
 *
 * @param {number} userId
 * @param {number} cartSessionId
 * @param {Array|number|null} productId
 * @returns {Object}
 * @private
 */
function cartQueryCondition(userId, cartSessionId, productIds) {
  const productId = Array.isArray(productIds) ? {
      inq: productIds,
    } : productIds
    const condition = app.utils.object.nullFilter({
      statusType: {
        inq: [1, 2],
      },
      isValid: 1,
      isPurchase: 0,
      productId,
      userId: 0,
      sessionId: cartSessionId,
    })

  if (userId == 0) {
    return condition
  }

  return app.utils.object.nullFilter({
    or: [
      app.utils.object.nullFilter({
        statusType: {
          inq: [1, 2],
        },
        isValid: 1,
        isPurchase: 0,
        productId,
        userId,
      }),
      condition,
    ],
  })
}

function newCartQueryCondition(userId, cartSessionId, productIds) {
  const productId = Array.isArray(productIds) ? {
      inq: productIds,
    } : productIds
    const condition = app.utils.object.nullFilter({
      statusType: {
        inq: [1, 2],
      },
      isValid: 1,
      isPurchase: 0,
      productId,
      userId: 0,
      sessionId: cartSessionId,
    })

  if (userId == 0) {
    return [condition]
  }

  return [
      app.utils.object.nullFilter({
        statusType: {
          inq: [1, 2],
        },
        isValid: 1,
        isPurchase: 0,
        productId,
        userId,
      }),
      condition,
    ]
}

/**
 * Count number of item in cart
 *
 * @param {number} productId
 * @param {number} userId
 * @param {number} cartSessionId
 * @returns {number|null}
 * @public
 */
async function countProductInCart(productId, userId, cartSessionId) {
  let productIds
  if (productId) {
    productIds = _fullProductIds([
      productId,
    ])
  }
  const condition = newCartQueryCondition(userId, cartSessionId, productIds)
  const data = await Promise.all(condition.map(cond => cartModel.count(cond)))
  return data.reduce((a, b) => parseInt(a) + parseInt(b), 0)
}

/*
 * Check if user already purchased product or not
 *
 * @param {number|Array} productIds
 * @param {number} userId
 * @param {Boolean} checkPeriod
 * @returns {Boolean}
 * @public
 */
async function purchased(
  productIds,
  userId,
  checkPeriod = true,
  includeCancel = false,
) {
  if (userId == 0) {
    return false
  }
  const pIds = Array.isArray(productIds) ? productIds : [productIds]
    const result = await isPurchased(userId, pIds, checkPeriod, includeCancel)
  return result
}

/*
 * Check if user already purchased product or not
 *
 * @param {number} userId
 * @returns {string}
 * @public
 */
function salesSessionId(userId) {
  const rand = randomstring.generate({
    length: 9,
    charset: 'numeric',
  })
  return userId > 0 ? rand + '-' + userId : rand
}

/*
 * Validate regex pattern of sessionId
 *
 * @param {string} sessionId
 * @returns {string}
 * @public
 */
function validateSalesSessionId(sessionId) {
  return (sessionId || '').toString()
  // return sessionId.toString().match(/\d+-\d+/g) ? sessionId : ''
}

/**
 * Check if payment API is required or not
 *
 * @param {number} payId
 * @returns {Boolean}
 * @public
 */
async function seriesProductId(articleProductId) {
  const article = await app.models.Articles.findOne({
      where: {
        isValid: 1,
        statusType: 1,
        productId: articleProductId,
      },
      fields: {
        seriesId: true,
      },
    }) || {}
    const seriesId = article.seriesId || 0
  if (seriesId == 0) {
    return 0
  }
  const series = await app.models.Series.findOne({
    where: {
      id: seriesId,
      isValid: true,
      statusType: true,
    },
    fields: {
      productId: true,
    },
  })
  return series.productId || 0
}

/**
 * Check if payment API is required or not
 *
 * @param {number} payId
 * @returns {Boolean}
 * @public
 */
function isApiAccessRequired(payId) {
  return (payId == 2 || payId == 3 || payId == 4)
}

/**
 * Total price of checkout products
 *
 * @param {Array} salesData
 * @returns {number}
 * @public
 */
function totalPrice(salesData) {
  return salesData.reduce((result, sale) => (result + (sale.salesType == 1 ?
    sale.price : 0)), 0)
}

/**
 * Check if conclusion must be display or not
 *
 * @param {Object} product
 * @returns {Boolean}
 * @public
 */
function isDisPlayConclusion(product) {
  // https://gogojungle.backlog.jp/view/OAM-12860
  return product.isAdvising == 1 || product.typeId == 4
}

/**
 * Get sales data
 *
 * @param {number} userId
 * @param {string} sessionId
 * @returns {Boolean}
 * @public
 */
async function sales(userId, sessionId, fields) {
  const condition = {
    isValid: 1,
    sessionId,
    salesType: NORMAL_SALE_TYPE,
  }
  if (userId == 0) {
    condition.userType = 0 // Non member
  } else {
    condition.userId = userId
    condition.userType = 1
  }
  return await app.models.Sales.find({
    where: condition,
    fields: app.utils.query.fields(fields),
  })
}

/**
 * Get number of valid sales records of user
 *
 * @param {number} userId
 * @returns {Boolean}
 * @public
 */
async function isUserPurchasedBefore(userId) {
  // https://gogojungle.backlog.jp/view/OAM-11978#comment-50457821
  if (userId == 0) {
    return false
  }
  return await isPurchased(userId, [], false, false)
}

module.exports = {
  sales,
  purchased,
  totalPrice,
  dvdInformation,
  dvdProIds,
  salesSessionId,
  seriesProductId,
  isUserPurchasedBefore,
  countProductInCart,
  cartQueryCondition,
  isDisPlayConclusion,
  isApiAccessRequired,
  validateSalesSessionId,
}
