const app = require('@server/server')
const common = require('@services/surface/finance/navi/common')
const commonData = require('@services/surface/finance/navi/data')
const commomSale = require('@services/common/sale')
const commonCart = require('@services/common/cart')
const {
  checkPagePassword,
  checkCartPassword,
} = require('@services/common/product')

const {
  shuffle,
} = require('lodash')

// models
const surfaceNaviModel = app.models.SurfaceNavi
const articleModel = app.models.Articles
const articleAccessModel = app.models.ArticleAccess
const relatedArticleModel = app.models.RelatedArticles
const productOutline = app.models.ProductOutlines
const seriesModel = app.models.Series

// utils
const paging = app.utils.paging
const stringUtil = app.utils.string
const arrayUtil = require('@ggj/utils/utils/array')
const checkSeriesBuyStatus = require('@services/common/sale').isPurchased

// OAM-46169: isValidArticle
async function isValidArticle(userId, articleId) {
  if (isNaN(+articleId)) return false

  const currentArticle = await articleModel.findOne({
    where: {
      isValid: 1,
      id: articleId,
    },
    fields: {
      id: true,
      userId: true,
      statusType: true,
      productId: true,
      seriesId: true,
      articleOption: true,
    },
  })

  if (!currentArticle) {
    return false
  }

  // if user is owner
  if (userId === currentArticle.userId) {
    return true
  }

  // Article option 1 or 3 - single article or single-and-series article
  // free article option 1 has productId = 0
  if (currentArticle.productId || currentArticle.articleOption === 1) {
    if (currentArticle.statusType === 1) {
      return true
    }

    // check user bought or did not buy this product
    if (currentArticle.statusType > 1) {
      return common.isProductSaleByUserNotEnded(userId, currentArticle.productId)
    }
  }

  // Article option 2 or 3 - series article or single-and-series article
  // free article option 3 has productId = 0 and has series
  if (!currentArticle.productId && currentArticle.seriesId) {
    if (currentArticle.articleOption == 3 && currentArticle.statusType == 1) {
      return true
    }

    const currentSeries = await seriesModel.findOne({
      where: {
        isValid: 1,
        id: currentArticle.seriesId,
      },
      fields: {
        productId: true,
        statusType: true,
      },
    })

    if (!currentSeries) {
      return false
    }

    if (currentSeries.statusType === 1) return true
    if (currentSeries.statusType > 1) return common.isProductSaleByUserNotEnded(userId, currentSeries.productId)
  }

  return false
}

/**
 * Get detail data of article
 *
 * @param id
 * @param input
 * @param meta
 * @returns {Promise<Object>}
 */
async function articleDetail(id, input, meta) {
  id = parseInt(id)
  let [data, isValid] = await Promise.all([commonData.articleData({
    where: {
      isValid: 1,
      // statusType: 1,
      id: id,
      publishedAt: {
        lte: app.utils.time.utcDate(),
      },
    },
  }), isValidArticle(meta.userId, id)])

  data = data[0]

  // article options
  // https://gogojungle.backlog.jp/view/OAM-46711
  if (!data || (data.articleOption == 2 && data.seriesStatusType == 0) || !isValid) {
    return {}
  }

  let userId = meta.userId || 0,
    seriesId = data.seriesId,
    articlePId = data.productId,
    seriesPId = data.seriesProductId,
    [
      nearlyArticles,
      isPurchasedArticle,
      isPurchasedSeries,
      favorite,
      readLate,
      article,
      passwordRes,
    ] = await Promise.all([
      _nearlyArticles(id, seriesId),
      data.price ? commomSale.isPurchased(userId, articlePId, false, true) : false,
      // https://gogojungle.backlog.jp/view/OAM-23498
      data.seriesPrice ?
        (seriesId == consts.OAM23498.SEE_SERIES)
          ? commomSale.isPurchased(userId, seriesPId, true, true, () => [...consts.OAM23498.BOUGHT_ARTICLES, seriesPId])
          : commomSale.isPurchased(userId, seriesPId, true, true)
        : false,
      common.getFavoriteArticles(userId, [id]),
      common.getReadLaterArticles(userId, [id]),
      articleModel.findOne({
        where: {
          isValid: 1,
          id: id,
        },
        fields: {
          updatedAt: true,
          content: true,
          paidContent: true,
        },
      }),
      _checkPassword(data.articleProduct, data.seriesProduct, input),
    ])

  // Verify page password if this article/series has password
  if (!passwordRes.status && passwordRes.passwordType === 1) {
    passwordRes.seriesId = data.seriesId
    passwordRes.productName = data.productName
    passwordRes.title = data.title
    passwordRes.id = data.id
    passwordRes.cartInfo = {
      serie: {},
      article: {},
    }
    return passwordRes
  }

  // Assume if current user is author of this article, is purchased is true
  let isPurchased = userId === data.userId

  // sameSeriesArticles = sameSeriesArticles.filter(article => !ignoreIds.includes(article.id))

  if (!isPurchased) {
    isPurchased = data.isPaidContent === 1 ?
      (isPurchasedArticle || isPurchasedSeries) :
      false
  }

  // Add log
  _addArticleAccessRecord(id, userId)

  return await _object({
    data,
    nearlyArticles,
    readLate,
    favorite,
    article,
    isPurchased,
    password: passwordRes,
    userId
  })
}

/**
 *
 * @param articleProduct
 * @param seriesProduct
 * @param input
 * @returns {Promise<{status: number}>}
 * @private
 */
async function _checkPassword(articleProduct, seriesProduct, input) {
  // Verify page password if this article/series has password
  const articlePasswordType = articleProduct.isPassword
  const seriesPasswordType = seriesProduct.isPassword

  let passwordRes = null,
    res = {}

  const [pagePasswordSeries, pagePasswordArticle, cartPasswordSeries, cartPasswordArticle]
    = await Promise.all([
      checkPagePassword(seriesProduct, input),
      checkPagePassword(articleProduct, input),
      checkCartPassword(seriesProduct, input),
      checkCartPassword(articleProduct, input),
    ])

  // Check series password first, then check article password (just need match one)
  if (seriesPasswordType === 1) {
    passwordRes = pagePasswordSeries
    if (Object.keys(passwordRes).length && articlePasswordType === 1) {
      passwordRes = pagePasswordArticle
    }

    // Return if article has password & input password is incorrect
    res = {
      status: Object.keys(passwordRes).length ? 0 : 1,
      passwordType: 1,
      isPassword: passwordRes.isPassword,
      name: passwordRes.name,
    }
  }

  // Check series password first, then check article password (just need match one)
  if (seriesPasswordType === 2) {
    passwordRes = cartPasswordSeries
    if (passwordRes === 2 && articlePasswordType === 2) {
      passwordRes = cartPasswordArticle
    }

    if (passwordRes === 2) {
      res.status = 0
    }
    if (passwordRes === 1) {
      res.status = 1
    }
  }

  return res
}

/**
 * Convert response object for navi detail
 *
 * @param data
 * @param nearlyArticles
 * @param readLate
 * @param favorite
 * @param article
 * @param isPurchased
 * @param sameSeries
 * @param password
 * @param userId
 * @returns {Promise<Object>}
 * @private
 */
async function _object({
  data,
  nearlyArticles,
  readLate,
  favorite,
  article,
  isPurchased,
  sameSeries,
  password,
  userId
}) {
  const articleProduct = data.articleProduct
  const seriesProduct = data.seriesProduct
  const [seriesCart, articleCart, seriesProductOutline, isPurchasedSeries] = await Promise.all([
    isPurchased || !data.seriesPrice ? {} : commonCart.show(data.seriesProductId),
    isPurchased || !data.isPaidContent ? {} : commonCart.show(data.productId),
    productOutline.findOne({where: {productId: data.seriesProductId}, fields: 'outline'}),
    checkSeriesBuyStatus(userId, data.seriesProductId)
  ])
  const feeContent = article ? (article.content || '') + (article.paidContent || '') : ''
  // OAM-17096
  const paidContent = isPurchased ? _content(feeContent) : null

  return app.utils.object.deepNullFilter({
    id: data.id,
    prev: nearlyArticles.prev,
    next: nearlyArticles.next,
    productId: data.productId,
    productName: data.productName,
    readLater: Object.keys(readLate).length ? 1 : 0,
    isFavorite: Object.keys(favorite).length ? 1 : 0,
    isPaidContent: data.isPaidContent,
    user: {
      id: data.userId,
      name: data.userName,
      selfIntroduction: data.userSelfIntroduction,
    },
    publishedAt: data.publishedAt,
    updatedAt: article && article.updatedAt ?
      article.updatedAt : data.publishedAt,
    title: data.title,
    paidContent: paidContent,
    // OAM-17096
    freeContent: isPurchased ? null : _content(data.content),
    seriesId: data.seriesId,
    seriesProductId: data.seriesProductId,
    seriesContent: (seriesProductOutline ||{}).outline || '',
    seriesName: seriesProduct.name,
    cartInfo: {
      serie: seriesCart,
      article: articleCart,
    },
    sameSeries: sameSeries,
    tags: data.tags || '',
    isPassword: seriesProduct.isPassword || articleProduct.isPassword,
    status: password ? password.status : undefined,
    naviCategoryId: data.naviCategoryId,
    isPurchased,
    articlePrice: data.price,
    seriesPrice: data.seriesPrice,
    isPurchasedSeries
  })
}

// OAM-17096
function _content(content) {
  if (content) {
    return stringUtil.expandHyperlink(content
      .replace(
        /http:\/\/fx-on\.com/gi,
        'https://fx-on.com',
      )
      .replace(
        /src="\/asp/gi,
        'src="https://fx-on.com/asp',
      ))
  }
  return content
}

/**
 * Get nearly article of given article
 *
 * @param id
 * @param seriesId
 * @returns {Promise<Object>}
 * @private
 */
async function _nearlyArticles(id, seriesId) {
  if (!id || !seriesId) {
    return {
      prev: {},
      next: {},
    }
  }

  const articles = await articleModel.find({
    where: {
      seriesId: seriesId,
      statusType: 1,
      isValid: 1,
      publishedAt: {
        lte: app.utils.time.utcDate(),
      },
    },
    fields: {
      id: true,
      title: true,
      publishedAt: true,
      updatedAt: true,
    },
  })

  // find index of given article in articles list
  const idx = articles.findIndex(article => article.id === id)

  return {
    prev: articles[idx - 1] || {},
    next: articles[idx + 1] || {},
  }
}


/**
 * Get articles that is same series with given article
 *
 * @param userId
 * @param seriesId
 * @param articleId
 * @param ignoreIds
 * @param input
 * @returns {Promise<*>}
 */
async function sameSeries(userId = 0, seriesId = null, articleId = null, ignoreIds = [], input = {}) {
  if (!seriesId && !articleId) {
    return []
  }

  if (!seriesId) {
    const article = await surfaceNaviModel.findOne({
      where: {
        isValid: 1,
        id: articleId,
      },
      fields: {
        seriesId: true,
      },
    })
    seriesId = article.seriesId
  }

  const fields = 'id,articleId,userId,nickName,productId,seriesId,seriesProductId,title,content,publishedAt,isCampaign,isPaidContent,price,seriesPrice,imageFile'
  const where = {
    isValid: 1,
    seriesId: seriesId,
    articleId: {
      nin: ignoreIds,
    },
    publishedAt: {
      lte: app.utils.time.utcDate(),
    },
  }

  const [articles, total] = await Promise.all([
    surfaceNaviModel.find(Object.assign({
      where: where,
      order: 'publishedAt DESC',
      fields: app.utils.query.fields(fields),
    }, app.utils.paging.getOffsetCondition(input.page || 1, input.limit ||
      20))),
    surfaceNaviModel.count(where),
  ])

  // Get favorite & read later data for all articles
  const ids = articles.reduce((acc, article) => {
    acc.article.push(article.id)
    acc.product.push(article.productId)
    acc.seriesProduct.push(article.seriesProductId)
    return acc
  }, {
    article: [],
    product: [],
    seriesProduct: [],
  })

  const articleIds = ids.article
  const productIds = ids.product.concat(ids.seriesProduct)
  const [favoriteArticles, readLateArticles, purchased] = await Promise.all([
    common.getFavoriteArticles(userId, articleIds),
    common.getReadLaterArticles(userId, articleIds),
    common.getPurchasedArticles(userId, productIds),
  ])

  // Mapping all articles into response
  const res = articles.map(article => {
    const isRL = !readLateArticles[article['id']] ? 0 : 1
    const isFavorite = !favoriteArticles[article['id']] ? 0 : 1
    const isPurchased = !purchased[article['productId']] &&
      !purchased[article['seriesProductId']] ? 0 : 1

    return common.articleObject(article, isRL, isFavorite, isPurchased, !!input.isGetContent)
  })

  return !input.page ? res : paging.addPagingInformation(
    res,
    parseInt(input.page),
    total,
  )
}

/**
 * Get articles that is same series with given article
 *
 * @param userId
 * @param seriesId
 * @param articleId
 * @param ignoreIds
 * @param input
 * @returns {Promise<*>}
 */
async function sameSeriesEx(userId = 0, articleId = null, input = {}) {
  let seriesId = +input.seriesId

  if (!seriesId || !articleId) {
    return []
  }

  if (!seriesId) {
    const article = await surfaceNaviModel.findOne({
      where: {
        isValid: 1,
        id: articleId,
      },
      fields: {
        seriesId: true,
      },
    })
    seriesId = article.seriesId
  }

  const nearlyArticles = await _nearlyArticles(articleId, seriesId)
  const ignoreIds = [
    nearlyArticles.prev ? nearlyArticles.prev.id : 0,
    nearlyArticles.next ? nearlyArticles.next.id : 0,
  ]
  const fields = 'id,articleId,userId,nickName,productId,seriesId,seriesProductId,title,content,publishedAt,isCampaign,isPaidContent,price,seriesPrice,imageFile'
  const where = {
    isValid: 1,
    seriesId: seriesId,
    articleId: {
      nin: ignoreIds,
    },
    publishedAt: {
      lte: app.utils.time.utcDate(),
    },
  }
  const [articles, total] = await Promise.all([
    surfaceNaviModel.find(Object.assign({
      where: where,
      order: 'publishedAt DESC',
      fields: app.utils.query.fields(fields),
    }, app.utils.paging.getOffsetCondition(input.page || 1, input.limit ||
      20))),
    surfaceNaviModel.count(where),
  ])

  // Get favorite & read later data for all articles
  const ids = articles.reduce((acc, article) => {
    acc.article.push(article.id)
    acc.product.push(article.productId)
    acc.seriesProduct.push(article.seriesProductId)
    return acc
  }, {
    article: [],
    product: [],
    seriesProduct: [],
  })

  const articleIds = ids.article
  const productIds = ids.product.concat(ids.seriesProduct)
  const [favoriteArticles, readLateArticles, purchased] = await Promise.all([
    common.getFavoriteArticles(userId, articleIds),
    common.getReadLaterArticles(userId, articleIds),
    common.getPurchasedArticles(userId, productIds),
  ])

  // Mapping all articles into response
  const res = articles.map(article => {
    const isRL = !readLateArticles[article['id']] ? 0 : 1
    const isFavorite = !favoriteArticles[article['id']] ? 0 : 1
    const isPurchased = !purchased[article['productId']] &&
      !purchased[article['seriesProductId']] ? 0 : 1

    return common.articleObject(article, isRL, isFavorite, isPurchased, !!
    input.isGetContent)
  })

  return !input.page ? res : paging.addPagingInformation(
    res,
    parseInt(input.page),
    total,
  )
}

/**
 * Add new log record into article access table
 *
 * @param id
 * @param userId
 * @returns {Promise<void>}
 * @private
 */
async function _addArticleAccessRecord(id, userId) {
  const article = await articleModel.findOne({
    where: {
      id,
      userId,
    },
  })

  // Skip if record exist, because that is owner of article
  if (article) {
    return
  }

  // Create new access record
  try {
    await articleAccessModel.create({
      isValid: 1,
      accessedAt: Date.now(),
      userId: userId,
      articleId: id,
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * get related articles
 * @param {number} id
 * @param {object} input
 * @param {number} userId
 *
 * @returns {array}
 * @public
 */
async function related(id, input, userId) {
  let relatedArticleIds = await _getRelatedArticleIds(id)
  const limit = input.limit
  const isGetContent = input.isGetContent

  if(!relatedArticleIds.length){
    return []
  }

  if (limit) {
    relatedArticleIds = relatedArticleIds.slice(0, limit)
  }

  return await common.getArticles(
    relatedArticleIds,
    userId,
    {isGetContent},
  )
}

/**
 * get related article ids
 *
 * @param {number} articleId
 *
 * @returns {array}
 * @private
 */
async function _getRelatedArticleIds(articleId) {
  const relatedArticleIds = arrayUtil.column(await relatedArticleModel.find({
    where: {
      isValid: 1,
      articleId,
    },
    fields: {
      relatedArticleId: true,
    },
    order: 'id DESC',
    limit: 100,
  }), 'relatedArticleId')

  return shuffle(relatedArticleIds)
}

module.exports = {
  articleDetail,
  sameSeries,
  sameSeriesEx,
  related,
}
