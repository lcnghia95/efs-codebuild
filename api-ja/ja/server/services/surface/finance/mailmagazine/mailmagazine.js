const app = require('@server/server')

// Models
const salonModel = app.models.Salons
const mailmagazineModel = app.models.Mailmagazine
const favoriteProductsModel = app.models.FavoriteProducts
const salesCountModel = app.models.SalesCount
const productModel = app.models.Products

// Services
const userCommonService = require('@services/common/user')
const priceCommonService = require('@services/common/price')
const saleCommonService = require('@services/common/sale')
const productCommonService = require('@services/common/product')
const cartCommonService = require('@services/common/cart')
const {
  replace,
  orderBy,
} = require('lodash')

// Utils
const arrayUtil = require('@ggj/utils/utils/array')
const pagingUtil = app.utils.paging
const stringUtil = app.utils.string
const objectUtil = app.utils.object
const modelUtil = require('@server/utils/model')
const timeUtil = app.utils.time

const IGNORE_SALON_IDS = [3, 117, 129, 144, 153, 165, 218, 223, 234, 378, 381]
const IGNORE_PRODUCT_IDS = [7650, 8812, 9154, 8592, 10520, 8697, 10340, 8955, 14150, 14359, 11511]
const STR_PRODUCT_FIELDS = 'id,userId,name'
// month
const PERIOD = 3

/**
 * Get list of salon's mailmagazine
 *
 * @param {Number} userId
 * @param {Number} page
 * @param {number} sortType
 * @param {number} limit
 * @return {Array}
 * @public
 */
async function index(userId, page, sortType, limit = 20) {
  const products = await _getProductsDetails()
  const productIds = arrayUtil.column(products, 'id', true)
  let mailmagazines = []
  if (sortType == 1) {
    const sort = 'publishedAt DESC'
    const salons = await _salons(productIds)
    const salonIds = arrayUtil.column(salons, 'id', true)
    const conditions = _getMailmagazineConditions(sort, limit, page, null, salonIds)
    mailmagazines = await _getSalonMailmagazines(conditions, salons)
  } else if (sortType == 2) {
    mailmagazines = await _getMailmagazineBySale(page, productIds)
  }

  if (mailmagazines.length == 0) {
    return []
  }

  const [favorites, prices] = await Promise.all([
    _favorites(userId, productIds),
    priceCommonService.getPricesByProductIds(productIds),
  ])
  const sellers = await userCommonService.getUsers(
    arrayUtil.column(products, 'userId', true),
  )

  return _generateData(
    mailmagazines,
    products,
    prices,
    sellers,
    favorites,
  )
}


/**
 * get mailmagazine detail
 *
 * @param {number} mailmagazineId
 * @param {number} userId
 * @param {number} salonId
 * @return {object}
 * @public
 */
async function show(mailmagazineId, userId, salonId) {
  if (IGNORE_SALON_IDS.includes(salonId)) {
    return {}
  }

  const salon = await _salons(null, [salonId])
  const conditions = _getMailmagazineConditions(null, 1, 1, mailmagazineId, [salonId])
  const mailmagazine = (await _getSalonMailmagazines(conditions, salon))[0]

  if (!mailmagazine) {
    return {}
  }

  const productId = mailmagazine.productId
  const productDetails = await productCommonService.show(productId)

  if (!productDetails) {
    return {}
  }

  let [seller, isBuyed, next, previous, cartInfo, favorite] = await Promise.all([
    userCommonService.getUser(productDetails.userId),
    saleCommonService.isPurchased(userId, productId),
    _getMailmagazineRelate(mailmagazine, 'next'),
    _getMailmagazineRelate(mailmagazine, 'previous'),
    cartCommonService.show(productId, productDetails),
    _favorites(userId, [productId]),
  ])

  cartInfo = isBuyed ? null : cartInfo
  mailmagazine.content = isBuyed ? stringUtil.convertCrlfBr(mailmagazine.content) : _surfaceContent(mailmagazine.content, 150, true) + '...'

  return _object(
    mailmagazine,
    seller,
    next,
    previous,
    productDetails,
    cartInfo,
    productId,
    favorite,
  )
}


/**
 * get salons
 *
 * @param {Array} productIds
 * @param {array} salonIds
 *
 * @return {array}
 * @private
 */
async function _salons(productIds, salonIds = null) {
  return await salonModel.find({
    where: objectUtil.nullFilter({
      isValid: 1,
      productId: !productIds ? null : {
        inq: productIds,
      },
      id: !salonIds ? null : {
        inq: salonIds,
      },
      and: [{
        id: {
          nin: IGNORE_SALON_IDS,
        },
      }],
    }),
    fields: {
      id: true,
      productId: true,
    },
  })
}

/**
 * get favorites info
 *
 * @param {Number} userId
 * @param {Array} productIds
 * @return {Object}
 * @private
 */
async function _favorites(userId, productIds) {
  const favorites = await favoriteProductsModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    fields: {
      userId: true,
      productId: true,
    },
  })

  return favorites.reduce((result, item) => {
    if (!result[item.productId]) {
      result[item.productId] = {
        count: 0,
      }
    }
    if (item.userId == userId) {
      result[item.productId].isFavorited = true
    }
    result[item.productId].count++
    return result
  }, {})
}

/**
 * generate surface content
 *
 * @param {String} content
 * @param {Number} number
 * @param {boolean} convertFlag
 *
 * @return {String}
 * @private
 */
function _surfaceContent(content, number, convertFlag) {
  const subNumber = content.length / 2
  content = convertFlag ? stringUtil.convertCrlfBr(content) : content
  number = number > subNumber ? subNumber : number
  return content.slice(0, number)
}

/**
 * generate content of mailmagazine for index
 *
 * @param {String} content
 * @param {Number} number
 * @return {String}
 * @private
 */
function _indexContent(content, number) {
  const regExp = new RegExp('(\\r|\\n)')
  content = replace(content, regExp, '. ')
  return _surfaceContent(content, number, false) + '...'
}

/**
 * generate image Url
 *
 * @param {Object} mailmagazine
 * @return {String}
 * @private
 */
function _imgURL(mailmagazine) {
  const prefix = '/file/mailmagazine/' + mailmagazine.salonId + '/' + mailmagazine.id + '/'
  if (mailmagazine.imageFile1) {
    return prefix + mailmagazine.imageFile1
  } else if (mailmagazine.imageFile2) {
    return prefix + mailmagazine.imageFile2
  } else if (mailmagazine.imageFile3) {
    return prefix + mailmagazine.imageFile3
  } else {
    return null
  }
}

/**
 * generate Data
 *
 * @param {Array} mailmagazines
 * @param {Array} productDetails
 * @param {Array} prices
 * @param {Array} sellers
 * @param {Object} favorites
 * @return {Array}
 * @private
 */
function _generateData(mailmagazines, productDetails, prices, sellers, favorites) {
  prices = arrayUtil.index(prices, 'productId')
  productDetails = arrayUtil.index(productDetails, 'id')
  sellers = arrayUtil.index(sellers, 'id')

  return mailmagazines.reduce((acc, mailmagazine) => {
    const productId = mailmagazine.productId
    const favorite = favorites[productId] || []
    const obj = objectUtil.nullFilter({
      id: mailmagazine.id,
      salonId: mailmagazine.salonId,
      publishedAt: mailmagazine.publishedAt,
      title: mailmagazine.title,
      content: mailmagazine.contentType == 2 ?
        '' : _indexContent(mailmagazine.content, 150),
      // TODO: correct imageURl
      imageUrl: _imgURL(mailmagazine),
      price: prices[productId] ? prices[productId].price : 0,
      seller: sellers[productDetails[productId].userId],
      name: productDetails[productId].name,
      stars: favorite.count || 0,
      isFavorited: favorite.isFavorited,
      productId,
    })
    acc.push(obj)

    return acc
  }, [])
}

async function _getProductsDetails() {
  return await productModel.find({
    where: {
      isValid: 1,
      statusType: 1,
      typeId: 4,
      id: {
        nin: IGNORE_PRODUCT_IDS,
      },
    },
    fields: app.utils.query.fields(STR_PRODUCT_FIELDS),
  })
}

/**
 * get find mailmagazine Conditions
 *
 * @param {string} order
 * @param {number} limit
 * @param {number} page
 * @param {number} mailmagazineId
 * @param {number} salonId
 *
 * @return {object}
 * @private
 */
function _getMailmagazineConditions(order, limit, page, mailmagazineId, salonIds) {
  const pagingInfo = pagingUtil.getOffsetCondition(page, limit)
  const time = Date.now()
  return {
    where: objectUtil.nullFilter({
      id: mailmagazineId,
      isValid: 1,
      statusType: 2,
      salonId: {
        inq: salonIds,
      },
      and: [{
        or: [{
          isReservedStart: 1,
          reserveStartAt: {
            lte: time,
          },
        }, {
          isReservedStart: 0,
          publishedAt: {
            lte: time,
          },
        }],
      }],
    }),
    order,
    fields: {
      id: true,
      salonId: true,
      title: true,
      content: true,
      contentType: true,
      imageFile1: true,
      imageFile2: true,
      imageFile3: true,
      publishedAt: true,
      backNumber: true,
    },
    limit: pagingInfo.limit,
    skip: pagingInfo.skip,
  }
}

/**
 * get mailmagazine
 *
 * @param {object} conditions
 * @return {array}
 * @private
 */
async function _getSalonMailmagazines(conditions, salons = null) {
  if (salons.length == 0) {
    return []
  }

  const mailmagazines = await mailmagazineModel.find(conditions)
  const salonsIndex = arrayUtil.index(salons, 'id')

  if (mailmagazines.length == 0) {
    return []
  }

  // add product id
  return mailmagazines.reduce((acc, mailmagazine) => {
    if (salonsIndex[mailmagazine.salonId]) {
      mailmagazine.productId = salonsIndex[mailmagazine.salonId].productId
      acc.push(mailmagazine)
    }
    return acc
  }, [])
}

/**
 * generate object to response for detail
 *
 * @param {object} mailmagazine
 * @param {object} seller
 * @param {object} next
 * @param {object} previous
 * @param {object} productDetails
 * @param {object} cartInfo
 * @param {object} favorites
 *
 * @returns {object}
 * @private
 */
function _object(mailmagazine, seller, next, previous, productDetails, cartInfo, productId, favorites) {
  const category = ((productDetails.categories || '').split(',')).sort((a, b) => a - b)[0] || ''
  cartInfo = !cartInfo ? null : {
    productId: cartInfo.productId,
    price: cartInfo.price,
    name: cartInfo.name,
    category,
    devId: seller.id,
    type: 4,
  }
  const favorite = favorites[productId] || {}
  return objectUtil.nullFilter({
    id: mailmagazine.id,
    salonId: mailmagazine.salonId,
    name: productDetails.productName,
    category,
    publishedAt: mailmagazine.publishedAt,
    title: mailmagazine.title,
    content: stringUtil.externalLink(mailmagazine.content),
    imageUrl: _imgURL(mailmagazine),
    seller,
    previous,
    next,
    cartInfo,
    productId,
    stars: favorite.count || 0,
    isFavorited: favorite.isFavorited || false,
  })
}

/**
 * Get next, previous mailmagazine
 *
 * @param {object}  mailmagazine
 * @param {string} flag
 *
 * @returns {object}
 * @private
 */
async function _getMailmagazineRelate(mailmagazine, flag) {
  return await mailmagazineModel.findOne({
    where: {
      isValid: 1,
      statusType: 2,
      salonId: mailmagazine.salonId,
      id: {
        neq: mailmagazine.id,
      },
      and: _getAndCondition(mailmagazine, flag),
    },
    order: 'publishedAt DESC',
    fields: {
      id: true,
      publishedAt: true,
      title: true,
    },
  })
}

/**
 * Get and conditions when find relate mailmagazine
 *
 * @param {object}  mailmagazine
 * @param {string} flag
 *
 * @returns {array}
 * @private
 */
function _getAndCondition(mailmagazine, flag) {
  const sub = {
    next: 'gte',
    previous: 'lte',
  }

  return [{
    publishedAt: {
      [sub[flag]]: mailmagazine.publishedAt * 1000,
    },
  }, {
    backNumber: {
      [sub[flag]]: mailmagazine.backNumber,
    },
  }]
}

/**
 * Get sales Count
 *
 * @param {array}  productIds
 *
 * @returns {array}
 * @private
 */
async function _getSalesCount(productIds) {
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

  return salesCount
}

/**
 * Get salon with sales count info
 *
 * @param {Number}  page
 * @param {array} productIds
 *
 * @returns {array}
 * @private
 */
async function _getSalonsBySalesCount(page, productIds) {
  let [salons, salesCount] = await Promise.all([
    _salons(productIds, null),
    _getSalesCount(productIds),
  ])

  salesCount = arrayUtil.index(salesCount, 'productId')
  const listSalons = salons.map(salon => {
    return {
      id: salon.id,
      salesCount: salesCount[salon.productId] ? salesCount[salon.productId].salesCount : 0,
      productId: salon.productId,
    }
  })

  return orderBy(listSalons, 'salesCount', 'desc')
}

/**
 * Get lastest mailmagazine by salonId
 *
 * @param {number}  salonIds
 *
 * @returns {array}
 * @private
 */
async function _getMailmagazineBySalonIds(salonIds) {
  const time = new Date()
  const timeSql = timeUtil.sqlDate(time)
    // get from last [PERIOD] month
  const getFromSql = timeUtil.sqlDate(time.setMonth(time.getMonth() - PERIOD))
  const sql = `SELECT m2.id, m2.salon_id as salonId, m2.title, m2.content, m2.content_type as contentType,
    m2.image_file1 as imageFile1, m2.image_file2 as imageFile2, m2.image_file3 as imageFile3,
    m2.published_at as publishedAt, m2.back_number as backNumber
  FROM (
    SELECT salon_id, max(published_at) as published_at
    FROM mailmagazine m
    WHERE m.salon_id in (${salonIds.toString()}) AND m.is_valid = 1
      AND m.status_type = 2 AND published_at >= '${getFromSql}'
      AND ((m.is_reserved_start = 1 and m.reserve_start_at <= '${timeSql}')
        OR (m.is_reserved_start = 0 and m.published_at <= '${timeSql}' ))
    GROUP BY m.salon_id
  ) as m1
    JOIN mailmagazine m2 ON m1.salon_id = m2.salon_id AND m1.published_at = m2.published_at`

  return await modelUtil.excuteQuery('salons', sql)
}

/**
 * Get mailmagazine sort by sale count
 *
 * @param {number}  page
 * @param {array} productIds
 *
 * @returns {array}
 * @private
 */
async function _getMailmagazineBySale(page, productIds) {
  let salons = await _getSalonsBySalesCount(page, productIds)

  if (salons.length == 0) {
    return []
  }

  const offset = pagingUtil.getOffsetCondition(page)
  const salonIds = arrayUtil.column(salons, 'id')
  const salonsIndex = arrayUtil.index(salons, 'id')
  
  let mailmagazines = await _getMailmagazineBySalonIds(salonIds)

  // add productId
  mailmagazines = mailmagazines.map(mailmagazine => {
    if (salonsIndex[mailmagazine.salonId]) {
      mailmagazine.productId = salonsIndex[mailmagazine.salonId].productId
      return mailmagazine
    }
  })

  mailmagazines = arrayUtil.index(mailmagazines, 'salonId')

  // sort mailmagazine by salonsPrice
  salons = salons.reduce((acc, salon) => {
    if (mailmagazines[salon.id]) {
      mailmagazines[salon.id].publishedAt = timeUtil.toUnix(mailmagazines[salon.id].publishedAt)
      acc.push(mailmagazines[salon.id])
    }
    return acc
  }, [])

  return salons.slice(offset.skip, page * offset.limit)
}

module.exports = {
  index,
  show,
}
