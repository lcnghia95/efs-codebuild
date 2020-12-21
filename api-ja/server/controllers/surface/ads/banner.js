const helper = require('./helper')
const bannerService = require('@@/server/services/surface/ads/banner')
const sliderService = require('@@/server/services/surface/ads/slider')
const adsService = require('@@/server/services/surface/ads/ads')

const cache = require('@@server/utils/cache')
const crypt = require('@@server/utils/crypto')

const CACHE_TIMEOUT = 30000 // 30 seconds

async function index(req, res) {
  res.json(await bannerService.index(helper.servicePath(req)))
}

async function top(req, res) {
  res.json(await bannerService.top())
}

async function advertisement(req, res) {
  const servicePath = helper.servicePath(req)
  const languageAndPlatform = helper.languageAndPlatform(req)
  const key = crypt.encrypt(servicePath + languageAndPlatform.langType + languageAndPlatform.platform)
  const cacheData = await cache.get(key) || {}
  const expire = cacheData.expire || 0
  const now = Date.now()

  if(expire > now) {
    return res.json(cacheData.data)
  }

  const [banners, sliders, ads] = await Promise.all([
    bannerService.index(servicePath, languageAndPlatform.platform),
    sliderService.index(servicePath,languageAndPlatform),
    adsService.index(servicePath,languageAndPlatform),
  ])

  const data = {
    banners,
    topSliders: sliders,
    advertiseBanners: ads,
  }

  await cache.remove(key)
  await cache.set(key, {data, expire: now + CACHE_TIMEOUT}, CACHE_TIMEOUT/1000)

  return res.json(data)
}

module.exports = {
  index,
  top,
  advertisement,
}
