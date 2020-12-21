const modelUtil = require('@server/utils/model')
/**
 * model: {
 *   id: string,
 *   is_valid: number (0,1)
 *   account_id: number,
 *   product_id: number,
 *   created_id: string
 *   updated_at: string
 * }
 * */
async function getFxRelationProducts(selectedProductId) {
  const relatedProductList = await modelUtil.find('fx_account', 'relation_products', {
    where: {
      is_valid: 1,
      product_id: selectedProductId,
      order: 'created_at DESC',
      limit: 3
    },
    fields: {
      id: true,
      is_valid: true,
      product_id: true,
      account_id: true
    }
  })

  return relatedProductList.map(prod => ({
    id: prod.id,
    isValid: prod.is_valid,
    accountId: prod.account_id,
    productId: prod.product_id,
  }))
}

module.exports = {
  getFxRelationProducts
}
