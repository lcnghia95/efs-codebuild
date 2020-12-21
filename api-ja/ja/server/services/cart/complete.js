const helper = require('./helper')
const { ignoreProductIds } = require('./sale')
const BANK_TRANSFER_PAYMENT_TYPE = 1
const STORE_PAYMENT_TYPE = 4
const BANK_AUTO_TRANSFER_PAYMENT_TYPE = 5

function _information(sales) {
  if (sales.length == 0) {
    return {}
  }
  const record = sales[0]
    const trackTransaction = sales.reduce((acc, cur) => {
      if (ignoreProductIds().includes(cur.productId)) {
        // don't handle special product ids
        return acc
      }
      const e = acc.findIndex(e => e.id == `P${cur.productId}`)
      if (~e) {
        // already exist, increase count
        acc[e].quantity += 1
      } else {
        acc.push({
          id: `P${cur.productId}`,
          price: cur.price,
          quantity: 1,
        })
      }
      return acc
    }, [])
    const payId = record.payId
    const result = {
      sessionId: record.sessionId,
      payId,
      typeIds: sales.map(sale => sale.typeId),
      // OAM-17509
      trackTransaction,
    }

  console.log('TRACKTRANSACTION %j', trackTransaction)

  if (payId == BANK_TRANSFER_PAYMENT_TYPE) {
    result.transferNumber == record.userId
  } else if (payId == STORE_PAYMENT_TYPE) {
    // TODO
    // result.expiredAt
    // result.code
    // result.code1
    // result.code2
    // result.confirmUrl
  } else if (payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE) {
    result.salonsPrice = sales.reduce(
      (total, sale) => (total + (sale.price - sale.expensePrice) / 3),
      0,
    )
  }
  return result
}

async function index(userId, sessionId) {
  if (helper.validateSalesSessionId(sessionId).length == 0) {
    console.log('CART COMPLETE VALIDATESALESSESSIONID %s, %s', userId, sessionId)
    return {}
  }
  console.log('CART COMPLETE %s, %s', userId, sessionId)
  const fields = 'id,productId,typeId,price,expensePrice,payId,userId,sessionId'
    const sales = await helper.sales(userId, sessionId,fields)

  return _information(sales)
}

module.exports = {
  index,
}
