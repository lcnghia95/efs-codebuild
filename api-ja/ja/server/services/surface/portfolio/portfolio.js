const app = require('@server/server')
const portfolioSelectionProductsModel = app.models.PortfolioSelectionProducts
const {syncDataToFxon} = require('@services/common/synchronize')
const modelUtils = require('@server/utils/model')

async function onSelect(id, meta) {
  if (!id || !meta.userId) {
    return {}
  }

  let data = await portfolioSelectionProductsModel.create({
    isValid: 1,
    userId: meta.userId,
    productId: id,
  })
  if (data) {
    syncDataToFxon('portfolio_selection_products', data.id)
  }

  return {}
}

async function onRemove(pId, meta) {
  if (!pId || !meta.userId) {
    return {}
  }

  let data = await portfolioSelectionProductsModel.findOne({
    where: {
      isValid: 1,
      userId: meta.userId,
      productId: pId,
    },
    fields: {
      id: true,
    }
  })
  if (!data) {
    return {}
  }

  data.destroy()
  let fxData = await modelUtils.findOne('portfolio', 'product', {
    where: {
      id: data.id
    }
  })

  if (fxData) {
    fxData.destroy()
  }


  return {}
}

module.exports = {
  onSelect,
  onRemove,
}
