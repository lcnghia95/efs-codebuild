const app = require('@server/server')
const specialFeePriceModel = app.models.SpecialFeePrice
const specialFeePriceStatementModel = app.models.SpecialFeePriceStatement
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get `master`.`special_fee_price` query condition
 *
 * @param {Array} productIds
 * @param {number} developerUserId
 * @param {number} affiliateUserId
 * @returns {Object}
 * @private
 */
function _condition(productIds, developerUserId, affiliateUserId) {
  return {
    or: [{
      isValid: 1,
      affiliateUserId: affiliateUserId > 0 ? 99999999 : 0,
      masterId: {inq: productIds},
      masterType: 2,
    }, {
      isValid: 1,
      affiliateUserId: affiliateUserId > 0 ? 99999999 : 0,
      masterId: developerUserId,
      masterType: 3,
    } ],
  }
}

/**
 * Calculate special fee and create record
 *
 * @param {Array} productId
 * @param {number} developerUserId
 * @param {number} salesId
 * @param {number} price
 * @param {number} affiliateUserId
 * @returns {number}
 * @public
 */
async function calculateSpecialFeePrice(
  productIds,
  developerUserId,
  salesId,
  price,
  affiliateUserId,
) {
  if (productIds.length == 0) {
    return 0
  }

  const data = await specialFeePriceModel.find({
    where: _condition(productIds, developerUserId, affiliateUserId),
    fields: {
      id: true,
      userId: true,
      price: true,
      rate: true,
    },
  })

  if (!data.length) {
    return 0
  }

  const totalPrice = data.reduce((total, record) => {
    return total + Math.round((record.price || 0) + (price * (record.rate || 0) / 100))
  }, 0)

  specialFeePriceStatementModel.create({
    isValid: 1,
    salesId,
    // Memo: all records have same userId
    userId: data[0].userId,
    price: totalPrice,
  })
  return totalPrice
}

async function updateSpecialFeePrice(
  sales,
) {
  if (sales.length == 0) {
    return
  }
  
  let pIds = sales.map(e => e.productId)
  const data = await specialFeePriceModel.find({
    where: {
      isValid: 1,
      masterId: {
        inq: pIds,
      },
      masterType: 2,
    },
    fields: {
      id: true,
      masterId: true,
    },
  })

  if (!data.length) {
    return
  }

  pIds = data.map(e => e.masterId)

  let newSales = sales.map(sale => {
    if (pIds.includes(sale.productId)) {
      return {
        id: sale.id,
        payAt: sale.payAt,
      }
    }
  }).filter(Boolean)

  const saleIds = newSales.map(e => e.id)

  const sfpsData = await specialFeePriceStatementModel.find({
    where: {
      isValid: 1,
      salesId: {
        inq: saleIds,
      },
    },
  })
  if (!sfpsData.length) {
    return
  }
  newSales = arrayUtil.index(newSales)
  return Promise.all(sfpsData.map(async e => {
    e.payAt = newSales[e.salesId].payAt
    return await e.save()
  }))
}

module.exports = {
  calculateSpecialFeePrice,
  updateSpecialFeePrice,
}
