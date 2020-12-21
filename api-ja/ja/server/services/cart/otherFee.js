const app = require('@server/server')
const OtherFeeModel = app.models.OtherFee
const OtherFeeSettingModel = app.models.OtherFeeSetting

/**
 * Get `master`.`other_fee_setting` query condition
 *
 * @param {number} productId
 * @param {number} developerUserId
 * @returns {Object}
 * @private
 */
function _condition(productId, developerUserId) {
  return {
    isValid: 1,
    and: [{
      or: [{
        masterId: productId,
        masterType: 1,
      }, {
        masterId: developerUserId,
        masterType: 2,
      }, ]
    }]
  }
}

/**
 * Get customize reward data
 *
 * @param {number} productId
 * @param {number} developerUserId
 * @returns {Array}
 * @private
 */
async function _otherFeeSetting(productId, developerUserId) {
  return await OtherFeeSettingModel.find({
    where: _condition(productId, developerUserId),
    fields: {
      id: true,
      userId: true,
      userType: true,
      feeRate: true,
    }
  })
}

/**
 * Calculate other fee
 *
 * @param {number} saleId
 * @param {number} productId
 * @param {number} developerUserId
 * @param {number} price
 * @returns {number}
 * @public
 */
async function calculateOtherFees(saleId, productId, developerUserId, price) {
  let settingData = await _otherFeeSetting(productId, developerUserId)

  if (settingData.length == 0) {
    return 0
  }

  let data = settingData.map(setting => ({
    feePrice: Math.round(parseInt(setting.feeRate) * price / 100),
    isValid: 1,
    salesId: saleId,
    userId: setting.userId,
    userType: setting.userType,
  }))
  OtherFeeModel.create(data)
  return data.reduce((total, record) => record.feePrice + total, 0)
}

module.exports = {
  calculateOtherFees
}
