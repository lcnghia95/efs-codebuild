const app = require('@server/server')
const service = require('@services/surface/finance/navi/navi')
const indexService = require('@services/surface/finance/navi/index')
const articleService = require('@services/surface/finance/navi/article')
const searchService = require('@services/surface/finance/navi/search')
const alsoBoughtProductService = require('@services/common/alsoBoughtProduct')
const metaUtils = app.utils.meta

async function pr(req, res) {
  try {
    res.json(await indexService.pr(req.query, metaUtils.meta(req, [
      'userId'
    ])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function newArticles(req, res) {
  try {
    res.json(await indexService.newArticles(req.query, metaUtils.meta(req, [
      'userId'
    ])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function articleRanking(req, res) {
  try {
    res.json(await service.articleRanking(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function seriesRanking(req, res) {
  try {
    res.json(await service.seriesRanking(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function articleDetail(req, res) {
  let input = req.method === 'POST' ? req.body : req.query
  try {
    res.json(await articleService.articleDetail(
      req.params.id,
      input,
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function sameSeries(req, res) {
  try {
    let input = req.query,
      meta = metaUtils.meta(req, ['userId'])

    res.json(await articleService.sameSeries(meta.userId || 0, input.seriesId,
      req.params.id, [], input))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function sameSeriesEx(req, res) {
  try {
    let input = req.query,
      meta = metaUtils.meta(req, ['userId'])
    res.json(await articleService.sameSeriesEx(meta.userId || 0, req.params.id, input))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function related(req, res) {
  try {
    let id = req.params.id || 0,
      userId = metaUtils.meta(req, ['userId']).userId || 0,
      input = {
        limit: req.query.limit|| 0,
        isGetContent: req.query.isGetContent || 0,
      }

    if (!id) {
      res.json([])
      return
    }

    res.json(await articleService.related(id, input, userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function purchased(req, res) {
  try {
    res.json(await service.purchased(req.query, metaUtils.meta(req, [
      'userId'
    ])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function readLater(req, res) {
  try {
    res.json(await service.readLater(req.query, metaUtils.meta(req, [
      'userId'
    ])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function searchArticle(req, res) {
  try {
    res.json(await searchService.searchArticle(req.query, metaUtils.meta(
      req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function searchArticleList(req, res) {
  try {
    res.json(await searchService.searchArticleList(req.query, metaUtils.meta(
      req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function searchSeries(req, res) {
  try {
    res.json(await searchService.searchSeries(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function searchSeriesList(req, res) {
  try {
    res.json(await searchService.searchSeriesList(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function searchAuthor(req, res) {
  try {
    res.json(await searchService.searchAuthor(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function favorite(req, res) {
  try {
    res.json(await service.favorite(req.query, metaUtils.meta(req, [
      'userId'
    ])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postReadLaterArticle(req, res) {
  try {
    res.json(await service.postReadLater(req.body, metaUtils.meta(req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postFavoriteSeries(req, res) {
  try {
    res.json(await service.postFavoriteSeries(req.body, metaUtils.meta(req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postFavoriteArticle(req, res) {
  try {
    res.json(await service.postFavorite(req.body, metaUtils.meta(req, ['userId'])))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function alsoBought(req, res) {
  const opt = metaUtils.meta(req, ['userId'])
  try {
    res.json(await alsoBoughtProductService.alsoBought([req.params.id, req.params.sid], opt.userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getNaviCategory(req, res) {
  try {
    res.json(await service.getNaviCategory())
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postLikeArticle(req, res) {
  try {
    const userId = _userId(req)
    const articleId = +req.params.articleId || 0
    if (!articleId || !userId) {
      return res.sendStatus(400)
    }

    res.json(await service.postLikeArticle(articleId, userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postLikeSeries(req, res) {
  try {
    const userId = _userId(req)
    const seriesId = +req.params.seriesId || 0
    if (!seriesId || !userId) {
      return res.sendStatus(400)
    }

    res.json(await service.postLikeSeries(seriesId, userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getLikeSeries(req, res) {
  try {
    const userId = _userId(req)
    const seriesId = +req.params.seriesId || 0
    if (!seriesId) {
      return res.sendStatus(400)
    }

    res.json(await service.getLikeSeries(seriesId, userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getLikeArticle(req, res) {
  try {
    const userId = _userId(req)
    const articleId = +req.params.articleId || 0
    if (!articleId) {
      return res.sendStatus(400)
    }

    res.json(await service.getLikeArticle(articleId, userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getListLikeNavi(req, res) {
  try {
    const userId = _userId(req)
    const articleIds = (req.query.articleIds || '')
      .split(',')
      .map(masterId => +masterId)

    const seriesIds = (req.query.seriesIds || '')
      .split(',')
      .map(masterId => +masterId)

    res.json(await service.getListLikeNavi(userId, articleIds, seriesIds))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function newNavi(req, res) {
  try {
    res.json(await indexService.newNavi(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

function _userId(req) {
  return metaUtils.meta(req, ['userId']).userId
}

module.exports = {
  articleRanking,
  seriesRanking,
  pr,
  newArticles,
  purchased,
  articleDetail,
  readLater,
  sameSeries,
  sameSeriesEx,
  favorite,
  searchArticle,
  searchSeries,
  searchAuthor,
  postReadLaterArticle,
  postFavoriteSeries,
  postFavoriteArticle,
  related,
  alsoBought,
  getNaviCategory,
  postLikeArticle,
  postLikeSeries,
  getLikeArticle,
  getLikeSeries,
  newNavi,
  searchSeriesList,
  searchArticleList,
  getListLikeNavi,
}
