const app = require('@server/server')

const helper = require('@services/surface/systemtrade/index/helper')

// models
const SystemtradeRankingRealAccountsModel = app.models.SystemtradeRankingRealAccounts
const salesCountModel = app.models.SalesCount
const productModel = app.models.Products
const surfaceProductDetailsModel = app.models.SurfaceProductDetails
const saCollectMagicNumberTotalModel = app.models.SaCollectMagicNumberTotal
const relatedProductsModel = app.models.RelatedProducts
const fxonInfoAccountModel = app.models.FxonInfoAccount

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const pagingUtil = require('@ggj/utils/utils/paging')
const axios = require('axios')

const GGJ_ACCOUNTS = [45281, 45348]

const LANGUAGE = process.env.LANGUAGE || 1

const langObj = {
  1: '',
  2: 'En',
  3: 'Th',
}

const langPrefix = {
  1: '',
  2: '/en',
  3: '/th',
}
/**
 * index systemtrade ranking best seller
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(query = {}) {
  const page = query.page || 1
  const limit = query.rtRankingLimit || query.limit || 30

  const rankingRealAccounts = await SystemtradeRankingRealAccountsModel.find({
    where: {
      isValid: 1,
      price: { gt: 0 },
    },
    fields: {
      productId: true,
      productName: true,
      pips: true,
      reviewsStars: true,
      reviewsCount: true,
      price: true,
      pipsCurve: true,
      timeCurrentPips: true,
      accountId: true,
    },
    order: 'pips DESC',
  })

  if (!rankingRealAccounts.length) {
    return []
  }

  const productIds = arrayUtil.column(rankingRealAccounts, 'productId', true)
  const [salesCountIdx, productIdx] = await Promise.all([
    _getSalesCountIdx(productIds),
    _getProductIndex(productIds),
  ])

  // get unique product with highest pips
  const rankingProduct = rankingRealAccounts.reduce((acc, product) => {
    const productId = product.productId
    const salesCount = salesCountIdx[productId]
    const productDetail = productIdx[productId]
    if (!acc[productId] && productDetail) {
      product.productName = productDetail[`productName${langObj[LANGUAGE]}`]
      acc[productId] = _rankingProductObject(product, salesCount)
    }

    return acc
  }, {})

  const rtRanking = Object.values(rankingProduct).sort((a, b) => {
    if (a.pips === b.pips) {
      return b.salesCount - a.salesCount
    }
    return b.pips - a.pips
  })

  return rtRanking.slice((page - 1) * limit, page * limit)
}

/**
 * Get ja products
 *
 * @param {array} productIds
 *
 * @returns {array}
 * @private
 */
async function _getProductIndex(productIds) {
  const products = await surfaceProductDetailsModel.find({
    where: {
      isValid: 1,
      id: {
        inq: productIds,
      },
      statusType: 1,
      typeId: 1,
      isSaleStop: 0,
      [`productName${langObj[LANGUAGE]}`]: {
        gt: '0',
      },
    },
    fields: {
      id: true,
      [`productName${langObj[LANGUAGE]}`]: true,
    },
  })

  return arrayUtil.index(products, 'id')
}

async function getPipChart(productId, query) {
  const where = {
    isValid: 1,
    productId,
  }

  if (parseInt(query.accountId || 0)) {
    where.accountId = query.accountId
  }

  let rankingRealAccounts = await SystemtradeRankingRealAccountsModel.find({
    where,
    fields: {
      accountId: true,
    },
    order: 'pips DESC',
  })

  if (!rankingRealAccounts.length) {
    return []
  }

  if (rankingRealAccounts.length > 1){
    // Ignore the GGJ account in case the product is already exists in the Dev user account
    rankingRealAccounts = rankingRealAccounts.filter(account => !GGJ_ACCOUNTS.includes(account.accountId))
  }
  const accountId = rankingRealAccounts[0].accountId
  const magicNumbers = await saCollectMagicNumberTotalModel.find({
    where: {
      isValid: 1,
      productId,
      accountId,
    },
    fields: {
      magicNumber: true,
    },
  })

  const magicNumberStr = arrayUtil.column(magicNumbers, 'magicNumber', true).join(',')
  const data = await _getRealTradeAccountData(accountId, magicNumberStr)

  return {
    accountId,
    magicNumberStr,
    data,
  }
}

async function getListPipChart(productId, query) {
  const where = {
    isValid: 1,
    productId,
    isPublicRealTrade: 1,
  }
  const [allPublicRelated, product] = await Promise.all([
    relatedProductsModel.find({
      where,
      fields: {
        accountId: true,
        magicNumber: true,
      },
    }),
    productModel.findOne({
      where: {
        id: productId,
        isValid: 1,
      },
      fields: {
        id: true,
        userId: true,
      },
    }),
  ])

  if (!allPublicRelated.length || !product) {
    return []
  }
  const sellerId = product.userId

  let magicNumbers = allPublicRelated.reduce((res, record) => {
    const accountId = record.accountId
    if (!res[accountId]) {
      res[accountId] = {
        accountId,
        magicNumberStr: `${record.magicNumber}`,
      }
    } else {
      res[accountId].magicNumberStr += `,${record.magicNumber}`
    }
    return res
  }, {})
  magicNumbers = Object.values(magicNumbers)

  if (!magicNumbers.length) {
    return []
  }

  const allAccountIds = arrayUtil.column(allPublicRelated, 'accountId')
  let allAccounts = await fxonInfoAccountModel.find({
      where: {
        or: [{
          isValid: 1,
          accountPublic: 1,
          isDemo: 0,
          id: {
            inq: allAccountIds,
          },
        },{
          isValid: 1,
          userId: sellerId,
          accountPublic: 1,
          isDemo: 0,
        }],
      },
      fields: {
        id: true,
        userId: true,
        name: true,
        accountName: true,
        leverage: true,
        accountCompany: true,
      },
    })

  const sellerAccount = arrayUtil.column(allAccounts.filter(e => e.userId == sellerId), 'id')

  if (parseInt(query.accountId)) {
    const queryIdx = magicNumbers.findIndex(e => e.accountId == query.accountId)
    if (queryIdx > 0) {
      const tmp = magicNumbers[0]
      magicNumbers[0] = magicNumbers[queryIdx]
      magicNumbers[queryIdx] = tmp
    }
  } else if (sellerAccount.length) {
    sellerAccount.sort(() => Math.random() > 0.5 ? 1 : -1)
    const sellerIdx = magicNumbers.findIndex(e => sellerAccount.includes(e.accountId))
    if (sellerIdx > 0) {
      const tmp = magicNumbers[0]
      magicNumbers[0] = magicNumbers[sellerIdx]
      magicNumbers[sellerIdx] = tmp
    }
  } else {
    magicNumbers.sort(() => Math.random() > 0.5 ? 1 : -1)
  }

  allAccounts = arrayUtil.index(allAccounts, 'id')
  magicNumbers = magicNumbers.filter(e => !!allAccounts[e.accountId]).slice(0, 20)
  const allChartData = await Promise.all(magicNumbers.map(data => {
    const {accountId, magicNumberStr} = data
    return _getRealTradeAccountData(accountId, magicNumberStr)
  }))

  if (!allChartData.length) {
    return []
  }

  return magicNumbers.map((magic, i) => {
    const accountId = magic.accountId
    const account = allAccounts[accountId] || {}
    if (allChartData[i] && allChartData[i].length) {
      return [{
        name: 'pips',
        accountId,
        accountName: account.name || '',
        leverage: account.leverage || 0,
        accountCompany: account.accountCompany || '',
        magicNumberStr: magic.magicNumberStr,
        data: allChartData[i],
        color: '#003366',
      }]
    }
    return false
  }).filter(Boolean)
}

function _getRealTradeAccountData(accountId, listMagicNumber) {
  const url = `${process.env.REALTRADE_API}/api/real-trade/v2/account/${accountId}`
  const headers = {
    'content-type': 'application/json',
    'x-requested-with': 'XMLHttpRequest',
  }

  return axios.post(url, {
    magicNumbers: listMagicNumber,
    type: 3,
    chartMode: 2,
    chartOnly: 1,
  }, { headers })
  .then(response => {
    return response.data
  })
  .catch(error => {
    console.error(error.stack)
    return []
  })
}

/**
 * Get sales Count
 *
 * @param {array}  productIds
 *
 * @returns {array}
 * @private
 */
async function _getSalesCountIdx(productIds) {
  const salesCount = await salesCountModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    fields: {
      productId: true,
      salesCount: true,
    },
    order: 'salesCount DESC',
  })

  return arrayUtil.index(salesCount, 'productId')
}

/**
 * Ggenerate ranking product to show
 *
 * @param {object}  product
 *
 * @returns {object} product
 * @private
 */
function _rankingProductObject(product, salesCount = {}) {
  return {
    id: product.productId,
    isReal: 1,
    name: product.productName,
    pips: product.pips,
    typeId: 1,
    detailUrl: `${langPrefix[LANGUAGE]}/systemtrade/fx/${product.productId}?a=${product.accountId}&t=3`,
    chart: helper.indexPipChart(product),
    review: {
      stars: product.reviewsStars,
      count: product.reviewsCount,
    },
    prices: [
      {
        price: product.price,
      },
    ],
    salesCount: salesCount.salesCount || 0,
  }
}

/**
 * index systemtrade ranking real trade
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function realAsset(query = {}) {
  const page = query.page || 1
  const limit = query.rtRankingLimit || query.limit || 30
  const type = query.type || 0
  const rankingRealAccounts = await SystemtradeRankingRealAccountsModel.find({
    where: {
      isValid: 1,
      // price: { gt: 0 },
    },
    fields: {
      productId: true,
      productName: true,
      pips: true,
      reviewsStars: true,
      reviewsCount: true,
      price: true,
      pipsCurve: true,
      timeCurrentPips: true,
      accountId: true,
    },
    order: 'pips DESC',
  })

  if (!rankingRealAccounts.length) {
    return []
  }

  const productIds = arrayUtil.column(rankingRealAccounts, 'productId', true)
  const [salesCountIdx, productIdx] = await Promise.all([
    _getSalesCountIdx(productIds),
    _getProductIndex(productIds),
  ])

  // get unique product with highest pips
  const rankingProduct = rankingRealAccounts.reduce((acc, product) => {
    const productId = product.productId
    const salesCount = salesCountIdx[productId]
    const productDetail = productIdx[productId]
    if (productDetail) {
      product.productName = productDetail[`productName${langObj[LANGUAGE]}`]
      acc.push(_realAssetObject(product, salesCount, type))
    }
    return acc
  }, [])

  rankingProduct.sort((a, b) => {
    if (a.pips === b.pips) {
      return b.salesCount - a.salesCount
    }
    return b.pips - a.pips
  })
  const total = (rankingProduct || []).length
  const data = rankingProduct.slice((page - 1) * limit, page * limit)
  return pagingUtil.addPagingInformation(data, page, total, limit)
}

function _realAssetObject(product, salesCount = {}, type = 0) {
  return {
    id: product.productId,
    isReal: 1,
    name: product.productName,
    pips: product.pips,
    typeId: 1,
    detailUrl: `${langPrefix[LANGUAGE]}/systemtrade/fx/${product.productId}?a=${product.accountId}&t=3`,
    chart: _realAssetChart(product, type),
    review: {
      stars: product.reviewsStars,
      count: product.reviewsCount,
    },
    prices: [
      {
        price: product.price,
      },
    ],
    salesCount: salesCount.salesCount || 0,
  }
}

function _realAssetChart(product, type = 0) {
  if (!product.pipsCurve) {
    return type == 1 ? [] : undefined
  }

  const pips = product.pipsCurve.split(',')

  // type == 1 high charts
  if (type == 1) {
    const time = product.timeCurrentPips.split(',')
    return time.map((value, key) => {
      return [parseInt(value), parseFloat(pips[key] || 0)]
    })
  }

  // type == 0 google char
  const min = Math.min(...pips)
  const max = Math.max(...pips)
  const length = max - min
  if (length == 0) {
    return ''
  }

  return pips.map(value => {
    return parseFloat(
      ((value - min) / length * 100).toFixed(1),
    )
  }).toString()
}

module.exports = {
  index,
  getPipChart,
  realAsset,
  getListPipChart,
}
