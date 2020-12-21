const app = require('@server/server')
const favorite = require('@services/common/favorite')
const portfolio = require('@services/common/portfolio')
const productDetailModel = app.models.SurfaceProductDetails
const {
  syncSf,
} = require('@services/common/product')
/**
 * Get product information for add to cart components
 * https://zpl.io/2EmBg9M
 *
 * @param {number} pId
 * @param {object} data
 * @param {number} userId
 * @param {number} isPurchased
 * @returns {Promise<Object>}
 */
async function show(pId, data = {}, userId = 0, isPurchased = 0) {
  if (data) {
    await syncSf(pId)
    data = await productDetailModel.findById(pId)
  }
  const category = (((data || {}).categories || '').split(',')).sort((a, b) => a - b)[0] || ''
  return !data ? {} : Object.assign({
    isFavorite: await favorite.isFavorite(pId, userId) ? 1 : 0,
  }, {
    isPortfolio: await portfolio.isPortfolio(pId, userId) ? 1 : 0,
  },
  app.utils.object.filter({
    productId: pId,
    name: data.productName,
    type: data.typeId,
    category,
    status: status(data),
    isDvd: data.isDvd,
    isSub: data.isSubscription,
    isAdvising: data.isAdvising,
    isAuth: data.isWebAuthentication,
    isPurchased: isPurchased,
    isFFM: data.isFreeFirstMonth,
    version: data.version,
    updated: data.versionUpdatedAt,
    count: data.salesCount,
    expected: data.expectedSalesCount,
    reservedStart: data.reservedStartAt,
    reservedEnd: data.reservedEndAt,
    favoriteCount: data.favoriteCount,
    start: data.forwardAt,
    devId: data.userId,
  }),
  saleRemain(data),
  price(data),
  pays(data.pays || '', data.isSubscription),
  brokers(data.brokers || ''),
  )
}

async function buildCartInfo(pId, data = {}, isFavorite, isPortfolio, isPurchased = 0) {
  const category = (((data || {}).categories || '').split(',')).sort((a, b) => a - b)[0] || ''
  return !data ? {} : Object.assign({
    isFavorite: isFavorite ? 1 : 0,
  }, {
    isPortfolio: isPortfolio ? 1 : 0,
  },
  app.utils.object.filter({
    productId: pId,
    name: data.productName,
    type: data.typeId,
    category,
    status: status(data),
    isDvd: data.isDvd,
    isSub: data.isSubscription,
    isAdvising: data.isAdvising,
    isAuth: data.isWebAuthentication,
    isPurchased: isPurchased,
    isFFM: data.isFreeFirstMonth,
    version: data.version,
    updated: data.versionUpdatedAt,
    count: data.salesCount,
    expected: data.expectedSalesCount,
    reservedStart: data.reservedStartAt,
    reservedEnd: data.reservedEndAt,
    favoriteCount: data.favoriteCount,
    start: data.forwardAt,
    devId: data.userId,
  }),
  saleRemain(data),
  price(data),
  pays(data.pays || '', data.isSubscription),
  brokers(data.brokers || ''),
  )
}

/**
 * Get sale remaining
 *
 * @param data
 * @returns {Object}
 */
function saleRemain(data) {
  if (data.isLimited === 1) {
    const remain = Math.max(data.upperLimit - data.salesCount, 0)

    return {
      limit: data.upperLimit,
      saleRemain: remain,
    }
  }

  return {}
}

/**
 * Get price data of given product
 *
 * @param data
 * @returns {Object}
 */
function price(data) {
  const now = parseInt(Date.now() / 1000)
  const start = data.specialDiscountStartAt || 0
  const end = data.specialDiscountEndAt || 0
  const count = data.specialDiscountCount || 0
  let remain = 0

  if (!data.isSpecialDiscount || (!count && !start && !end)) {
    return {
      price: data.price,
    }
  }

  if (count > 0) {
    remain = Math.max(count - data.salesCount, 0)
    // Over limit
    if (remain === 0) {
      return {
        price: data.price,
      }
    }
  }

  const isOverPeriod = start > now || (end > 0 && end < now)
  return isOverPeriod ? {
    price: data.price,
  } : app.utils.object.nullFilter({
    price: data.specialDiscountPrice,
    oldPrice: data.price,
    discountRemain: remain > 0 ? remain : null,
    discountStart: start,
    discountEnd: end,
  })
}

/**
 * Get payment info
 *
 * @param pays
 * @param isSub
 * @returns {Object}
 */
function pays(pays, isSub = 0) {
  const idxs = isSub === 0 ? {
      1: 'bank',
      2: 'card',
      4: 'store',
      5: 'tran',
      8: 'btc',
    } : {
      2: 'card',
      5: 'tran',
    }
    const payArr = pays.split(',')
    const res = {}

  for (const i in idxs) {
    if (payArr.includes(i)) {
      res[idxs[i]] = 1
    }
  }

  return app.utils.object.filter({
    payments: res,
  })
}

/**
 * Get brokers data
 *
 * @param brokers
 * @returns {Object}
 */
function brokers(brokers) {
  return !brokers ? {} : {
    brokers: brokers.split(',').map(broker => Number(broker)),
  }
}

/**
 * Get status of current
 *
 * @param data
 * @returns {number}
 */
function status(data) {
  // SIGNAL ONLY
  if (data.isSignalOnly === 1) {
    return 3
  }

  // USER SETTING: PRESALE
  if (data.statusType === 2) {
    return 2
  }

  // OAM-13853
  if (data.statusType === 9) {
    return 9
  }

  // OAM-25786
  if (data.isSaleStop === 2) {
    return 4
  }

  // USER SETTING: STOP
  if (data.statusType === 0 || data.isSaleStop === 1) {
    return 0
  }

  const now = Date.now() / 1000
  // USER SETTING: REACH END DATE: STOP
  if (data.isReservedEnd === 1) {
    if (data.reservedEndAt < now) {
      return 0
    }
  }

  // USER SETTING: BREFOR START DATE: PRESALE
  if (data.isReservedStart === 1) {
    if (data.reservedStartAt > now) {
      return 2
    }
  }

  // REACH UPPER LIMIT: STOP
  if (data.isLimited === 1) {
    if (data.salesCount >= data.upperLimit) {
      return 0
    }
  }

  // USER SETTING: ONSALE
  if (data.statusType === 1) {
    return 1
  }

  // DEFAULT VALUE: 0
  return 0
}

module.exports = {
  show: show,
  buildCartInfo: buildCartInfo,
}
