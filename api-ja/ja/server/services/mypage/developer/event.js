const app = require('@server/server')
const productService = require('./product')
const syncService = require('@services/common/synchronize')

// models
const eventModel = app.models.Events
const productModel = app.models.Products
const fileModel = app.models.Files
const outlineModel = app.models.ProductOutlines
const imageModels = app.models.Images
const priceModel = app.models.ProductPrices

// utils
const paging = app.utils.paging
const arrayUtil = require('@ggj/utils/utils/array')
const objUtil = app.utils.object

const PRODUCT_TYPEID_EVENT = 19
const PRODUCT_IMAGES = 4

/**
 * Paging information by request
 *
 * @param {number} userId
 * @param {object} input
 * @returns {object}
 * @public
 */
async function index(userId, opt = {}) {
  if (userId < 1) {
    return {}
  }

  const productIds = await _productEventIds(userId)
  if (!productIds.length) {
    return {}
  }

  const offset = paging.getOffsetCondition(opt.page, opt.limit)
  let [events, total] = await Promise.all([
      _getEventsByProductIds(productIds, offset),
      eventModel.count({
        isValid: 1,
        productId: {
          inq: productIds,
        },
      }),
    ])
  if (!total || !events.length) {
    return {}
  }

  events = events.map(event => _buildEventData(event))
  return paging.addPagingInformation(events, opt.page, total, opt.limit)
}

/**
 * Show event information by eventId
 *
 * @param {number} userId
 * @param {number} eventId
 * @returns {object}
 * @public
 */
async function show(userId, eventId) {
  if (eventId < 1 || userId < 1) {
    return {}
  }

  const event = await eventModel.findOne({
    where: {
      id: eventId,
      isValid: 1,
    },
  })
  if (!event) {
    return {}
  }

  const product = await productModel.findOne({
    where: {
      id: event.productId,
      isValid: 1,
      userId: userId,
    },
    fields: {
      id: true,
      affiliateMargin: true,
      isLimited: true,
      upperLimit: true,
      isDownload: true,
    },
  })
  if (!product) {
    return {}
  }

  const [fileName, outline] = await Promise.all([
    _getFileNameByProductId(product),
    _getOutlineByProductId(product.id),
  ])

  return await _buildEvent(event, product, outline, product.isLimited, fileName)
}

/**
 * Create event by userId and request
 *
 * @param {number} eventId
 * @param {object} input
 * @returns {object}
 * @public
 */
async function create(input, meta) {
  if (meta.userId < 1) {
    return {}
  }

  const product = await _createProduct(input, meta)
  if (!product) {
    return {}
  }
  input.productId = product.id

  const [event, productPrice] = await Promise.all([
    _createEvent(input),
    _pushPrice(product, input.price, meta),
    _pushOutline(product.id, input.pr || '', input.content || '', meta),
  ])

  if (!event) {
    return {}
  }

  product.productPriceId = productPrice.id
  await product.save()

  return {
    id: event.id,
    productId: event.productId,
  }
}

/**
 * Update event by eventId, userId and request
 *
 * @param {number} eventId
 * @param {number} userId
 * @param {object} input
 * @returns {object}
 * @public
 */
async function update(eventId, input, meta) {
  if (meta.userId < 1 || eventId < 1) {
    return {}
  }

  input.id = eventId
  const event = await eventModel.findOne({
    where: {
      id: input.id,
      isValid: 1,
    },
    fields: {
      id: true,
      productId: true,
    },
  })

  if (!event || !event.productId) {
    return {}
  }
  input.productId = event.productId

  let product = await productModel.findOne({
    where: {
      id: event.productId,
      isValid: 1,
      typeId: PRODUCT_TYPEID_EVENT,
      userId: meta.userId,
    },
    fields: {
      id: true,
    },
  })

  if (!product) {
    return {}
  }

  product = _buildProductData(product, input, meta)
  await product.save()

  input.productId = product.id
  await Promise.all([
    _putEvent(event, input),
    _pushOutline(product.id, input.pr || '', input.content || '', meta),
  ])

  return {
    productId: event.productId,
  }
}

/**
 * Get productEventIds from userId
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 * @private
 */
async function _productEventIds(userId) {
  const products = await productModel.find({
    where: {
      userId: userId,
      isValid: 1,
      typeId: PRODUCT_TYPEID_EVENT,
    },
    fields: {
      id: true,
    },
    order: 'id DESC',
  })

  return products.map(x => x.id)
}

/**
 * Get events from userId
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 * @private
 */
async function _getEventsByProductIds(productIds, offset = {}) {
  return await eventModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: productIds,
      },
    },
    limit: offset.limit,
    skip: offset.skip,
    fields: {
      id: true,
      statusType: true,
      title: true,
      price: true,
    },
    order: 'id DESC',
  })
}

/**
 * Get fileName by productId
 *
 * @param {number} productId
 * @returns {Promise}
 * @private
 */
async function _getFileNameByProductId(product) {
  if (product.isDownload == 1) {
    return await fileModel.findOne({
      where: {
        masterId: product.id,
        isValid: 1,
      },
      fields: {
        fileName: true,
      },
      order: 'id DESC',
    }) || {}
  }
}

/**
 * Get outLines by productId
 *
 * @param {number} productId
 * @returns {Promise}
 * @private
 */
async function _getOutlineByProductId(productId) {
  return await outlineModel.findOne({
    where: {
      isValid: 1,
      statusType: 1,
      productId: productId,
    },
    fields: {
      id: true,
      promotion: true,
    },
    order: 'id DESC',
  }) || {}
}

/**
 * Get images by masterId
 *
 * @param {number} productId
 * @returns {Promise<Array>}
 * @private
 */
async function _getImagesByProductId(masterId) {
  const images = await imageModels.find({
    where: {
      isValid: 1,
      imageCategoryId: PRODUCT_IMAGES,
      masterId: masterId,
    },
    fields: {
      imageNumber: true,
    },
  }) || []
  return arrayUtil.column(images, 'imageNumber')
}

/**
 * Push price by product and price
 *
 * @param {number} product
 * @param {number} price
 * @returns {Promise}
 * @private
 */
async function _pushPrice(product, price, meta) {
  let productPrice = await priceModel.findOne({
      where: {
        isValid: 1,
        statusType: 1,
        productId: product.id,
      },
      fields: {
        id: true,
        price: true,
      },
    })
  const oldPrice = productPrice ? productPrice.price : 0

  if (price >= 0 && oldPrice != price) {
    if (productPrice && productPrice.id) {
      productPrice.isValid = 0
      productPrice.statusType = 0
      await productPrice.save()
    }

    productPrice = await priceModel.create({
      isValid: 1,
      statusType: 1,
      productId: product.id,
      chargeType: 1,
      price: price,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    })
    syncService.syncDataToFxon('product_prices', productPrice.id)
  }
  return productPrice
}

/**
 * Push outline by productId, promotion and content
 *
 * @param {number} productId
 * @param {string} promotion
 * @param {string} content
 * @returns {Promise}
 * @private
 */
async function _pushOutline(productId, promotion, content, meta) {
  let outline = await outlineModel.findOne({
    where: {
      isValid: 1,
      statusType: 1,
      productId: productId,
    },
    fields: {
      id: true,
      outline: true,
      promotion: true,
    },
    order: 'id DESC',
  })

  if (_checkOutlineCond(outline, content, promotion)) {
    if (outline) {
      outline.isValid = 0
      outline.statusType = 0
      await outline.save()
    }
    outline = await outlineModel.create({
      isValid: 1,
      statusType: 1,
      productId: productId,
      outline: content,
      promotion: promotion,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    })
    syncService.syncDataToFxon('product_outlines', outline.id)
  }
}

/**
 * build event object by event, product, outline, isLimit and fileName
 *
 * @param {object} event
 * @param {object} product
 * @param {object} outline
 * @param {number} isLimit
 * @param {object} fileName
 * @returns {object}
 * @private
 */
async function _buildEvent(event, product, outline, isLimit, fileName) {
  return objUtil.filter({
    id: event.id,
    title: event.title,
    outline: event.outline,
    price: event.price,
    startDate: event.eventAt,
    endDate: event.endAt,
    categories: event.categoryIds.split(',').map(x => parseInt(x)),
    lAreaId: event.largeAreaId,
    mAreaId: event.mediumAreaId,
    location: event.location,
    times: event.times,
    content: event.content,
    margin: product.affiliateMargin,
    pr: outline.promotion,
    isLimit: isLimit,
    limit: isLimit == 1 ? product.upperLimit : null,
    pId: product.id,
    images: await _getImagesByProductId(event.productId),
    fileName: fileName,
  })
}

/**
 * create product by input and userId
 *
 * @param {object} input
 * @param {number} userId
 * @returns {object}
 * @private
 */
async function _createProduct(input, meta) {
  const date = new Date()
    const isLimit = input.isLimit || 0
    const product = await productModel.create({
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      catchCopy: input.outline,
      affiliateMargin: input.margin,
      isLimited: isLimit,
      upperLimit: isLimit == 1 ? input.limit : null,
      isValid: 1,
      typeId: PRODUCT_TYPEID_EVENT,
      userId: meta.userId,
      name: input.title,
      forwardAt: date.getTime(),
      statusType: 0,
      isSaleStop: 0,
    })

  syncService.syncDataToFxon('products', product.id)
  return product
}

/**
 * create event by input
 *
 * @param {object} input
 * @returns {object}
 * @private
 */
async function _createEvent(input) {
  const event = await eventModel.create({
    eventAt: input.startDate * 1000,
    endAt: input.endDate * 1000,
    largeAreaId: input.lAreaId,
    mediumAreaId: input.mAreaId,
    location: input.location,
    categoryIds: input.categories.join(','),
    times: input.times,
    outline: input.outline,
    content: input.content,
    title: input.title,
    isValid: 1,
    statusType: 0,
    productId: input.productId,
    price: input.price > 0 ? input.price : 0,
  })
  syncService.syncDataToFxon('events', event.id)
  return event
}

/**
 * put event by input
 *
 * @param {object} event
 * @param {object} input
 * @returns {object}
 * @private
 */
async function _putEvent(event, input) {
  event.price = input.price > 0 ? input.price : 0
  event.eventAt = input.startDate * 1000
  event.endAt = input.endDate * 1000
  event.largeAreaId = input.lAreaId
  event.mediumAreaId = input.mAreaId
  event.location = input.location
  event.categoryIds = input.categories.join(',')
  event.times = input.times
  event.outline = input.outline
  event.content = input.content

  await event.save()
}

/**
 * Build event data
 *
 * @param {object} event
 * @returns {object}
 * @private
 */
function _buildEventData(event) {
  return {
    id: event.id,
    status: event.statusType,
    name: event.title,
    price: event.price,
  }
}

/**
 * build product object by product, input and isLimit
 *
 * @param {object} product
 * @param {object} input
 * @param {number} isLimit
 * @returns {object}
 * @private
 */
function _buildProductData(product, input, meta) {
  product.ipAddress = meta.ipAddress
  product.userAgent = meta.userAgent
  product.catchCopy = input.outline
  product.affiliateMargin = input.margin
  product.isLimited = input.isLimit
  if (input.isLimit == 1 && input.limit > 0) {
    product.upperLimit = input.limit
  }

  return product
}

/**
 * Condition for outline updating
 *
 * @param {object} outline
 * @param {string} content
 * @param {string} promotion
 * @returns {bool}
 * @private
 */
function _checkOutlineCond(outline, content, promotion) {
  if (!outline) {
    return true
  }

  let change = false
  if (outline.outline != content || outline.promotion != promotion)
    {change = true}
  return change
}

/**
 * Get article of specific developer
 *
 * @param {number} id
 * @param {number} userId
 * @returns {Promise<Object>}
 * @private
 */
async function _event(id, userId) {
  return await eventModel.findOne({
    where: {
      id,
      isValid: 1,
      userId,
    },
    fields: {
      id: true,
      productId: true,
      statusType: true,
    },
  }) || {}
}

/**
 * Update status of event
 *
 * @param {number} eventId
 * @param {number} statusType
 * @param {number} userId
 * @returns {void}
 * @public
 */
async function updateStatus(eventId, statusType, userId) {
  // Validate status type
  if (![1, 2, 9].includes(statusType)) {
    return
  }

  // Get event
  const event = await _event(eventId, userId)

  // Cannot update status of event with no productId
  if (!event.productId) {
    return
  }

  // Status must change
  if (event.statusType == statusType) {
    return
  }

  event.statusType = statusType
  event.save()
  // Update status of product
  productService.updateStatus(event.productId, statusType, userId)
}

module.exports = {
  index,
  show,
  create,
  update,
  updateStatus,
}
