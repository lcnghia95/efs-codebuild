const app = require('@server/server')
const {
  sfProductObjects,
} = require('@services/common/surfaceProduct')

const { indexChart, systemtradeBalanceCurve } =  require('@services/surface/systemtrade/index/helper')
const rtRankingService = require('@@services/surface/systemtrade/index/realtradeRanking')
// models
const commonRankingBestSellerModel = app.models.CommonRankingBestSellers


// utils
const objectUtil = require('@@server/utils/object')
const arrayUtil = require('@ggj/utils/utils/array')

//
const SYSTEMTRADE_TYPE_ID = 1
// const TOOLS_TYPE_ID = [2, 6, 9, 10, 13, 70, 71, 72]
const { TOOLS_TYPE_ID } = require('@@server/common/data/hardcodedData')
const MAX_LENGTH = 10

/**
 * Get index content
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function index(query = {}) {
  const data = await _data()
  let [objectData, systemtradeProducts, realtradeRanking] = await Promise.all([
    sfProductObjects(data.data),
    systemtradeBalanceCurve(arrayUtil.column(data.data || [], 'productId')),
    rtRankingService.index(query),
  ])

  objectData = objectUtil.deepFilter(objectData)
  objectData.push(...realtradeRanking)

  return objectData.reduce((result, item) => {
    if (typeof item.pips !== 'undefined'){
      // In case this is real-trade product
      result.rt.push(item)
      return result
    }
    item = Object.assign(item, {
      chart: indexChart(systemtradeProducts[item.id] || {}),
    })
    if (data.all.indexOf(item.id) != -1) {
      result.all.push(item)
    }
    if (data.ea.indexOf(item.id) != -1) {
      result.ea.push(item)
    }
    if (data.etc.indexOf(item.id) != -1) {
      result.etc.push(item)
    }
    return result
  }, {
    all: [],
    ea: [],
    etc: [],
    rt: [],
  })
}

/**
 * get common_ranking_best_sellers data
 *
 * @param {Void}
 * @return {Array}
 * @private
 */
async function _data() {
  const data = await commonRankingBestSellerModel.find({
    where: {
      isValid: 1,
    },
    fields: {
      typeId: true,
      categories: true,
      productId: true,
      productName: true,
      catchCopy: true,
    },
  })

  return _groupData(data)
}

/**
 * group data
 *
 * @param {Array} data
 * @return {Array}
 * @private
 */
function _groupData(data) {
  return data.reduce((result, item) => {
    let check = false
    if (result.all.length < MAX_LENGTH) {
      result.all.push(item.productId)
      check = true
    }

    if (result.ea.length < MAX_LENGTH && item.typeId == SYSTEMTRADE_TYPE_ID) {
      result.ea.push(item.productId)
      check = true
    }

    if (result.etc.length < MAX_LENGTH && TOOLS_TYPE_ID.indexOf(item.typeId) != -1) {
      result.etc.push(item.productId)
      check = true
    }
    if (check) {
      result.data.push(item)
    }
    return result
  }, {
    all: [],
    ea: [],
    etc: [],
    data: [],
  })
}

module.exports = {
  index,
}
