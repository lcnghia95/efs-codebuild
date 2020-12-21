const app = require('@server/server')
const urlService = require('./productUrl')

// models
const productModel = app.models.Products
const surfacePrDetailModel = app.models.SurfaceProductDetails

// utils
const objectUtils = app.utils.object
const arrayUtil = require('@ggj/utils/utils/array')
const timeUtil = require('@ggj/utils/utils/time')

/**
 * Fields to get surface product
 *
 * @var  string
 */
const SURFACE_PRODUCT_FIELDS = {
  id: true,
  typeId: true,
  categories: true,
  productId: true,
  productName: true,
  productNameEn: true,
  productNameTh: true,
  price: true,
  isSpecialDiscount: true,
  specialDiscountPrice: true,
  reviewsStars: true,
  reviewsCount: true,
}

/**
 * Get surface product objects
 *
 * @param {Array} records
 * @returns {Array}
 */
async function sfProductObjects(records) {
  const products = records.map(record => ({
      id: record.productId,
      typeId: record.typeId,
    }))
  const productIds = arrayUtil.column(records, 'productId')
  const [urls, prices] = await Promise.all([
      urlService.productDetailUrls(products),
      getDataPrice(productIds),
    ])

  return records.filter(e => !!prices[e.productId]).map(record => {
    const productId = record.productId
    return objectUtils.filter({
      id: productId,
      name: record.productName ? record.productName.trim() : '',
      typeId: record.typeId,
      seller: objectUtils.nullFilter({
        userId: record.userId || undefined,
        nickName: record.nickName || undefined,
      }),
      categories: objectUtils.filter(
        record.categories ? record.categories.split(',') : {},
      ),
      keywords: objectUtils.filter(
        record.keywords ? record.keywords.split(',') : {},
      ),
      count: record.salesCount || 0,
      description: record.catchCopy,
      detailUrl: urls[productId],
      prices: [prices[productId]],
      review: objectUtils.filter({
        stars: record.reviewsStars,
        count: record.reviewsCount,
      }),
      forwardAt: record.forwardAt ? timeUtil.toUnix(record.forwardAt) : undefined,
    })
  })
}

/**
 * validate surface product
 *
 * @param {Number} id
 * @returns {Boolean}
 * @public
 */
async function validateSfProduct(id) {
  const where = sfConditions().where
  where.id = id

  const count = await productModel.count(where)
  return (count > 0)
}

async function getDataPrice(productIds) {
  const products =  await surfacePrDetailModel.find({
    where: {
      id: {inq: productIds},
      isValid: 1,
    },
    fields: {
      id: true,
      price: true,
      isSpecialDiscount: true,
      salesCount: true,
      specialDiscountPrice: true,
      specialDiscountCount: true,
      specialDiscountStartAt: true,
      specialDiscountEndAt: true,
    },
  }) || []

  if (!products) {
    return {}
  }
  return arrayUtil.index(products.map(product => {
    return price(product)
  }), 'id')
}

/**
 * Get conditions for surface products
 *
 * @param {Number} id
 * @returns {Object}
 * @public
 */
function sfConditions(fields = undefined) {
  return {
    where: {
      isValid: 1,
      statusType: {
        gt: 0,
      },
    },
    fields,
  }
}

/**
 * Get conditions for products on sale
 *
 * @param {Array} userIds
 * @param {Array} typeIds
 * @returns {Object}
 * @public
 */
function onSaleConditions(userIds = [], typeIds = [], ignonePIds = []) {
  const now = Date.now()
    const conditions = {
      where: {
        isValid: 1,
        id: {
          nin: ignonePIds,
        },
        typeId: {
          inq: typeIds,
        },
        statusType: 1,
        userId: {
          inq: userIds,
        },
        isSaleStop: 0,
        isSignalOnly: 0,
        and: [{
          or: [{
            isReservedStart: 0,
          }, {
            isReservedStart: 1,
            reservedStartAt: {
              lt: now,
            },
          }],
        }, {
          or: [{
            isReservedEnd: 0,
          }, {
            isReservedEnd: 1,
            reservedEndAt: {
              gt: now,
            },
          }],
        }],
      },
      fields: SURFACE_PRODUCT_FIELDS,
    }
  if (userIds.length == 0) {
    delete conditions.where.userId
  }
  if (typeIds.length == 0) {
    delete conditions.where.typeId
  }
  if (ignonePIds.length == 0) {
    delete conditions.where.id
  }
  return conditions
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
      id: data.id,
      price: data.price,
      isDiscount: 0,
    }
  }

  if (count > 0) {
    remain = Math.max(count - data.salesCount, 0)
    // Over limit
    if (remain === 0) {
      return {
        id: data.id,
        price: data.price,
        isDiscount: 0,
      }
    }
  }

  const isOverPeriod = start > now || (end > 0 && end < now)
  return isOverPeriod ? {
    id: data.id,
    price: data.price,
    isDiscount: 0,
  } : app.utils.object.nullFilter({
    id: data.id,
    price: data.price,
    isDiscount: 1,
    discountPrice: data.specialDiscountPrice,
    discountRemain: remain > 0 ? remain : null,
    specialDiscountStartAt: start,
    specialDiscountEndAt: end,
  })
}

module.exports = {
  sfProductObjects,
  validateSfProduct,
  onSaleConditions,
  sfConditions,
}
