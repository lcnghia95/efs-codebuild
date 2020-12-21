const app = require('@server/server')
const common = require('@services/surface/finance/navi/common')
const { find } = require('@server/utils/model')

const cache = require('@server/utils/cache')
const arrayUtil = require('@ggj/utils/utils/array')
const pagingUtil = require('@ggj/utils/utils/paging')
const modelUtil = require('@server/utils/model')
const stringUtil = require('@ggj/utils/utils/string')
const surfaceNaviModel = app.models.SurfaceNavi

const productCommonService = require('@services/common/product')

const NAVI_CONTENT_LENGTH = 150

const NAVI_FILTER = {
  ALL: -1,
  FREE: 0,
  PAID: 1,
}

/**
 * Get pr article data
 *
 * @param input
 * @returns {Promise<Array>}
 * @private
 */
async function _prArticles(input) {
  const limit = input.limit || 2
  // Check if data is cached or not
  const key = `/api/v3/surface/navi/pr${limit}`
  const data = await cache.get(key)

  if (data) {
    return arrayUtil.shuffle(data || [], limit)
  }

  const pr = await find('fx_default', 'article', {
    where: {
      PublishedDate: {
        lte: app.utils.time.utcDate(),
      },
      IsPR: 1,
      IsValid: 1,
      StatusId: 1,
    },
    fields: {
      Id: true,
    },
  })

  if (pr.length === 0) {
    return []
  }

  const articleFields = 'id,articleId,seriesId,seriesProductId,productId,publishedAt,title,content,userId,nickName,isCampaign,isPaidContent,isSpecialDiscount,specialDiscountPrice,price,isReservedStart,reserveStartAt,seriesPrice,imageFile'

  const prArticles = await surfaceNaviModel.find({
    where: {
      id: {
        inq: arrayUtil.column(pr, 'Id'),
      },
      isValid: 1,
      isSaleStop: 0,
    },
    fields: app.utils.query.fields(articleFields),
  })

  // cache data
  await cache.set(
    key,
    prArticles,
    360,
  )

  return arrayUtil.shuffle(prArticles || [], limit)
}

/**
 * Get articles index
 *
 * @param {number} userId
 * @param {Array} articles
 * @param {Boolean} isGetContent
 * @returns {Promise<Object[]>}
 * @private
 */
async function _index(userId, articles, isGetContent = true) {
  const aIds = arrayUtil.column(articles, 'id')

  const articleProductIds = arrayUtil.column(articles, 'productId')
  const seriesProductIds = arrayUtil.column(articles, 'seriesProductId')

  const [favoriteArticles, readLateArticles, purchasedArticles] = await Promise.all([
    common.getFavoriteArticles(userId, aIds),
    common.getReadLaterArticles(userId, aIds),
    common.getPurchasedArticles(userId, articleProductIds.concat(
      seriesProductIds)),
  ])

  return articles.reduce((res, article) => {
    const aId = article.id
    const isReadlate = readLateArticles[aId] ? 1 : 0
    const isFavorite = favoriteArticles[aId] ? 1 : 0
    const isPurchased = purchasedArticles[article.productId] ||
      purchasedArticles[article.seriesProductId] ? 1 : 0

    res.push(common.articleObject(
      article,
      isReadlate,
      isFavorite,
      article.isPaidContent === 1 ? isPurchased : 0,
      isGetContent,
    ))
    return res
  }, [])
}

/**
 * Get data from `navi.articles`
 *
 * @returns {Promise<Array>}
 * @private
 */
async function _articles(limit) {
  const fields = 'id,articleId,seriesId,seriesProductId,productId,publishedAt,title,content,userId,nickName,isCampaign,isPaidContent,isSpecialDiscount,specialDiscountPrice,price,isReservedStart,reserveStartAt,seriesPrice,imageFile'

  return await surfaceNaviModel.find({
    where: {
      isValid: 1,
      publishedAt: {
        lte: app.utils.time.utcDate(),
      },
      isSaleStop: 0,
    },
    limit,
    order: 'publishedAt DESC',
    fields: app.utils.query.fields(fields),
  })
}

/**
 * Get pr article
 *
 * @param input
 * @param meta
 * @returns {Promise<Object[]>}
 * @public
 */
async function pr(input, meta) {
  const pr = await _prArticles(input)
  return pr.length === 0 ? [] : await _index(meta.userId, pr)
}

/**
 * Get new article ranking
 * Return Array that contain objects
 *
 * @param input
 * @param meta
 * @returns {Promise<Object[]>}
 * @public
 */
async function newArticles(input, meta) {
  const articles = await _articles(input.limit || 20)
  return articles.length === 0 ? [] : await _index(
    meta.userId,
    articles,
    parseInt(input.isGetContent || 0) === 1,
  )
}

/**
 * Get new article and series
 *
 * @param input
 *  - page: number
 *  - limit: number
 *  - plan: 1 pay - 0 free
 *  - category: navi category id
 *
 * @param userId
 * @returns {Promise<Object[]>}
 * @public
 */
async function newNavi(input) {
  const {
    page,
    limit = 10,
  } = input

  const newNaviSql = _newNaviSql(limit, page, input)
  const newNavi = await modelUtil.excuteQuery('surfaces', newNaviSql.sql, newNaviSql.params)

  const seriesProductIds = newNavi.reduce((acc, navi)=> {
    const productId = navi.productId
    if (!navi.articleId && productId) {
      acc.push(productId)
    }
    return acc
  }, [])

  const seriesProducts = await productCommonService.products(seriesProductIds, 'id,isFreeFirstMonth')
  const seriesProductsIdx = arrayUtil.index(seriesProducts)
  const res = newNavi.map(navi => {
    const product = seriesProductsIdx[navi.productId] || {}
    return {
      ..._naviObject(navi),
      isFreeFirstMonth: product.isFreeFirstMonth || 0,
    }
  })

  return res
}

/**
 * generate sql get new articles and series, order by published at
 *
 * @param {number} limit
 * @param {number} page
 * @param {object} input
 *
 * @returns {Promise<Object[]>}
 * @private
 */
function _newNaviSql(limit, page, input) {
  const {
    plan: isPaid,
    category: categoryId,
  } = input
  const offset = pagingUtil.getOffsetCondition(page, limit)

  const articlesSql = _articlesSql(+isPaid, +categoryId)
  const seriesSql = _seriesSql(+isPaid, +categoryId)

  return {
    sql: `
      SELECT *
      FROM (
        (${articlesSql.sql})
        UNION ALL
        (${seriesSql.sql})
      ) n
      ORDER BY published_at DESC
      LIMIT ?
      OFFSET ?
    `,
    params: [...articlesSql.params, ...seriesSql.params, offset.limit, offset.skip],
  }
}

/**
 * generate sql get new articles order by published at
 *
 * @param {number} isPaid
 * @param {number} categoryId
 *
 * @returns {{params: number[], sql: string}}
 * @private
 */
function _articlesSql(isPaid, categoryId) {
  const sqlConditions = [
    'is_valid = 1',
    'published_at < NOW()',
    'is_sale_stop = 0',
  ]
  const params = []

  if (isPaid != NAVI_FILTER.ALL) {
    const priceCondition = isPaid
      ? `
      is_paid_content = 1
      AND (price > 1 OR series_price > 1)
      `
      : `
      (
        is_paid_content = 0
        OR (
          is_paid_content = 1
          AND price = 0
          AND series_price = 0
        )
      )
    `
    sqlConditions.push(priceCondition)
  }

  if (categoryId) {
    sqlConditions.push('navi_category_id = ?')
    params.push(categoryId)
  }

  const sql =  `
    SELECT
      id,
      article_id,
      series_id,
      series_product_id,
      product_id,
      published_at,
      title,
      content,
      user_id,
      nick_name,
      is_campaign,
      is_paid_content,
      is_special_discount,
      special_discount_price,
      price,
      is_reserved_start,
      reserve_start_at,
      series_price,
      navi_category_id,
      1 AS is_article,
      image_file
    FROM surface_navi
    WHERE
      ${sqlConditions.join(' AND ')}
    ORDER BY published_at DESC
  `

  return {
    sql,
    params,
  }
}

/**
 * generate sql get new series order by published at
 *
 * @param {number} isPaid
 * @param {number} categoryId
 *
 * @returns {Promise<Object[]>}
 * @private
 */
function _seriesSql(isPaid, categoryId) {
  const sqlConditions = [
    'is_valid = 1',
    'published_at < NOW()',
    'is_sale_stop = 0',
  ]
  const params = []
  if (!isNaN(isPaid) && isPaid >= 0) {
    sqlConditions.push(isPaid ? 'price > 1' : 'price = 0')
  }

  if (categoryId) {
    sqlConditions.push('navi_category_id = ?')
    params.push(categoryId)
  }

  const sql =  `
    SELECT
      id,
      NULL AS article_id,
      NULL AS series_id,
      NULL AS series_product_id,
      product_id,
      published_at,
      title,
      content,
      user_id,
      nick_name,
      NULL AS is_campaign,
      NULL AS is_paid_content,
      is_special_discount,
      special_discount_price,
      price,
      NULL AS is_reserved_start,
      NULL AS reserve_start_at,
      NULL AS series_price,
      navi_category_id,
      0 AS is_article,
      NULL as image_file
    FROM surface_navi_series
    WHERE
      ${sqlConditions.join(' AND ')}
    ORDER BY published_at DESC
  `

  return {
    sql,
    params,
  }
}

/**
 * generate navi to show on top
 *
 * @param {object} navi
 *
 * @returns {Object}
 * @private
 */
function _naviObject(navi) {
  const naviContent = stringUtil.stripTags(navi['content'] || '')

  const showContent =  naviContent.length > NAVI_CONTENT_LENGTH
    ? naviContent.substr(0, NAVI_CONTENT_LENGTH) + '...'
    : naviContent

  return {
    id: navi['id'],
    articleId: navi['article_id'],
    seriesId: navi['series_id'],
    seriesProductId: navi['series_product_id'],
    productId: navi['product_id'],
    publishedAt: navi['published_at'],
    title: navi['title'],
    content: showContent,
    userId: navi['user_id'],
    nickName: navi['nick_name'],
    isCampaign: navi['is_campaign'],
    isPaidContent: navi['is_paid_content'],
    isSpecialDiscount: navi['is_special_discount'],
    specialDiscountPrice: navi['special_discount_price'],
    price: navi['price'],
    isReservedStart: navi['is_reserved_start'],
    reserveStartAt: navi['reserve_start_at'],
    seriesPrice: navi['series_price'],
    naviCategoryId: navi['navi_category_id'],
    isArticle: navi['is_article'],
    imageFile: navi['image_file'],
  }
}

module.exports = {
  pr,
  newArticles,
  newNavi,
}
