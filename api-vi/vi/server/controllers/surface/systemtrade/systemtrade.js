const searchService = require('@services/surface/systemtrade/index/search')
const chartDetailService = require('@services/surface/systemtrade/detail/chart')
const videoService = require('@services/surface/systemtrade/video/video')
const backTestService = require('@services/surface/systemtrade/index/backtest')

const metaUtil = require('@@server/utils/meta')

async function search(req, res) {
  try {
    const input = req.body
    input.type = 1
    // TODO Uncomment this block when support mobile
    // if (req.headers.platform != 'mobile') {
    //    input.type = 1
    // }
    res.json(await searchService.index(input))
  } catch (e) {
    res.sendStatus(e)
  }
}


async function getChart(req, res) {
  try {
    res.json(await chartDetailService.showChart(req.params.id, req.query))
  } catch (e) {
    res.sendStatus(e)
  }
}


async function getVideo(req, res) {
  try {
    res.json(await videoService.show(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function backTest(req, res) {
  try {
    res.send(await backTestService.show(
      req.params.id,
      req.query,
      req.params.number,
      metaUtil.meta(req, ['langType']).langType,
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function getDirsByProductId(req, res) {
  try {
    res.send(await backTestService.getDirsByProductId(req.params.id))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function backtestIndex(req, res) {
  try {
    res.send(await backTestService.backtestIndex(req.params.id, req.query, metaUtil.meta(req).userId))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function userBackTest(req, res) {
  try {
    res.send(await backTestService.renderUserBackTest(
      req.params.id,
      req.query,
      req.params.user_id,
      req.params.count,
      req.params.number,
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}

async function userBackTestv2(req, res) {
  try {
    res.send(await backTestService.renderUserBackTestv2(
      req.params.id,
      req.query,
      req.params.user_id,
      req.params.count,
      req.params.number,
    ))
  } catch (e) {
    res.sendStatus(e)
  }
}
module.exports = {
  search,
  getChart,
  getVideo,
  backTest,
  getDirsByProductId,
  userBackTest,
  userBackTestv2,
  backtestIndex,
}
