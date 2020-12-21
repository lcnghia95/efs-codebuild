const app = require('@server/server')
const saleCommonService = require('@services/common/sale')
const urlService = require('@services/common/productUrl')
const arrayUtil = require('@ggj/utils/utils/array')
// const DOWNLOAD_PRODUCT_TYPE_IDS = [1, 2, 6, 9, 13, 70, 71]
const { DOWNLOAD_PRODUCT_TYPE_IDS } = require('@@server/common/data/hardcodedData')
const DEFAULT_SALE_TYPE = [1, 2]
const productMultiLanguages = app.models.ProductMultiLanguages

const LANGTYPE = [2, 3, 4]

// const SPECIAL_PRODUCTS = 7421
// const SPECIAL_RECORD = {
//   id: 7421,
//   type: 1,
//   detailUrl: 'javascript:void(0)',
//   name: 'fx-onプレミアム',
//   salesId: 0,
// }

/**
 * Get sale infomation
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 * @private
 */
async function _sales(userId) {
  const fields =
    'typeId,productId,payAt,isMonitor,id,isFinished,serviceStartAt,serviceEndAt'
    // const lastmonth = app.utils.time.addMonths(-1, Date.now(), true)
    const sales = await app.models.Sales.find({
      where: _condition(userId),
      order: ['payAt DESC', 'id DESC'],
      fields: app.utils.query.fields(fields),
    })
  return sales//.filter(sale => _checkFinish(sale))
}

/**
 * Validate finish condition of sale record
 *
 * @param {Object} sale
 * @param {number} lastmonth
 * @returns {Boolean}
 * @private
 */
// function _checkFinish(sale) {
//   return sale.isFinished != 1 || Date.now() / 1000 > sale.serviceEndAt
// }

/**
 * Get version data
 *
 * @param {Array} productIds
 * @param {number} statusType
 * @returns {Object}
 * @private
 */
async function _versions(productIds, statusType = 1) {
  return arrayUtil.index(await app.models.ProductVersions.find({
    where: {
      isValid: 1,
      statusType,
      productId: {
        inq: productIds,
      },
    },
    fields: {
      id: true,
      productId: true,
      versionUpdatedAt: true,
      createdAt: true,
    },
    order: 'versionUpdatedAt DESC',
  }), 'productId')
}

/**
 * Get sub product information of product sets
 *
 * @param {Array} products
 * @returns {Promise<Array>}
 * @private
 */
async function _subProducts(products) {
  const setProductIds = products
    .filter(product => (product.isSet == 1))
    .map(product => product.id)
  if (setProductIds.length == 0) {
    return []
  }
  return await _productSets(setProductIds)
}

/**
 * Get data from `master.product_sets`
 *
 * @param {Array} productIds
 * @returns {Promise<Array>}
 * @private
 */
async function _productSets(productIds) {
  const productSets = await app.models.ProductSets.find({
    where: {
      isValid: 1,
      parentProductId: {
        inq: productIds,
      },
    },
    fields: {
      id: true,
      parentProductId: true,
      productId: true,
    },
  })

  return productSets.reduce((result, record) => {
    if (!result[record.parentProductId]) {
      result[record.parentProductId] = []
    }
    result[record.parentProductId].push(record.productId)
    return result
  }, {})
}

/**
 * Get account data
 *
 * @param {Array} salesIds
 * @param {number} userIds
 * @returns {Promise<Object>}
 * @private
 */
async function _accounts(salesIds, userId) {
  const fields = 'id,productId,salesId,accountCompany,accountNumber'
    const accounts = await app.models.WebAuthAccounts.find({
      where: {
        isValid: 1,
        salesId: {
          inq: salesIds,
        },
        userId,
      },
      fields: app.utils.query.fields(fields),
    })
  return accounts
    .filter(account => (account.accountCompany || account.accountNumber))
    .reduce((result, record) => {
      const idx = _indexByAccountRecord(record)
      if (!result[idx]) {
        result[idx] = []
      }
      result[idx].push({
        company: record.accountCompany,
        account: record.accountNumber,
      })
      return result
    }, {})
}

/**
 * Generate index using account object
 *
 * @param {Object} account
 * @returns {string}
 * @private
 */
function _indexByAccountRecord(account) {
  return account.salesId
  // return account.salesId + '_' + account.productId
}

/**
 * Generate index using sale object
 *
 * @param {Object} sale
 * @returns {string}
 * @private
 */
function _indexBySaleRecord(sale) {
  return sale.id
  // return sale.id + '_' + sale.productId
}

/**
 * Get max Updated date
 *
 * @param {Number} createdAt
 * @param {Array} relatedProductIds
 * @param {Array} versions
 * @returns {Number}
 * @private
 */
function _updateDate(createdAt, relatedProductIds, versions) {
  const updateDates = relatedProductIds.map(productId => {
    return (versions[productId] || {}).versionUpdatedAt || 0
  })
  updateDates.push(createdAt)
  return Math.max(...updateDates)
}

/**
 * Get sale infomation
 *
 * @param {Array} ids
 * @param {String} userId
 * @returns {Promise<Object>}
 * @private
 */
function _condition(userId) {
  const condition = saleCommonService.saleConditions(userId, false)
  condition.where.salesType = {
    inq: DEFAULT_SALE_TYPE,
  }
  condition.where.productId = {
    gte: 1,
  }
  condition.where.typeId = {
    inq: DOWNLOAD_PRODUCT_TYPE_IDS,
  }
  return condition.where || {}
}

/**
 * Get download product data
 *
 * @param {Array} productIds
 * @returns {Promise<Array>}
 * @private
 */
async function _downloadProducts(productIds) {
  return await app.models.Products.find({
    where: {
      isValid: {inq: [0, 1]},
      isDownload: 1,
      id: {
        inq: productIds,
      },
      typeId: {
        inq: DOWNLOAD_PRODUCT_TYPE_IDS,
      },
    },
    fields: {
      id: true,
      name: true,
      typeId: true,
      isSet: true,
      isSubscription: true,
      isWebAuthentication: true,
      createdAt: true,
    },
  })
}

/**
 * Download product object
 *
 * @param {Object} product
 * @param {Object} sale
 * @param {string || undefined} detailUrl
 * @param {number} updated
 * @param {Array} accounts
 * @return {Object}
 * @private
 */
function _object(product, detailUrl, sale, updated, accounts) {
  const accountData = accounts.reduce((result, account) => {
    result.company.push(account.company)
    result.account.push(account.account)
    return result
  }, {
    company: [],
    account: [],
  })

  return app.utils.object.filter({
    id: product.id,
    type: (product.typeId === 71) ? 70 : product.typeId,
    detailUrl,
    name: product.name,
    isMonitor: sale.isMonitor,
    salesId: sale.id,
    date: sale.payAt,
    update: updated,
    finished: sale.isFinished,
    subscription: product.isSubscription,
    company: _unique(accountData.company),
    account: _unique(accountData.account),
  })
}

/**
 * Unique & join array
 *
 * @param {Object} array
 * @return {Object}
 * @private
 */
function _unique(arr) {
  return arrayUtil.unique(arr).join('<br>')
}

/**
 * Get product, subproducts and version data
 *
 * @param {Object} sales
 * @return {Object}
 * @private
 */
async function _group(sales) {
  const products = await _downloadProducts(
      arrayUtil.unique(arrayUtil.column(sales, 'productId')),
    )
  const subProductObjects = await _subProducts(products)
  const productIds = arrayUtil.unique(
    Object.keys(subProductObjects).reduce((result, parentProductId) => {
        return result.concat(subProductObjects[parentProductId])
      }, arrayUtil.column(products, 'id'),
    ),
  )
  const [versions, urls] = await Promise.all([
      _versions(productIds),
      urlService.productDetailUrls(products),
    ])

  return {
    products,
    subProductObjects,
    versions,
    urls,
  }
}

/**
 * Get product, subproducts and version data
 *
 * @param {Object} sales
 * @return {Object}
 * @private
 */
async function _languageProducts(productIds, langType) {
  if (!LANGTYPE.includes(langType)) {
    return {}
  }
  const products = await productMultiLanguages.find({
    where: {
      languages: langType,
      productId: {
        inq: productIds,
      },
    },
    order: 'id ASC',
    fields: {
      productId: true,
      name: true,
    },
  })
  return arrayUtil.index((products || {}), 'productId')
}

/**
 * Get all purchased download products
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 * @public
 */
async function index(userId, langType) {
  const sales = await _sales(userId)

  if (sales.length == 0) {
    return []
  }
  // const getSpecialProduct = sales.findIndex(e => e.typeId == 1) > -1 && sales.findIndex(e => e.productId == SPECIAL_PRODUCTS) == -1
  
  const [
    accounts, 
    {
      products,
      subProductObjects,
      versions,
      urls,
    },
    languageProducts,
  ] = await Promise.all([
    _accounts(arrayUtil.column(sales, 'id'), userId),
    _group(sales),
    _languageProducts(arrayUtil.column(sales, 'productId'), langType),
  ])

  const productObjects = arrayUtil.index(products, 'id')

  return sales
    .filter(sale => {
      if (!productObjects[sale.productId]) {
        return false
      }
      const product = productObjects[sale.productId]
      return (product.isSubscription == 0 && sale.isFinished == 0) || sale.serviceEndAt > Date.now() / 1000
    })
    .map(sale => {
      const productId = sale.productId
      const product = productObjects[productId]
      const relatedProductIds = [productId].concat(subProductObjects[productId] || [])
      const update = _updateDate(product.createdAt, relatedProductIds, versions)
      product.name = (languageProducts[productId] || {}).name || product.name
      return _object(product, urls[productId], sale, update, accounts[_indexBySaleRecord(sale)] || [])
    })
  // if (getSpecialProduct) {
  //   res.unshift(SPECIAL_RECORD)
  // }
  // return res
}

module.exports = {
  index,
}
