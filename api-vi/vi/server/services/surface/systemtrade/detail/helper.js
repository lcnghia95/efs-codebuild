const app = require('@server/server')
const helper = require('@services/surface/systemtrade/index/helper')

const {
  sfProductObjects,
  onSaleConditions,
} = require('@services/common/surfaceProduct')

const slackCommonService = require('@services/common/slack')

// models
const communityModel = app.models.CommunitiesVi
const productOutlinesModel = app.models.ProductOutlines

const systemtradeSearchModel = app.models.SystemtradeSearch
const systemtradeSearchViModel = app.models.SystemtradeSearchVi
const productModel = app.models.Products
const surfaceProductDetailsModel = app.models.SurfaceProductDetails
const productCategoryModel = app.models.ProductCategories
const productMultiLanguagesModel = app.models.ProductMultiLanguages

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = require('@ggj/utils/utils/object')

//
const GGJGdevUserId = 110001
const LANGUAGE = 'vi'

// "en":2, "th" : 3, "vi" : 4
const LANGUAGE_TYPE = 4

/**
 * Get user data object based on given data
 *
 * @param data
 * @returns {Object}
 */
function userObject(data) {
  if (data.userId) {
    return objectUtil.nullFilter({
      id: data.userId,
      name: data.nickName,
      transaction: !data.isTransaction ? null : data.transaction,
      selfIntroduction: data.isTransaction ? null : data.userSelfIntroduction,
      url: data.saleUrl,
    })
  }
  return {}
}

/**
 * show systemtrade others
 *
 * @param {Number} userId
 * @param {Number} productId
 * @return {Array}
 * @public
 */
async function userProducts(userId, productId) {
  // get all products
  const conditions = onSaleConditions([userId], [], [productId])
  if (userId == GGJGdevUserId) {
    conditions.where.price = {
      gt: 0,
    }
  }

  const products = await surfaceProductDetailsModel.find(conditions)
  const productIds = arrayUtil.column(products, 'productId')

  let [systemtradeProducts, systemtradeViProducts] = await Promise.all([
    systemtradeSearchModel.find({
      where: {
        productId: {
          inq: productIds,
        },
        isValid: 1,
        userId,
        months: 0,
        price: userId == GGJGdevUserId ? {
          gt: 0,
        } : {
          gte: 0,
        },
      },
      order: 'productId DESC',
    }),
    systemtradeSearchViModel.find({
      where: {
        productId: {
          inq: productIds,
        },
        isValid: 1,
        userId,
        months: 0,
        price: userId == GGJGdevUserId ? {
          gt: 0,
        } : {
          gte: 0,
        },
      },
      order: 'productId DESC',
    }),
  ])

  systemtradeViProducts = arrayUtil.index(systemtradeViProducts, 'productId')

  // get systemtrade products
  systemtradeProducts = systemtradeProducts.map(item => {
    if (systemtradeViProducts[item.productId]) {
      item.productName = systemtradeViProducts[item.productId].productName
    }
    return helper.indexObject(item)
  })

  if (systemtradeProducts.length >= 20) {
    return arrayUtil.shuffle(systemtradeProducts, 20)
  }

  // systemtrade products < 20 show systemtrade + others product
  const systemtradePIds = arrayUtil.column(systemtradeProducts, 'id')
  let surfaceProducts = products.reduce((result, product) => {
    if (systemtradePIds.indexOf(product.productId) == -1 && product.typeId == 1) {
      result.push(product)
    }
    return result
  }, [])

  surfaceProducts = await sfProductObjects(
    arrayUtil.shuffle(surfaceProducts, (20 - systemtradeProducts.length)),
  )

  return systemtradeProducts.concat(surfaceProducts)
}

/**
 * Get product data in `privacy`.`products`
 *
 * @param pId
 * @return {Promise<object>}
 */
async function productObject(pId) {
  return await productModel.findOne({
    where: {
      id: pId,
    },
    fields: {
      id: true,
      userId: true,
      platformId: true,
    },
  })
}

/**
 * list createdAt of outline
 *
 * @param productId
 * @returns {Object}
 * @public
 */
async function listOutline(productId) {
  const outline = await productOutlinesModel.find({
    where: {
      isValid: {
        inq: [0, 1],
      },
      productId,
      languages: LANGUAGE_TYPE,
    },
    fields: {
      id: true,
      createdAt: true,
    },
    order: 'createdAt DESC',
    limit: 6,
  })

  return outline.map(item => {
    return {
      id: item.id,
      createdDate: item.createdAt,
    }
  })
}

/**
 * Get question Total
 *
 * @param {Number} ProductID
 * @returns {Number}
 * @private
 */
async function questionTotal(productId) {
  return await communityModel.count({
    isValid: 1,
    isPrivate: 0,
    productId,
    userId: {
      gt: 0,
    },
  })
}

/**
 * Get question Total
 *
 * @param {Number} productId
 * @param {Number} categoryId
 * @returns {Boolean}
 * @private
 */
async function validateCategoryId(productId, categoryId) {
  return !!await productCategoryModel.count({
    isValid: 1,
    productId,
    categoryId,
  })
}

/**
 * check language and send slack if product dont have name en
 *
 * @param {object || null} product
 * @param {object || null} languageProduct
 *
 * @returns {Object}
 * @public
 */
function validateLanguages(product, languageProduct) {
  let isValid = true
  const productId = product ? product.id : 0

  if (!product || !product.languages.includes(LANGUAGE)) {
    return false
  }
  
  if (!languageProduct || !languageProduct.name) {
    isValid = false
    slackCommonService.sendSlackLanguages(productMultiLanguagesModel, [productId], 'product id')
  }

  return isValid
}

module.exports = {
  userObject,
  userProducts,
  productObject,
  listOutline,
  questionTotal,
  validateCategoryId,
  validateLanguages,
}
