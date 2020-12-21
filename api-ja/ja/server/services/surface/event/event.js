const app = require('@server/server')
const commonFavorite = require('@services/common/favorite')

const getDay = require('date-fns/get_day')
const getDayOfYear = require('date-fns/get_day_of_year')

// models
const eventModel = app.models.Events
const favoriteProductModel = app.models.FavoriteProducts
const productModel = app.models.Products

// utils
const timeUtil = app.utils.time
const metaUtil = app.utils.meta
const queryUtil = app.utils.query
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object
const stringUtil = app.utils.string
const pagingUtil = app.utils.paging

/**
 * Get data for event index page
 *
 * @param input
 * @return {Promise<Object>}
 */
async function index(input) {
  const keywords = stringUtil.getKeywords(input.keywords || '')
  const page = parseInt(input.page || 1)
  const from = parseInt(input.from || 0) * 1000
  const to = parseInt(input.to || 0) * 1000
  const categories = (input.categories || '')
  const limit = input.limit || 20
  const offset = pagingUtil.getOffsetCondition(page, limit)
  const l = parseInt(input.lAreaId)
  const m = parseInt(input.mAreaId)
  const where = objectUtil.deepFilter({
    statusType: {
      inq: [1, 2],
    },
    and: [{
      or: [{
        or: !keywords ? null : keywords.split('|').map(keyword => {
          return {
            title: {
              like: '%' + keyword + '%',
            },
          }
        }),
      },
      {
        or: !keywords ? null : keywords.split('|').map(keyword => {
          return {
            outline: {
              like: '%' + keyword + '%',
            },
          }
        }),
      },
      ],
    },
    {
      eventAt: {
        gte: from,
      },
    },
    {
      eventAt: {
        lte: to,
      },
    },
    categories == 'null' ? null : queryUtil.commaKey(categories, 'categoryIds'),
    ],
    endAt: from ? null : {
      gte: to || Date.now(),
    }, // TODO check logic
  })
  l && (where.largeAreaId = l)
  m && (where.mediumAreaId = m)
  const [total, events, checkArea] = await Promise.all([
    eventModel.count(where),
    _events(where, offset, limit),
    _checkArea(input || {}),
  ])
  if (!checkArea) {
    return {}
  }
  const pIds = arrayUtil.column(events, 'productId')
  const [favorites, products] = await Promise.all([
    _favorites(pIds, input),
    _products(pIds),
  ])
  // Paging response
  return pagingUtil.addPagingInformation(
    _objects(events, products, favorites),
    page,
    total,
    limit,
  )
}

/**
 * Get event detail data
 *
 * @param id
 * @param input
 * @return {Promise<Object>}
 */
async function show(id, input) {
  const event = await eventModel.findOne({
    where: {
      id: id,
    },
  })
  const pId = !event ? 0 : event.productId
  const [product, isFavorite] = !pId ? [null, false] : await Promise.all([
    productModel.findOne({
      where: {
        id: pId,
        statusType: {
          inq: [1, 2, 9],
        },
      },
      fields: {
        id: true,
        isLimited: true,
        upperLimit: true,
        statusType: true,
        userId: true,
      },
    }),
    commonFavorite.isFavorite(pId, await metaUtil.asyncUserId(app, input.requestId)),
  ])

  if (!event || !product) {
    return {}
  }

  // Get response object
  return Object.assign(_object(event, product.statusType), {
    limit: product.upperLimit,
    like: isFavorite ? 1 : 0,
    devId: product.userId,
  })
}

/**
 * Count area id of all events
 *
 * @return {Promise<Object>}
 */
async function counts() {
  const events = await eventModel.find({
    where: {
      endAt: {
        gte: Date.now(),
      },
      statusType: {
        inq: [1, 2],
      },
    },
    fields: {
      id: true,
      mediumAreaId: true,
    },
    order: 'mediumAreaId ASC',
  })
  return events.reduce((obj, event) => {
    if (!obj[event.mediumAreaId]) {
      obj[event.mediumAreaId] = 0
    }
    obj[event.mediumAreaId] += 1
    return obj
  }, {})
}

/**
 * Get favorites product base on given product ids
 *
 * @param {Array} productIds
 * @param {Object} input
 * @returns {Promise<Object>}
 * @private
 */
async function _favorites(productIds, input) {
  const userId = await metaUtil.asyncUserId(app, input.requestId)
  if (userId === 0) {
    return {}
  }

  return arrayUtil.index(await favoriteProductModel.find({
    where: {
      userId,
      productId: {
        inq: productIds,
      },
    },
    fields: {
      productId: true,
    },
    order: 'id DESC',
  }), 'productId')
}

/**
 * Get all products base on given product ids
 *
 * @param {Array} productIds
 * @returns {Promise<Object>}
 * @private
 */
async function _products(productIds) {
  return arrayUtil.index(await productModel.find({
    where: {
      id: {
        inq: productIds,
      },
      statusType: {
        inq: [1, 2],
      },
    },
    fields: {
      id: true,
      isLimited: true,
      upperLimit: true,
    },
  }))
}

/**
 * Get all events of given offset (paging)
 *
 * @param {Object} where
 * @param {Object} offset
 * @returns {Promise<Array>}
 * @private
 */
async function _events(where, offset, limit = 20) {
  return await eventModel.find({
    where,
    fields: queryUtil.fields(
      'id,price,eventAt,endAt,categoryIds,title' +
      ',outline,location,productId,statusType',
    ),
    order: 'eventAt ASC',
    skip: offset.skip,
    limit,
  })
}

/**
 * Get response for all events
 *
 * @param events
 * @param products
 * @param favorites
 * @private
 */
function _objects(events, products, favorites) {
  return events.reduce((arr, event) => {
    const pId = event.productId
    const product = products[pId]
    const obj = !product ?
      null :
      Object.assign(_object(event), objectUtil.nullFilter({
        limit: !product.isLimited ? null : product.upperLimit || 0,
        like: !favorites[pId] ? null : 1,
      }))
    obj && arr.push(obj)
    return arr
  }, [])
}

/**
 * Get response object for given event record
 *
 * @param {Object} event
 * @return {Object}
 * @private
 */
function _object(event, statusType = 0) {
  const from = event.eventAt
  const to = event.endAt

  return objectUtil.filter({
    id: event.id,
    title: event.title,
    status: statusType || event.statusType,
    date: _date(from, to),
    categories: event.categoryIds.split(',').map(cat => parseInt(cat)),
    price: event.price,
    times: event.times,
    outline: stringUtil.externalLink(stringUtil.convertCrlfBr(event.outline)),
    content: stringUtil.externalLink(stringUtil.convertCrlfBr(event.content)),
    location: stringUtil.convertCrlfBr(event.location),
    pId: event.productId,
  })
}

/**
 * Get date string of given date
 *
 * @param from
 * @param to
 * @return {String}
 * @private
 */
function _date(from, to) {
  if (from > to) {
    return ''
  }
  let res = _jpDate(from)
  if (getDayOfYear(to) - getDayOfYear(from) > 0) {
    res += ' &#65374; '
    res += _jpDate(to)
  }
  return res
}

/**
 * Get Japanese date string
 *
 * @param {Number} time
 * @return {String}
 * @private
 */
function _jpDate(time) {
  const arr = [
    '',
    '&#26376;',
    '&#28779;',
    '&#27700;',
    '&#26408;',
    '&#37329;',
    '&#22303;',
    '&#26085;',
  ]

  return timeUtil.jDate(time * 1000) + ' (' + (arr[getDay(time * 1000)] || '&#26085;') + ') '
}

/**
 * check area is valid
 *
 * @param {Object} input
 * @return {Boolean}
 * @private
 */
async function _checkArea(input) {
  const where = {}
  const l = parseInt(input.lAreaId)
  const m = parseInt(input.mAreaId)
  if (isNaN(l) && isNaN(m)) {
    return true
  }
  where.largeAreaId = l
  !isNaN(m) && (where.id = m)

  const record = await app.models.MediumAreas.findOne({ where, fields: { id: true } })
  return !!record
}

module.exports = {
  index,
  show,
  counts,
}
