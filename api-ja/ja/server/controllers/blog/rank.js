const service = require('@server/services/blog/rank')

async function ranking(req, res) {
  try {
    res.json(await service.ranking(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function rankingRecentBlog(req, res) {
  try {
    res.json(await service.rankingRecentBlog(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function rankingTotalById(req, res) {
  try {
    res.json(await service.rankingTotalById(req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function rankingCategoryById(req, res) {
  try {
    res.json(await service.rankingCategoryById(req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function rankingRecommendArticles(req, res) {
  res.json(await service.rankingRecommendArticles(req.query))
}

async function rankingRecentArticles(req, res) {
  res.json(await service.rankingRecentArticles(req.query))
}

async function rankingArticle(req, res) {
  try {
    res.json(await service.rankingArticle(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  ranking,
  rankingRecentBlog,
  rankingTotalById,
  rankingCategoryById,
  rankingRecommendArticles,
  rankingRecentArticles,
  rankingArticle
}
