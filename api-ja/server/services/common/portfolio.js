const app = require('@server/server')
const PortfolioSelectionProductModel = app.models.PortfolioSelectionProducts

async function isPortfolio(pId, userId = 0) {
  if (userId === 0) {
    return false
  }

  return !! (await PortfolioSelectionProductModel.findOne({
    where: {
      isValid: 1,
      userId: userId,
      productId: pId,
    },
    fields: {id: true},
    order: 'id DESC'
  }))
}

module.exports = {
  isPortfolio: isPortfolio
}
