const app = require('@server/server')
const commonUser = require('@services/common/user')
const commonSfProduct = require('@services/common/surfaceProduct')
const crypto = require('crypto')
const cookieModule = require('cookie')
const FX_SYSTEM = 'fx_system'
const sprintf = require('sprintf-js').sprintf
const timeUtil = app.utils.time
const favorite = require('@services/common/favorite')
const portfolio = require('@services/common/portfolio')

// models
const productModel = app.models.Products
const sfProductDetailModel = app.models.SurfaceProductDetails
const modelUtil = require('@server/utils/model')
const mdConn = require('@server/models/modelConnector')
const articleModel = app.models.Articles
const saleCountModel = app.models.SalesCount
const productPriceModel = app.models.ProductPrices
const productCategoryModel = app.models.ProductCategories
const productKeywordModel = app.models.ProductKeywords
const productPayModel = app.models.ProductPays
const redirectModel = app.models.Redirect
const userModel = app.models.Users
const userSelfIntroductionModel = app.models.UserSelfIntroduction
const productVersionModel = app.models.ProductVersions
const reviewStarModel = app.models.ReviewStars
const productOutlineModel = app.models.ProductOutlines
const transactionModel = app.models.Transaction
const favoriteProductModel = app.models.FavoriteProducts
const setProductModel = app.models.ProductSets
const communityModel = app.models.Communities
const keywordsModel = app.models.Keywords
const categoriesModel = app.models.Categories

const arrayUtil = require('@ggj/utils/utils/array')
const {_appendSystemtrade, syncProduct} = require('@@services/common/product')

/**
 * Flag for password from input
 *
 * @var  int
 */
const PASSWORD_FROM_INPUT = 1

/**
 * Flag for password from input
 *
 * @var  int
 */
const PASSWORD_FROM_COOKIE = 2

/**
 * Duration to keep cookie for page password
 *
 * @var  int
 */
const PAGE_PASSWORD_COOKIE_PERIOD = 3600000 // 1 hour

const { IGNORE_PRODUCTS_MAP, DISPLAYPRODUCT_TYPE_IDS } = require('@@server/common/data/hardcodedData')

/**
 * Get product by id
 *
 * @param {number} id
 * @param {Object} fields
 * @returns {Object|null}
 * @public
 */
async function product(id, fields) {
  return await productModel.findById(id, {
    fields,
  })
}

/**
 * Get Product by list Id
 *
 * @param {Array} productIds
 * @param {String} fields
 * @returns {Promise<Array>}
 * @public
 */
async function products(productIds, fields) {
  return await productModel.find({
    where: {
      isValid: 1,
      id: {
        inq: productIds,
      },
    },
    fields: app.utils.query.fields(fields),
  })
}

/**
 * get list product name
 * Ex: [{id: 1, name: 'test'}] => {1: "test"}
 *
 * @param {Array} products
 * @returns {Object}
 * @public
 */
function name(products) {
  return products.reduce((result, product) => {
    result[product.id] = product.name
    return result
  }, {})
}

/**
 *
 * @param id
 * @param input
 * @returns {Promise<Object>}
 * @public
 */
async function show(id, input = {}) {
  const [data, keywordIds, categoryIds] = await Promise.all([
    syncProduct(id, input),
    _getKeywordIds(),
    _getCategoryIds(),
  ])

  const sfPdDetail = data.sfPdDetail || {}

  sfPdDetail.keywords && (sfPdDetail.keywords = _sortKeywordsProduct(sfPdDetail.keywords, keywordIds))
  sfPdDetail.categories && (sfPdDetail.categories = _sortCategoriesProduct(sfPdDetail.categories, categoryIds))

  // Add set products in case is_set = 1
  if (sfPdDetail.isSet === 1) {
    sfPdDetail.setProducts = await _setProducts(sfPdDetail.subProductIds)
  }
  return sfPdDetail
}

/**
 * Get surface_product_details record
 *
 * @param id
 * @param input
 * @returns {Promise<Object>}
 * @private
 */
// async function _getProduct(id, input = {}) {
//   // Sync data
//   await syncSf(id)
//   const data = await sfProductDetailModel.findOne({
//     where: app.utils.object.nullFilter({
//       id: id,
//       isValid: 1,
//       typeId: input.typeIds ? {
//         inq: input.typeIds.split(','),
//       } : null,
//       statusType: {
//         gte: 1,
//       },
//       userId: {
//         gt: 0,
//       },
//     }),
//   })

//   if (!data) {
//     return {}
//   }
//   // Check user
//   const user = await commonUser.getUser(data.userId)
//   if (!Object.keys(user).length) {
//     return {}
//   }

//   // If product have password, don't cache it
//   if (data.passwordType > 0) {
//     app.emit('setHeader' + input.requestId, 'no-cache', 1)
//   }

//   if (data.passwordType === 1) {
//     const res = await checkPagePassword(data, input)

//     // No password or incorrect password
//     if (Object.keys(res).length) {
//       if (data.statusType == 9) {
//         res.statusType = 9
//       }
//       return res
//     }
//     // Correct password
//     data.status = 1
//   }

//   if (data.passwordType === 2) {
//     const res = await checkCartPassword(data, input)

//     // No password or incorrect password
//     if (res === 2) {
//       data.status = 0
//     }

//     // Correct password
//     if (res === 1) {
//       data.status = 1
//     }
//   }

//   return data
// }

/**
 * Get sub products of given product
 *
 * @param id
 * @param input
 * @returns {Promise<Object>}
 */
async function subProduct(id, input) {
  let userProducts = [],
    relatedProducts = []

  // Add products same seller
  if (input.userId) {
    userProducts = await _userProducts(input.userId, id)
  }

  // Add set same categories
  if (input.type) {
    relatedProducts = await _relatedProducts(input.type, id)
  }

  return app.utils.object.filter({
    productsOfUser: userProducts,
    related: relatedProducts,
  })
}

/**
 * Get related products
 *
 * @param {Number} typeId
 * @param {Number} pId
 * @return {Promise<Array>}
 * @private
 */
async function _relatedProducts(typeId, pId) {
  // generate conditions
  const conditions = commonSfProduct.onSaleConditions([], [typeId], [pId])
  conditions.sort = 'salesCount DESC'
  let products = await sfProductDetailModel.find(conditions)

  // Random 20 records and convert to response objects
  products = arrayUtil.shuffle(products, 20)
  return await commonSfProduct.sfProductObjects(products)
}

/**
 * Get products same seller
 *
 * @param uId
 * @param pId
 * @returns {Promise<Array>}
 * @private
 */
async function _userProducts(uId, pId) {
  let products = await sfProductDetailModel.find(
    commonSfProduct.onSaleConditions(
      [uId],
      DISPLAYPRODUCT_TYPE_IDS,
      [pId].concat(IGNORE_PRODUCTS_MAP[uId] || []),
    ),
  )

  // Random 20 records and convert to response objects
  products = arrayUtil.shuffle(products, 20)
  return await commonSfProduct.sfProductObjects(products)
}

/**
 * Get sub product data (set products)
 *
 * @param ids
 * @returns {Promise<Array>}
 */
async function _setProducts(ids) {
  const products = await sfProductDetailModel.find({
    where: {
      id: {
        inq: ids.split(','),
      },
      isValid: 1,
      statusType: 1,
    },
    fields: {
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
    },
  })

  return await Promise.all(
    products.map(async product => await _sfProductObject(product)),
  )
}

/**
 * Convert given record into surface_product_detail response object
 *
 * @param record
 * @returns {Promise<Object>}
 * @private
 */
async function _sfProductObject(record) {
  const res = await commonSfProduct.sfProductObjects([record])
  return !res.length ? {} : res[0]
}

/**
 * Verify page password of given product record
 * Use password from cookie or from input
 *
 * @param {object} record: product record
 * @param {object} input
 * @returns {Promise<object>}
 */
async function checkPagePassword(record, input) {
  const id = record.productId
    const password = await getPassword(id, input)
    const type = password.type
    const pass = password.password || ''

  if (!pass) {
    return {
      id,
      isPassword: 1,
      name: record.productName,
    }
  }

  if (pass != record.pagePassword) {
    if (type === PASSWORD_FROM_COOKIE) {
      return {
        id,
        isPassword: 1,
        name: record.productName,
      }
    }
    return {
      status: 0,
    }
  }

  // Cache password
  // TODO consider await here
  await _cachePassword(id, pass, input.requestId)

  // Correct
  return {}
}

/**
 * Verify cart password of given product record
 * Use password from cookie or from input
 *
 * @param record
 * @param input
 * @returns {Promise<number>}
 */
async function checkCartPassword(record, input) {
  const id = record.productId
    const password = await getPassword(id, input)
    const type = password.type
    const pass = password.password

  // Not input password
  if (!pass) {
    return 0
  }

  // Wrong password
  if (pass != record.pagePassword) {
    if (type === PASSWORD_FROM_COOKIE) {
      return 0
    }
    return 2
  }

  // Cache password
  // TODO consider await here
  await _cachePassword(id, pass, input.requestId)

  // Correct
  return 1
}

async function getPassword(id, input) {
  return new Promise((resolve => {
    app.on('header' + input.requestId, function(cookie) {
      const cookies = cookie ? cookieModule.parse(cookie) : {}
      resolve(
        input.pagePassword ? {
          type: PASSWORD_FROM_INPUT,
          password: input.pagePassword.toString(),
        } : {
          type: PASSWORD_FROM_COOKIE,
          password: app.utils.crypto.decrypt(cookies[_key(id)] ||
            ''),
        },
      )
    })
    app.emit('getHeader' + input.requestId, 'cookie')
  }))
}

/**
 * Cache password from input or cookie
 *
 * @param id
 * @param password
 * @param requestId
 * @return void
 * @private
 */
async function _cachePassword(id, password, requestId) {
  return new Promise(((resolve, reject) => {
    const success = app.emit(
      'setHeader' + requestId,
      'Set-Cookie',
      cookieModule.serialize(_key(id), app.utils.crypto.encrypt(
        password), {
        expires: new Date(Date.now() + PAGE_PASSWORD_COOKIE_PERIOD),
        path: '/',
      }),
    )

    if (!success) {
      return reject(new Error('Set cookie fail'))
    }
    resolve()
  }))
}

/**
 * Get cookie name for password
 *
 * @param  {Number} id
 * @return {String}
 * @private
 */
function _key(id) {
  return crypto
    .createHash('md5')
    .update('ppk_' + id)
    .digest('hex')
    .substr(0, 10)
}

/**
 * Check where product in discount or not
 *
 * @param {Object} product
 * @returns {Boolean}
 * @public
 */
async function onDiscount(product) {
  const now = Date.now() / 1000
    const start = product.specialDiscountStartAt
    const end = product.specialDiscountEndAt
    const isDiscount = product.isSpecialDiscount
    const discountCount = product.specialDiscountCount
  if (
    // Data validation
    isDiscount === undefined ||
    discountCount === undefined ||
    start === undefined ||
    end === undefined
    // No discount
    ||
    isDiscount !== 1
    // Out of period
    ||
    now < start ||
    (now > end && end > 0)
  ) {
    return false
  }
  // Over limit
  if (discountCount > 0) {
    const productId = product.id
      const salesCount = await app.models.Sales.salesCount(productId)
    return discountCount > salesCount
  }
  return true
}

/**
 * Sync data for surface_product_details
 *
 * @param {number} id
 * @returns {Promise<Boolean>}
 * @public
 */
async function syncSf(id) {
  if (!await _isSync(id)) {
    return true
  }

  // TODO sync direct in api v3
  try {
    const http = app.utils.http.http()
    await http.get(`surface_product_details/${id}/refresh`)
  } catch (e) {
    // do nothing (TODO)
  }
  return true
}

/**
 * Check lasted sync time
 *
 * @param {number} id
 * @returns {Promise<Boolean>}
 * @public
 */
async function _isSync(id) {
  const record = await sfProductDetailModel.findOne({
    where: {
      id: id,
    },
    fields: {
      updatedAt: true,
    },
  })
  return !record || record.updatedAt < parseInt(Date.now() / 1000) - 60
}

async function getSfPdDetail(id) {
  const record = await sfProductDetailModel.findOne({
    where: {
      id: id,
      isValid: {
        inq: [0, 1],
      },
    },
  })
  return record || {}
}

async function getSfPdDetails(ids) {
  const records = await sfProductDetailModel.find({
    where: {
      id: {
        inq: ids,
      },
    },
  })
  return records || []
}

async function buildRelationalFxData(sfProduct, input, userId, displayProduct = {}) {
  const [systemtrade, forward, questionTotal, isFavorite, isPortfolio] = await Promise.all([
    _appendSystemtrade(displayProduct.id || sfProduct.id),
    _appendForward(displayProduct.id || sfProduct.id, commonUser.oldDeveloperId(displayProduct.userId || sfProduct.userId)),
    _questionTotal(sfProduct.id),
    favorite.isFavorite(sfProduct.id, userId),
    portfolio.isPortfolio(sfProduct.id, userId),
  ])

  sfProduct = await _customizeFxData(sfProduct, input)
  return {
    fxProduct: sfProduct,
    relData: {
      systemtrade: systemtrade,
      forward: forward,
      questionTotal: questionTotal,
    },
    cartInfo: {
      isFavorite: isFavorite,
      isPortfolio: isPortfolio,
    },
  }
}

async function buildUpInsertFxData(product, input, userId, isEmptySfpd, displayProduct = {}) {
  let buildProduct = {
    id: product.id,
    isSync: 1, // Mark sync
    isValid: product.isValid,
    productId: product.id,
  }

  await _cloneProductInfo(buildProduct, product)
  // [systemtrade, forward, questionTotal, isFavorite, isPortfolio]
  const [systemtrade, forward, questionTotal, isFavorite, isPortfolio] = await Promise.all([
      _appendSystemtrade(displayProduct.id || product.id),
      _appendForward(displayProduct.id || product.id, commonUser.oldDeveloperId(displayProduct.userId || product.userId)),
      _questionTotal(product.id),
      favorite.isFavorite(product.id, userId),
      portfolio.isPortfolio(product.id, userId),
      _appendForwardAt(buildProduct, product),
      _appendSaleCount(buildProduct),
      _appendProductSet(buildProduct),
      _appendPrice(buildProduct),
      _appendCategories(buildProduct),
      _appendKeywords(buildProduct),
      _appendPays(buildProduct),
      _appendRedirect(buildProduct),
      _appendUser(buildProduct),
      _appendIntroduction(buildProduct),
      _appendVersion(buildProduct),
      _appendReview(buildProduct),
      _appendOutline(buildProduct),
      _appendTransaction(buildProduct),
      _appendFavorite(buildProduct),
    ])
  const pdMdObj = Object.assign({}, buildProduct)

  if (isEmptySfpd) {
    await sfProductDetailModel.create(pdMdObj)
  } else {
    await sfProductDetailModel.updateAll({
      id: pdMdObj.id,
      isValid: {inq: [0, 1]},
      },
      pdMdObj,
    )
  }
  buildProduct = await _customizeFxData(buildProduct, input)
  return {
    fxProduct: buildProduct,
    relData: {
      systemtrade: systemtrade,
      forward: forward,
      questionTotal: questionTotal,
    },
    cartInfo: {
      isFavorite: isFavorite,
      isPortfolio: isPortfolio,
    },
  }
}

async function _customizeFxData(buildProduct, input) {
  removeCachePass(buildProduct, input.requestId)
  // Validate data
  if (!await _isValidUser(buildProduct.userId)) {
    return {}
  } else {
    const isValidPass = await _isValidPassword(buildProduct, input)
    if (!isValidPass.ret) {
      return isValidPass.dt
    }
  }
  // Move from sync Price - Over limit
  if (buildProduct.specialDiscountCount && buildProduct.specialDiscountCount <= buildProduct.salesCount) {
    _resetDiscount(buildProduct)
  }
  return buildProduct
}

async function appendSetProducts(product) {
  let setProducts
  // Add set products in case is_set = 1
  if (product.isSet === 1) {
    setProducts = await _setProducts(product.subProductIds)
  }
  return setProducts
}

async function _isValidUser(userId) {
  // Check user
  const user = await commonUser.getUser(userId)
  if (!Object.keys(user).length) {
    return false
  }
  return true
}

async function _isValidPassword(object, input) {
  if (object.passwordType === 1) {
    const res = await checkPagePassword(object, input)

    // No password or incorrect password
    if (Object.keys(res).length) {
      if (object.statusType == 9) {
        res.statusType = 9
      }
      return {
        ret: false,
        dt: res,
      }
    }
    // Correct password
    object.status = 1
  }

  if (object.passwordType === 2) {
    const res = await checkCartPassword(object, input)

    // No password or incorrect password
    if (res === 2) {
      object.status = 0
    }

    // Correct password
    if (res === 1) {
      object.status = 1
    }
  }
  return {
    ret: true,
    dt: {},
  }
}

async function removeCachePass(object, requestId) {
  // If product have password, don't cache it
  if (object.passwordType > 0) {
    app.emit('setHeader' + requestId, 'no-cache', 1)
  }
}

// Sync favorite
async function _appendFavorite(object) {
  const queryParam = {
    productId: object.id,
  }
  object.favoriteCount = await mdConn.count(favoriteProductModel, queryParam)
}

// Sync transaction
async function _appendTransaction(object) {
  // Display transaction of GogoJungle for systemtrade product
  // Or Display transaction of GogoJungle for salon product
  const userId = (object.typeId == 1 || (object.isAdvising == 1 && object.isDispConclusion == 0))
      ? 110001
      : object.userId
  const queryParam = {
      where: {
        userId: userId,
      },
      fields: [
        'content',
      ],
      order: 'id DESC',
    }
  let transaction = await mdConn.selectOne(transactionModel, queryParam)

  object.isTransaction = parseInt(Object.keys(transaction).length || 0) && 1
  const content = convert_crlf_br(transaction.content || '')
  if (content.length > 0 || !(object.isAdvising == 1 && object.typeId == 4)) {
    object.transaction = content
  } else {
    queryParam.where.userId = 110001
    transaction = await mdConn.selectOne(transactionModel, queryParam)
    object.isTransaction = 1
    object.transaction = convert_crlf_br(transaction.content || '')
  }

  // Remove is_disp_conclusion field (this field is use for get transaction data of salons)
  delete object.isDispConclusion
}

// Convert newline character into html tag <br> to display on GUI
// This method is used for transation content
function convert_crlf_br(text) {
  if (!text) {
    return ''
  }
  return text.replace(/(?:[\r])/g, '').replace(/(?:[\n])/g, '<br>')
}

// Sync outline
async function _appendOutline(object) {
  const queryParam = {
      where: {
        productId: object.id,
        statusType: 1,
        languages: 1,
      },
      order: 'id DESC',
    }
    const outline = await mdConn.selectOne(productOutlineModel, queryParam)

  object.productOutline = (outline.outline || '')
    .replace(/http:\/\/fx-on\.com/gi, 'https://fx-on.com')
    .replace(/src="\/asp/gi, 'src="https://fx-on.com/asp')
  // object.productOutlineEn = (outline.outlineEn || '')
  //   .replace(/http:\/\/fx-on\.com/gi, 'https://fx-on.com')
  //   .replace(/src="\/asp/gi, `src="https://fx-on.com/asp`)
  // object.productOutlineTh = (outline.outlineTh || '')
  //   .replace(/http:\/\/fx-on\.com/gi, 'https://fx-on.com')
  //   .replace(/src="\/asp/gi, `src="https://fx-on.com/asp`)

  if (object.typeId === 1 || object.typeId === 2) {
    object.brokers = outline.brokers || ''
    object.demoBrokerId = outline.demoBrokerId || 0
    object.accountCurrencyType = outline.accountCurrencyType || 0
    object.currencyPairs = outline.currencyPairs || ''
    object.tradingTypes = outline.tradingTypes || ''
    object.tradingStyles = outline.tradingStyles || ''
    object.technicalIndicators = outline.technicalIndicators || ''
    object.initialDeposit = outline.initialDeposit || 0
    object.maxPositions = outline.maxPositions || 0
    object.maxPositionsOther = outline.maxPositionsOther || ''
    object.maxLots = outline.maxLots || 0
    object.maxLotsOther = outline.maxLotsOther || ''
    object.period = outline.period || 0
    object.maxStopLoss = outline.maxStopLoss || 0
    object.maxStopLossOther = outline.maxStopLossOther || ''
    object.maxTakeProfit = outline.maxTakeProfit || 0
    object.maxTakeProfitOther = outline.maxTakeProfitOther || ''
    object.isHedge = outline.isHedge || 0
    object.isUsingExternalFiles = outline.isUsingExternalFiles || 0
    object.specialInstructions = outline.specialInstructions || '0'
  }
}

// Sync review
async function _appendReview(object) {
  const queryParam = {
      where: {
        productId: object.id,
      },
      fields: [
        'reviewStars',
        'reviewCount',
      ],
      order: 'id DESC',
    }
    const reviews = await mdConn.selectOne(reviewStarModel, queryParam)
  object.reviewsStars = reviews.reviewStars || 0
  object.reviewsCount = reviews.reviewCount || 0
}

// Sync version
async function _appendVersion(object) {
  const queryParam = {
      where: {
        productId: object.id,
        // https://gogojungle.backlog.jp/view/OAM-29669
        // statusType: 1,
      },
      fields: [
        'version',
        'versionUpdatedAt',
      ],
      order: 'versionUpdatedAt DESC',
    }
    const version = await mdConn.selectOne(productVersionModel, queryParam)
  object.version = version.version || ''
  object.versionUpdatedAt = version.versionUpdatedAt || null
}

// Sync user introduction
async function _appendIntroduction(object) {
  const queryParam = {
      where: {
        userId: object.userId,
      },
      fields: [
        'content',
      ],
      order: 'id DESC',
    }
    const introduction = await mdConn.selectOne(userSelfIntroductionModel, queryParam)
  object.userSelfIntroduction = introduction.content || ''
}

// Sync user
async function _appendUser(object) {
  const queryParam = {
      where: {
        id: object.userId,
      },
      fields: [
        'nickName',
        'isDispConclusion',
        'corporateName',
      ],
      order: 'id DESC',
    }
    const user = await mdConn.selectOne(userModel, queryParam)
  object.nickName = user.nickName || ''
  object.isDispConclusion = user.isDispConclusion || ''
  object.corporateName = user.corporateName || ''
}

// Sync pays
async function _appendPays(object) {
  const queryParam = {
    where: {
      productId: object.id,
    },
    fields: [
      'payId',
    ],
    order: 'payId DESC',
  }
  object.pays = (await mdConn.select(productPayModel, queryParam)).map(item => item[queryParam.fields[0]]).join()
}


// Sync redirect
async function _appendRedirect(object) {
  const queryParam = {
      where: {
        masterId: object.id,
        masterType: 2,
      },
      fields: [
        'externalUrl',
        'internalUrl',
      ],
      order: 'id DESC',
    }
    const redirect = await mdConn.selectOne(redirectModel, queryParam)
  object.saleUrl = redirect.externalUrl || redirect.internalUrl || ''
}

// Sync keywords
async function _appendKeywords(object) {
  const queryParam = {
    where: {
      productId: object.id,
    },
    fields: [
      'keywordId',
    ],
    order: 'keywordId DESC',
  }
  object.keywords = (await mdConn.select(productKeywordModel, queryParam)).map(item => item[queryParam.fields[0]]).join()
}

// Sync categories
async function _appendCategories(object) {
  const queryParam = {
    where: {
      productId: object.id,
    },
    fields: [
      'categoryId',
    ],
    order: 'categoryId DESC',
  }
  object.categories = (await mdConn.select(productCategoryModel, queryParam)).map(item => item[queryParam.fields[0]]).join()
}

// Reset discount information
function _resetDiscount(object) {
  object.isSpecialDiscount = 0
  object.specialDiscountPrice = 0
  object.specialDiscountType = 0
  object.specialDiscountCount = 0
  object.specialDiscountStartAt = null
  object.specialDiscountEndAt = null
}

// Sync price
async function _appendPrice(object) {
  const queryParam = {
      where: {
        productId: object.id,
        statusType: 1,
      },
      fields: [
        'price',
        'specialDiscountPrice',
      ],
      order: 'id DESC',
    }
    const price = await mdConn.selectOne(productPriceModel, queryParam)
  object.price = price.price || 0
  object.specialDiscountPrice = price.specialDiscountPrice || 0

  // No discount
  if (object.isSpecialDiscount !== 1) {
    return _resetDiscount(object)
  }

  // Out of period
  const now = new Date().getTime()
    const from = new Date(object.specialDiscountStartAt * 1e3).getTime()
    const to = new Date(object.specialDiscountEndAt * 1e3).getTime()
  if (from > now || (to > 0 && to < now)) {
    return _resetDiscount(object)
  }

  // Discount type
  object.specialDiscountType = 0
  object.specialDiscountCount > 0 && object.specialDiscountType++
  (from > 0 && to > 0) && object.specialDiscountType++
}

// Sync product sets
async function _appendProductSet(object) {
  if (object.isSet) {
    const queryParam = {
        where: {
          statusType: 1,
          parentProductId: object.id,
        },
        fields: [
          'productId',
        ],
        order: 'productId DESC',
        limit: 0,
      }
      const setProducts = await mdConn.select(setProductModel, queryParam)
    object.subProductIds = setProducts.map(item => item.productId).join()
  } else {
    object.subProductIds = ''
  }
}

async function _appendSaleCount(object) {
  const queryParam = {
      where: {
        productId: object.id,
      },
      fields: [
        'salesCount',
        'expectedSalesCount',
      ],
      order: 'id DESC',
    }
    const salesCount = await mdConn.selectOne(saleCountModel, queryParam)
  object.salesCount = salesCount.salesCount || 0
  object.expectedSalesCount = salesCount.expectedSalesCount || 0
}

// Sync forward_at field
// object.forward_at = product.forward_at || article.published_at || product.created_at
async function _appendForwardAt(object, product) {
  if (product.isReservedStart == 1) {
    object.forwardAt = product.reservedStartAt
    return
  }

  // Get article, if it's a article, use published field
  // TODO: sync products & articles together
  if (product.typeId == 3) {
    const queryParam = {
        where: {
          productId: product.id,
        },
        fields: [
          'id',
          'productId',
          'isReservedStart',
          'publishedAt',
          'createdAt',
        ],
        order: 'id DESC',
      }
      const article = await mdConn.selectOne(articleModel, queryParam)

    object.forwardAt = !Object.keys(article).length || !article.isReservedStart
      ? product.createdAt
      : (article.reserveStartAt || article.publishedAt)
    return
  }
  object.forwardAt = product.createdAt
}

/**
 * Get forwad data with product id
 *
 * @param {Number} pId
 * @param {Number} oldDevId
 * @returns {Object}
 * @private
 */
async function _appendForward(pId, oldDevId) {
  const table = `si_${sprintf('%04d', pId)}_${sprintf('%04d', oldDevId)}_0000`
  let data = {},
    sql = 'SELECT * FROM '
  sql += '(SELECT MAX(CheckDate) as stop, MIN(CheckDate) as start FROM '
  sql += `${table}) as t1, `
  sql += `(SELECT IsOpen FROM ${table} ORDER BY IsOpen DESC LIMIT 1) as t2, `
  sql += `(SELECT MAX(Profit) as maxProfit, MIN(Profit) as maxLoss FROM ${table} `
  sql += 'WHERE IsOpen=0 AND Position<>\'Balance\') as t3, '
  sql += `(SELECT COUNT(*) as total FROM ${table}) as t4; `

  try {
    data = (await modelUtil.excuteQuery(FX_SYSTEM, sql))[0] || {}
  } catch (e) {
    // TODO: Do nothing ?
  }

  if (!data.total) {
    return {}
  }

  const maxLoss = parseInt(data.maxLoss) || 0
  return {
    period: (timeUtil.toUnix(data.stop) - timeUtil.toUnix(data.start)) / 86400,
    total: parseInt(data.total),
    maxProfit: parseInt(data.maxProfit),
    maxLoss: maxLoss < 0 ? maxLoss : 0, // OAM-14934, OAM-16179
    isOpen: parseInt(data.IsOpen),
  }
}

async function _cloneProductInfo(object, product) {
  object.isValid = product.isValid
  object.statusType = product.statusType
  object.typeId = product.typeId
  object.platformId = product.platformId
  object.userId = product.userId
  object.productName = product.name
  object.productNameEn = product.nameEn
  object.productNameTh = product.nameTh
  object.catchCopy = product.catchCopy
  object.isSaleStop = product.isSaleStop
  object.isSet = product.isSet
  object.isDvd = product.isDvd
  object.isFreeFirstMonth = product.isFreeFirstMonth
  object.isWebAuthentication = product.isWebAuthentication
  object.isSubscription = product.isSubscription
  object.isAdvising = product.isAdvising
  object.isSignalOnly = product.isSignalOnly

  // Discount logic: Check syncPrice
  object.isSpecialDiscount = product.isSpecialDiscount
  object.specialDiscountCount = product.specialDiscountCount
  object.specialDiscountStartAt = product.specialDiscountStartAt
  object.specialDiscountEndAt = product.specialDiscountEndAt

  // Reserved logic
  const isStart = product.isReservedStart === 1 ? 1 : 0
    const isEnd = product.isReservedEnd === 1 ? 1 : 0
  object.isReservedStart = isStart
  object.isReservedEnd = isEnd
  object.reservedStartAt = isStart ? product.reservedStartAt : 0
  object.reservedEndAt = isEnd ? product.reservedEndAt : 0

  if (! object.reservedStartAt) {
    object.isReservedStart = null
  }

  if (! object.reservedEndAt) {
    object.isReservedEnd = null
  }

  // Limit
  const isLimit = product.isLimited == 1 ? 1 : 0
  object.isLimited = isLimit
  object.upperLimit = isLimit ? product.upperLimit : 0

  // Password
  object.passwordType = product.isPassword || 0
  object.pagePassword = object.passwordType > 0 ? product.pagePassword : null
}

async function getFxProduct(id) {
  const queryParam = {
    where: {
      id: id,
      isValid: {
        inq: [0, 1],
      },
      typeId: 1,
      // statusType: {
      //   gte: 1,
      // },
      userId: {
        gt: 0,
      },
      languages: {
        like: '%ja%',
      },
    },
  }
  return await mdConn.selectOne(productModel, queryParam)
}

/**
 * Get question Total
 *
 * @param {Number} ProductID
 * @returns {Number}
 * @private
 */
async function _questionTotal(productId) {
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
 * Get keywordIds by priority
 *
 * @returns {Array}
 * @private
 */
async function _getKeywordIds() {
  const keywords = await keywordsModel.find({
    where: {
      isValid: 1,
    },
    fields: {
      id: true,
      priority: true,
    },
    order: 'priority ASC',
  })
  return arrayUtil.column(keywords, 'id')
}

/**
 * Get categoryIds by priority
 *
 * @returns {Array}
 * @private
 */
async function _getCategoryIds() {
  return arrayUtil.column(await categoriesModel.find({
    where: {
      isValid: 1,
    },
    fields: {
      id: true,
      priority: true,
    },
    order: 'priority ASC',
  }), 'id')
}

/**
 * Sort product keywords by keyword Ids
 *
 * @param {String} productKeywords
 * @param {Array} keywordIds
 * @returns {String}
 * @private
 */
function _sortKeywordsProduct(productKeywords, keywordIds) {
  if (!productKeywords) {
    return ''
  }

  const arrProductKeywords = productKeywords.split(',').map(Number)
  const sortedKeywords = keywordIds.filter(keywordId => arrProductKeywords.includes(keywordId))

  return sortedKeywords.toString()
}

/**
 * Sort product keywords by category priority
 *
 * @param {String} productKeywords
 * @param {Array} keywordIds
 * @returns {String}
 * @private
 */
function _sortCategoriesProduct(productCategories, categoryIds) {
  if (!productCategories) {
    return ''
  }

  const arrProductCategories = productCategories.split(',').map(Number)
  const sortedCategories = categoryIds.filter(categoryId => arrProductCategories.includes(categoryId))

  return sortedCategories.toString()
}

module.exports = {
  show,
  subProduct,
  onDiscount,
  product,
  syncSf,
  products,
  name,
  checkPagePassword,
  checkCartPassword,
  getFxProduct,
  appendSetProducts,
  getSfPdDetail,
  buildRelationalFxData,
  buildUpInsertFxData,
  getPassword,
  getSfPdDetails,
}
