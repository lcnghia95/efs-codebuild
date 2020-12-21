const app = require('@server/server')
const syncService = require('@services/common/synchronize')
const modelUtils = require('@server/utils/model')

//models
const communityGoodModel = app.models.CommunityGood

//utils
const timeUtil = app.utils.time

//
const SUB_TIME = 3600000 * 9

/**
 * Get markets by query from and to
 *
 * @param {object} input (contain from and to value)
 * @returns {Promise<Array>}
 * @public
 */
async function index(input) {
  if (!input.from || !input.to) {
    return []
  }

  let where = {
      and: [{
        CheckDate: {
          gte: input.from * 1000 + SUB_TIME
        }
      }, {
        CheckDate: {
          lte: input.to * 1000 + SUB_TIME
        }
      }],
    },

    data = await _economics(where)
  return data.map(item => {
    item = item.toJSON()
    item.CheckDate = timeUtil.toUnix(item.CheckDate)
    return item
  })
}

/**
 * Get market by marketId
 *
 * @param {number} marketId
 * @returns {Promise<Object>}
 * @public
 */
async function show(marketId) {
  if (marketId < 1) {
    return {}
  }

  let result = (await _economics({
    ID: marketId,
  }))[0]

  if (!result) {
    return {}
  }

  result = result.toJSON()
  result.CheckDate = timeUtil.toUnix(result.CheckDate)
  return result
}

/**
 * Get chart goodType by marketId
 *
 * @param {number} marketId
 * @returns {Promise<Array>}
 * @public
 */
async function chart(communityId) {
  if (!communityId) {
    return []
  }

  let data = await communityGoodModel.find({
    where: {
      communityId: communityId,
      goodType: {
        inq: [1, 2]
      },
    },
    fields: {
      id: true,
      goodType: true,
    },
  })

  if (!data.length) {
    return []
  }

  let type1 = data.filter(item => item.goodType == 1).length
  return {
    '1': +(100 * type1 / data.length).toFixed(2),
    '2': +(100 * (data.length - type1) / data.length).toFixed(2),
  }
}

/**
 * Get comments
 *
 * @param
 * @returns
 * @public
 */
async function comments() {
  return []
}

/**
 * Post comments
 *
 * @param
 * @returns
 * @public
 */
async function postComment() {
  return []
}

/**
 * Post rate by marketId and return chart goodType
 *
 * @param {number} marketId
 * @returns {Promise<Array>}
 * @public
 */
async function postRate(userId, communityId, input) {
  if (userId < 1 || input.value > 2 || input.value < 0 || input.value == null) {
    return []
  }

  let communityGood = await communityGoodModel.findOne({
    where: {
      isValid: 1,
      communityId: communityId,
      userId: userId,
    }
  })

  if (!communityGood) {
    communityGood = await communityGoodModel.create({
      isValid: 1,
      communityId: communityId,
      userId: userId,
      goodType: input.value
    })
    syncService.syncDataToFxon('CommunityGood', communityGood.id)
  } else if (communityGood.goodType != input.value) {
    communityGood.goodType = input.value
    await communityGood.save()
    syncService.syncDataToFxon('CommunityGood', communityGood.id)
  }

  return await chart(communityId)
}

/**
 * Get data by from and to from table economic
 *
 * @param {Object} where
 * @returns {Promise<Array>}
 * @public
 */
async function _economics(where) {
  let fields = {
    ID: true,
    CheckDate: true,
    DayOfWeek: true,
    Country: true,
    Name: true,
    Value: true,
    LastTime: true,
    ThisTime: true,
    Result: true,
  }
  return await modelUtils.find('fx_default', 'economic', {
    where,
    limit: 0,
    fields,
  })
}

module.exports = {
  index,
  show,
  chart,
  comments,
  postComment,
  postRate,
}
