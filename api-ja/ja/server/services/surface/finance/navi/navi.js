const app = require('@server/server')
const {
  articleObject,
  seriesObject,
  getPurchasedArticles,
  getReadLaterArticles,
  getFavoriteArticles,
  getFavoriteSeries
} = require('@services/surface/finance/navi/common')

const surfaceNaviModel = app.models.SurfaceNavi
const surfaceNaviSeriesModel = app.models.SurfaceNaviSeries
const articleModel = app.models.Articles
const favoriteSeriesModel = app.models.FavoriteSeries
const readLateArticlesModel = app.models.ReadLateArticles
const naviCategoryModel = app.models.NaviCategories
const likeArticleModel = app.models.LikeArticles
const likeSeriesModel = app.models.LikeSeries

/**
 * Get article ranking data
 *
 * Access count in 1 days
 * Access count in 7 days
 * Access count in 30 days
 * Access count total
 *
 * @param input
 * @returns {Promise<Object>[][]}
 * @public
 */
async function articleRanking(input) {
  let [access1Days, access7Days, access30Days, accessTotal] = await Promise.all(
    [
      _getArticleData(input.limit || 10, ['accessCountDaily DESC',
        'publishedAt DESC'
      ]),
      _getArticleData(input.limit || 10, ['accessCountWeekly DESC',
        'publishedAt DESC'
      ]),
      _getArticleData(input.limit || 10, ['accessCountMonthly DESC',
        'publishedAt DESC'
      ]),
      _getArticleData(input.limit || 10, ['accessCount DESC',
        'publishedAt DESC'
      ])
    ])

  return [access1Days, access7Days, access30Days, accessTotal]
}

/**
 * Get series ranking data
 * Access count for fx
 * Access count for stock
 * Access count for bitcoin
 * Access count for nikkei
 *
 * @param input
 * @returns {Promise<Object[][]>}
 * @public
 */
async function seriesRanking(input) {
  let sort = ['accessCountThreeMonths DESC', 'publishedAt DESC']
  if (input.isCombineCategories) {
    return _getSeriesData(input.limit || 10, sort)
  }

  let [all, fx, stock, bitcoin] = await Promise.all(
    [
      _getSeriesData(input.limit || 10, sort, null, input.isGetContent),
      _getSeriesData(input.limit || 10, sort, 1, input.isGetContent),
      _getSeriesData(input.limit || 10, sort, 3, input.isGetContent),
      _getSeriesData(input.limit || 10, sort, 18, input.isGetContent)
    ])

  return [all, fx, stock, bitcoin]
}

/**
 * Get article ranking data
 *
 * @param limit
 * @param sort
 * @returns {Promise<Object[]>}
 * @private
 */
async function _getArticleData(limit, sort) {
  let articles = await surfaceNaviModel.find({
    where: {
      isValid: 1,
      publishedAt: {
        lte: app.utils.time.utcDate()
      },
      isSaleStop: 0,
    },
    limit: limit,
    order: sort,
    fields: {
      content: false
    }
  })

  return articles.map(article => {
    return Object.assign({}, articleObject(article), {
      seriesTitle: article.seriesTitle,
    })
  })
}

/**
 * Get series ranking data
 *
 * @param limit
 * @param sort
 * @param category
 * @returns {Promise<Object[]>}
 * @private
 */
async function _getSeriesData(limit, sort, category = null, isGetContent=false) {
  let conditions = {
    where: {
      isValid: 1,
      publishedAt: {
        lte: app.utils.time.utcDate()
      },
      isSaleStop: 0,
    },
    limit: limit,
    order: sort,
    fields: {
      lastArticleTitle: false
    }
  }
  if (category) {
    conditions.where.categoryId = category
  }

  let series = await surfaceNaviSeriesModel.find(conditions)
  return series.map(series => seriesObject(series, isGetContent))
}

/**
 * Get purchased articles/series of current user
 *
 * @param input
 * @param meta
 * @returns {Object}
 * @public
 */
async function purchased(input, meta) {
  let pIds = Object.keys(await getPurchasedArticles(meta.userId)) || {}
  if (!pIds || pIds == []) return []

  let [series, articles] = await Promise.all([
      surfaceNaviSeriesModel.find({
        where: {
          productId: {
            inq: pIds
          },
          isPaidContent: 1
        },
        fields: {
          id: true,
          title: true
        },
      }),
      surfaceNaviModel.find({
        where: {
          productId: {
            inq: pIds
          }
        },
        fields: {
          id: true,
          title: true,
          seriesId: true
        },
      })
    ]),

    res = []
  if (series) {
    series.forEach(function(record) {
      record.detailUrl = '/finance/navi/series/' + record.id
      res.push(record)
    })
  }
  if (articles) {
    articles.forEach(function(record) {
      record.detailUrl = '/finance/navi/articles/' + record.id
      res.push(record)
    })
  }
  return res
}

/**
 * Get list series was followed by current user
 *
 * @param input
 * @param meta
 * @returns {Object}
 * @public
 */
async function readLater(input, meta) {
  if (!meta.userId || meta.userId == 0) return []

  let ids = Object.keys(await getReadLaterArticles(meta.userId)) || {}
  if (!ids || ids == []) return []

  let articles = await articleModel.find({
    where: {
      id: {
        inq: ids
      },
      isValid: 1
    },
    fields: {
      id: true,
      title: true,
      seriesId: true
    }
  })

  return articles.map(record => Object.assign(
    record, {
      detailUrl: '/finance/navi/articles/' + record.id
    }
  ))
}

/**
 * Get favorite articles of current user
 *
 * @param input
 * @param meta
 * @returns {Object}
 * @public
 */
async function favorite(input, meta) {
  if (!meta.userId || meta.userId == 0) return []

  let [artIds, serIds] = await Promise.all([
      (Object.keys(await getFavoriteArticles(meta.userId)) || {}),
      (Object.keys(await getFavoriteSeries(meta.userId)) || {}),
    ]),
    [articles, series] = await Promise.all([
      articleModel.find({
        where: {
          id: {
            inq: artIds
          },
          isValid: 1
        },
        fields: {
          id: true,
          title: true,
          seriesId: true
        },
      }),
      surfaceNaviSeriesModel.find({
        where: {
          id: {
            inq: serIds
          },
          isValid: 1
        },
        fields: {
          id: true,
          title: true
        },
      })
    ]),
    res = []

  if (articles) {
    articles.forEach(function(record) {
      record.detailUrl = '/finance/navi/articles/' + record.id
      res.push(record)
    })
  }

  if (series) {
    series.forEach(function(record) {
      record.detailUrl = '/finance/navi/series/' + record.id
      res.push(record)
    })
  }

  return res
}

/**
 * Post favorite Series of current user
 *
 * @param input
 * @param meta
 * @returns {Object}
 * @public
 */
async function postFavoriteSeries(input, meta) {
  return await _postFavorite(input.seriesId, meta, 3, favoriteSeriesModel)
}

/**
 * Post read later of current user
 *
 * @param input
 * @param meta
 * @returns {Object}
 * @public
 */
async function postReadLater(input, meta) {
  if (!input.articleId || !meta.userId) {
    return {}
  }

  let old = await readLateArticlesModel.findOne({
    where: {
      isValid: {inq: [0, 1]},
      userId: meta.userId,
      articleId: input.articleId,
    }
  })

  if (!old) {
    await readLateArticlesModel.create({
      isValid: 1,
      userId: meta.userId,
      articleId: input.articleId,
    })
    return {
      status: 1,
    }
  }

  old.isValid = old.isValid == 0 ? 1 : 0
  await old.save()

  return {
    status: old.isValid,
  }
}

/**
 * Post read later of current user
 *
 * @param input
 * @param meta
 * @returns {Object}
 * @public
 */
async function postFavorite(input, meta) {
  return await _postFavorite(input.articleId, meta, 4, favoriteSeriesModel)
}

/**
 * Post favorite by id and userId
 *
 * @param id
 * @param meta
 * @param masterType
 * @param model
 * @returns {Object}
 * @private
 */
async function _postFavorite(id, meta, masterType, model) {
  if (!id || !meta.userId) {
    return {}
  }

  let old = await model.findOne({
    where: {
      isValid: {inq: [0, 1]},
      userId: meta.userId,
      masterType: masterType,
      masterId: id,
    }
  })

  if (!old) {
    await model.create({
      isValid: 1,
      userId: meta.userId,
      masterType: masterType,
      masterId: id,
    })
    return {
      status: 1,
    }
  }

  old.isValid = old.isValid == 0 ? 1 : 0
  await old.save()

  return {
    status: old.isValid,
  }
}

async function getNaviCategory() {
  return await naviCategoryModel.find({
    where: {
      isValid: 1
    }
  })
}

/**
 * Post like article of current user
 *
 * @param articleId
 * @param userId
 * @returns {Object}
 * @public
 */
async function postLikeArticle(articleId, userId) {
  return _postLike(articleId, userId, likeArticleModel)
}

/**
 * Post like series of current user
 *
 * @param seriesId
 * @param userId
 * @returns {Object}
 * @public
 */
async function postLikeSeries(seriesId, userId) {
  return _postLike(seriesId, userId, likeSeriesModel)
}

/**
 * Post like by id and userId
 *
 * @param id
 * @param userId
 * @param model
 * @returns {Object}
 * @private
 */
async function _postLike(id, userId, model) {
  const existedData = await model.findOne({
    where: {
      isValid:{
        inq: [0, 1],
      },
      userId: userId,
      masterId: id,
    },
    fields: {
      id: true,
      isValid: true,
    },
  })

  if (!existedData) {
    const newData = await model.create({
      isValid: 1,
      userId: userId,
      masterId: id,
    })

    return {
      status: newData.isValid,
    }
  }

  existedData.isValid = 1 - existedData.isValid
  await existedData.save()

  return {
    status: existedData.isValid,
  }
}

/**
 * Get like series and status like of user
 *
 * @param seriesId
 * @param userId
 * @returns {Object}
 * @public
 */
async function getLikeSeries(seriesId, userId) {
  return _getLike(seriesId, userId, likeSeriesModel)
}

/**
 * Get like article and status like of user
 *
 * @param articleId
 * @param userId
 * @returns {Object}
 * @public
 */
async function getLikeArticle(articleId, userId) {
  return _getLike(articleId, userId, likeArticleModel)
}

/**
 * Get like count and status like of user
 *
 * @param id
 * @param userId
 * @param model
 * @returns {Object}
 * @private
 */
async function _getLike(id, userId, model) {
  const conditions = {
    isValid: 1,
    masterId: id,
  }

  const isLikedCondition = {
    ...conditions,
    userId,
  }

  const [totalLike, like] = await Promise.all([
    model.count(conditions),
    _getListLike(model, userId, [id], isLikedCondition),
  ])

  return {
    totalLike,
    isLiked: !!like.length,
  }
}

/**
 * Get list like
 *
 * @param model
 * @param userId
 * @param masterIds
 * @param condition
 * @returns {Array}
 * @private
 */
async function _getListLike(model, userId = 0, masterIds = [], conditions = {}) {
  if (!masterIds.length) {
    return []
  }

  const finalConditions = {
    isValid: 1,
    masterId: {
      inq: masterIds,
    },
    ...conditions,
  }

  const listLike = await model.find({
    where: finalConditions,
    fields: {
      createdAt: false,
      updatedAt: false,
    },
  })

  const res = listLike.reduce((acc, like) => {
    const masterId = like.masterId
    if (!acc[masterId]) {
      const obj = {
        id: like.id,
        masterId: masterId,
        isLiked: userId === like.userId,
        totalLike: 0,
      }
      acc[masterId] = obj
    }

    if (acc[masterId].userId === userId) {
      acc[masterId].id = like.id
      acc[masterId].isLiked = true
    }

    acc[masterId].totalLike++

    return acc
  }, {})

  return Object.values(res)
}

/**
 * Get list like navi
 *
 * @param userId
 * @param articleIds
 * @param seriesIds
 *
 * @returns {Promise<{seriesLikes: Array, articleLikes: Array}>}{Array}
 *
 * @public
 */
async function getListLikeNavi(userId, articleIds, seriesIds) {
  const [articleLikes, seriesLikes] = await Promise.all([
    _getListLike(likeArticleModel, userId, articleIds),
    _getListLike(likeSeriesModel, userId, seriesIds),
  ])

  return {
    articleLikes,
    seriesLikes,
  }
}

module.exports = {
  articleRanking,
  seriesRanking,
  purchased,
  readLater,
  favorite,
  postFavoriteSeries,
  postReadLater,
  postFavorite,
  getNaviCategory,
  postLikeArticle,
  postLikeSeries,
  getLikeArticle,
  getLikeSeries,
  getListLikeNavi,
}
