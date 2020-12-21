const reviewService = require('@services/surface/review/review')
const productService = require('@services/surface/review/product')
const listReviewService = require('@services/surface/review/listReview')
const myReviewService = require('@services/surface/review/myReview')

async function index(req, res) {
  try {
    res.json(await productService.index(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function show(req, res) {
  try {
    res.json(await productService.show(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function newReview(req, res) {
  try {
    res.json(await reviewService.newReview(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function systemtrade(req, res) {
  try {
    res.json(await reviewService.systemtrade(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function ebook(req, res) {
  try {
    res.json(await reviewService.ebook(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function salon(req, res) {
  try {
    res.json(await reviewService.salon(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function reviewer(req, res) {
  try {
    res.json(await reviewService.reviewer(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function topEA(req, res) {
  try {
    res.json(await reviewService.topEA(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function topEbook(req, res) {
  try {
    res.json(await reviewService.topEbook(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function listReview(req, res) {
  try {
    res.json(await listReviewService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function myReviewIndex(req, res) {
  try {
    res.json(await myReviewService.index(req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function myReviewDetail(req, res) {
  try {
    res.json(await myReviewService.show(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function myReviewUpdate(req, res) {
  try {
    res.json(await myReviewService.update(req.params.id, req.body, req))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  index,
  show,
  newReview,
  systemtrade,
  ebook,
  salon,
  reviewer,
  topEA,
  topEbook,
  listReview,
  myReviewIndex,
  myReviewDetail,
  myReviewUpdate,
}
