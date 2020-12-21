const userId = require('@controllers/mypage/helper').userId
const meta = require('@controllers/mypage/helper').meta

const articleService = require('@services/mypage/developer/article')
const seriesService = require('@services/mypage/developer/series')
// const _isEmpty = require('lodash').isEmpty

async function index(req, res) {
  const uid = userId(req)
  const [series, articles] = await Promise.all([
      seriesService.index(uid),
      articleService.index(uid),
    ])
  res.json({series, articles})
}

async function updateStatus(req, res) {
  articleService.updateStatus(
    parseInt(req.params.id),
    parseInt(req.params.status),
    userId(req),
  )
  res.json()
}

async function getArticles(req, res) {
  const uid = userId(req)
  const articles = await articleService.getArticles(uid,req.query)
  res.json(articles)
}


async function getListArticleBySeriesId (req, res) {
  const uid = userId(req)
  const articles = await articleService.getListArticleSearch(uid, req.query)
  res.json(articles)
}

async function show(req, res){
  const uid = userId(req)
  const editArticle = await articleService.show(uid, req.params.id)
  if(editArticle.code){
    return res.status(editArticle.code).json()
  }
  res.json(editArticle)
}

async function create(req, res){
  const infoMeta = meta(req)
  const payload = await articleService.createArticle(infoMeta, req.body)
  if(payload.code){
    return res.status(payload.code).json(payload)
  }
  res.json(payload)
}

async function update(req, res){
  const infoMeta = meta(req)
  const payload = await articleService.updateArticle(infoMeta, req.params.id, req.body)
  if(payload.code){
    return res.status(payload.code).json(payload)
  }
  res.json(payload)
}

async function destroy(req, res){
  const uid = userId(req)
  const payload = await articleService.deleteArticle(uid, req.params.id)
  if(!payload){
    return res.status(400).json()
  }
  res.json(payload)
}

async function salesStop(req, res){
  const uid = userId(req)
  const payload = await articleService.salesStopArticle(uid, req.params.id)
  if(!payload){
    return res.status(400).json()
  }
  res.json(payload)
}

async function resell(req, res){
  const uid = userId(req)
  const result = await articleService.resell(uid, req.params.id)
  if (typeof result === 'object') res.json(result)
  res.status(500).send()
}

module.exports = {
  show,
  index,
  create,
  update,
  destroy,
  getArticles,
  updateStatus,
  getListArticleBySeriesId,
  salesStop,
  resell
}
