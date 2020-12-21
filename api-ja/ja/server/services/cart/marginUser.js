const MarginUserSetModel = require('@server/server').models.MarginUserSet

async function checkMarginUser(cart) {
  let record = await MarginUserSetModel.findOne({
    where: {
      isValid: 1,
      productId: cart.productId,
      userType: 3,
    },
    order: 'id DESC',
    fields: {
      userId: true,
      isOverWrite: true,
    },
  })
  if (!record) {
    return
  }
  if (record.isOverWrite == 1 || cart.affiliateUserId == 0) {
    cart.affiliateUserId = record.userId
  }
}

module.exports = {
  checkMarginUser,
}
