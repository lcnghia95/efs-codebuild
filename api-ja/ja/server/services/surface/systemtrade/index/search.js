const app = require('@server/server')
const helper = require('./helper')

// models
const systemtradeSearchModel = app.models.SystemtradeSearch
const systemtradeRankingActiveModel = app.models.SystemtradeRankingActive

// utils
// const timeUtil = app.utils.time
const queryUtil = app.utils.query
const objectUtil = app.utils.object
const pagingUtil = app.utils.paging
const arrayUtil = require('@ggj/utils/utils/array')

const Months = [
  '0', '1', '3', '6', '12', '24',
]

const CommonKeys = {
  month: 'months',
  categoryId: 'categoryId',
  platformId: 'platformId',
}

const LikeKeys = {
  name: 'productName',
}

const CommaKeys = {
  tags: 'easySearchType',
  currencyPairs: 'currencyPairs',
  tradingStyles: 'tradingStyles',
  technicalIndicators: 'technicalIndicators',
}

const Mins = {
  minProfitRate: 'profitRate',
  minProfitTotal: 'profitTotal',
  minProfitFactor: 'profitFactor',
  minTotalTrades: 'totalTrades',
  minPrice: 'price',
  minDrawdown: 'maximalDrawdownRate',
  minPosition: 'maxPositions',
}

const Maxs = {
  maxProfitRate: 'profitRate',
  maxProfitTotal: 'profitTotal',
  maxProfitFactor: 'profitFactor',
  maxTotalTrades: 'totalTrades',
  maxPrice: 'price',
  maxDrawdown: 'maximalDrawdownRate',
  maxPosition: 'maxPositions',
}

const activeMins = {
  minOperatingMonths: 'operatingMonths',
  minActiveCount: 'activeCount',
  minActiveRate: 'activeRate',
}

const activeMaxs = {
  maxOperatingMonths: 'operatingMonths',
  maxActiveCount: 'activeCount',
  maxActiveRate: 'activeRate',
}

const SortOfTag = {
  2: '0profitTotal',
  6: '0forwardDate',
}

const Sorts = {
  '0profitTotal': 'profit DESC',
  '1profitTotal': 'profit ASC',

  '0profitFactor': 'profitFactor DESC',
  '1profitFactor': 'profitFactor ASC',

  '0profitRate': 'profitRate DESC',
  '1profitRate': 'profitRate ASC',

  '0riskReturnRate': 'riskReturnRate DESC',
  '1riskReturnRate': 'riskReturnRate ASC',

  '0winningRate': 'winningRate DESC',
  '1winningRate': 'winningRate ASC',

  '0price': 'priceOnSale DESC',
  '1price': 'priceOnSale ASC',

  '0salesCount': 'salesCount DESC',
  '1salesCount': 'salesCount ASC',

  '0forwardDate': 'forwardAt DESC',
  '1forwardDate': 'forwardAt ASC',
}

/**
 * genarate order
 *
 * @param {String} sort
 * @param {String} tag
 * @return {String}
 * @private
 */
function _order(sort, tag) {
  if (sort == '') {
    sort = SortOfTag[tag] || '0profitTotal'
  }
  return [Sorts[sort] || 'profit DESC' ]
}

/**
 * genarate where
 *
 * @param {Object} input
 * @return {Object}
 * @private
 */
function _where(input) {
  const where = objectUtil.nullFilter(Object.assign(
    _commmoKeys(input),
    _likeKeys(input),
    // _status(input.status || 0)
    ),
  )
  const and = _commaKeys(input).concat(_mins(input)).concat(_maxs(input))

  if (and.length > 0) {
    where.and = and
  }

  if (input.isOnSale == true || input.isOnSale == 'true') {
    where.easySearchType = {
      neq: 10,
    }
  }

  if (input.isOperating == true || input.isOperating == 'true') {
    where.isOperating = 1
  }

  return where
}


/**
 * genarate where
 *
 * @param {Number} status
 * @return {Object}
 * @private
 */
// function _status(status) {
//   let threeMonthAgo = timeUtil.addMonths(-3)
//   if (status == 1) {
//     return {
//       forwardAt: {
//         gte: threeMonthAgo
//       }
//     }
//   } else if (status == 2) {
//     return {
//       versionUpdatedAt: {
//         gte: threeMonthAgo
//       }
//     }
//   } else {
//     return {}
//   }
// }

/**
 * genarate where with Common Keys
 *
 * @param {Object} input
 * @return {Object}
 * @private
 */
function _commmoKeys(input) {
  return Object.keys(CommonKeys).reduce((result, key) => {
    if (input[key]) {
      result[CommonKeys[key]] = {
        inq: input[key].split(','),
      }
    }
    return result
  }, {})
}

/**
 * genarate where with likeKey
 *
 * @param {Object} input
 * @return {Object}
 * @private
 */
function _likeKeys(input) {
  return Object.keys(LikeKeys).reduce((result, key) => {
    if (input[key]) {
      result[LikeKeys[key]] = {
        like: `%${input[key]}%`,
      }
    }
    return result
  }, {})
}

/**
 * genarate where with commaKeys
 *
 * @param {Object} input
 * @return {Object}
 * @private
 */
function _commaKeys(input) {
  return Object.keys(CommaKeys).reduce((result, key) => {
    if (input[key]) {
      result.push(queryUtil.commaKey(input[key], CommaKeys[key]))
    }
    return result
  }, [])
}

/**
 * genarate where with min conditions
 *
 * @param {Object} input
 * @return {Object}
 * @private
 */
function _mins(input) {
  return Object.keys(Mins).reduce((result, key) => {
    if (input[key]) {
      result.push({
        [Mins[key]]: {
          gte: input[key],
        },
      })
    }
    return result
  }, [])
}

/**
 * genarate where with max conditions
 *
 * @param {Object} input
 * @return {Object}
 * @private
 */
function _maxs(input) {
  return Object.keys(Maxs).reduce((result, key) => {
    if (input[key]) {
      result.push({
        [Maxs[key]]: {
          lte: input[key],
        },
      })
    }
    return result
  }, [])
}

/**
 * validate Input
 *
 * @param {Object} input
 * @return {Object}
 * @private
 */
function _validateInput(input) {
  input = objectUtil.nullFilter(input)
  
  if (!input.month || Months.indexOf(input.month.toString()) == -1) {
    input.month = '0'
  }

  return Object.keys(input).reduce((result, key) => {
    result[key] = input[key].toString()
    return result
  }, {})
}

/**
 * index systemtrade search
 *
 * @param {Object} input
 * @return {Object}
 * @public
 */
async function index(input) {
  input = _validateInput(input)
  // const activeWhere = _activeWhere(input)
  let pIds = [],
   rankingActive = await systemtradeRankingActiveModel.find({
    where: {
      isValid: 1,
      activeMonths: 1,
      platformId: {
        inq: [1, 15],
      },
      categoryId: 1,
      totalTrades: {
        gt: 0,
      },
      isOperating: 1,
      activeCount: {
        gte: 5,
      },
    },
    fields: {
      operatingMonths: true,
      activeRate: true,
      activeCount: true,
      salesCount: true,
      productName: true,
      categoryId: true,
      productId: true,
      userId: true,
    },
    order: ['activeCount DESC', 'activeRate DESC'],
  })
  if (input.minActiveCount || input.maxActiveCount || input.minActiveRate || input.maxActiveRate) {
    const filteredData = (rankingActive || []).filter(item => {
      for (const i in activeMins) {
        if (activeMins[i] && input[i] && item[activeMins[i]] < input[i]) {
          return false
        }
      }
      for (const i in activeMaxs) {
        if (activeMaxs[i] && input[i] && item[activeMaxs[i]] > input[i]) {
          return false
        }
      }
      return true
    })
    if (!(filteredData || []).length) {
      return {data: [], rankingActive: (rankingActive || []).map(e => _object(e, false))}
    }
    pIds = arrayUtil.column(filteredData || [], 'productId')
  }
  
  const where = _where(input)
  if (pIds.length) {
    where.id = {
      inq: pIds,
    }
  } else {
    if (input.minOperatingMonths) {
      const and = where.and || []
      and.push({
        operatingMonths: {gte: input.minOperatingMonths},
      })
      where.and = and
    } 
    if (input.maxOperatingMonths) {
      const and = where.and || []
      and.push({
        operatingMonths: {lte: input.maxOperatingMonths},
      })
      where.and = and
    }
  }
  const order = _order(input.sort || '', input.tag || 0)
  const page = input.page || 1
  const limit = input.limit || 20
  const offset = pagingUtil.getOffsetCondition(page, limit)
  const [total, data, allPIds] = await Promise.all([
      systemtradeSearchModel.count(where),
      systemtradeSearchModel.find({
        where,
        order,
        limit: offset.limit,
        skip: offset.skip,
      }),
      input.name ? systemtradeSearchModel.find({
        where,
        fields: {
          productId: true,
        },
      }) : [],
    ])
  pIds = arrayUtil.column(allPIds || [], 'productId')
  rankingActive = (rankingActive || []).map(e => {
    const isChangeCo = pIds.includes(e.productId) && input.name && e.productName.toLowerCase().includes(input.name.toLowerCase())
    return _object(e, isChangeCo)
  })
  const res = pagingUtil.addPagingInformation(
      data.map(item => {
        return helper.indexObject(item, input.type || 0)
      }),
      page,
      total,
      limit,
    )
  res.rankingActive = rankingActive
  return res
}

function _object(data, changeCo = false) {
  return {
    x: data.operatingMonths,
    y: data.activeRate,
    z: data.activeCount,
    salesCount: data.salesCount, 
    name: data.productName,
    detailUrl: helper.detailUrl(data.productId, data.categoryId) + '?src=chart',
    marker: { 
      fillColor: changeCo ? '#add0f3' : 'rgba(100, 100, 100, 0.5)',
      lineColor: changeCo ? '#7cb5eC' : 'rgba(100, 100, 100, 0.5)',
      coBorder: changeCo ? '#7cb5eC' : 'rgba(100, 100, 100, 0.5)',
    },
  }
}

module.exports = {
  index,
}
