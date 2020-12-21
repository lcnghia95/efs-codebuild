const app = require('@server/server')
const {detailUrl} = require('./helper')

// models
const systemtradeRankingActiveModel = app.models.SystemtradeRankingActive
const salesModel = app.models.Sales

const arrayUtil = require('@ggj/utils/utils/array')

async function index(userId = 0, query = {ismp: 0, uid: -1}) {
  const {ismp, uid} = query
  let [data, sales] = await Promise.all([
    systemtradeRankingActiveModel.find({
      where: {
        isValid: 1,
        activeMonths: 1,
        platformId: {
          inq: [1, 15],
        },
        categoryId: 1,
        totalTrades: {
          gt: 0,
        },
        isOperating: 1,
        activeCount: {
          gte: 5,
        },
      },
      fields: {
        operatingMonths: true,
        activeRate: true,
        activeCount: true,
        salesCount: true,
        productName: true,
        categoryId: true,
        productId: true,
        userId: true,
      },
      order: ['activeCount DESC', 'activeRate DESC'],
      limit: 500,
    }),
    (ismp && userId) ? salesModel.find({
      where: {
        isValid: 1,
        statusType: {
          gt: 0,
        },
        typeId: 1,
        payAt: {
          gte: '1970-01-01 00:00:01',
        },
        userId,
      },
      fields: {
        productId: true,
      },
    }) : [],
  ])
  sales = arrayUtil.index((sales || []), 'productId')
  // sale || data.userId == uid
  return (data || []).map(e => _object(e, sales[e.productId] || e.userId == uid))
}

// async function search(query = {}) {
//   const {name} = query
//   if (!name) {
//     return []
//   }
//   const data = await systemtradeRankingActiveModel.find({
//       where: {
//         isValid: 1,
//         activeMonths: 1,
//         platformId: {
//           inq: [1, 15],
//         },
//         categoryId: 1,
//         totalTrades: {
//           gt: 0,
//         },
//         isOperating: 1,
//         activeCount: {
//           gte: 5,
//         },
//       },
//       fields: {
//         operatingMonths: true,
//         activeRate: true,
//         activeCount: true,
//         salesCount: true,
//         productName: true,
//         categoryId: true,
//         productId: true,
//         userId: true,
//       },
//       order: ['activeCount DESC', 'activeRate DESC'],
//       limit: 500,
//     })
//   const dataChangeCo = arrayUtil.index((data.filter(e => e.productName.includes(name)) || []), 'productId')
//   return (data || []).map(e => _object(e, !!dataChangeCo[e.productId]))
// }

function _object(data, changeCo = false) {
  return {
    x: data.operatingMonths,
    y: data.activeRate,
    z: data.activeCount,
    salesCount: data.salesCount, 
    name: data.productName,
    detailUrl: detailUrl(data.productId, data.categoryId) + '?src=chart&t=1',
    marker: { 
      fillColor: changeCo ? '#add0f3' : 'rgba(100, 100, 100, 0.5)',
      lineColor: changeCo ? '#7cb5eC' : 'rgba(100, 100, 100, 0.5)',
      coBorder: changeCo ? '#7cb5eC' : 'rgba(100, 100, 100, 0.5)',
    },
  }
}

module.exports = {
  index,
  // search,
}