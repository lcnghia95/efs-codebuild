const app = require('@server/server')
const urlService = require('./productUrl')

// models
const productModel = app.models.Products

// utils
const objectUtil = require('@ggj/utils/utils/object')

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
  productNameVi: true,
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
  const urls = await urlService.productDetailUrls(products)

  return records.map(record => {
    const name = record.productNameVi ? record.productNameVi : record.productName

    return objectUtil.filter({
      id: record.productId,
      name: name ? name.trim() : '',
      typeId: record.typeId,
      categories: objectUtil.filter(
        record.categories ? record.categories.split(',') : {},
      ),
      keywords: objectUtil.filter(
        record.keywords ? record.keywords.split(',') : {},
      ),
      count: record.salesCount || 0,
      description: record.catchCopy,
      detailUrl: urls[record.productId],
      prices: [objectUtil.nullFilter({
        price: record.price,
        discountPrice: record.isSpecialDiscount == 1 ? record.specialDiscountPrice : undefined,
      })],
      review: objectUtil.filter({
        stars: record.reviewsStars,
        count: record.reviewsCount,
      }),
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
      productNameVi: {
        nin: ['', null],
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
      // productNameEn: {
      //   nin: ['', null]
      // },
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

module.exports = {
  sfProductObjects,
  validateSfProduct,
  onSaleConditions,
  sfConditions,
}
