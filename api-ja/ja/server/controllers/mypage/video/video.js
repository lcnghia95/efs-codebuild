const app = require('@server/server')
const service = require('@services/mypage/video/video')

// utils
const metaUtils = app.utils.meta
async function index(req, res) {
  try {
    res.json(await service.index(
      req.query,
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function show(req, res) {
  try {
    res.json(await service.show(
      req.params.id,
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function comment(req, res) {
  try {
    res.json(await service.comment(
      req.params.id,
      req.query,
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postComment(req, res) {
  try {
    res.json(await service.postComment(
      req.params.id,
      req.body,
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function deleteComment(req, res) {
  try {
    res.json(await service.deleteComment(
      req.params.id,
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function schedule(req, res) {
  try {
    res.json(await service.schedule(
      req.params.id,
      req.query,
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function setting(req, res) {
  try {
    res.json(await service.setting(
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postSetting(req, res) {
  try {
    res.json(await service.postSetting(
      req.body,
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function review(req, res) {
  try {
    res.json(await service.review(
      req.params.id,
      metaUtils.meta(req, ['userId']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function postReview(req, res) {
  try {
    res.json(await service.postReview(
      req.params.id,
      req.body,
      metaUtils.meta(req, ['userId', 'ipAddress', 'userAgent']),
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  index,
  show,
  comment,
  postComment,
  deleteComment,
  schedule,
  setting,
  postSetting,
  review,
  postReview,
}
