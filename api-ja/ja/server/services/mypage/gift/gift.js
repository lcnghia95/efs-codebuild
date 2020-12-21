const app = require('@server/server')

const saleModel = app.models.Sales
const productGiftModel = app.models.ProductGifts
const productModel = app.models.Products

const productUrlCommonService = require('@services/common/productUrl')
const userCommonService = require('@services/common/user')

const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object

/**
 * get index for gift
 *
 * @param {Number} uId
 * @returns {Array}
 * @public
 */
async function index(uId) {
  if (!uId) {
    return []
  }

  const sales = await _getSales(uId)
  if (!sales.length) {
    return []
  }

  const giftIds = _getGiftIds(sales)
    const [gifts, products] = await Promise.all([
      _getGifts(giftIds),
      _productInformations(arrayUtil.column(sales, 'productId')),
    ])

    const userIds = arrayUtil.column(gifts, 'userId')
    const users = arrayUtil.index(await userCommonService.getUsers(userIds))
  return gifts.length ? _index(gifts, products, users) : []
}

/**
 * get gift ids frome sales
 *
 * @param {Array} sales
 * @returns {Array}
 * @public
 */
function _getGiftIds(sales) {
  const strIds = arrayUtil.column(sales, 'giftId', true)
  return strIds.reduce((acc, item) => {
    const ids = item.split(',')
    ids.map(id => {
      acc.push(id)
    })
    return acc
  }, [])
}

/**
 * get gift index response
 *
 * @param {Array} gifts
 * @param {Array} products
 * @param {Array} users
 * @returns {array}
 * @public
 */
function _index(gifts, products, users) {
  return gifts.reduce((acc, gift) => {
    const user = users[gift.userId]
      const product = products[gift.productId]
    if (!user || !product) {
      return acc
    }

    const isDownload = _isDownload(gift)
    let startedAt = null,
      endedAt = null
    if (gift.isTerm) {
      startedAt = gift.startedAt || 0
      endedAt = gift.endedAt || 0
    }

    product.typeId = undefined
    acc.push(objectUtil.nullFilter({
      id: gift.id || 0,
      name: gift.giftName || '',
      status: isDownload * gift.statusType,
      isDownload: isDownload,
      isTerm: gift.isTerm || null,
      from: startedAt,
      to: endedAt,
      product: product,
      user: user.nickName,
    }))
    return acc
  }, [])
}

/**
 * get sales
 *
 * @param {number} uId
 * @returns {Array}
 * @public
 */
async function _getSales(uId) {
  return await saleModel.find({
    where: {
      userId: uId,
      userType: 1,
      statusType: 1,
      salesType: 1,
      isFinished: 0,
      isCancel: 0,
      cancelType: 0,
      offsetId: 0,
      isRepayment: 0,
      giftId: {
        neq: '',
      },
    },
    fields: {
      id: true,
      giftId: true,
      productId: true,
      userId: true,
    },
  })
}

/**
 * get productGift
 *
 * @param {Array} ids
 * @returns {Array}
 * @public
 */
async function _getGifts(ids) {
  return await productGiftModel.find({
    where: {
      id: {
        inq: ids,
      },
      statusType: {
        inq: [1, 2],
      },
    },
    fields: {
      id: true,
      statusType: true,
      userId: true,
      productId: true,
      giftName: true,
      isTerm: true,
      startedAt: true,
      endedAt: true,
    },
  })
}

/**
 * check gift is downloaded
 *
 * @param {object} gift
 * @returns {number}
 * @public
 */
function _isDownload(gift) {
  if (!gift.isTerm) {
    return 1
  }

  const from = gift.startedAt || 0
    const to = gift.endedAt || 0
  if (from == 0 || to == 0) {
    return 0
  }

  const now = Date.now()
  if (now < from || now > to) {
    return 0
  }
  return 1
}

/**
 * get product informations
 *
 * @param {Array} productIds
 * @returns {object}
 * @public
 */
async function _productInformations(productIds) {
  if (!productIds.length) {
    return []
  }

  const products = await productModel.find({
      where: {
        id: {
          inq: productIds,
        },
      },
      fields: {
        id: true,
        name: true,
        typeId: true,
      },
    })
    const urls = await productUrlCommonService.productDetailUrls(products)
  products.map(product => {
    product.url = urls[product.id]
  })
  return arrayUtil.index(products)
}

module.exports = {
  index,
}
