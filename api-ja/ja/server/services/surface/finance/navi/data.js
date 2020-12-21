const app = require('@server/server')
const articleModel = app.models.Articles
const productPriceModel = app.models.ProductPrices
const seriesModel = app.models.Series
const userModel = app.models.Users
const selfIntroductionModel = app.models.UserSelfIntroduction
const productModel = app.models.Products
const utils = app.utils

const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get surface navi data for given article (conditions)
 *
 * @param {object} conditions
 * @return {Promise<array>}
 */
async function articleData(conditions) {
  const articles = await articleModel.find(conditions)
  const serieIds = []
  const userIds = []
  const productIds = []

  articles.forEach(article => {
    serieIds.push(article.seriesId)
    userIds.push(article.userId)
    productIds.push(article.productId)
  })

  let [users, selfIntroductions, series] = await Promise.all([
    _users(userIds),
    _userSelfIntroduction(userIds),
    _series(serieIds),
  ]),
  seriePIds = arrayUtil.column(series, 'productId'),
  [articlePrices, seriesPrices, products] = await Promise.all([
    _prices(productIds),
    _prices(seriePIds),
    _products(seriePIds.concat(productIds)),
  ])

  // Indexing all data
  users = arrayUtil.index(users, 'id')
  selfIntroductions = arrayUtil.index(selfIntroductions, 'userId')
  series = arrayUtil.index(series, 'id')
  articlePrices = arrayUtil.index(articlePrices, 'productId')
  seriesPrices = arrayUtil.index(seriesPrices, 'productId')
  products = arrayUtil.index(products, 'id')
  // Convert response object
  return articles.map(article => {
    const user = users[article['userId']] || {}
    const selfIntroduction = selfIntroductions[article['userId']] || {}
    const serie = series[article['seriesId']] || {}
    const articlePrice = articlePrices[article['productId']] || {}
    const articleProduct = products[article['productId'] || 0] || {}
    const seriePrice = seriesPrices[serie['productId'] || 0] || {}
    const seriesProduct = products[serie['productId'] || 0] || {}

    // Cheat for check password in article detail function
    articleProduct.productName = articleProduct.name
    seriesProduct.productName = seriesProduct.name
    return {
      id: article.id,
      naviCategoryId: article.naviCategoryId,
      backNumber: article.backNumber,
      publishedAt: article.publishedAt,
      title: article.title,
      content: article.content,
      imageFile: article.imageFile,
      isReservedStart: article.isReservedStart,
      isPaidContent: article.isPaidContent,
      price: articlePrice.price || 0,
      productId: article.productId,
      productName: seriesProduct.name,
      seriesId: serie.id || 0,
      seriesProductId: serie.productId || 0,
      seriesPrice: seriePrice.price || 0,
      isSpecialDiscount: seriesProduct.isSpecialDiscount || 0,
      specialDiscountPrice: seriesProduct.specialDiscountPrice || 0,
      userId: user.id || 0,
      userName: user.nickName || '',
      userSelfIntroduction: selfIntroduction.content || '',
      seriesStatusType: serie.statusType,
      articleOption: article.articleOption,
      // product objects, use for verify password or get additional data
      articleProduct,
      seriesProduct,
      productStatusType: article.statusType
    }
  })
}

/**
 * Get prices of given products
 *
 * @param {array} productIds
 * @return {Promise<array>}
 * @private
 */
async function _prices(productIds) {
  const fields = 'productId,price'
  return await productPriceModel.find({
    where: {
      productId: {inq: productIds},
    },
    fields: utils.query.fields(fields),
  })
}

/**
 * Get users of given id
 *
 * @param {array} userIds
 * @return {Promise<array>}
 * @private
 */
async function _users(userIds) {
  const fields = 'id,nickName'
  return await userModel.find({
    where: {
      id: {inq: userIds},
    },
    fields: utils.query.fields(fields),
  })
}

/**
 * Get series of given id
 *
 * @param {array} serieIds
 * @return {Promise<array>}
 * @private
 */
async function _series(serieIds) {
  return await seriesModel.find({
    where: {
      id: {inq: serieIds},
      isValid: 1
    },
  })
}

/**
 * Get products of given id
 *
 * @param {array} productIds
 * @return {Promise<array>}
 * @private
 */
async function _products(productIds) {
  return await productModel.find({
    where: {
      id: {inq: productIds},
    },
    fields: {
      id: true,
      name: true,
      isSpecialDiscount: true,
      specialDiscountPrice: true,
      isPassword: true,
      pagePassword: true,
    },
  })
}

/**
 * Get self introduction of given users
 *
 * @param {array} userIds
 * @return {Promise<array>}
 * @private
 */
async function _userSelfIntroduction(userIds) {
  const fields = 'userId,content'
  return await selfIntroductionModel.find({
    where: {
      userId: {inq: userIds},
    },
    fields: utils.query.fields(fields),
  })
}

module.exports = {
  articleData,
}
