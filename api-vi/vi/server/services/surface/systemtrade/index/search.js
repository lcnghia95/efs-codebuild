const app = require('@server/server')
const helper = require('./helper')

// models
const systemtradeSearchModel = app.models.SystemtradeSearchVi

// utils
const timeUtil = require('@ggj/utils/utils/time')
const queryUtil = require('@ggj/utils/utils/query')
const objectUtil = require('@ggj/utils/utils/object')
const pagingUtil = require('@ggj/utils/utils/paging')

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
    _status(input.status || 0)))

  const and = _commaKeys(input).concat(_mins(input)).concat(_maxs(input))

  if (and.length > 0) {
    where.and = and
  }

  return Object.assign({categoryId: 1}, where)
}

/**
 * genarate where
 *
 * @param {Number} status
 * @return {Object}
 * @private
 */
function _status(status) {
  const threeMonthAgo = timeUtil.addMonths(-3)
  if (status == 1) {
    return {
      forwardAt: {
        gte: threeMonthAgo,
      },
    }
  } else if (status == 2) {
    return {
      versionUpdatedAt: {
        gte: threeMonthAgo,
      },
    }
  } else {
    return {}
  }
}

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

  const where = _where(input)
  const order = _order(input.sort || '', input.tag || 0)
  const page = input.page || 1
  const limit = input.limit || 20
  const offset = pagingUtil.getOffsetCondition(page, limit)

  const [total, data] = await Promise.all([
    systemtradeSearchModel.count(where),
    systemtradeSearchModel.find({
      where,
      order,
      limit: offset.limit,
      skip: offset.skip,
    }),
  ])

  return pagingUtil.addPagingInformation(
    data.map(item => {
      return helper.indexObject(item, input.type || 0)
    }),
    page,
    total,
    limit,
  )
}

module.exports = {
  index,
}
