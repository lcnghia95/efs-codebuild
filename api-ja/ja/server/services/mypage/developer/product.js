const app = require('@server/server')
const helper = require('./helper')
const historyService = require('./history')
const priceService = require('./price')
const syncService = require('@services/common/synchronize')
const productOutlineModel = app.models.ProductOutlines
const masterAffiliateModel = app.models.MasterAffiliateSearch
const productPriceModel = app.models.ProductPrices
const productModel = app.models.Products
const objectUtil = app.utils.object
const {syncProduct} = require('@@services/common/product')

const lodash = require('lodash')
const _isEmpty = lodash.isEmpty

const PRODUCT_TYPE_ID = 3
// const DOWNLOAD_PRODUCT_TYPE_IDS = [1, 2, 6, 9, 13, 70, 71]
const { DOWNLOAD_PRODUCT_TYPE_IDS } = require('@@server/common/data/hardcodedData')

const langMap = {
  1: 'ja',
  2: 'en',
  3: 'th',
  4: 'vi',
}
/**
 * Check if product status can be edited or not base on typeId
 *
 * @param {number} typeId
 * @returns {Boolean}
 * @private
 */
function _isAllowStatusUpdate(typeId) {
  if ([2, 3, 4, 6, 9, 10, 13, 19, 70, 71, 72].includes(typeId)) {
    return true
  }
  return false
}

/**
 * Get product By id
 * @param {number} userId
 * @param {number} id
 * @param {object} fields
 */
async function getProductById(userId, id, fields = 'id,affiliateMargin,productPriceId'){
  if(id == 0) {
    return {}
  }
   const data =  await productModel.findOne({
    where:{
      id,
      isValid: 1,
      userId,
    },
    fields: app.utils.query.fields(fields),
  })

  return data || {}
}

/**
 * Update status of product object
 *
 * @param {Object} product
 * @param {number} statusType
 * @param {number} saleStop
 * @returns {void}
 * @private
 */
async function _updateProductStatus(product, statusType, saleStop) {
  if (![0, 1, 2, 9].includes(statusType)) {return}

  if (product.statusType === 5 && statusType !== 2) {
    return
  }

  // only admin allowed setting from status type = 2 to another
  if (product.statusType === 2) {
    return
  }

  const mapStatusTypeSaleStop = {
    0: 0,
    // https://gogojungle.backlog.jp/view/OAM-27678#comment-66303987
    1: saleStop,
    // https://gogojungle.backlog.jp/view/OAM-13457
    9: 0,
  }

  product.statusType = statusType
  product.isSaleStop = mapStatusTypeSaleStop[saleStop] !== undefined ? mapStatusTypeSaleStop[saleStop] : product.isSaleStop

  await product.save()
  // Sync with fx-on DB
  await app.models.FxonInfoProduct.upsert({
    Id: product.id,
    StatusId: product.statusType,
    IsSaleStop: product.isSaleStop,
  })

  return product
}

/**
 * Log product status & price
 *
 * @param {number} statusType
 * @param {Object} product
 * @returns {void}
 * @private
 */
async function _log(statusType, product) {
  const price = await priceService.priceById(product.productPriceId)
  await historyService.logStatusAndPrice(
    product.id,
    statusType,
    price.chargeType || 0,
    price.price || 0,
    price.specialDiscountPrice || 0,
  )

}

/**
 * Update status of product
 *
 * @param {number} productId
 * @param {number} statusType
 * @param {number} userId
 * @param {number} saleStop
 * @returns {void}
 * @public
 */
async function updateStatus(productId, statusType, userId, saleStop) {
  // Validate status type
  if (![0, 1, 2, 9].includes(parseInt(statusType))) {
    return
  }

  // Get product
  const fields = 'id,typeId,productPriceId,isSaleStop'
    const product = await helper.product(productId, userId, fields)

  // Check if user can update status of product or not
  if (!_isAllowStatusUpdate(product.typeId || 0)) {
    return
  }

  // Update status & log
  const updatedProduct = await _updateProductStatus(product, statusType, saleStop)
  await _log(statusType, product)

  return updatedProduct
}

/**
 * Update margin of product
 *
 * @param {number} productId
 * @param {number} margin
 * @param {number} userId
 * @returns {void}
 * @public
 */
async function updateMargin(productId, margin, userId) {
  if (!productId || margin === null || margin === undefined) {
    return {code: 400}
  }

  const fields = 'id,affiliateMargin,typeId,productPriceId'
  const product = await helper.product(productId, userId, fields)
  const [price, masterAffiliate] = await Promise.all([
      priceService.priceById(product.productPriceId),
      masterAffiliateModel.findOne({
        where: {
          masterId: product.id,
          masterType: 2,
          isValid: 1,
        },
      }),
    ])

  if (!Object.keys(product).length || !DOWNLOAD_PRODUCT_TYPE_IDS.includes(product.typeId)) {
    return {code: 400}
  }

  if ([1, 70, 71].includes(product.typeId) && (margin < 10 || margin > 100)) {
    return {code: 400}
  } else if (margin < 0 || margin > 100) {
    return {code: 400}
  }

  product.affiliateMargin = margin
  product.save()

  if (!Object.keys(price).length) {
    return {}
  }
  const reward = margin ? margin * price.price / 100 : 0
  if (masterAffiliate) {
    masterAffiliate.affiliateMargin = margin
    masterAffiliate.affiliateReward = reward
    masterAffiliate.save()
  }

  app.models.FxonInfoProduct.upsert({
    Id: product.id,
    AffiliateMargin: margin,
    AffiliateReward: reward,
  })
  return {}
}

/**
 * Get list product content
 *
 * @param {array} productIds
 * @returns {array}
 * @public
 */
async function getProductContent(productIds){
  const products = await productOutlineModel.find({
    where: {
      productId: {
        inq: productIds,
      },
      isValid: 1,
    },
    fields: { productId: true, outline: true},
  })
  return objectUtil.arrayToObject(products, 'productId')
}

/**
 * get list product unfree
 *
 * @param {array}  productIds
 * @returns {array}
 * @private
 */
async function filterProductFree(productIds) {
  const products = await productPriceModel.find({
    where: {
      productId: {
        inq: productIds,
      },
      isValid: 1,
    },
    fields: {
      productId: true,
    },
  })
  return objectUtil.arrayToObject(products, 'productId')
}

/**
 * create product
 *
 * @param {object}  data
 * @returns {object}
 * @private
 */
async function createProduct(data = {}){
  if(!Object.keys(data).length){
    return {}
  }
  data.isValid = 1
  const result = await productModel.create(data)
  syncProduct(result.id, data, false)
  return result

}

/**
 * create product and product price
 * @param {object}  data
 * @returns {array}
 * @private
 */
async function createProductHasPrice(data = {}) {
  const { userId, userAgent, ipAddress } = data
  const product = await createProduct({
    userId,
    userAgent,
    ipAddress,
    isValid: 1,
    name: data.title,
    typeId: PRODUCT_TYPE_ID,
    affiliateMargin: data.margin,
    statusType: data.statusType || 0,
    isFreeFirstMonth: data.isFreeFirstMonth,
    isSpecialDiscount: data.isSpecialDiscount,
    specialDiscountEndAt: data.specialDiscountEndAt,
    specialDiscountStartAt: data.specialDiscountStartAt,
    isPassword: data.isPassword,
    pagePassword: data.pagePassword,
    isSubscription: data.isSubscription || 0,
  })
  syncService.syncDataToFxon('products', product.id)
  const productPrice = product && await priceService.createProductPrice({
    productId: product.id,
    price: data.price,
    userId,
    userAgent,
    ipAddress,
    isValid: 1,
    specialDiscountPrice: data.specialDiscountPrice|| 0,
    statusType: data.statusType,
    chargeType: data.chargeType || 0,
  })
  syncService.syncDataToFxon('product_prices', productPrice.id)
  await updateProduct(userId, product.id, { productPriceId: productPrice.id })
  syncProduct(product.id, {}, false)
  return [product, productPrice]
}

/**
 * update product
 *
 * @param {number}  userId
 * @param {number}  id
 * @param {object}  data
 * @returns {object}
 * @private
 */
async function updateProduct( userId, id, data = {}){
  if(_isEmpty(data) || !userId || !id){
    return {}
  }
  const resultUpdate = await productModel.updateAll({ id, userId }, data)
  if(!resultUpdate.count){
    return  {}
  }
  syncService.syncDataToFxon('products', id)
  syncProduct(id, {}, false)
  return await getProductById(userId, id, 'id,name,affiliateMargin,productPriceId,isSpecialDiscount,isFreeFirstMonth,specialDiscountEndAt,specialDiscountStartAt,isPassword,pagePassword')
}

/**
 * delete product and delete price
 * @param {number}  userId
 * @param {number}  id
 * @returns {boolean}
 * @private
 */
async function deleteProduct (userId, id ) {
  const product = await getProductById(userId, id, 'id,productPriceId')
  const productPriceId = product.productPriceId
  await Promise.all([
    productModel.updateAll({userId, id}, { isValid: 0}),
    priceService.deleteProductPrice(userId, productPriceId),
  ])
  syncService.syncDataToFxon('products',id, { id_valid: 0})
  return true
}

/**
 * get product by UserId
 * @param {number}  userId
 * @param {object}  fields
 * @returns {boolean}
 * @private
 */
async function getProductByUserId(userId, fields = 'id,price'){
  const product = await productModel.find({
    where:{
      userId,
      isValid: 1,
    },
    fields: app.utils.query.fields(fields),
  })
  return product || []
}

/**
 *
 * @param {array} listProductId
 * @param {string} fields
 * @returns {Promise<Object>}
 * @public
 */
function getListProductById(listProductId, fields = 'id,name'){
  return productModel.find({
    where : {
      id: { inq: listProductId},
    },
    fields: app.utils.query.fields(fields),
  })
}

/**
 *
 * @param {int} userId
 * @param {Object} query
 * @returns {Promise<Object>}
 * @public
 */
async function myProducts(userId, q, langType) {
  if (!userId) {
    return []
  }
  const where = {
    and: [
      {
        userId,
      },
      {
        typeId: { inq: DOWNLOAD_PRODUCT_TYPE_IDS },
      },
      {
        languages: {
          like: `%${langMap[langType] || 'ja'}%`,
        },
      }
    ]
  }
  if (q) {
    if (isNaN(q)) {
      where.and.push({
        name: {
          like: '%' + q + '%',
        }
      })
    } else {
      where.and.push({
        or: [{
          name: {
            like: '%' + q + '%',
          }
        },
        {
          id: {
            like: '%' + q + '%',
          }
        }]
      })
    }
  }

  return await productModel.find({
    where,
    fields: {id: true, name: true},
    order: 'id DESC',
    limit: 10,
  })
}

module.exports = {
  updateStatus,
  updateMargin,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductContent,
  filterProductFree,
  getProductByUserId,
  createProductHasPrice,
  getListProductById,
  myProducts,
}
