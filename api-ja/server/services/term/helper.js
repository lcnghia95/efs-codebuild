const app = require('@server/server')

// Common
const commonSale = require('@services/common/sale')
const commonUser = require('@services/common/user')
const commonProduct = require('@services/common/product')
const {productDetailUrls} = require('@@services/common/productUrl')

// models
const termModel = app.models.Terms
const transactionModel = app.models.Transaction
const saleModel = app.models.Sales
const conclusionBeforeModel = app.models.ConclusionBefore
const conclusionModel = app.models.Conclusion

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const pagingUtil = require('@ggj/utils/utils/paging')
const timeUtil = require('@ggj/utils/utils/time')
const queryUtil = require('@ggj/utils/utils/query')


/**
 * Get term data
 *
 * @param {Array} typeIds
 * @param {Object} fields
 * @param {Number} language
 * @returns {Array}
 * @public
 */
async function getTermsData(typeIds, fields = {}, language = 1) {
  const res = await _data(typeIds, fields, language)

  return res.length == 0 ? [] : res.map(item => _object(item))
}

/**
 * Get term transaction
 *
 * @param {Number} userId
 * @returns {Array}
 * @public
 */
async function transaction(userId) {
  const data = await transactionModel.findOne({
    where: {
      isValid: 1,
      userId: userId,
    },
    order: 'id DESC',
    fields: {
      content: true,
    },
  })

  return !data ? [] : [data]
}

/**
 * get user terms
 *
 * @param {Number} userServiceType
 * @param {Number} language
 * return {string}
 *
 * @public
 */
async function user(userServiceType, language = 1) {
  const data = await termModel.findOne({
    where: {
      isValid: 1,
      serviceType: userServiceType,
      languages: language,
    },
    fields: {
      content: true,
    },
  }) || {}

  return data.content || ''
}

/**
 * Get term contract index
 *
 * @param {Number} userId
 * @param {Object} input
 * @param {Number} limit: maximum response record
 * @returns {Array}
 * @public
 */
async function index(userId, input, limit = 30) {
  const page = input.page || 1
  const fields = 'id,productId,payAt,conclusionId,conclusionBeforeId'
  const conditions = _getSaleConditions(userId, page, fields)

  let [sales, total] = await Promise.all([
    saleModel.find(conditions),
    saleModel.count(conditions.where),
  ])

  sales = sales.filter(sale => {
    return sale.conclusionId + sale.conclusionBeforeId != 0
  })

  if (!sales || sales.length === 0) {
    return []
  }

  const productIds = arrayUtil.column(sales, 'productId')
  const products = await commonProduct.products(productIds, 'id,name,typeId')
  const productUrls = await productDetailUrls(products)
  const productName = commonProduct.name(products)
  const data = sales.filter(sale => {
    return productName[sale.productId]
  }).map(record => {
    return _contractObject(record, productName, productUrls[record.productId])
  })

  return pagingUtil.addPagingInformation(data, page, total, limit)
}

/**
 * Get term contract detail
 *
 * @param {Number} userId
 * @param {Number} id
 * @param {Number} saleId
 * @param {Object} input
 * @param {Number} period
 * @returns {Object}
 * @public
 */
async function contract(uId, id, saleId, input, period) {
  if (!uId || !id || !saleId) {
    return {}
  }

  const saleFields = 'id,userId,developerUserId,price,chargeType,serviceStartAt,serviceEndAt,payAt,expensePrice'
  const isBefore = input.isBefore || 0
  const conditions = _getContractDetailConditions(uId, id, saleId, saleFields, isBefore)
  const sales = await saleModel.findOne(conditions)

  if (!sales) {
    return {}
  }

  const [users, conclusion] = await Promise.all([
    commonUser.getUsers(
      [sales.developerUserId, sales.userId], {
        id: true,
        firstName: true,
        lastName: true,
        zip: true,
        address1: true,
        address2: true,
        address3: true,
        prefectureId: true,
      },
    ),
     _getContentDataForTermDetail(isBefore, id),
  ])

  const userIndex = arrayUtil.index(users, 'id')
  const buyer = userIndex[sales.userId]
  const seller = userIndex[sales.developerUserId]
  const term = Math.ceil((sales.serviceEndAt - sales.serviceStartAt) / period) + '&#12534;&#26376;'
  const prefectures = await _getPrefectures(buyer.prefectureId || 0)
  const data = {
    PostalCode: buyer.zip,
    postal_code: buyer.zip,
    Region1: (!prefectures ? '' : prefectures.name) + buyer.address1,
    Region2: buyer.address2,
    Region3: buyer.address3,
    buy_last_name: buyer.lastName,
    buyename: buyer.lastName,
    buyfname: buyer.firstName,
    buy_first_name: buyer.firstName,
    dev_last_name: seller.lastName,
    dev_first_name: seller.firstName,
    devename: seller.lastName,
    devfname: seller.firstName,
    price: sales.price - sales.expensePrice,
    term: term,
    dday: timeUtil.jDate(sales.payAt * 1000),
    dday2: timeUtil.jDate(sales.serviceStartAt * 1000),
    dday3: timeUtil.jDate(sales.serviceEndAt * 1000),
    Region4: '',
  }
  const content = !conclusion ? '' : conclusion.content

  return {
    content: _replaceKeyData(content, data),
  }
}

/**
 * Replace all key data
 *
 * @param {String} content
 * @param {Object} data
 * @returns {String}
 * @private
 */
function _replaceKeyData(content, data) {
  Object.keys(data).map(record => {
    const key = '#' + record + '#'
    content = content.split(key).join(data[record])
  })
  return content || ''
}

/**
 * Get prefectures data
 *
 * @param {Number} id
 * @returns {Object || null}
 * @private
 */
async function _getPrefectures(id) {
  return await app.models.Prefectures.findOne({
    where: {
      isValid: 1,
      id: id,
    },
    fields: {
      id: true,
      name: true,
    },
  })
}

/**
 * Get term crowdsourcing detail
 *
 * @param {Number} isBefore
 * @param {Number} id
 * @returns {Object || null}
 * @private
 */
async function _getContentDataForTermDetail(isBefore, id) {
  const apiModel = isBefore > 0 ? conclusionBeforeModel : conclusionModel
  return await apiModel.findOne({
    where: {
      isValid: 1,
      id: id,
    },
    fields: {
      id: true,
      content: true,
    },
  })
}

/**
 * Get conditions for contract detail
 *
 * @param {Number} userId
 * @param {Number} id
 * @param {Number} saleId
 * @param {String} fields
 * @param {Number} isBefore
 * @returns {Object}
 * @private
 */
function _getContractDetailConditions(uId, id, saleId, fields, isBefore) {
  const conditions = _getSaleConditions(uId, 1, fields)

  if (!isBefore) {
    conditions.where.conclusionId = id
  } else {
    conditions.where.conclusionBeforeId = id
  }

  conditions.where.id = saleId
  delete conditions.skip

  return conditions
}

/**
 * Generate contract object
 *
 * @param {Object} sale
 * @param {Object} productName
 * @returns {Object}
 * @private
 */
function _contractObject(sale, productName, detailUrl) {
  return {
    id: sale.id,
    name: productName[sale.productId],
    payDate: sale.payAt,
    conclusionId: sale.conclusionId,
    conclusionBeforeId: sale.conclusionBeforeId,
    detailUrl,
  }
}

/**
 * Generate sale conditions
 *
 * @param {Number} userId
 * @param {Number} page
 * @param {String} fields
 * @param {Number} limit
 * @returns {Array}
 * @private
 */
function _getSaleConditions(userId, page, fields, limit) {
  const conditions = commonSale.saleConditions(userId, false, true)
  const offset = pagingUtil.getOffsetCondition(page, limit)

  conditions.where = Object.assign(conditions.where, {
    userId: !userId ? 0 : userId,
    isMonitor: 0,
    conclusionId: {
      gt: 0,
    },
    conclusionBeforeId: {
      gt: 0,
    },
    price: {
      gt: 0,
    },
    offsetId: null,
    isRepayment: null,
  })

  conditions.limit = limit
  conditions.skip = offset.skip
  conditions.fields = queryUtil.fields(fields)

  delete conditions.where.offsetId
  delete conditions.where.isRepayment

  return conditions
}

/**
 * Get term data
 *
 * @param {Array} types
 * @param {Object} fields
 * @param {Number} language
 * @returns {Array}
 * @private
 */
async function _data(types, fields = {}, language = 1) {
  let data = await termModel.find({
    where: {
      isValid: 1,
      serviceType: {
        inq: types,
      },
      languages: language,
    },
    order: 'id DESC',
    fields: Object.assign({
      id: true,
      title: true,
      content: true,
      serviceType: true,
    }, fields),
  })
  data = arrayUtil.index(data, 'serviceType')
  return types.reduce((result, type) => {
    if (data[type]) {
      result.push(data[type])
    }
    return result
  }, [])
}

/**
 * Generate terms response data
 *
 * @param {Object} item
 * @returns {Object}
 * @private
 */
function _object(item) {
  item = item.toJSON()
  if (item.publishedAt) {
    item.published_at = item.publishedAt
    delete item.publishedAt
  }
  return item
}


module.exports = {
  getTermsData,
  transaction,
  user,
  index,
  contract,
}
