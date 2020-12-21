const app = require('@server/server')
const newReviewService = require('@services/surface/review/newReview')


async function popular(req, res) {
  try {
    let limit = parseInt(req.query.limit) || 10
    res.json(await newReviewService.popular(limit))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function highScore(req, res) {
  try {
    res.json(await newReviewService.highScore(req.params, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function highPost(req, res) {
  try {
    res.json(await newReviewService.highPost(req.params, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function popularDetail(req, res) {
  try {
    let query = req.query,
      page = query.page || 1,
      limit = query.limit || 20
    res.json(await newReviewService.popularDetail(page, limit))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function newPopularDetail(req, res) {
  try {
    let query = req.query,
      page = query.page || 1,
      limit = query.limit || 20
    res.json(await newReviewService.newPopularDetail(page, limit))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function fullhighPost(req, res) {
  try {
    let query = req.query,
      page = query.page || 1,
      limit = query.limit || 20
    res.json(await newReviewService.fullhighPost(page, limit))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function fullhighScore(req, res) {
  try {
    let query = req.query,
      page = query.page || 1,
      limit = query.limit || 20
    res.json(await newReviewService.fullhighScore(page, limit))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function alsoBought(req, res) {
  try {
    let {
      userId
    } = app.utils.meta.meta(req, ['userId'])
    res.json(await newReviewService.alsoBought(userId, req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function recommend(req, res) {
  try {
    let {
      userId
    } = app.utils.meta.meta(req, ['userId'])
    res.json(await newReviewService.recommend(userId, req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  popular,
  highScore,
  highPost,
  popularDetail,
  alsoBought,
  newPopularDetail,
  fullhighPost,
  fullhighScore,
  recommend,
}
