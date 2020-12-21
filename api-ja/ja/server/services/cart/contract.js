const app = require('@server/server')
const helper = require('./helper')
const SYSTEM_PRODUCT_TYPE_ID = 1
const ADS_PRODUCT_TYPE_ID = 8
const SALON_PRODUCT_TYPE_ID = 4
// const TYPE_IDS = [1,2,3,4,5,6,8,9,13,19,70,71,72]
const { TYPE_IDS, ALLOW_CONTRACT_TYPE_IDS } = require('@@server/common/data/hardcodedData')
const DEFAULT_DEVELOPER_USER_ID = 110001

// models
const conclusionBeforeModel = app.models.ConclusionBefore
const conclusionModel = app.models.Conclusion
const TransactionModel = app.models.Transaction
const salesModel = app.models.Sales

/**
 * Get default transaction id
 *
 * @returns {number}
 * @private
 */
async function _defaultTransactionId() {
  const record = await TransactionModel.findOne({
    where: {
      userId: DEFAULT_DEVELOPER_USER_ID,
    },
    order: 'id DESC',
    fields: {
      id: true,
    },
  }) || {}
  return record.id || 0
}

/**
 * Update sales records
 *
 * @param {Array} ids
 * @param {Object} data
 * @returns {Promise<void> | void}
 * @private
 */
function _updateSales(ids, data) {
  if (!ids.length) {
    return
  }
  return salesModel.updateAll({
    id: {
      inq: ids,
    },
  }, data)
}

/**
 * conclusion
 *
 * @param {Object} products
 * @returns {Object}
 * @public
 */
async function _objects(products, model) {
  const userIds = _userIds(products)
  if (userIds.length == 0) {
    return {}
  }
  // TODO: check
  // userIds.push(110001) //add default userId

  const data = await model.find(_condition(userIds))
  return data.reduce((result, item) => {
    if (!result[item.userId]) {
      result[item.userId] = item.content
    }
    return result
  }, {})
}

/**
 * Get list of developer ids of product that
 *    have conclusion & conclusion before data
 *
 * @param {Object} products
 * @returns {Array}
 * @private
 */
function _userIds(products) {
  const userIds = []
  for (const productId in products) {
    if (helper.isDisPlayConclusion(products[productId])) {
      userIds.push(products[productId].userId)
    }
  }
  return userIds
}

/**
 * Generate condition for query
 *
 * @param {Array} userIds
 * @param {Boolean} content
 * @returns {Object}
 * @private
 */
function _condition(userIds, content = true) {
  return {
    where: {
      isValid: 1,
      userId: {
        inq: userIds,
      },
    },
    fields: {
      id: true,
      userId: true,
      content,
    },
    order: 'id DESC',
  }
}

/**
 * Get conclusion & conclusion before id of developer
 *
 * @param {number} userId
 * @returns {Object}
 * @public
 */
async function conclusionData(userId) {
  let condition = {
      where: {
        isValid: 1,
        userId,
      },
      order: 'id DESC',
      fields: {
        id: true,
      },
    },
    [conclusionBefore, conclusion] = await Promise.all([
      conclusionBeforeModel.findOne(condition),
      conclusionModel.findOne(condition),
    ])
  return {
    conclusionBeforeId: (conclusionBefore || {}).id,
    conclusionId: (conclusion || {}).id,
  }
}

/**
 * Get conclusions & conclusions before id of developers
 *
 * @param {number} userIds
 * @returns {Object}
 * @private
 */
async function _conclusions(userIds) {
  let condition = {
      where: {
        isValid: 1,
        userId: {inq: userIds},
      },
      order: 'id DESC',
      fields: {
        id: true,
        userId: true,
      },
    },
    [conclusionBefore, conclusion] = await Promise.all([
      conclusionBeforeModel.find(condition),
      conclusionModel.find(condition),
    ])

  conclusionBefore = conclusionBefore.reduce((res, record) => {
    if (!res[record['userId']]) {
      res[record['userId']] = record.id
    }
    return res
  }, {})
  conclusion = conclusion.reduce((res, record) => {
    if (!res[record['userId']]) {
      res[record['userId']] = record.id
    }
    return res
  }, {})
  return {
    conclusionBeforeIds: conclusionBefore,
    conclusionIds: conclusion,
  }
}

/**
 * conclusion before data
 *
 * @param {Object} products
 * @returns {Object}
 * @public
 */
async function conclusionBefore(products) {
  return await _objects(products, conclusionBeforeModel)
}

/**
 * conclusion before data
 *
 * @param {Object} products
 * @returns {Object}
 * @public
 */
async function conclusion(products) {
  return await _objects(products, conclusionModel)
}

/**
 * Get transation id of user
 *
 * @param {number} userId
 * @returns {number}
 * @public
 */
async function transactionId(userId) {
  const transaction = await app.models.Transaction.findOne({
    where: {
      isValid: 1,
      userId,
    },
    order: 'id DESC',
    fields: {
      id: true,
    },
  })
  return transaction ? transaction.id : 0
}

/**
 * Get transactions id of user
 *
 * @param {number} userIds
 * @returns {number}
 * @private
 */
async function _transactionIds(userIds) {
  const transactions = await app.models.Transaction.find({
    where: {
      isValid: 1,
      userId: { inq : userIds },
    },
    order: 'id DESC',
    fields: {
      id: true,
      userId: true,
    },
  })
  return transactions.reduce((res, record) => {
    if (!res[record['userId']]) {
      res[record['userId']] = record.id
    }
    return res
  }, {})
}

/**
 * Add contract data to sales records
 *
 * @param {Array} sales
 * @returns {Promise<[void, *[], void]>}
 * @public
 */
function addContractData(sales, productObjects) {
  /**
    Type1,8
      transaction devDefault (110001)
      conclusion_before: NO
      conclusion: NO
    Type2,6,3,5,9,19,70
      transaction devLatest
      conclusion_before: NO
      conclusion: NO
    Type4
      transaction devLatest || devDefault (110001)
      conclusion_before: devLatest || devDefault (110001)
      conclusion: devLatest || devDefault (110001)
    Others
      transaction NO
      conclusion_before: NO
      conclusion: NO
  */
  // Filter
  sales = sales.filter(sale => TYPE_IDS.includes(sale.typeId))

  /*
  * There is no override sale data here
  * */
  return Promise.all([
    // Transaction for products with type_id 1, 8
    _addGogoContract(sales.filter(
      sale => [SYSTEM_PRODUCT_TYPE_ID, ADS_PRODUCT_TYPE_ID].includes(
        sale.typeId),
      ),
    ),
    // Transaction for salons
    _addSalonContract(
      sales.filter(sale => sale.typeId == SALON_PRODUCT_TYPE_ID && productObjects[sale.productId].isAdvising)),
    // Transaction for products with type_id 2, 3, 5, 6, 9, 19, 70
    _addDeveloperContract(sales.filter(
      sale => ALLOW_CONTRACT_TYPE_IDS.includes(sale.typeId))),
  ])
}

/**
 * Add contract data for systemtrade and ads products
 * Use default developer
 *
 * @param sales
 * @private
 * @return {Promise<void>}
 */
async function _addGogoContract(sales) {
  const defaultTransactionId = await _defaultTransactionId()
  return _updateSales(
    sales.map(sale => sale.id),
    {
      transactionId: defaultTransactionId,
      conclusionId: 0,
      conclusionBeforeId: 0,
    },
  )
}

/**
 * Add contract data for salon products
 *
 * @param sales
 * @return {Promise<[]>}
 * @private
 */
async function _addSalonContract(sales) {
  const devUserIds = sales.map(sale => sale.developerUserId)
  devUserIds.push(DEFAULT_DEVELOPER_USER_ID)

  const [conclusionObj, transactions] = await Promise.all([
    _conclusions(devUserIds),
    _transactionIds(devUserIds),
  ])
  const conclusionsBefore = conclusionObj.conclusionBeforeIds
  const conclusions = conclusionObj.conclusionIds

  return Promise.all(sales.map(sale => {
      sale.transactionId =
        transactions[sale.developerUserId] ||
        transactions[DEFAULT_DEVELOPER_USER_ID] || 0
      sale.conclusionBeforeId =
        conclusionsBefore[sale.developerUserId] ||
        conclusionsBefore[DEFAULT_DEVELOPER_USER_ID] || 0
      sale.conclusionId =
        conclusions[sale.developerUserId] ||
        conclusions[DEFAULT_DEVELOPER_USER_ID] || 0
      return sale.save()
    }),
  )
}

/**
 * Add contract data for developer products
 *
 * @param sales
 * @return {Promise<void>}
 * @private
 */
async function _addDeveloperContract(sales) {
  const devUserIds = sales.map(sale => sale.developerUserId)
  devUserIds.push(DEFAULT_DEVELOPER_USER_ID)

  const transactions = await _transactionIds(devUserIds)

  return Promise.all(sales.map(sale => {
    sale.transactionId =
      transactions[sale.developerUserId] ||
      transactions[DEFAULT_DEVELOPER_USER_ID] || 0
    return sale.save()
  }))
}

module.exports = {
  conclusion,
  transactionId,
  conclusionData,
  conclusionBefore,
  addContractData,
}
