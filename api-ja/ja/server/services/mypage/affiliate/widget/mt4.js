const app = require('@server/server')

const modelUtil = require('@server/utils/model')
const tagService = require('@server/services/mypage/affiliate/tag')

const productModel = app.models.Products

const { padStart, join, split, keyBy, uniqWith, isEqual } = require('lodash')

// const oldPartnerId = require("@services/common/user").oldPartnerId

/**
 * Get data from fxon__info_account
 *
 * @param {object} meta
 *
 * @returns {array}
 * @public
 */
async function accounts(imgId, meta) {
  const userId = meta.userId
  if (!userId) {
    return []
  }
  const conditions = {
    where: {
      IsValid: 1,
      StatusId: 1,
      UserId: userId,
    },
    fields: {
      Id: true,
      Name: true,
      ModeId: true,
    },
  }
  const accounts = await modelUtil.find('fx_account', '_info_account', conditions)
  const tags = await _getTags(accounts, userId, imgId)

  return accounts.map((account, index) => _object(account, tags[index]))
}

/**
 * get magic number data of accountId
 *
 * @param {number} accountId
 *
 * return array
 */
async function magicNumber(accountId) {
  const conditions = {
    where: {
      is_valid : 1,
      is_public_widget : 1,
      account_id : accountId,
    },
    fields: {
      id: true,
      account_id: true,
      magic_number: true,
      magic_number_name: true,
    },
  }

  const [magicNumbers, relatedMagicNumbers] = await Promise.all([
    _getMagicNumberName(conditions),
    _getRelatedMagicNumbers(conditions),
  ])

  const totalData = uniqWith([...magicNumbers, ...relatedMagicNumbers], isEqual)

  return totalData
}

/**
 * get magic numbers data from related_products
 *
 * @param {object} conditions
 *
 * return array
 */
async function _getRelatedMagicNumbers(conditions) {
  conditions.fields.product_id = true
  const magicNumbers = await modelUtil.find('fx_account', 'related_products', conditions)
  const productIds = magicNumbers.map(magicNumber => magicNumber.product_id)

  const products = await productModel.find({
    where: {
      isValid: 1,
      id: {
        inq: productIds,
      },
    },
    fields: {
      id: true,
      name:true,
    },
  })

  return _generateRelatedMagicNumber(products, magicNumbers)
}

/**
 * combine data from products, related_products
 *
 * @param {array} products
 * @param {array} magicNumbers
 *
 * return array
 */
function _generateRelatedMagicNumber(products, magicNumbers) {
  const objMagicNumbers = keyBy(magicNumbers, 'product_id')

  return products.map((product) => {
    return {
      accountId: objMagicNumbers[product.id].account_id,
      magicNumber: objMagicNumbers[product.id].magic_number,
      name: product.name,
    }
  })
}

/**
 * generate data for magic_number_name
 *
 * @param {object} magic
 *
 * return object
 */
function _objectMagicNumber(magic) {

  return {
    accountId: magic.account_id,
    magicNumber: magic.magic_number,
    name: magic.magic_number_name,
  }
}

/**
 * get magic number data from magic_number_name
 *
 * @param {object} conditions
 *
 * return array
 */
async function _getMagicNumberName(conditions) {
  const magicNumbers = await modelUtil.find('fx_account', 'magic_number_name', conditions)

  return magicNumbers.map(_objectMagicNumber)
}

/**
 * get tag for accounts
 *
 * @param {array} accounts
 * @param {number} userId
 *
 * @returns {array}
 * @private
 */
async function _getTags(accounts, userId, imgId) {
  const strUserId = padStart(userId, 7, '0')
  const img = padStart(imgId, 3, '0')
  const tags = accounts.reduce((acc, account) => {
    const strAccountId = padStart(account.Id, 6, '0')
    acc.push('n_m0' + strAccountId + strUserId + '0000000' + img + '027')
    return acc
  }, [])

  return await _enTags(tags)
}

/**
 * encode tags
 *
 * @param {array} tags
 *
 * @returns {array}
 * @private
 */
async function _enTags(tags) {
  const data = join(tags)
  const enTags = await tagService.encryptTag(data)

  return split(enTags, ',')
}

/**
 * generate datas account to show
 *
 * @param {object} account
 * @param {string} tag
 *
 * @returns {object}
 * @private
 */
function _object(account, tag) {
  return {
    id: account.Id,
    name: account.Name,
    tag: tag,
    modeId: account.ModeId,
  }
}

module.exports = {
  accounts,
  magicNumber,
}
