const app = require('@server/server')

const webAuthAccountsModel = app.models.WebAuthAccounts
const salesModel = app.models.Sales
const productModel = app.models.Products

const arrayUtil = require('@ggj/utils/utils/array')

async function insertWebAuth(sessionId) {
  if (!sessionId) {
    return
  }
  const now = Date.now()
  const sales = await salesModel.find({
    where: {
      isValid: 1,
      sessionId,
      cancelType: 0,
    },
    fields: {
      id: true,
      userId: true,
      productId: true,
      serviceStartAt: true,
      serviceEndAt: true,
    },
  })
  if (!(sales || []).length) {
    return
  }
  const hasDvd = sales.find(sale => sale.productId == 8030 || sale.productId == 8031)
  if (!hasDvd) {
    return
  }
  const productIds = sales.map(sale => sale.productId)
  const webAuthProducts = await productModel.find({
    where: {
      isValid: 1,
      statusType: 1,
      isWebAuthentication: 1,
      id: {
        inq: productIds
      }
    },
    fields: {
      id: true,
      isSubscription: true,
      typeId: true,
    }
  })
  if (!(webAuthProducts || []).length) {
    return
  }
  const salesIdx = arrayUtil.index(sales, 'productId')
  const dataToInsert = []
  for (const product of webAuthProducts) {
    const productId = product.id
    const sale = salesIdx[productId]
    if (!sale) {
      continue
    }
    dataToInsert.push({
      isValid: 1,
      userId: sale.userId,
      salesId: sale.id,
      productId,
      isSubscription: product.isSubscription,
      serviceStartAt: sale.serviceStartAt || '1970-01-01 00:00:00',
      serviceEndAt: sale.serviceEndAt || '1970-01-01 00:00:00',
      accountCompany: '',
      accountNumber: '',
      accountServer: '',
      accountType: 0,
      accountChangeCount: 0,
    })
    if (product.typeId == 1) {
      dataToInsert.push({
        isValid: 1,
        userId: sale.userId,
        salesId: sale.id,
        productId,
        isSubscription: product.isSubscription,
        serviceStartAt: sale.serviceStartAt || '1970-01-01 00:00:00',
        serviceEndAt: sale.serviceEndAt || '1970-01-01 00:00:00',
        accountCompany: '',
        accountNumber: '',
        accountServer: '',
        accountType: 1,
        accountChangeCount: 0,
      })
    }
  }
  webAuthAccountsModel.create(dataToInsert)
}

module.exports = {
  insertWebAuth
}