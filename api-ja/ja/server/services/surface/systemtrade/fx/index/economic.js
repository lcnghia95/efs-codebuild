const app = require('@server/server')
const helper = require('@services/surface/systemtrade/index/helper')

// models
const systemtradeRankingEconomicModel = app.models.SystemtradeRankingEconomics

const { Flags, AllEconomicValue } = require('@@server/common/data/hardcodedData').SYSTEMTRADE_ECONOMIC

const pagingUtil = app.utils.paging

/**
 * index systemtrade Economic
 *
 * @param {Void}
 * @return {Object}
 * @public
 */
async function index() {
  const economics = systemtradeRankingEconomicModel.find({
    where: {
      isValid: 1,
      isEconomic: 1,
      value: {
        inq: AllEconomicValue,
      },
    },
    limit: 2,
    order: 'value ASC',
    fields: {
      country: true,
      title: true,
      value: true,
    },
  })

  return economics.map(economic => {
    return {
      flag: Flags[(economic.country || 0) - 1],
      type: economic.value, // TODO: cheat
      title: economic.title,
    }
  })
}

async function systemtrade(input, value) {
  // const data = await _systemtrade(input, value)
  let data,
    total
    
  if (!input.page || !input.limit) {
    data = await _systemtrade(input, value)
    return (input.type || 0) != 1 ? data : {data}
  } else {
    [data, total] = await Promise.all([
      _systemtrade(input, value),
      systemtradeRankingEconomicModel.count({
        isValid: 1,
        isEconomic: 0,
        value,
      }),
    ])

    data = pagingUtil.addPagingInformation(data, input.page, total, input.limit, input.displayRange)
    return data
  }
}

/**
 * index systemtrade Economic
 *
 * @param {Object} input
 * @param {Number} value
 * @return {Array}
 * @public
 */
async function _systemtrade(input, value) {
  if (AllEconomicValue.indexOf(value) == -1) {
    return []
  }

  const condition = {
    where: {
      isValid: 1,
      isEconomic: 0,
      value,
    },
  }

  if ((input.type || 0) != 1) {
    condition.fields = {
      categoryId: true,
      productId: true,
      productName: true,
      price: true,
      isSpecialDiscount: true,
      specialDiscountPrice: true,
      reviewsStars: true,
      reviewsCount: true,
      balanceCurve: true,
      accountCurrencyType: true,
    }
  }

  if ((input.limit || 0) > 0) {
    condition.limit = input.limit
  }

  if ((input.page || 0) > 0) {
    condition.skip = (parseInt(input.page) - 1) * (parseInt(input.limit) || 0)
  }

  const financial = await systemtradeRankingEconomicModel.find(condition)
  return financial.map(
    item => helper.indexObject(item, input.type || 0),
  )
}

/**
 * index systemtrade Economic
 *
 * @param {Number} value
 * @return {Object}
 * @public
 */
async function top(value) {
  if (AllEconomicValue.indexOf(value) == -1) {
    return []
  }

  const economic = await systemtradeRankingEconomicModel.findOne({
    where: {
      isValid: 1,
      isEconomic: 1,
      value,
    },
  })

  if (!economic) {
    return []
  }

  const input = {
    limit: 5,
    type: 0,
  }

  return {
    title: economic.title || '',
    flag: Flags[(economic.country || 0) - 1] || '',
    data: await _systemtrade(input, value),
  }
}

module.exports = {
  index,
  systemtrade,
  top,
}
