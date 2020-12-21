const app = require('@server/server')
const userCommonService = require('@services/common/user')
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get `master.product_gifts` records
 *
 * @param {Array} productIds
 * @returns {Array}
 * @private
 */
async function _gifts(productIds) {
  const now = Date.now()
  return await app.models.ProductGifts.find({
    where: {
      isValid: 1,
      statusType: 1,
      productId: {
        inq: productIds,
      },
      or: [{
        isTerm: 0,
      }, {
        isTerm: 1,
        startedAt: {
          lt: now,
        },
        endedAt: {
          gt: now,
        },
      }],
    },
    fields: {
      id: true,
      userId: true,
      productId: true,
      giftName: true,
    },
  })
}

/**
 * Generate response object of gifts for cart feature
 *
 * @param {Object} gift
 * @param {Object} user
 * @returns {Object}
 * @private
 */
function _giftObject(gift, user) {
  return {
    id: user.id,
    nickName: user.nickName,
    name: gift.giftName,
  }
}

/**
 * Generate response object of gifts for cart feature
 *
 * @param {Array} productIds
 * @returns {Object}
 * @public
 */
async function giftUserInformationObjects(productIds) {
  const gifts = await _gifts(productIds)
  if (!gifts) {
    return
  }

  const check = {}
  const users = app.utils.object.arrayToObject(
    await userCommonService.getUsers(
      arrayUtil.attributeArray(gifts, 'userId'),
    ),
  )

  if (!users) {
    return
  }

  return gifts.reduce((result, gift) => {
    const productId = gift.productId
    const userId = gift.userId
      // Init
    !result[productId] && (result[productId] = [])

    // Add user information
    // https://gogojungle.backlog.jp/view/OAM-11022
    users[userId] &&
      !(check[productId] || {})[userId] &&
      result[productId].push(_giftObject(gift, users[userId]))

    // mark check
    !check[productId] && (check[productId] = [])
    check[productId][userId] = 1
    return result
  }, {})
}

/**
 * Generate response object of gifts for cart feature
 *
 * @returns {Promise<[]>}
 * @public
 * @param sales
 */
async function addGiftIdsToSalesRecords(sales) {
  const productIds = arrayUtil.column(sales, 'productId', true)
  const gifts = await _gifts(productIds)
  return Promise.all(sales.map(sale => {
    sale.giftId = gifts.filter(gift => {
      if (gift.productId != sale.productId) {
        return false
      }
      return gift.userId == sale.developerUserId
        || gift.userId == sale.affiliateUserId
    }).map(gift => gift.id).join(',')
    return sale.save()
  }))
}

module.exports = {
  addGiftIdsToSalesRecords,
  giftUserInformationObjects,
}
