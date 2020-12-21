const CustomizeRewardModel = require('@server/server').models.CustomizeReward

const FIELDS = {
  id: true,
  payId: true,
  affiliateUserId: true,
  twotierUserId: true,
  feePrice: true,
  developerPrice: true,
  affiliatePrice: true,
  twotierPrice: true,
  ggjSpPrice: true,
  ggjSpFeePrice: true,
  affiliateSpPrice: true,
  affiliateSpFeePrice: true,
  feePriceRate: true,
  developerPriceRate: true,
  affiliatePriceRate: true,
  twotierPriceRate: true,
  ggjSpPriceRate: true,
  ggjSpFeePriceRate: true,
  affiliateSpPriceRate: true,
  affiliateSpFeePriceRate: true,
  serviceStartAt: true,
  serviceEndAt: true,
}

/**
 * Get customize reward data
 *  Get base on product id, then affiliate user id (if exist)
 *
 * @param {number} productId
 * @param {number} affiliateUserId
 * @returns {Object || null}
 * @private
 */
async function _customizeReward(payId, productId, affiliateUserId) {
  let data = productId == 0 ? [] : await CustomizeRewardModel.find({
    order: ['payId DESC', 'affiliateUserId ASC', 'id DESC'],
    where: _condition(productId, affiliateUserId),
    fields: FIELDS,
  })

  if (data.length == 0) {
    return null
  }

  let now = Date.now() / 1000
  return data.find(record => {
    if ((record.payId || 0) > 0 && payId != record.payId) {
      return false
    }
    if (record.serviceEndAt > 0 && record.serviceEndAt < now) {
      return false
    }
    if (record.serviceStartAt > now) {
      return false
    }
    return true
  })
}

/**
 * Get `master`.`customize_reward` query condition
 *  Get base on product id, then affiliate user id (if exist)
 *
 * @param {number} productId
 * @param {number} affiliateUserId
 * @returns {Object}
 * @private
 */
function _condition(productId, affiliateUserId) {
  if (affiliateUserId == 0) {
    return {
      isValid: 1,
      productId,
      affiliateUserId: 0,
    }
  }

  return {
    or: [{
      isValid: 1,
      productId,
      affiliateUserId: 99999999, // TODO move to constant
    },{
      isValid: 1,
      productId,
      affiliateUserId,
    }],
  }
}

/**
 * Get customize reward value
 *
 * @param {Object} reward
 * @param {string} key
 * @param {number} price
 * @returns number
 * @private
 */
function _rewardPrice(reward, key, price) {
  let rewardPrice = parseInt(reward[key])
  if (rewardPrice > 0) {
    return rewardPrice
  }
  return Math.round(parseFloat(reward[key + 'Rate']) * price / 100)
}

/**
 * Get customize reward data
 *  Get base on product id, then affiliate user id (if exist)
 *
 * @param {number} productId
 * @param {number} affiliateUserId
 * @param {number} price
 * @param {number} monthlyPrice
 * @returns {Object}
 * @public
 */
async function calculateCustomizeReward(payId, productId, affiliateUserId, price, monthlyPrice) {
  let reward = await _customizeReward(payId, productId, affiliateUserId)
  if (!reward) {
    return {}
  }
  return {
    twotierUserId: reward.twotierUserId,
    feePrice: _rewardPrice(reward, 'feePrice', price),
    developerPrice: _rewardPrice(reward, 'developerPrice', price),
    affiliatePrice: _rewardPrice(reward, 'affiliatePrice', monthlyPrice),
    twotierPrice: _rewardPrice(reward, 'twotierPrice', price),
    ggjSpPrice: _rewardPrice(reward, 'ggjSpPrice', price),
    ggjSpFeePrice: _rewardPrice(reward, 'ggjSpFeePrice', price),
    affiliateSpPrice: _rewardPrice(reward, 'affiliateSpPrice', monthlyPrice),
    affiliateSpFeePrice: _rewardPrice(reward, 'affiliateSpFeePrice', monthlyPrice),
  }
}

module.exports = {
  calculateCustomizeReward,
}
