const app = require('@server/server')

// models
const discountModel = app.models.Discount
const discountProductsModel = app.models.DiscountProducts

// utils
const arrayUtil = require('@ggj/utils/utils/array')

// discount.discountType == 0 : check length == conditionValue
// discount.discountType == 1 : check total price == conditionValue
const { DISCOUNT_TYPE_COUNT, DISCOUNT_TYPE_TOTAL_PRICE } = require('@@server/common/data/hardcodedData')

async function getCampaign(productIds, prices) {
  const now = Date.now()
  let [discountProducts, discounts] = await Promise.all([
    discountProductsModel.find({
      where: {
        productId: {
          inq: productIds,
        },
        isValid: 1,
      },
      fields: {
        discountId: true,
        productId: true,
        unitType: true,
        discountValue: true,
      },
    }),
    discountModel.find({
      where: {
        isValid: 1,
        serviceStartAt: {
          lte: now,
        },
        serviceEndAt: {
          gte: now,
        },
      },
      fields: {
        id: true,
        discountType: true,
        conditionValue: true,
        serviceStartAt: true,
        serviceEndAt: true,
      },
    }),
  ])

  discounts = arrayUtil.index(discounts, 'id')
  discountProducts = arrayUtil.groupArray(discountProducts, 'discountId')
  prices = prices.filter(e => productIds.includes(e.productId))
  
  const discountCampaign = {
    [DISCOUNT_TYPE_COUNT]: {},
    [DISCOUNT_TYPE_TOTAL_PRICE]: {},
  }

  for (const discountId in discountProducts) {
    if (discountProducts[discountId]) {
      const discountProductArr = discountProducts[discountId]
      const discount = discounts[discountId] || {}
      if (discount.discountType == DISCOUNT_TYPE_COUNT) {
        let discountProductCount = 0
        for (const i in productIds) {
          if (productIds[i] && discountProductArr.find(e => e.productId == productIds[i])) {
            discountProductCount += 1
          }
        }
        if (discountProductCount >= discount.conditionValue) {
          discountProductArr.map(discountProduct => {
            if (discountId == discountProduct.discountId) {
              discountCampaign[DISCOUNT_TYPE_COUNT][discountProduct.productId] = {
                unitType: discountProduct.unitType,
                discountValue: discountProduct.discountValue,
              }
            }
          })
        }
      } else if (discount.discountType == DISCOUNT_TYPE_TOTAL_PRICE) {
        const filterdPrices = prices.filter(e => {
          return discountProducts[discountId].find(p => p.productId == e.productId)
        })
        const totalPrice = filterdPrices.reduce((total, price) => {
          const count = productIds.filter(p => p == price.productId).length
          total += count * (price.specialDiscountPrice || price.price)
          return total
        }, 0)
        if (totalPrice >= discount.conditionValue) {
          discountProductArr.map(discountProduct => {
            if (discountId == discountProduct.discountId) {
              discountCampaign[DISCOUNT_TYPE_TOTAL_PRICE][discountProduct.productId] = {
                unitType: discountProduct.unitType,
                discountValue: discountProduct.discountValue,
              }
            }
          })
        }
      }
    }
  }
  return discountCampaign
}

module.exports = {
  getCampaign,
}