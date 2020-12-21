const app = require('@server/server')
const common = require('@services/surface/finance/navi/common')
const surfaceNaviModel = app.models.SurfaceNavi
const surfaceNaviSeriesModel = app.models.SurfaceNaviSeries
const surfaceNaviAuthorsModel = app.models.SurfaceNaviAuthors

const paging = app.utils.paging
const arrayUtil = require('@ggj/utils/utils/array')
const modelUtil = require('@server/utils/model')

const SORT_VALUE = {
  JA: 1,
  EN: 2,
  EMPTY: 3,
}

const SEARCH_TYPE = {
  AUTHOR: {
    POPULAR: 0,
    JP_NAME: 1,
    EN_NAME: 2,
    NEW: 3,
  },
}

/**
 * Get search data for articles
 * Default is recent articles
 *
 * @param array $input
 * @return array
 */
async function searchArticle(input, meta) {
  const keyword = input.keyword || null // Search by article title
    // default is get new articles
  const periodType = !input.periodType && parseInt(input.periodType) !== 0 ? 3 :
    parseInt(input.periodType)
  const isPaidContent = parseInt(input.isPaidContent) || 0 // 1: Paid; 0: all; 2: Free
  const isAsc = parseInt(input.isAsc) || 0 // 1: asc; 0: desc
  const cat = input.cat || null

  let tags = input.tags || null,
    sort = _getSortCondition(periodType)

  // Get access count data (include article data)

  const articleFields = 'id,articleId,seriesId,seriesProductId,productId,publishedAt,title,content,userId,nickName,isCampaign,isPaidContent,isSpecialDiscount,specialDiscountPrice,price,isReservedStart,reserveStartAt,seriesPrice,imageFile,tags'


  const priceCondition = isPaidContent ? {
   and: [
     {
      or: [
        {
          price: {
            gte: 1,
          },
        },
        {
          seriesPrice: {
            gte: 1,
          },
        },
      ],
     },
   ],
  } : null

  let condition = {
    isValid: 1,
    isSaleStop: 0,
    naviCategoryId: cat,
    tags: !tags ? null : {
      neq: null,
    },
    title: !keyword ? null : {
      like: '%' + keyword + '%',
    },
    isPaidContent: (!isPaidContent || isPaidContent === 2) ? {
      inq: [0, 1],
    } : 1,
    publishedAt: {
      lte: app.utils.time.utcDate(),
    },
  }

  if(isPaidContent === 1) {
    condition = {
      ...condition,
      ...priceCondition,
    }
  }

  if(isPaidContent === 2) {
    condition = {
      isValid: 1,
      isSaleStop: 0,
      naviCategoryId: cat,
      tags: !tags ? null : {
        neq: null,
      },
      title: !keyword ? null : {
        like: '%' + keyword + '%',
      },
      publishedAt: {
        lte: app.utils.time.utcDate(),
      },
      price: 0,
      seriesPrice: 0,
    }
  }

  const where = app.utils.object.nullFilter(condition)
  const offset = paging.getOffsetCondition(input.page, input.limit)

  let [total, articles] = await Promise.all([
    surfaceNaviModel.count(where),
    surfaceNaviModel.find({
      where,
      limit: offset.limit,
      skip: offset.skip,
      order: isAsc == 1 ? sort + ' ASC' : sort + ' DESC',
      fields: app.utils.query.fields(articleFields),
    }),
  ])

  if (!articles || articles.length === 0) {
    return []
  }

  // Handle if exists tag
  if (tags) {
    // Remove all space in tags
    tags = tags.split(' ').join('')

    // Change string to array
    const tagArr = tags.split(',')

    articles = articles.filter(function(value) {
      let articleTags = value.tags,
        checked = true

      tagArr.forEach(function(element) {
        if (!element && parseInt(element) !== 0) {
          return
        }
        const flag = articleTags.includes(element)
        if (!flag) {
          checked = false
        }
      })

      return checked
    })

    // Update total
    total = articles.length
  }

  // Get follow & favorite info of current user
  const aIds = arrayUtil.column(articles, 'id')
  const articleProductIds = arrayUtil.column(articles, 'productId')
  const seriesProductIds = arrayUtil.column(articles, 'seriesProductId')
  const favoriteArticles = await common.getFavoriteArticles(meta.userId, aIds) || {}
  const readLateArticles = await common.getReadLaterArticles(meta.userId, aIds) || {}
  const purchaseds = await common.getPurchasedArticles(meta.userId, articleProductIds.concat(seriesProductIds)) || {}

  // Map data into response
  const data = articles.map(article => {
    const aId = article.id
    const isReadlate = readLateArticles[aId] ? 1 : 0
    const isFavorite = favoriteArticles[aId] ? 1 : 0
    const isPurchased = purchaseds[article.productId] || purchaseds[article.seriesProductId] ? 1 : 0

    return common.articleObject(
      article,
      isReadlate,
      isFavorite,
      article.isPaidContent === 1 ? isPurchased : 0,
      parseInt(input.isGetContent || 0) === 1,
    )
  })

  return !input.page ? data : paging.addPagingInformation(data, parseInt(input.page),
    total, input.limit)
}

/**
 *
 * @param input {{keyword: string, period: number, plan: number, category: number, page: number, limit: number}}
 * @param meta
 * @returns {Promise<*|{total: Number, lastPage: number, data: *, pagingTo: number, currentPage: Number, pagingFrom: number}|{total: Number, lastPage: number, data: *, pagingTo: number, currentPage: Number, pagingFrom: number}|{total: Number, lastPage: number, data: *, pagingTo: number, currentPage: Number, pagingFrom: number}|*[]>}
 */
async function searchArticleList(input, meta) {
  const keyword = input.keyword || null // Search by article title
  const period = +(input.period || 3)
  const isPaidContent = isNaN(+input.plan) ? 0 : +input.plan // 1: Paid; 0: all; 2: Free
  const sort = _getSortCondition(period)


  const articleFields = 'id,articleId,seriesId,seriesProductId,productId,publishedAt,title,content,userId,nickName,isPaidContent,isSpecialDiscount,specialDiscountPrice,price,seriesPrice,naviCategoryId'
  const where = app.utils.object.nullFilter({
    isValid: 1,
    isSaleStop: 0,
    title: !keyword ? null : {
      like: '%' + decodeURIComponent(keyword) + '%',
    },
    isPaidContent: (!isPaidContent || isPaidContent === 2) ? {
      inq: [0, 1],
    } : 1,
    publishedAt: {
      lte: app.utils.time.utcDate(),
    },
  })
  if (+input.category) {where.naviCategoryId = +input.category}
  if (isPaidContent !== -1) {where.price = !isPaidContent ? 0 : {gte: 1}}
  const offset = paging.getOffsetCondition(input.page, input.limit)

  const [total, articles] = await Promise.all([
    surfaceNaviModel.count(where),
    surfaceNaviModel.find({
      where,
      limit: offset.limit,
      skip: offset.skip,
      order: sort + ' DESC',
      fields: app.utils.query.fields(articleFields),
    }),
  ])

  if (!articles || !articles.length) {
    return []
  }

  // Get follow & favorite info of current user
  const articleProductIds = arrayUtil.column(articles, 'productId')
  const seriesProductIds = arrayUtil.column(articles, 'seriesProductId')
  const purchasedArticles = await common.getPurchasedArticles(meta.userId, articleProductIds.concat(seriesProductIds)) || {}

  // Map data into response
  const data = articles.map(article => {
    const isPurchased = purchasedArticles[article.productId] || purchasedArticles[article.seriesProductId] ? 1 : 0

    return common.articleObject(
      article,
      null,
      null,
      article.isPaidContent === 1 ? isPurchased : 0,
      1,
    )
  })

  return !input.page ? data : paging.addPagingInformation(data, parseInt(input.page),
    total, input.limit)
}

/**
 * Get search data for series index page
 * Default is recent active series (series that have new articles)
 *
 * @param array $input
 * @return array
 */
async function searchSeries(input) {
  const keyword = input.keyword || null // Search by article title
    // default is get new articles
  const periodType = !input.periodType && parseInt(input.periodType) !== 0 ? 3 :
    parseInt(input.periodType)
  const isPaid = parseInt(input.isPaidContent) || 0 // 1: Paid; 0: all; 2: Free
  const isAsc = parseInt(input.isAsc) || 0 // 1: asc; 0: desc
  const sort = _getSortCondition(periodType)
  const price = isPaid === 2 ? 0 : {
    gte: !isPaid ? 0 : 1,
  }
  const where = app.utils.object.nullFilter({
    isValid: 1,
    isSaleStop: 0,
    title: !keyword ? null : {
      like: '%' + decodeURIComponent(keyword) + '%',
    },
    price: price,
  })
  const offset = paging.getOffsetCondition(input.page, input.limit)
  const [total, series] = await Promise.all([
    surfaceNaviSeriesModel.count(where),
    surfaceNaviSeriesModel.find({
      where,
      limit: offset.limit,
      skip: offset.skip,
      order: isAsc == 1 ? sort + ' ASC' : sort + ' DESC',
    }),
  ])

  if (!series || series.length === 0) {
    return []
  }

  const data = series.map(series => {
    return common.seriesObject(series, parseInt(input.isGetContent || 0) ===
      1)
  })

  return !input.page ? data : paging.addPagingInformation(data, parseInt(input.page),
    total, input.limit)
}
async function searchSeriesList(input) {
  const keyword = input.keyword || null
    // default is get new articles
  const period = +(input.period || 3)
  const isPaid = isNaN(+input.plan) ? 0 : +input.plan // 1: Paid; 0: free ; -1: free
  const sort = _getSortCondition(period)
  const where = app.utils.object.nullFilter({
    isValid: 1,
    isSaleStop: 0,
    title: !keyword ? null : {
      like: '%' + keyword + '%',
    },
  })
  if (+input.category) {where.categoryId = +input.category}
  if (isPaid !== -1) {where.price = !isPaid ? 0 : {gte: 1}}
  const offset = paging.getOffsetCondition(input.page, input.limit)
  const [total, series] = await Promise.all([
    surfaceNaviSeriesModel.count(where),
    surfaceNaviSeriesModel.find({
      where,
      limit: offset.limit,
      skip: offset.skip,
      order: `${sort} DESC`,
    }),
  ])

  if (!series || !series.length) {
    return []
  }
  
  const data = series.map(series => {
    return common.seriesObject(series, true)
  })

  return !input.page ? data : paging.addPagingInformation(data, parseInt(input.page),
    total, input.limit)
}

/**
 * Get search data for authors
 * Default is all authors list (no sort)
 *
 * @param array $input
 * @return array
 */

async function searchAuthor(input) {
  const keyword = input.keyword || null
    // default is get all authors
  const searchType = !input.searchType && parseInt(input.searchType) !== 0 ? 3 :
    parseInt(input.searchType)
  const sort = _getAuthorSortCondition(searchType)

    // Conditions for get data
  const where = app.utils.object.nullFilter({
    isValid: 1,
    nickName: !keyword ? null : {
      like: '%' + keyword + '%',
    },
  })
  const offset = paging.getOffsetCondition(input.page, input.limit)
  const [total, authors] = await Promise.all([
    surfaceNaviAuthorsModel.count(where),
    searchType != SEARCH_TYPE.AUTHOR.JP_NAME
      ? surfaceNaviAuthorsModel.find({
        where,
        limit: offset.limit,
        skip: offset.skip,
        order: sort,
      })
      : _searchAuthorByNickname(keyword, offset),
  ])

  if (!authors.length) {
    return []
  }

  const data = authors.map(author => {
    return common.authorObject(author)
  })

  return !input.page ? data : paging.addPagingInformation(data, parseInt(input.page),
    total, input.limit)
}

/**
 * Get sort condition (access count) based on periodType
 * periodType: 0 - all, 1 - 7 days, 2 - 30 days, 3 - new articles (default)
 *
 * @param $periodType
 * @return null|string
 * @private
 */
function _getSortCondition(periodType) {
  switch (periodType) {
    case 0:
      return 'accessCount'
    case 1:
      return 'accessCountWeekly'
    case 2:
      return 'accessCountMonthly'
    default:
      return 'publishedAt'
  }
}

/**
 * Get sort condition for author page based on searchType
 * searchType: 0 - popular author, 1 - name あ～わ, 2 - name A~Z, 3 - new authors (default)
 *
 * @param $searchType
 * @return null|string
 * @private
 */
function _getAuthorSortCondition(searchType) {
  switch (searchType) {
    case 0:
      return 'accessCount DESC'
    case 1:
      return 'nickName ASC'
    case 2:
      return 'nickName ASC'
    default:
      return 'userId DESC'
  }
}

/**
 * search author order by nick name
 * @param {string} keyword
 * @param {Object} offset
 *
 * private
 */
async function _searchAuthorByNickname(keyword, offset) {
  const keywordConditionSql = keyword ? `AND nick_name LIKE '%${keyword}%' ` : ''
  const enStrRangeRegex = 'a-zA-z0-9'
  const jpNicknameConditionsSql = `
    AND nick_name REGEXP '^[^${enStrRangeRegex}]'
    ${keywordConditionSql}
  `
  const enNicknameConditionsSql = `
    AND nick_name IS NOT NULL
    AND nick_name REGEXP '^[${enStrRangeRegex}]'
    ${keywordConditionSql}
  `
  const emptyNicknameConditionsSql = `
    AND (nick_name IS NULL OR nick_name = '')
    ${keywordConditionSql}
  `

  const sql = `
    SELECT
      id,
      is_valid,
      user_id,
      nick_name,
      user_self_introduction
    FROM (
      (${_getAuthorByNicknameSql(jpNicknameConditionsSql, SORT_VALUE.JA)})
      UNION ALL
      (${_getAuthorByNicknameSql(enNicknameConditionsSql, SORT_VALUE.EN)})
      UNION ALL
      (${_getAuthorByNicknameSql(emptyNicknameConditionsSql, SORT_VALUE.EMPTY)})
    ) a
    ORDER BY sort_key ASC, nick_name ASC
    LIMIT ?
    OFFSET ?
  `

  const authors = await modelUtil.excuteQuery('surfaces', sql, [+offset.limit, +offset.skip])
  return authors.map(author => {
    return {
      id: author['id'],
      isValid: author['is_valid'],
      userId: author['user_id'],
      nickName: author['nick_name'],
      userSelfIntroduction: author['user_self_introduction'],
    }
  })
}

/**
 * sql to get author sort by nickName
 *
 * @param {string} sqlWhereCondition
 * @param {number} sortKey
 *
 * private
 */
function _getAuthorByNicknameSql(sqlWhereCondition, sortKey) {
  return `
    SELECT
      id,
      is_valid,
      user_id,
      nick_name,
      user_self_introduction,
      ${sortKey} AS sort_key
    FROM
      surface_navi_authors
    WHERE
    is_valid = 1
    ${sqlWhereCondition}
    ORDER BY nick_name ASC
  `
}

module.exports = {
  searchArticle,
  searchSeries,
  searchAuthor,
  searchSeriesList,
  searchArticleList,
}
