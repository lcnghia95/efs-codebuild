const fxAccountInfoService = require('./accountInfo')
const fxRelatedProductService = require('./relationProduct')

async function getFxWidgetRelatedProducts(selectedFxProductId) {
  const relatedProductList = await fxRelatedProductService.getFxRelationProducts(selectedFxProductId)
  const accountIds = relatedProductList.map(prod => prod.accountId)
  return fxAccountInfoService.getAccountInfoByIds(accountIds)
}


module.exports = {
  getFxWidgetRelatedProducts,
}
