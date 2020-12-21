const app = require('@server/server')
const productTermsModels = app.models.ProductTerms
const conclusion = app.models.Conclusion
const conclusionBefore = app.models.ConclusionBefore
const productsModel = app.models.Products
const {
  findOne
} = require('@server/utils/model')
const {oldDeveloperId} = require('@services/common/user')

const usbMaps = {
  12578: 5,
  12582: 7,
  7535: 8,
  7255: 10,
}

const usbUserMaps = {
  7650: 1,
  8691: 1,
  8709: 1,
  7852: 1,
  12578: 3015,
  12582: 3015
}

async function usb(pId, devId) {
  let data
  if (pId == 12578 || pId == 12582 || pId == 7535 || pId == 7255) {
    data = await findOne('asp', 'contracts', {
      where: {
        DevUserId: oldDeveloperId(devId),
        Type: usbMaps[pId]
      },
      order: 'CreatedDate DESC',
      fields: {
        Contents: true
      }
    })
    data.Contents = app.utils.crypto.decrypt(data.Contents)
    return data
  } else {
    data = await conclusionBefore.findOne({
      where: {
        userId: devId,
        isValid: 1
      },
      order: 'id DESC',
      fields: {
        content: true
      }
    })
    // data.Contents = app.utils.crypto.decrypt(data.content)
    data.Contents = data.content
    data.content = ''
    return data
  }
}

async function usa(pId) {
  let data
  if (pId) {
    if (pId == 7650 || pId == 8691 || pId == 8709 || pId == 7852 || pId == 12578 || pId == 12582) {
      data = await findOne('asp', 'contracts', {
        where: {
          DevUserId: usbUserMaps[pId],
          Type: usbMaps[pId]
        },
        order: 'CreatedDate DESC',
        fields: {
          Contents: true
        }
      })
      data.Contents = app.utils.crypto.decrypt(data.Contents)
      return data
    } else {
      let {userId} = await productsModel.findOne({
        where: {
          id: pId,
          isValid: 1
        },
        fields: {
          userId: true
        }
      })
      data = await conclusion.findOne({
        where: {
          userId: userId,
          isValid: 1
        },
        order: 'id DESC',
        fields: {
          content: true
        }
      })
      data.Contents = data.content
      data.content = ''
      return data
    }
  } else {
    data = await findOne('asp', 'contracts', {
      where: {
        IsValid: 1,
        DevUserId: 1,
        Type: 2
      },
      order: 'CreatedDate DESC',
      fields: {
        Contents: true
      }
    })
    data.Contents = app.utils.crypto.decrypt(data.Contents)
    return data
  }
}

async function usl(language) {
  let data = await findOne('asp', 'contracts', {
    where: {
      DevUserId: 1,
      Type: 4,
      Language: language
    },
    order: 'CreatedDate DESC',
    fields: {
      Contents: true
    }
  })
  data.Contents = app.utils.crypto.decrypt(data.Contents)
  return data
}

async function ust(id) {
  let data = await productTermsModels.findOne({
    where: {
      productId: id,
      isValid: 1,
      publishedAt: {gt: '1970-01-01T00:00:00.000Z'},
      content: {neq: ''},
    },
    fields: {
      content: true,
    },
    order: 'id DESC'
  })
  return data
}

module.exports = {
  usb,
  usa,
  usl,
  ust,
}
