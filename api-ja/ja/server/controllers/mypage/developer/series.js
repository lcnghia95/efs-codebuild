const userId = require('@controllers/mypage/helper').userId
const meta = require('@controllers/mypage/helper').meta
const seriesService = require('@services/mypage/developer/series')

async function seriesSearch(req, res){
  const uid = userId(req)
  const series = await seriesService.getListSeriesByUserId(uid)
  res.json(series)
}

async function getSeries(req, res) {
  const uid = userId(req)
  const series = await seriesService.getSeries(uid, req.query)
  res.json(series)
}

async function show(req, res) {
  const uid = userId(req)
  const editSeries = await seriesService.show(uid, req.params.id)
  if(editSeries.code){
   return res.status(editSeries.code).json()
  }
  res.json(editSeries)
}

async function create(req, res){
  const metaInfo = meta(req)
  const createSeries = await seriesService.createSeries(metaInfo, req.body)
  if(createSeries.code){
    return res.status(createSeries.code).json(createSeries)
  }
  res.json(createSeries)
}

async function update(req, res){
  const uid = userId(req)
  const updateSeries = await seriesService.updateSeries(uid, req.params.id, req.body)
  if(updateSeries.code){
   return res.status(updateSeries.code).json(updateSeries)
  }
  res.json(updateSeries)
}

async function destroy(req, res){
  const uid = userId(req)
  const deleteSeries = await seriesService.deleteSeries(uid, req.params.id)
  if(!deleteSeries){
    return res.status(400).json()
  }
  res.json(deleteSeries)
}

async function salesStop(req, res){
  const uid = userId(req)
  const payload = await seriesService.salesStopSeries(uid, req.params.id)
  if(!payload){
    return res.status(400).json()
  }
  res.json(payload)
}

async function resell(req, res) {
  const uid = userId(req)
  const result = await seriesService.resell(uid, req.params.id)
  if (typeof result === 'object') res.json(result)
  res.status(500).send()
}

module.exports = {
  show,
  create,
  update,
  destroy,
  getSeries,
  salesStop,
  seriesSearch,
  resell
}
