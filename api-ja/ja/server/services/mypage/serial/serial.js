const app = require('@server/server')

// models
const serialModel = app.models.ProductSerialKeys
const productModel = app.models.Products

// utils
const paging = app.utils.paging
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object
const queryUtil = app.utils.query
const timeUtil = app.utils.time

const sortMap = {
  0 : 'productId DESC',
  1 : 'productId ASC',
  2 : null, // product name DESC
  3 : null, // product name ASC
  4 : 'salesId DESC',
  5 : 'salesId ASC',
  6 : 'serialKey DESC',
  7 : 'serialKey ASC',
  8 : 'isCommon DESC',
  9 : 'isCommon ASC',
  10 : 'statusType DESC',
  11 : 'statusType ASC',
  12 : 'deliveredAt DESC',
  13 : 'deliveredAt ASC',
}

/**
 * Get serial data for user
 * @param {Object} input
 * @param {Number} uId
 * @returns {Promise<Object>}
 * @public
 */
async function index(input, meta) {
  const uId = parseInt(meta.userId) || 0
  if (!uId) {
    return []
  }

  const limit = input.limit || 50
    const page = input.page || 1
    const sortType = input.sortType || 1
    const fields = 'id,statusType,isCommon,productId,serialKey,salesId,deliveredAt'

    // otherwise, map product with serial
    const products = await _filterProduct(uId, input.keywords || '')

    const productIdx = arrayUtil.index(products, 'id')
    const where = {
      productId: {inq: Object.keys(productIdx)},
    }

    const [total, serials] = await Promise.all([
      serialModel.count(where),
      _serialFind(where, fields, page, limit, _getSortCondition(sortType)),
    ])

    let data = serials.reduce((arr, serial) => {
    const product = productIdx[serial.productId] || {}
      arr.push(_object(serial, product))
      return arr
    }, []) || []

  // sort by product name
  if (sortType == 2 || sortType == 3) {
    const skip = limit * (page - 1)
    const correctLimit = skip + limit
    data = data.sort((a, b) => {
      if (sortType == 2) {
        return a.product.name > b.product.name ? -1 : 1
      }
      return a.product.name > b.product.name ? 1 : -1
    }).slice(skip, correctLimit)
  }

  return paging.addPagingInformation(
    data,
    page,
    total,
    limit,
  )
}

/**
 * Filter product by keywords
 * @param {Number} uId
 * @param {String} keywords
 * @returns {Promise<Array>}
 * @private
 */
async function _filterProduct(uId, keyword) {
  const keywords = keyword.split(' ')
  const like = keywords.reduce((arr, key) => {
      if (key) {
        if (!isNaN(key)) {
          arr.push({id: {like: `%${key}%`}})
        } else {
          arr.push({name: {like: `%${key}%`}})
        }
      }
      return arr
    }, [])
  let where = {
      userId: uId,
    }

  if (like.length > 1) {
    where.or = like
  } else if(like.length == 1) {
    where = Object.assign(where, like[0])
  }

  return await productModel.find({
    where,
    fields: {id: true, name: true},
  }) || []
}

/**
 * Get serial data with paging
 * @param {Object} where
 * @param {String} fields
 * @param {Number} page
 * @param {Number} limit
 * @param {String} order
 * @returns {Promise<Object>}
 * @private
 */
async function _serialFind(where, fields, page, limit, order) {
  // Get all and then sort later
  if (order === null) {
    limit = 0
  }

  const offset = paging.getOffsetCondition(page, limit)
  return await serialModel.find(objectUtil.nullFilter({
    where,
    order,
    limit: offset.limit,
    skip: offset.skip,
    fields: queryUtil.fields(fields),
  }))
}

/**
 * Combine data of serial and product
 * @param {Object} serial
 * @param {Object} product
 * @returns {Object}
 * @private
 */
function _object(serial, product) {
  return objectUtil.nullFilter({
    id: serial.id,
    product: {
      id: product.id,
      name: product.name,
    },
    serialKey: serial.serialKey,
    isCommon: serial.isCommon,
    deliverDate: timeUtil.toUnix(serial.deliveredAt),
    statusType: !serial.isCommon && serial.deliveredAt,
    salesId: serial.salesId,
  })
}

/**
 * get sort condition correctly
 * @param {Number} sortType
 * @returns {String}
 * @private
 */
function _getSortCondition(sortType) {
  if (sortType in sortMap) {
    return sortMap[sortType]
  }
  // product Id ASC by default
  return sortMap[1]
}


module.exports = {
  index,
}
