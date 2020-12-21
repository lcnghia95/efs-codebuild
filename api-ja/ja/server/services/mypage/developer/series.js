const app = require('@server/server')
const priceCommonService = require('@services/common/price')
const productService = require('./product.js')
const outlineService = require('./outline')
const priceService = require('./price')
const articleService = require('./article.js')
const helper = require('./helper')

const seriesModel = app.models.Series
const productModel = app.models.Products
const saleModel = app.models.Sales
const articleModel = app.models.Articles

const arrayUtil = require('@ggj/utils/utils/array')
const modelUtil = require('@server/utils/model')
const crypto = require('@server/utils/crypto')
const syncService = require('@services/common/synchronize')
const lodash = require('lodash')
const objectUtil = app.utils.object
const _map = lodash.map
const _isEmpty = lodash.isEmpty
const _inRange = lodash.inRange

const SERIE_TYPE_ID = 3
async function index(userId) {
  const fields = 'id,name,statusType,isPassword,productPriceId,isSpecialDiscount,specialDiscountCount,specialDiscountStartAt,specialDiscountEndAt'
    const products = await app.models.Products.find({
      where: {
        userId,
        isValid: 1,
        typeId: SERIE_TYPE_ID,
      },
      fields: app.utils.query.fields(fields),
    })
    const productIds = arrayUtil.column(products, 'id')
    const productObjects = objectUtil.arrayToObject(products)
    const prices = await priceCommonService.getPricesByProductIds(
      arrayUtil.column(products, 'id'),
    )
    const priceObjects = await priceCommonService.priceObjects(prices, productObjects)
    const series = seriesModel.find({
      where: {
        productId: {
          inq: productIds,
        },
        isValid: 1,
      },
      fields: {
        id: true,
        statusType: true,
        productId: true,
        categoryId: true,
        endAt: true,
      },
    })
  return series.map(serie => {
    const productId = serie.productId
      const product = productObjects[productId] || {}
      const price = helper.price(product, priceObjects)
      // priceObject = (priceObjects[product.id] || [])
      //   .find(price => price.id == product.productPriceId) || {},
      // price = priceObject.price || 0

    return objectUtil.filter({
      id: serie.id,
      endAt: serie.endAt || 0,
      categoryId: serie.categoryId || 0,
      pId: productId,
      name: product.name || null,
      status: product.statusType || 0,
      // status: serie.statusType || 0,
      isPassword: product.isPassword || 0,
      password: product.password || '',
      margin: product.margin,
      price,
      isFree: price == 0 ? 1 : 0,
    })
  })
}

/**
 * Convert timestamp
 * @param {string} timeString
 * @returns {Number}
 * @private
 */
function _getTimeStamp(timeString) {
  return new Date(timeString).getTime()
}

/**
 *
 * @param {array} arr1
 * @param {array} arr2
 * @param {string} field
 * @private
 * @return {array}
 */
function _mergeArray(listSeries, listArticle){
  const objectArticle = objectUtil.arrayToObject(listArticle, 'seriesId')
  return listSeries.map(item => {
    const articleObject = objectArticle[item.id] || {}
    item.count = articleObject.count || 0
    return item
  })
}

/**
 * Get info series by id
 *
 * @param {string} userId
 * @param {string} id
 * @returns {Object}
 * @private
 */
async function getSeriesByid(userId, id){
  return await seriesModel.findOne({
    where:{
      userId,
      id,
      isValid: 1,
    },
    fields: {
      id: true,
      statusType: true,
      productId: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

/**
 * Get info series by article id
 *
 * @param {string} userId
 * @param {string} articleId
 * @returns {Object}
 * @private
 */
async function getSeriesByArticleId(userId, articleId){
  return await seriesModel.findOne({
    where: {
      userId,
      articleId,
      isValid: 1,
    },
    fields: {
      id: true,
      statusType: true,
      productId: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

/**
 * Get info series by userId
 *
 * @param {string} userId
 * @returns {Array}
 * @private
 */
async function getListSeriesByUserId(userId){
  if(!userId){
    return []
  }
  const products = await productService.getProductByUserId(userId,'id,seriesId,name')
  const productIds = arrayUtil.column(products, 'id')
  const productObjects = objectUtil.arrayToObject(products)
  const listSeries =  await seriesModel.find({
    where: {
      productId: {
        inq: productIds,
      },
      isValid: 1,
      statusType: {neq: 2},
    },
    fields: {
      id: true,
      statusType: true,
      productId: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return listSeries.map(series => {
    const productId = series.productId
    return {
      id: series.id,
      title: productObjects[productId].name,
    }
  })
}

/**
 * get list Series By query string
 * @param {string} userId
 * @param {Object} opt
 * @returns {array}
 * @private
 */
async function _getSeriesByQuery(userId, opt = {} ) {
  const page = parseInt(opt.page) || 1
  const limit = parseInt(opt.limit) || 10
  const skip = ( page - 1 ) * limit
  const paramSql = []
  const listProduct = await productModel.find({
    where: {
      userId,
      isValid: 1,
    },
    fields: {
      id: true,
      name: true,
    },
  })
  let listProductId = _map(listProduct, 'id')
  const sql = {}
        sql.SELECT =  `
                        SELECT  navi.series.id as id,  navi.series.category_id as categoryId,
                              navi.series.product_id as productId,
                              navi.series.status_type as statusType,  navi.series.created_at as createdAt,
                              navi.series.updated_at as updatedAt
                      `
        sql.FROM = 'FROM navi.series'
        sql.WHERE = 'WHERE navi.series.is_valid = 1'
        sql.ORDERBY = ''
        sql.LIMIT = `LIMIT ${limit} OFFSET ${skip}`
        sql.SELECTCOUNT = `${sql.SELECT}, count(navi.series.id) as count`

  if(opt.status_type && [0,1,2].includes(parseInt(opt.status_type))) {
    sql.WHERE += ' AND navi.series.status_type = ?'
    paramSql.push(opt.status_type)
  }

  if(opt.keyword) {
    const key = decodeURIComponent(opt.keyword)
    const listByKeyword = listProduct.filter(item => item.name.toLowerCase().includes(key))
    listProductId = _map(listByKeyword,'id')
  }

  sql.WHERE += listProductId.length > 0 ?  ' AND navi.series.product_id in (' + listProductId.toString() + ')'  : ' AND navi.series.product_id = -1'

  const queryRecord = `
                  SELECT series.*, common.sales_count.sales_count as salesCount
                  FROM  (
                          ${sql.SELECT}
                          ${sql.FROM}
                          ${sql.WHERE}
                        ) as series
                  LEFT JOIN common.sales_count
                  ON series.productId = common.sales_count.product_id
                `
  const queryTotal =  `
                  SELECT count(*) as count
                  ${sql.FROM}
                  ${sql.WHERE}
                `
  const [totalRecord, listSeries] = await Promise.all([
    (await modelUtil.excuteQuery('master',queryTotal, paramSql))[0],
    await modelUtil.excuteQuery('master' ,queryRecord, paramSql),
  ])
  const listSeriesId = _map(listSeries, 'id')
  const listArticles = await articleService.countArticleBySerieIds(listSeriesId)
  let seriesArticle = _mergeArray(listSeries,listArticles,'id', 'seriesId', 'count').map(item => {
    item.count = item.count || 0
    return item
  })

  if(opt.created_at){
    seriesArticle = seriesArticle.sort((item1, item2) => {
      return parseInt(opt.created_at) == -1 ? _getTimeStamp(item2.createdAt) - _getTimeStamp(item1.createdAt) : _getTimeStamp(item1.createdAt) - _getTimeStamp(item2.createdAt)
    })
  }
  if(opt.updated_at){
    seriesArticle = seriesArticle.sort((item1, item2) => {
      return  parseInt(opt.updated_at) == -1 ? _getTimeStamp(item2.updatedAt) - _getTimeStamp(item1.updatedAt) : _getTimeStamp(item1.updatedAt) - _getTimeStamp(item2.updatedAt)
    })
  }
  if(opt.sales){
    seriesArticle = seriesArticle.sort((item1, item2) => {
      return  parseInt(opt.sales) == -1 ? item2.salesCount - item1.salesCount : item1.salesCount - item2.salesCount
    })
  }
  if(opt.article){
    seriesArticle = seriesArticle.sort((item1, item2) => {
      return  parseInt(opt.article) == -1 ? item2.count - item1.count : item1.count - item2.count
    })
  }
  return [totalRecord,seriesArticle.splice(skip, skip + limit),listProduct]
}

/**
 * validate logic to create and update series
 *
 * @param {object} data
 * @param {object} series
 * @param {object} product
 * @param {object} productPrice
 * @private
 * @return {boolean}
 */
function _validateInput( data={}, series = {}, product = {}, productPrice = {} ){
  const {
    title ,
    content,
    price,
    margin,
    categoryId,
    isSpecialDiscount,
    specialDiscountPrice,
    specialDiscountEndAt,
    specialDiscountStartAt,
    pagePassword ,
    isPassword,
    statusType,
  } = data

  const errFields = []
  let errMess = ''

  // validdate logic
  if(!title){
    errFields.push('title')
  }

  if(statusType == 1){
    if(isPassword && !pagePassword){
      errFields.push('pagePassword')
    }
    if(pagePassword && !isPassword){
      errFields.push('isPassword')
    }
    if(!content ){
      errFields.push('content')
    }
    if((!price && margin ) || (price && price < 400)){
      errFields.push('price')
    }
    if(price && !_inRange(margin,0,100)){
      errFields.push('margin')
    }
    if(!categoryId){
      errFields.push('categoryId')
    }
    if(isSpecialDiscount){
      if((specialDiscountStartAt < (Date.now()/1000))){
        errFields.push('specialDiscountStartAt')
      }
      if(specialDiscountStartAt > specialDiscountEndAt){
        errFields.push('specialDiscountEndAt')
      }
      if(!specialDiscountPrice){
        errFields.push('specialDiscountPrice')
      }
    }
    // publish and block update
  }

  if(!_isEmpty(series)){
    if(
        !(
          data.specialDiscountPrice == productPrice.specialDiscountPrice
          && data.specialDiscountStartAt == product.specialDiscountStartAt
          && data.specialDiscountEndAt == product.specialDiscountEndAt
          && data.isSpecialDiscount == product.isSpecialDiscount
        )
      ){
      if((series.statusType == 1) && ((Date.now() - series.updatedAt*1000)/(86400*1000)) <= 30 ){
        errMess = 'limit30Day'

      }
      if(!series.statusType ){
        errMess = 'limit30Day'
      }
    }
  }

  if(errFields.length > 0 || errMess){
    return{ errFields, errMess}
  }
  return true
}

/**
 * validate data to create and update series
 * @param {object} data
 * @private
 * @returns {object}
 */
async function _validateFields(  data = {}){
  const {
    isPassword = 2,
    pagePassword = '',
    price = 0,
    title = '',
    content = '',
    articles = [],
    categoryId = 0,
    statusType = 0,
    isFreeFirstMonth = 0,
    isSpecialDiscount = 0,
    specialDiscountPrice = 0,
    specialDiscountEndAt = 0,
    specialDiscountStartAt = 0,
    margin = 0,
  } = data
  return {
    price: (Number.isInteger(price*1) && price >= 0 ) ? price*1 : 0,
    title,
    margin,
    isPassword,
    pagePassword,
    content,
    articles,
    categoryId:  (await helper.getListIdNaviCategories()).includes(parseInt(categoryId)) ? parseInt(categoryId) : 0,
    specialDiscountPrice: (Number.isInteger(specialDiscountPrice*1) && specialDiscountPrice >= 0 ) ? specialDiscountPrice*1 : 0,
    specialDiscountEndAt: specialDiscountEndAt,
    specialDiscountStartAt: specialDiscountStartAt,
    statusType: [0,1].includes(statusType) ? statusType : 0,
    isSpecialDiscount: [0,1].includes(isSpecialDiscount) ? isSpecialDiscount : 0,
    isFreeFirstMonth: [0,1].includes(isFreeFirstMonth) ? isFreeFirstMonth : 0,
  }
}

/**
 *
 * @param {number} userId
 * @private
 * @return {Promise<array>}
 */
async function _countSeriesByStatus(userId){
  const listProduct = await productModel.find({
    where:{
      userId,
      isValid: 1,
    },
    fields: {
      id: true
    }
  })
  const listProductId = _map(listProduct, 'id')
  if(listProductId.length <= 0){
    return [
      {
        '0': 0,
        '1': 0,
        '2': 0
      }
    ]
  }
  const sql = `SELECT IFNULL(SUM(sr.status_type = 0), 0) AS '0',
                      IFNULL(SUM(sr.status_type = 1), 0 ) AS '1',
                      IFNULL(SUM(sr.status_type = 2), 0 ) AS '2'
              FROM navi.series as sr
              WHERE is_valid = 1 AND product_id in ${'(' + listProductId.toString() + ')'}
  `
  return modelUtil.excuteQuery('master', sql)
}

/**
 * get list Series By query string
 * @param {string} userId
 * @param {Object} opt
 * @returns {array}
 * @private
 */
async function getSeries(userId, opt = {} ) {

  if(userId == 0 ){
    return {}
  }

  const [ totalRecord, listSeries, listProduct] = await _getSeriesByQuery(userId, opt)
  const listProductId = _map(listSeries, 'productId').filter(id => id !== 0)
  const [listProductsContent, listProductPrice, statusCount ] = await Promise.all([
    productService.getProductContent(listProductId),
    priceService.getListPriceByProductId(listProductId),
    _countSeriesByStatus(userId)
  ])
  const productPricesObject = objectUtil.arrayToObject(listProductPrice, 'productId')
  const productObject = objectUtil.arrayToObject(listProduct, 'id')
  const data = listSeries.map(series => {
    const productId = series.productId || 0
    const productUnFree = productPricesObject[productId] || {}
    const productContent = listProductsContent[productId] || {}
    const product = productObject[productId] || {}
    return {
      id: series.id,
      pId: series.productId,
      name: product.name || '',
      status: series.statusType,
      articles: series.count || 0,
      categoryId: series.categoryId,
      sales: series.salesCount || 0,
      content: productContent.outline || '',
      isFree:  productUnFree.price ? 0 : 1,
      createdAt: _getTimeStamp(series.createdAt),
      updatedAt: _getTimeStamp(series.updatedAt),
    }
  })
  return {
    total: totalRecord.count,
    data : data,
    statusCount: statusCount[0]
  }
}

/**
 * get data to edit series
 * @param {number} userId
 * @param {number} seriesId
 * @public
 * @return {object}
 *
 */
async function show(userId, seriesId){
  if(!userId || !seriesId) {
    return {code: 400}
  }
  const series = await getSeriesByid(userId, seriesId)
  if(!series || _isEmpty(series)){
    return {code: 404}
  }
  const productId = series.productId || 0
  const product = await productService.getProductById(userId, productId, 'id,affiliateMargin,name,productPriceId,isSpecialDiscount,specialDiscountStartAt,specialDiscountEndAt,isFreeFirstMonth,isPassword,pagePassword')
  if(!product || _isEmpty(product)){
    return {code: 400}
  }
  const [ articles, articlesNoneSeries, productContent] = await Promise.all([
    articleService.getArticlesBySeriesId(userId, seriesId, 'id,title,statusType,productId'),
    articleService.getArticlesNoneSeries(userId, 'id,title,statusType'),
    outlineService.getOutlines(productId),
  ])
  const productPriceId = product.productPriceId || 0
  const productPrice = await priceService.getPriceById(userId, productPriceId, 'id,price,specialDiscountPrice')
  return {
    articles,
    id: series.id,
    articlesNoneSeries,
    title: product.name || '',
    createdAt: series.createdAt,
    updatedAt: series.updatedAt,
    productId: series.productId,
    categoryId: series.categoryId,
    statusType: series.statusType,
    price: productPrice.price || 0,
    isPassword: product.isPassword || 0,
    margin: product.affiliateMargin || 0,
    naviCategoryId: series.naviCategoryId,
    content: productContent.outline || '',
    pagePassword: product.pagePassword || '',
    isFreeFirstMonth: product.isFreeFirstMonth || 0,
    isSpecialDiscount: product.isSpecialDiscount || 0,
    specialDiscountEndAt: product.specialDiscountEndAt || 0,
    specialDiscountStartAt: product.specialDiscountStartAt || 0,
    specialDiscountPrice: productPrice.specialDiscountPrice || 0,
    isBlockCampain: +((series.statusType == 1) && ((Date.now() - series.updatedAt*1000)/(86400*1000)) <= 30 ) || +(!series.statusType),

  }
}

/**
 * create series
 *
 * @param {object} meta
 * @param {object} data
 */
async function createSeries(meta, data = {}) {

  // validate

  const { userId, userAgent, ipAddress } = meta
  if(userId == 0 || _isEmpty(data) ){
    return {code: 400, errrMess: 'userNotAvailable'}
  }

  const newData = await _validateFields(data)

  const checkValidate = _validateInput(newData)
  if(checkValidate !== true){
    return { code: 400, errMess: checkValidate.errMess ? checkValidate.errMess : 'errData' , message: checkValidate.errFields}
  }

  // create product and product price
  const [product, productPrice] = await productService.createProductHasPrice({
    isFreeFirstMonth: newData.isFreeFirstMonth,
    price:newData.price,
    title:newData.title,
    userId:userId,
    margin:newData.margin,
    userAgent,
    ipAddress,
    statusType: newData.statusType,
    isSpecialDiscount:newData.isSpecialDiscount,
    specialDiscountPrice:newData.specialDiscountPrice,
    specialDiscountEndAt:newData.specialDiscountEndAt,
    specialDiscountStartAt:newData.specialDiscountStartAt,
    isPassword: newData.isPassword,
    pagePassword: newData.pagePassword,
    isSubscription: 1,
    chargeType: 2
  })

  // create product outline
  const productOutline = await outlineService.createProductOutline(meta, product.id, {  userId, userAgent, ipAddress,content: newData.content, statusType: newData.statusType })

  // create new series
  const series = await seriesModel.create({
    content:newData.content,
    productId: product.id,
    statusType: newData.statusType,
    userId,
    userAgent,
    ipAddress,
    categoryId:newData.categoryId,
    naviCategoryId: newData.categoryId,
    isValid: 1,
    endAt: 0
  })

  // update list article
  const listArticles = await articleService.updateArticleSeriesID(newData.articles,series.id, userId)

  // sync data
  syncService.syncDataToFxon('series', series.id)

  const newSeries = await getSeriesByid(userId, series.id)
  return {
    id: newSeries.id,
    title: product.name || '',
    productId: product.id || 0,
    articles: listArticles || [],
    price: productPrice.price || 0,
    updatedAt: newSeries.updatedAt,
    createdAt: newSeries.createdAt,
    statusType: newSeries.statusType || 0,
    categoryId: newSeries.categoryId || 0,
    margin: product.affiliateMargin || 0,
    isFreeFirstMonth: product.isFreeFirstMonth,
    isSpecialDiscount: product.isSpecialDiscount || 0,
    content: crypto.decrypt(productOutline.outline) || '',
    isPassword: product.isPassword,
    pagePassword: crypto.decrypt(product.pagePassword) || '',
    specialDiscountPrice: productPrice.specialDiscountPrice || 0,
    specialDiscountEndAt: _getTimeStamp(product.specialDiscountEndAt)/1000 || 0,
    specialDiscountStartAt: _getTimeStamp(product.specialDiscountStartAt)/1000 || 0,
    isBlockCampain: +(series.statusType == 1 || !newSeries.statusType) ,
  }
}

/**
 * update series
 *
 * @param {number} userId
 * @param {number} id
 * @param {object} data
 */
async function updateSeries(userId, id, data = {}){
  // validate user and data
  if(userId == 0 || _isEmpty(data)){
    return {code: 400, errMess: 'userNotAvailable'}
  }
  const newData = await _validateFields(data)
  // get old series and check
  const series = await getSeriesByid(userId, id)

  if(!series || _isEmpty(series) || [2].includes(series.statusType) || ![0,1].includes(newData.statusType)) {
    return {code: 404, errMess: 'seriesNotAvailable'}
  }
  const [oldProduct, oldPrice] = await Promise.all([
    productService.getProductById(userId, series.productId, 'id,affiliateMarin,specialDiscountEndAt,specialDiscountStartAt,isSpecialDiscount'),
    priceService.getPriceByProductId(series.productId),
  ])
  // validate
  const checkValidate = _validateInput(newData,series,oldProduct,oldPrice)
  if(checkValidate !== true){
    return { code: 400, errMess: checkValidate.errMess ? checkValidate.errMess : 'errData' , message: checkValidate.errFields }
  }

  // update product and product price
  const productId = series.productId
  const checkProduct  = await productService.getProductById(userId, productId)
  if(!checkProduct || _isEmpty(checkProduct)){
    return {code: 400, errMess: 'seriesNotAvailable'}
  }
  const filedsProduct = {
    isSpecialDiscount: newData.isSpecialDiscount,
    specialDiscountEndAt: newData.specialDiscountEndAt,
    specialDiscountStartAt: newData.specialDiscountStartAt,
    statusType: newData.statusType,
    affiliateMargin: newData.margin,

  }
  const fieldsProductPrice = {
    specialDiscountPrice: newData.specialDiscountPrice,statusType: newData.statusType,
  }

  const productPrice = await priceService.updateProductPrice(
    userId,
    checkProduct.productPriceId,
    [1].includes(series.statusType)
      ? fieldsProductPrice
      : Object.assign(
        fieldsProductPrice,
        { price:newData.price},
      ),
  ) || {}

  // status 0 update all , status 1 update campain
  const product = await productService.updateProduct(
    userId,
    productId,
    [1].includes(series.statusType)
      ? filedsProduct
      : Object.assign(
          filedsProduct,
          { categoryId: newData.categoryId,name: newData.title,isFreeFirstMonth: newData.isFreeFirstMonth, isPassword: newData.isPassword, pagePassword: newData.pagePassword},
        ),
  )

  // check series update
  ![1].includes(series.statusType) ? await seriesModel.updateAll({
      userId,
      id: series.id,
      isValid: 1,
    }, {
      categoryId: newData.categoryId,
      statusType: newData.statusType,
  }) : {}

  // update data vao article
  const listArticles = [0,1].includes(series.statusType) ? await articleService.updateArticleSeriesID(
    newData.articles,
    series.id,
    userId,
  ) : await articleService.getArticlesBySeriesId(userId, id, 'id,title,statusType,productId')

  // update product outline
  const productOutline = ![1].includes(series.statusType) ? await outlineService.updateProductOutline(
    userId,
    productId,
    {
      outline: newData.content,
      statusType: newData.statusType,
    },
  ) : await outlineService.getOutlines(productId)

   // sync data
  syncService.syncDataToFxon('series',id)

  const newSeries = await getSeriesByid(userId, id)
  return {
    id: newSeries.id,
    title: product.name || '',
    productId: product.id || 0,
    articles: listArticles || [],
    statusType: newSeries.statusType,
    price: productPrice.price || 0,
    updatedAt: newSeries.updatedAt,
    isPassword: product.isPassword,
    pagePassword: product.pagePassword,
    createdAt: newSeries.createdAt,
    margin: product.affiliateMargin || 0,
    categoryId: newSeries.categoryId || 0,
    content: productOutline.outline || '',
    isFreeFirstMonth: product.isFreeFirstMonth,
    isSpecialDiscount: product.isSpecialDiscount || 0,
    specialDiscountPrice: productPrice.specialDiscountPrice || 0,
    specialDiscountEndAt: product.specialDiscountEndAt || 0,
    specialDiscountStartAt: product.specialDiscountStartAt || 0,
    isBlockCampain: +((series.statusType == 1) && ((Date.now() - series.updatedAt*1000)/(86400*1000)) <= 30 ) || +(!series.statusType),
  }
}

/**
 *
 * @param {number} userId
 * @param {number} id
 */
async function deleteSeries(userId, id){
  const series = await getSeriesByid(userId, id) || {}
  if(_isEmpty(series) || (!_isEmpty(series) && [1,2].includes(series.statusType) ) ){
    return false
  }
  const checkUser = await productService.getProductById(userId, series.productId, 'id')
  if(!checkUser || _isEmpty(checkUser)){
    return false
  }

  await Promise.all([
    productService.deleteProduct(userId, series.productId),
    outlineService.deleteOutlineByProductId(userId, series.productId),
    seriesModel.updateAll({userId, id}, { isValid: 0}),
  ])

  syncService.syncDataToFxon('series', id, { is_valid: 0 })

  return true
}

/**
 *
 * @param {number} userId
 * @param {number} id
 */
async function salesStopSeries(userId, id){
  const series = await getSeriesByid(userId, id) || {}
  if(_isEmpty(series) || (!_isEmpty(series) && ![1].includes(series.statusType))){
    return false
  }
  const productId = series.productId
  const checkUser = await productService.getProductById(userId, productId)
  if(!checkUser || _isEmpty(checkUser)){
    return false
  }

  await Promise.all([
    seriesModel.updateAll({ id }, { statusType: 2}),
    articleModel.updateAll({ seriesId: id, articleOption: 2 },{ statusType: 2}),
    productService.updateProduct(userId, productId, { statusType: 9}),
    saleModel.updateAll({ productId }, { isFinished: 1 }),
  ])

  syncService.syncDataToFxon('series', series.id)

  return true
}

async function resell(userId, seriesId) {
  const series = await getSeriesByid(userId, seriesId) || {}
  const isSaleStopped = [2, 9].includes(series.statusType)
  if (!isSaleStopped) return series

  await Promise.all([
    productService.updateProduct(userId, series.productId, { statusType: 1 }),
    seriesModel.updateAll({ id: seriesId }, { statusType: 1 }),
    saleModel.updateAll({ productId: series.productId }, { isFinished: 0 }),
    articleModel.updateAll({ seriesId: seriesId, articleOption: 2 }, { statusType: 1}),
  ])

  syncService.syncDataToFxon('series', series.id)

  return {
    userId,
    seriesId
  }
}

module.exports = {
  show,
  index,
  getSeries,
  updateSeries,
  deleteSeries,
  createSeries,
  getSeriesByid,
  salesStopSeries,
  getSeriesByArticleId,
  getListSeriesByUserId,
  resell
}
