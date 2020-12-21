const app = require('@server/server')
const crypto = require('crypto')
const urlService = require('@services/common/productUrl')
const modelUtil = require('@server/utils/model')
const saleCommonService = require('@services/common/sale')

const { padStart, flatten, keyBy } = require('lodash')

const saleModel = app.models.Sales
const infoAccountModel = app.models.FxonInfoAccount
const licenseModel = app.models.License
const relationProductsModel = app.models.RelationProducts
const productModel = app.models.Products
const magicNumberNameModel = app.models.MagicNumberName
const userEmailAddressesModel = app.models.UserEmailAddresses
const productMultiLanguagesModel = app.models.ProductMultiLanguages

const arrayUtil = require('@ggj/utils/utils/array')
const timeUtil = app.utils.time
const objectUtil = app.utils.object

const DOWNLOAD_PRODUCT_TYPE_IDS = [1]
const DEFAULT_SALE_TYPE = [1, 2]
const REALTRADE_EMAIL_TYPE = 7

/**
 * Get sale infomation
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 * @private
 */
async function _sales(userId) {
  const lastmonth = timeUtil.addMonths(-1, Date.now(), true)
  const sales = await saleModel.find({
    where: _condition(userId),
    fields: { productId: true },
  })
  return _distinctSales(sales.filter(sale => _checkFinish(sale, lastmonth)))
}

/**
 * Distinct sales
 *
 * @param {Array} sales
 * @returns {Promise<Array>}
 * @private
 */
function _distinctSales(sales) {
  const array = []
  sales.forEach(sale => {
    const temp = array.filter(item => item.productId == sale.productId)
    if (!temp.length) {
      array.push(sale)
    }
  })
  return array
}

/**
 * Validate finish condition of sale record
 *
 * @param {Object} sale
 * @param {number} lastmonth
 * @returns {Boolean}
 * @private
 */
function _checkFinish(sale, lastmonth) {
  return sale.isFinished != 1 || lastmonth < sale.payAt
}

/**
 * Get sale infomation
 *
 * @param {String} userId
 * @returns {Object}
 * @private
 */
function _condition(userId) {
  const condition = saleCommonService.saleConditions(userId, false)
  condition.where.salesType = {
    inq: DEFAULT_SALE_TYPE,
  }
  condition.where.productId = {
    gte: 1,
  }
  condition.where.typeId = {
    inq: DOWNLOAD_PRODUCT_TYPE_IDS,
  }
  return condition.where || {}
}

/**
 * Get download product data
 *
 * @param {Array} productIds
 * @returns {Array}
 * @private
 */
async function _downloadProducts(productIds) {
  return await productModel.find({
    where: {
      isValid: 1,
      isDownload: 1,
      id: {
        inq: productIds,
      },
      typeId: {
        inq: DOWNLOAD_PRODUCT_TYPE_IDS,
      },
    },
    fields: {
      id: true,
      name: true,
      typeId: true,
      isSubscription: true,
    },
  })
}

/**
 * Download product object
 *
 * @param {Object} product
 * @param {string || undefined} detailUrl
 * @private
 */
function _object(product, detailUrl) {
  return objectUtil.filter({
    id: product.id,
    type: product.typeId == 71 ? 70 : product.typeId,
    detailUrl,
    name: product.name,
  })
}

/**
 * Get product, subproducts and version data
 *
 * @param {Object} sales
 * @return {Object}
 * @private
 */
async function _group(sales) {
  const products = await _downloadProducts(
    arrayUtil.unique(arrayUtil.column(sales, 'productId')),
  )
  const urls = await urlService.productDetailUrls(products)

  return {
    products,
    urls,
  }
}

/**
 * Get all purchased download products
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 * @public
 */
async function index(userId) {
  const sales = await _sales(userId)
  if (sales.length == 0) {
    return []
  }

  const { products, urls } = await _group(sales)
  const productObjects = arrayUtil.index(products, 'id')
  const lastmonth = timeUtil.addMonths(-1, Date.now(), true)

  return sales
    .filter(sale => {
      if (!productObjects[sale.productId]) {
        return false
      }
      const product = productObjects[sale.productId]
      return product.isSubscription == 0 || sale.payAt > lastmonth
    })
    .map(sale => {
      const productId = sale.productId
      const product = productObjects[productId]
      return _object(product, urls[productId])
    })
}

/**
 * Get all purchased download products
 *
 * @param {number} userId
 * @param {number} langType
 * @returns {Promise<Array>}
 * @public
 */
async function license(userId, langType) {
  const conditions = {
    where: {
      isValid: 1,
      userId: userId,
    },
  }
  let licenses = await licenseModel.find(conditions)
  const accountIds = arrayUtil.column(licenses, 'accountId')
  const accountInfo = arrayUtil.index(await _getInfoAccount(accountIds), 'id')
  const tradeTime = arrayUtil.index(
    flatten(await getTradeTime(accountInfo, userId)),
    'accountId',
  )

  const [magicNumberName, relatedProducts, multiSiMagicIds] = await Promise.all([
    _getMagicNumberName(accountIds),
    _getRelatedProducts(accountIds, langType),
    _getMultiSiMagicIds(accountInfo),
  ])

  const unsavedMagicIds = _filterUnsavedMagicNumbers(magicNumberName, multiSiMagicIds)
  licenses.forEach(function(license) {
    const accountId = license.accountId
    license.accountInfo = accountInfo[accountId]
    if (tradeTime[accountId]) {
      license.accountInfo.periodStartDate =
        tradeTime[accountId].periodStartDate
      license.accountInfo.periodEndDate =
        tradeTime[accountId].periodEndDate
    }
    license.magicNumberName = magicNumberName[accountId] || []
    license.unsavedMagicIds = unsavedMagicIds[accountId] || []
    license.relatedProducts = relatedProducts[accountId] || []
  })
  licenses = licenses.filter(license => license.accountInfo)
  return licenses
}

/**
 * map product name base on language
 *
 * @param {array} relatedProducts
 * @param {number} langType
 */
async function _mapMultiLangProductName(relatedProducts, langType) {
  const productIds = arrayUtil.column(relatedProducts, 'productId')
  const multiProductNames = await productMultiLanguagesModel.find({
    where: {
      productId: {
        inq: productIds,
      },
      languages: langType,
    },
    fields: {
      id: true,
      name: true,
      productId: true,
    },
  })
  const multiProductNamesIdx = arrayUtil.index(multiProductNames, 'productId')

  return relatedProducts.map(product => {
    const multiLangProductName = (multiProductNamesIdx[product.productId] || {})['name']
      product.productName = multiLangProductName || product.productName
      return product
  })
}

async function create(input, meta) {
  const modeId = _getModeId(input)
  const infoAccount = await _createInfoAccount(input, modeId, meta)
  return _createLicense(input, modeId, meta, infoAccount.id)
}
async function getTradeTime(accountInfo, userId) {
  const validSiTable = (
    await modelUtil.excuteQuery(
      'fx_account',
      `show tables like 'si_%_${userId}%'`,
    )
  ).map(o => Object.values(o)[0])

  const promises = Object.keys(accountInfo)
    .map(key => {
      const account = accountInfo[key]
      if (!account.statusId) {
        return
      }
      const modeId = padStart(account.modeId, 4, '0')
      const userId = padStart(account.userId, 4, '0')
      const accountId = padStart(account.id, 4, '0')
      const siTable = `si_${modeId}_${userId}_${accountId}`

      if (!validSiTable.includes(siTable)) {
        return
      }

      const getTimeSql = `SELECT ? AS accountId, MIN(UnixTime) AS periodStartDate, MAX(UnixTime) AS periodEndDate FROM (
        SELECT UNIX_TIMESTAMP(CONVERT_TZ(CloseDate, '+00:00', @@global.time_zone))*1000 AS UnixTime
        FROM ??
        WHERE IsOpen = 0
        GROUP BY DATE_FORMAT(CloseDate, '%Y-%m-%d')
    ) AS data`

      return modelUtil.excuteQuery('fx_account', getTimeSql, [
        account.id,
        siTable,
      ])
    })
    .filter(Boolean)
  return Promise.all(promises)
}

async function update(input) {
  if (!input.id) {
    return
  }

  await infoAccountModel.updateAll(
    {
      id: input.id,
    },
    input,
  )
}

async function deleteLicense(input) {
  if (!input.licenseId && !input.accountId) {
    return
  }

  await Promise.all([
    _disableLicense(input.licenseId),
    _disableInfoAccount(input.accountId),
    _disableRelationProduct(input.accountId),
  ])
}
async function createMagicNumber(accountId) {
  if (!accountId) {
    return
  }

  return magicNumberNameModel.create({
    accountId,
    isValid: 1,
    isPublicWidget: 0,
    isPublicRealTrade: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

async function _getMagicNumberName(accountIds) {
  const conditions = {
    where: {
      accountId: { inq: accountIds },
    },
  }
  const magicNumberName = await magicNumberNameModel.find(conditions)
  return arrayUtil.groupArray(magicNumberName, 'accountId')
}

async function updateMagicNumber(input) {
  if (isNaN(input.magicNumber)) {
    return
  }
  const data = objectUtil.nullFilter(input)
  if (!data) {
    return
  }
  await magicNumberNameModel.updateAll(
    {
      id: input.id,
    },
    data,
  )
}

async function deleteMagicNumber(id) {
  await magicNumberNameModel.deleteById(id)
}

function updateRelatedProducts(relatedProd) {
  return app.models.RelatedProducts.updateAll(
    {
      accountId: relatedProd.accountId,
      productId: relatedProd.productId,
    },
    relatedProd,
  )
}
function _disableLicense(id) {
  licenseModel.updateAll(
    {
      id,
    },
    {
      isValid: 0,
      updatedAt: Date.now(),
    },
  )
}
function _disableInfoAccount(id) {
  infoAccountModel.updateAll(
    {
      id,
    },
    {
      isValid: 0,
      isDelete: 1,
      updateDate: Date.now(),
    },
  )
}
async function _disableRelationProduct(accountId) {
  relationProductsModel.updateAll(
    {
      accountId,
    },
    {
      isValid: 0,
      updatedAt: Date.now(),
    },
  )
}
function _getModeId(input) {
  let modeId = 0
  // fx-on User
  if (input.userId < 110000) {
    modeId = 1
  }
  if (110000 < input.userId && input.userId < 120000) {
    modeId = 2
  }
  if (120000 < input.userId && input.userId < 130000) {
    modeId = 3
  }

  // Gogojungle User(140000~200000) && Merchant User(130000~140000)
  if (
    (130000 < input.userId && input.userId < 200000) ||
    input.userId >= 600000
  ) {
    if (input.isAffiliate === 1) {
      modeId = 3
    } else {
      if (input.isDeveloper === 1) {
        modeId = 2
      } else {
        modeId = 1
      }
    }
  }
  return modeId
}

function _getInfoAccount(accountIds) {
  const conditions = {
    where: {
      id: { inq: accountIds },
      isValid: 1,
      isDelete: 0,
    },
  }
  return infoAccountModel.find(conditions)
}

async function _getRelatedProducts(accountIds, langType) {
  const relatedProductList = await app.models.RelatedProducts.find({
    where: {
      isValid: 1,
      accountId: {
        inq: accountIds,
      },
    },
    fields: {
      isAutoMapping: false,
      autoMappingString: false,
      createdAt: false,
      updatedAt: false,
    },
    order: 'productId',
  })

  if (!relatedProductList.length) {
    return []
  }

  const relatedProductsIdx = keyBy(relatedProductList, (rlp) => {
    return `${rlp.accountId}_${rlp.productId}`
  })
  const productIds = arrayUtil.column(relatedProductList, 'productId')

  const productDetailList = await app.models.Products.find({
    where: {
      isValid: 1,
      id: {
        inq: productIds,
      },
    },
    fields: ['id', 'name'],
  })

  const productDetailIdx = keyBy(productDetailList, 'id')

  let relatedProducts = Object.values(relatedProductsIdx).reduce((result, relatedProduct) => {
    const productId = relatedProduct.productId
    const productDetail = productDetailIdx[productId]
    if(!productDetail){
      return result
    }
    result.push({
      id: productId,
      productId: productId,
      productName: productDetail.name,
      isPublicWidget: relatedProduct.isPublicWidget,
      isPublicRealTrade: relatedProduct.isPublicRealTrade,
      // https://gogojungle.backlog.jp/view/OAM-39115
      // magicNumber: relatedProduct.magicNumber,
      accountId: relatedProduct.accountId,
    })
    return result
  }, [])

  if (langType != 1) {
    relatedProducts = await _mapMultiLangProductName(relatedProducts, langType)
  }

  return arrayUtil.groupArray(relatedProducts || [], 'accountId')
}

function _createInfoAccount(input, modeId, meta) {
  const {
    userId,
    isCustomPeriod,
    customPeriodStartDate,
    customPeriodEndDate,
  } = input
  return infoAccountModel.create({
    isValid: 1,
    statusId: 0,
    userId,
    modeId,
    accountNumberPublic: 1,
    balancePublic: 1,
    historyPublic: 1,
    sizingPublic: 1,
    tradesPublic: 1,
    ordersPublic: 1,
    analyticsPublic: 1,
    typeId: 1,
    isCustomPeriod,
    customPeriodStartDate,
    customPeriodEndDate,
    isNotice: 0,
    noticeType: 0,
    ip: meta.ipAddress,
    userAgent: meta.userAgent,
    createDate: Date.now(),
    changeDate: Date.now(),
    profitPublic: 1,
  })
}

async function _createLicense(input, modeId, meta, accountId) {
  const key = crypto
    .createHash('sha256')
    .update(_getTableName(modeId, input.userId, accountId))
    .digest('hex')
  const license =
    (await licenseModel.create({
      isValid: 1,
      userId: input.userId,
      accountId,
      modeId,
      licenseKey: key,
      nickName: input.nickName,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })) || {}
  return license
}

async function getRealTradeEmails(userId) {
  const emails = await userEmailAddressesModel.find({
    where: {
      isValid: 1,
      mailType: REALTRADE_EMAIL_TYPE,
      userId,
    },
    order: 'id DESC',
    limit: 1,
    fields: {
      id: true,
      mailAddress: true,
    },
  })

  return emails
}

async function getNotifyAccounts(userId) {
  const infoAccounts = await infoAccountModel.find({
    where: {
      userId,
      isValid: 1,
      isDelete: 0,
    },
    fields: {
      id: true,
      name: true,
      isNotice: true,
      noticeType: true,
    },
  })

  return infoAccounts
}

async function editRealTradeEmail(meta, email, accounts) {
  const promises = []

  if (Object.keys(email).length) {
    promises.push(_saveRealTradeEmail(meta, email))
  }

  if (accounts.length) {
    promises.push(_updateAccountsNotice(accounts))
  }

  if (!promises.length){
    return {}
  }

  const res = await Promise.all(promises)
  return Object.assign(...res)
}

async function _saveRealTradeEmail(meta, email) {
  if (!email.mailAddress) {
    return {}
  }

  let res
  if (!email.id) {
    res = await userEmailAddressesModel.create({
      isValid: 1,
      mailType: REALTRADE_EMAIL_TYPE,
      userId: meta.userId,
      mailAddress: email.mailAddress,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    })
  } else {
    res = await userEmailAddressesModel.updateAll(
      {
        isValid: 1,
        id: email.id,
      },
      {
        mailAddress: email.mailAddress,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    )
  }

  return res
}

async function _updateAccountsNotice(accounts = []) {
  if (!accounts.length) {
    return {}
  }

  const { enableNoticeAccountIds, disableNoticeAccountIds } = accounts.reduce(
    (acc, account) => {
      const noticeStatus = account.isNotice
        ? 'enableNoticeAccountIds'
        : 'disableNoticeAccountIds'
      acc[noticeStatus].push(account.id)

      return acc
    },
    {
      enableNoticeAccountIds: [],
      disableNoticeAccountIds: [],
    },
  )

  let enabledResult = 0,
    disabledResult = 0

  if (enableNoticeAccountIds.length) {
    enabledResult += await _editAccountsNoticeStatus(enableNoticeAccountIds, 1)
  }

  if (disableNoticeAccountIds.length) {
    disabledResult += await _editAccountsNoticeStatus(
      disableNoticeAccountIds,
      0,
    )
  }

  return {
    count: enabledResult + disabledResult,
  }
}

async function _editAccountsNoticeStatus(accountIds = [], noticeStatus = 0) {
  const updateData = {
    isNotice: noticeStatus,
    noticeType: noticeStatus,
  }

  const res = await infoAccountModel.updateAll(
    {
      id: { inq: accountIds },
    },
    updateData,
  )

  return res.count
}

function _getTableName(modeId, userId, accountId) {
  return (
    'si_' +
    _zeroPadding(modeId, 4) +
    '_' +
    _zeroPadding(userId, 4) +
    '_' +
    _zeroPadding(accountId, 4)
  )
}

function _zeroPadding(number, length) {
  if (number.toString().length >= length) {
    return number
  }
  return (Array(length).join('0') + number).slice(-length)
}

/**
 * Get all magic from si table for multi account
 *
 * @param {Object} accounts
 * @returns {Promise<Object>}
 * @private
 */
async function _getMultiSiMagicIds(accounts) {
  const multiAccountMagicIdsPromises = Object.keys(accounts).reduce((acc, accountId) => {
    const account = accounts[accountId]
    if (account.statusId != 1) {
      return acc
    }

    acc.push(_getSiMagicIds(account))
    return acc
  }, [])

  const multiAccountMagicIds = await Promise.all(multiAccountMagicIdsPromises)
  return multiAccountMagicIds
}

/**
 * Get all magic from si table
 *
 * @param {Object} account
 * @returns {Promise<Object>}
 * @private
 */
async function _getSiMagicIds(account) {
  const {
    modeId,
    userId,
    id: accountId,
  } = account

  const siTable = _getTableName(modeId, userId, accountId)
  const sql = `
    SELECT DISTINCT MagicId
    FROM ??
  `
  const res = await modelUtil.excuteQuery('fx_account', sql, [siTable])

  return {
    accountId,
    magicIds: res.map(si => si['MagicId']),
  }
}

/**
 * filter magic in table si but not in table magic_number_name
 *
 * @param {Object} magicNumberName
 * @param {Array} multiSiMagicIds
 *
 * @returns {Object}
 * @private
 */
function _filterUnsavedMagicNumbers(magicNumberName, multiSiMagicIds) {
  return multiSiMagicIds.reduce((acc, siMagicIds) => {
    const accountId = siMagicIds.accountId
    const tempMagicNumberName = magicNumberName[accountId]

    if (!tempMagicNumberName) {
      acc[accountId] = siMagicIds.magicIds
      return acc
    }

    const savedMagicIds = arrayUtil.column(tempMagicNumberName, 'magicNumber')
    acc[accountId] = siMagicIds.magicIds.filter(siMagicId => !savedMagicIds.includes(siMagicId))
    return acc
  }, {})
}

module.exports = {
  index,
  license,
  create,
  update,
  deleteLicense,
  createMagicNumber,
  updateMagicNumber,
  deleteMagicNumber,
  updateRelatedProducts,
  getRealTradeEmails,
  editRealTradeEmail,
  getNotifyAccounts,
}
