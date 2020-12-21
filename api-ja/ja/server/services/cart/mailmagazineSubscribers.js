const app = require('@server/server')

// model
const salonModel = app.models.Salons
const mailmagazineSubscribersModel = app.models.MailmagazineSubscribers

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const objectUtil = app.utils.object

/**
 * create
 *
 * @param {Array} sales
 * @returns {void}
 * @public
 */
async function create(sales) {
  if (sales.length == 0) {
    return
  }

  const now = Date.now()

  let salons = await salonModel.find({
    where: {
      isValid: 1,
      productId: {
        inq: arrayUtil.column(sales, 'productId'),
      },
    },
    fields: {
      id: true,
      productId: true,
    },
    order: 'id DESC',
  })

  salons = objectUtil.arrayToObject(salons, 'productId')


  const data = sales.filter(sale => {
    return salons[sale.productId] ? true : false
  }).map(sale => ({
    isValid: 1,
    userId: sale.userId,
    salonId: salons[sale.productId].id,
    salesId: sale.id,
    isMailMain: 1,
    subscriptionStartedAt: now,
    subscriptionCount: 1,
  }))
  
  await mailmagazineSubscribersModel.create(data)
}

module.exports = {
  create,
}
