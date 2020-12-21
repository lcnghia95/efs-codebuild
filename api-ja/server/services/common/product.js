const app = require('@server/server')
const productModel = app.models.Products
const sfProductDetailModel = app.models.SurfaceProductDetails
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
// const communityModel = app.models.Communities
// const keywordsModel = app.models.Keywords
const productMultiLanguagesModel = app.models.ProductMultiLanguages
const cookieModule = require('cookie')
const crypto = require('crypto')

const { excuteQuery } = require('@@server/utils/model')
const queryUtil = require('@ggj/utils/utils/query')
const cryptoUtil = require('@@server/utils/crypto')

const nameLangMap = {
  1: 'productName',
  2: 'productNameEn',
  3: 'productNameTh',
  4: 'productNameVi',
}

const outlineLangMap = {
  1: 'productOutline',
  2: 'productOutlineEn',
  3: 'productOutlineTh',
  4: 'productOutlineVi',
}

const PASSWORD_FROM_INPUT = 1

const PASSWORD_FROM_COOKIE = 2

const PAGE_PASSWORD_COOKIE_PERIOD = 3600000 // 1 hour

const LANGUAGE = process.env.LANGUAGE || 1

/**
 * Get Product by list Id
 *
 * @param {Array} productIds
 * @param {String} fields
 * @returns {Promise<Array>}
 * @public
 */
async function getProducts(productIds, fields) {
  if (productIds.length == 0) {
    return []
  }
  return await productModel.find({
    where: {
      isValid: 1,
      id: {
        inq: productIds,
      },
    },
    fields: queryUtil.fields(fields),
  })
}

/**
 * Get systemtrade data with product id
 *
 * @param {Number} ProductID
 * @returns {Object}
 * @private
 */
async function _appendSystemtrade(ProductID) {
  const sql = `SELECT ID,CreatedDate,UpdatedDate,ProductID,LotsTotal,TradesTotal,ProfitTrades,LossTrades,
    WinningRate,GrossProfit*1 as GrossProfit,GrossLoss*1 as GrossLoss,ProfitFactor,RiskRewardRatio,PipsTotal,SwapTotal,ProfitTotal*1 as ProfitTotal,
    ProfitAndSwapTotal*1 as ProfitAndSwapTotal,BuyTrades,SellTrades,MaxDDPercent,MaxDDPrice,ProfitAtDD,MaxProfit,IncreaseRate,
    MaxDownWithEquity,RecommendedMargin,BaseMargin,PairRate,LotsAverage,MaxPosition,Equity
    FROM ns_collect_total_all
    WHERE ProductID=${ProductID}
    ORDER BY ID
    LIMIT 1`
  const data = await excuteQuery('fx_system', sql)
  return (data || [])[0] || {}
}

async function syncProduct(id, input = {}, sendBack = true) {
  if (!id) {
    return {}
  }

  let [product, sfPdDetail] = await Promise.all([
    _getProduct(id),
    _getSfPdDetail(id),
  ])

  if (!Object.keys(product).length) {
    return {}
  }

  const isSfPrd = Object.keys(sfPdDetail).length

  // https://gogojungle.backlog.jp/view/OAM-38034
  if (!product.isValid || !product.statusType) {
    const buildProduct = {
      id: product.id,
      isSync: 1, // Mark sync
      isValid: product.isValid,
      productId: product.id,
      statusType: product.statusType,
    }

    isSfPrd && (await sfPdDetail.updateAttributes(buildProduct))

    return {}
  }

  let isNeedSync = false
  if (isSfPrd) {
    isNeedSync = sfPdDetail.updatedAt < parseInt(Date.now() / 1000) - 60
  }

  if (isNeedSync || !isSfPrd) {
    sfPdDetail = await _buildSyncData(product, !isSfPrd)
  }

  if (!sendBack) {
    return {}
  }

  // If product have password, don't cache it
  if (sfPdDetail.passwordType > 0) {
    app.emit('setHeader' + input.requestId, 'no-cache', 1)
  }

  if (sfPdDetail.passwordType === 1) {
    const res = await checkPagePassword(sfPdDetail, input)

    // No password or incorrect password
    if (Object.keys(res).length) {
      if (sfPdDetail.statusType == 9) {
        res.statusType = 9
      }
      // return res
      return { product, sfPdDetail: res }
    }
    // Correct password
    sfPdDetail.status = 1
  }

  if (sfPdDetail.passwordType === 2) {
    const res = await checkCartPassword(sfPdDetail, input)

    // No password or incorrect password
    if (res === 2) {
      sfPdDetail.status = 0
    }

    // Correct password
    if (res === 1) {
      sfPdDetail.status = 1
    }
  }

  return { product, sfPdDetail }
}

async function _getProduct(id, input = {}) {
  const queryParam = {
    where: {
      id: id,
      isValid: {
        inq: [0, 1],
      },
      // statusType: {
      //   gte: 1,
      // },
      userId: {
        gt: 0,
      },
    },
  }
  if (input.typeIds) {
    queryParam.typeId = {
      inq: input.typeIds.split(','),
    }
  }
  return (await productModel.findOne(queryParam)) || {}
}

async function _getSfPdDetail(id) {
  return (
    (await sfProductDetailModel.findOne({
      where: {
        id: id,
        isValid: {
          inq: [0, 1],
        },
      },
    })) || {}
  )
}

async function _buildSyncData(product, isEmptySfpd) {
  const buildProduct = {
    id: product.id,
    isSync: 1, // Mark sync
    isValid: product.isValid,
    productId: product.id,
  }

  _cloneProductInfo(buildProduct, product)

  await Promise.all([
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
    _buildLanguageData(buildProduct, product),
  ])

  const pdMdObj = Object.assign({}, buildProduct)

  if (isEmptySfpd) {
    await sfProductDetailModel.create(pdMdObj)
  } else {
    await sfProductDetailModel.updateAll(
      {
        id: pdMdObj.id,
        isValid: {
          inq: [0, 1],
        },
      },
      pdMdObj,
    )
  }

  return buildProduct
}

async function _buildLanguageData(object, product) {
  if (!product.languages.includes(',')) {
    return
  }
  const langData =
    (await productMultiLanguagesModel.find({
      where: {
        productId: product.id,
        isValid: 1,
      },
      fields: {
        productId: true,
        name: true,
        languages: true,
      },
    })) || []
  // langData = arrayUtil.index(langData, 'languages')
  langData.map(e => {
    if (e.languages) {
      object[nameLangMap[e.languages]] = e.name
    }
  })
}

async function _cloneProductInfo(object, product) {
  object.isValid = product.isValid
  object.statusType = product.statusType
  object.typeId = product.typeId
  object.platformId = product.platformId
  object.userId = product.userId
  object.productName = product.name
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

  if (!object.reservedStartAt) {
    object.isReservedStart = null
  }

  if (!object.reservedEndAt) {
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

// Sync favorite
async function _appendFavorite(object) {
  const queryParam = {
    productId: object.id,
  }
  object.favoriteCount = await favoriteProductModel.count(queryParam)
}

// Sync transaction
async function _appendTransaction(object) {
  // Display transaction of GogoJungle for systemtrade product
  // Or Display transaction of GogoJungle for salon product
  const userId =
    object.typeId == 1 ||
    (object.isAdvising == 1 && object.isDispConclusion == 0)
      ? 110001
      : object.userId
  const queryParam = {
    where: {
      userId: userId,
    },
    fields: {
      content: true,
    },
    order: 'id DESC',
  }
  let transaction = (await transactionModel.findOne(queryParam)) || {}

  object.isTransaction = parseInt(Object.keys(transaction).length || 0) && 1
  const content = convert_crlf_br(transaction.content || '')
  if (content.length > 0 || !(object.isAdvising == 1 && object.typeId == 4)) {
    object.transaction = content
  } else {
    queryParam.where.userId = 110001
    transaction = (await transactionModel.findOne(queryParam)) || {}
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
      // languages: LANGUAGE,
    },
    order: 'id DESC',
  }
  const outline = (await productOutlineModel.find(queryParam)) || []

  // send slack if dont have outline th
  // if(!outline || !outline.outline){
  //   slackCommonService.sendSlackLanguages(productOutlineModel, [object.id], 'productId')
  // }
  outline.map(e => {
    if (outlineLangMap[e.languages]) {
      object[outlineLangMap[e.languages]] = (e.outline || '')
        .replace(/http:\/\/fx-on\.com/gi, 'https://fx-on.com')
        .replace(/src="\/asp/gi, 'src="https://fx-on.com/asp')
    }
  })

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
    fields: {
      reviewStars: true,
      reviewCount: true,
    },
    order: 'id DESC',
  }
  const reviews = (await reviewStarModel.findOne(queryParam)) || {}
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
    fields: {
      version: true,
      versionUpdatedAt: true,
    },
    order: 'versionUpdatedAt DESC',
  }
  const version = (await productVersionModel.findOne(queryParam)) || {}
  object.version = version.version || ''
  object.versionUpdatedAt = version.versionUpdatedAt || null
}

// Sync user introduction
async function _appendIntroduction(object) {
  const queryParam = {
    where: {
      userId: object.userId,
    },
    fields: {
      content: true,
    },
    order: 'id DESC',
  }
  const introduction =
    (await userSelfIntroductionModel.findOne(queryParam)) || {}
  object.userSelfIntroduction = introduction.content || ''
}

// Sync user
async function _appendUser(object) {
  const queryParam = {
    where: {
      id: object.userId,
    },
    fields: {
      nickName: true,
      isDispConclusion: true,
      corporateName: true,
    },
    order: 'id DESC',
  }
  const user = (await userModel.findOne(queryParam)) || {}
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
    fields: {
      payId: true,
    },
    order: 'payId DESC',
  }
  object.pays = ((await productPayModel.find(queryParam)) || [])
    .map(item => item[queryParam.fields[0]])
    .join()
}

// Sync redirect
async function _appendRedirect(object) {
  const queryParam = {
    where: {
      masterId: object.id,
      masterType: 2,
    },
    fields: {
      externalUrl: true,
      internalUrl: true,
    },
    order: 'id DESC',
  }
  const redirect = (await redirectModel.findOne(queryParam)) || {}
  object.saleUrl = redirect.externalUrl || redirect.internalUrl || ''
}

// Sync keywords
async function _appendKeywords(object) {
  const queryParam = {
    where: {
      productId: object.id,
    },
    fields: {
      keywordId: true,
    },
    order: 'keywordId DESC',
  }
  object.keywords = ((await productKeywordModel.find(queryParam)) || [])
    .map(item => item[queryParam.fields[0]])
    .join()
}

// Sync categories
async function _appendCategories(object) {
  const queryParam = {
    where: {
      productId: object.id,
    },
    fields: {
      categoryId: true,
    },
    order: 'categoryId DESC',
  }
  object.categories = ((await productCategoryModel.find(queryParam)) || [])
    .map(item => item[queryParam.fields[0]])
    .join()
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
    fields: {
      price: true,
      specialDiscountPrice: true,
    },
    order: 'id DESC',
  }
  const price = (await productPriceModel.findOne(queryParam)) || {}
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
  from > 0 && to > 0 && object.specialDiscountType++
}

// Sync product sets
async function _appendProductSet(object) {
  if (object.isSet) {
    const queryParam = {
      where: {
        statusType: 1,
        parentProductId: object.id,
      },
      fields: {
        productId: true,
      },
      order: 'productId DESC',
      limit: 0,
    }
    const setProducts = (await setProductModel.find(queryParam)) || []
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
    fields: {
      salesCount: true,
      expectedSalesCount: true,
    },
    order: 'id DESC',
  }
  const salesCount = (await saleCountModel.findOne(queryParam)) || {}
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
      fields: {
        id: true,
        productId: true,
        isReservedStart: true,
        publishedAt: true,
        createdAt: true,
      },
      order: 'id DESC',
    }
    const article = (await articleModel.findOne(queryParam)) || {}

    object.forwardAt =
      !Object.keys(article).length || !article.isReservedStart
        ? product.createdAt
        : article.reserveStartAt || article.publishedAt
    return
  }
  object.forwardAt = product.createdAt
}

async function checkPagePassword(record, input) {
  const id = record.productId
  const password = await getPassword(id, input)
  const type = password.type
  const pass = password.password || ''

  if (!pass) {
    return {
      isPassword: 1,
      name: record[nameLangMap[LANGUAGE]],
    }
  }

  if (pass != record.pagePassword) {
    if (type === PASSWORD_FROM_COOKIE) {
      return {
        isPassword: 1,
        name: record[nameLangMap[LANGUAGE]],
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
  return new Promise(resolve => {
    app.on('header' + input.requestId, function(cookie) {
      const cookies = cookie ? cookieModule.parse(cookie) : {}
      resolve(
        input.pagePassword
          ? {
              type: PASSWORD_FROM_INPUT,
              password: input.pagePassword.toString(),
            }
          : {
              type: PASSWORD_FROM_COOKIE,
              password: cryptoUtil.decrypt(cookies[_key(id)] || ''),
            },
      )
    })
    app.emit('getHeader' + input.requestId, 'cookie')
  })
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
  return new Promise((resolve, reject) => {
    const success = app.emit(
      'setHeader' + requestId,
      'Set-Cookie',
      cookieModule.serialize(_key(id), cryptoUtil.encrypt(password), {
        expires: new Date(Date.now() + PAGE_PASSWORD_COOKIE_PERIOD),
        path: '/',
      }),
    )

    if (!success) {
      return reject(new Error('Set cookie fail'))
    }
    resolve()
  })
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

module.exports = {
  getProducts,
  _appendSystemtrade,
  syncProduct,
}
