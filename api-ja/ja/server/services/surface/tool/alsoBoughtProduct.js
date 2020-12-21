const alsoBoughtProductService = require('@services/common/alsoBoughtProduct')
/**
 * Get list ordered products by current bought product Id
 *
 * @returns {Promise<Array>}
 * @public
 */
async function show(productId, userId) {
  const alsoBoughtResults = await alsoBoughtProductService.alsoBought(productId, userId)

  if (alsoBoughtResults instanceof Array) {
    return alsoBoughtResults.map(resultItem => {
      const newResult = Object.assign({}, resultItem)
      newResult.typeId = newResult.typeId || consts.PRODUCT.TYPE.SYSTEM_TRADE
      return newResult
    })
  }

  return []
}

module.exports = {
  show,
}
