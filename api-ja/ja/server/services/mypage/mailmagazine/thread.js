const app = require('@server/server')

// models
const threadModel = app.models.Threads
const userModel = app.models.Users
const tieupProductsModel = app.models.TieupProducts
const salesModel = app.models.Sales
const salonsModel = app.models.Salons
const productsModel = app.models.Products

// utils
const arrayUtil = require('@ggj/utils/utils/array')

// services
const commonEmailV1 = require('@@services/common/emailv1')
const commonUser = require('@@services/common/user')

async function index(userId, params) {
  const {id, threadId} = params
    const isPurchased = await _isSalonPurchased(userId, id)
  if (!isPurchased) {
    return {}
  }
  const thread = await threadModel.findOne({
      where: {
        id: threadId,
        salonId: id,
        isValid: 1,
        isTopic: 1,
      },
      fields: {
        id: true,
        title: true,
        publishedAt: true,
        updatedAt: true,
        userId: true,
      },
    })
  if (!thread) {
    return {}
  }
  const user = await userModel.findOne({
    where: {
      id: thread.userId,
      isValid: 1,
    },
    fields: {
      id: true,
      nickName: true,
    },
  })
  if (!user) {
    return {}
  }
  thread.user = user || {}
  return thread
}

async function sub(userId, params) {
  const {id, threadId} = params
    const isPurchased = await _isSalonPurchased(userId, id)
  if (!isPurchased) {
    return []
  }
  const threads = await threadModel.find({
      where: {
        topicThreadId: threadId,
        salonId: id,
        isValid: 1,
        isTopic: 0,
      },
      fields: {
        id: true,
        content: true,
        publishedAt: true,
        userId: true,
      },
      order: 'publishedAt DESC',
    })
  if (!threads) {
    return []
  }
  const userIds = arrayUtil.attributeArray(threads || [], 'userId')
  let users = await userModel.find({
      where: {
        id: {
          inq: userIds,
        },
        isValid: 1,
      },
      fields: {
        id: true,
        nickName: true,
      },
    })
  users = arrayUtil.index(users, 'id')
  return threads.map(thread => {
    thread.user = users[thread.userId]
    return thread
  })
}

async function store(userId, params, body) {
  const {id, threadId} = params
  const salon = await salonsModel.findOne({
    where: {
      id,
      isValid: 1,
    },
    fields: {
      productId: true,
    },
  })
  const productId = salon.productId
  const product = await productsModel.findOne({
    where: {
      id: productId,
      isValid: 1,
      isSaleStop: 0,
    },
    fields: {
      userId: true,
      name: true,
    },
  })
  const isPurchased = await _isProductPurchased(userId, productId)
  if (!isPurchased) {
    return []
  }
  const thread = await threadModel.findOne({
    where: {
      id: threadId,
      salonId: id,
      isValid: 1,
      isTopic: 1,
    },
    fields: {
      id: true,
      title: true,
    },
  })
  if (!thread) {
    return []
  }
  await threadModel.create({
    isValid: 1,
    statusType: 1,
    userId,
    salonId: id,
    isTopic: 0,
    topicThreadId: threadId,
    publishedAt: Date.now(),
    content: body.content,
  })
  sendEmails(id, productId, userId, product.name, body.content, thread.title, product.userId)
  return {}
}

async function _isSalonPurchased(userId, salonId) {
  const salon = await salonsModel.findOne({
      where: {
        id: salonId,
        isValid: 1,
      },
      fields: {
        productId: true,
      },
    })

  if (!salon) {
    return false
  }

  const productId = salon.productId
    const tieup = await tieupProductsModel.find({
      where: {
        tieupProductId: salon.productId,
        isValid: 1,
        typeId: 1,
      },
      fields: {
        tieupProductId: true,
        productId: true,
      },
    })
    const productIds = arrayUtil.attributeArray(tieup || [], 'productId')
  productIds.push(productId)
  const sale = await salesModel.findOne({
    where: {
      productId: {
        inq: productIds,
      },
      userId,
    },
    fields: {
      id: true,
    },
  })
  return !!sale
}

async function _isProductPurchased(userId, productId) {
  const tieup = await tieupProductsModel.find({
      where: {
        tieupProductId: productId,
        isValid: 1,
        typeId: 1,
      },
      fields: {
        tieupProductId: true,
        productId: true,
      },
    })
    const productIds = arrayUtil.attributeArray(tieup || [], 'productId')
  productIds.push(productId)
  const sale = await salesModel.findOne({
    where: {
      productId: {
        inq: productIds,
      },
      userId,
    },
    fields: {
      id: true,
    },
  })
  return !!sale
}

async function sendEmails(salonId, productId, userId, productName, content, title, sellerId) {
  const curTime = Date.now()
  const sales = await salesModel.find({
    where: {
      productId,
      isValid: 1,
      payAt: {
        gte: 1,
      },
      userType: 1,
      userId: {
        neq: userId,
      },
      serviceStartAt: {
        lte: curTime,
      },
      serviceEndAt: {
        gte: curTime,
      },
    },
    fields: {
      userId: true,
    },
  })
  const salesUserIds = arrayUtil.attributeArray(sales || [], 'userId')
  const emailContent = {
    product_name: productName,
    content: content,
    title: title,
  }
  let uIds = [],
    buyerSub,
    sendMailMain,
    sendMailSub,
    emailSubs

  if (sales) {
    buyerSub = await app.models.MailmagazineSubscribers.find({
      where: {
        isValid: 1,
        salonId,
        salesId: {
          gte: 1,
        },
        userId: {
          inq: salesUserIds,
        },
        isMailThreadSubscriber: 1,
      },
      fields: {
        userId: true,
        isMailSub: true,
        isMailMain: true,
      },
    }) || []

    sendMailMain = buyerSub.filter(e => e.isMailMain)
    uIds = arrayUtil.attributeArray(sendMailMain, 'userId')

    sendMailSub = buyerSub.filter(e => e.isMailSub)
    emailSubs = await commonUser.getSubEmails(arrayUtil.attributeArray(sendMailSub, 'userId'))
  }
  uIds.push(sellerId)
  const emails = await commonUser.getEmails(uIds)
    const allEmails = Object.values(emails || {}).concat(Object.values(emailSubs || {}))
    const to = allEmails.join()
  commonEmailV1.sendNow(to, emailContent, 6, 1)
}

module.exports = {
  index,
  sub,
  store,
}
