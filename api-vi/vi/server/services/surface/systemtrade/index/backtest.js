const app = require('@server/server')
const commonProduct = require('@services/common/product')
const {
  removeCompanyName,
  removeRedundantInfo,
} = require('@@server/services/surface/backtest/helper')
const Encoding = require('encoding-japanese')

// Utils
const httpUtil = require('@@server/utils/http')
const arrayUtil = require('@ggj/utils/utils/array')

const DEFAULT_MESSAGES = {
  1: 'バックテストは表示できませんでした。',
  2: 'We could not display the back test.',
  3: 'ไม่สามารถแสดงผลแบคเทสได้',
  4: 'There is no backtest for this product. Sorry for this inconvenience.',
  5: '无法表示回测资料。',
  6: '無法表示回測資料。',
}

const SORT_MAPS = {
  1: 'updatedAt DESC',
  2: 'downloadCount DESC',
}

/**
 * show backTest
 *
 * @param {Number} id
 * @param {Object} input
 * @return {}
 * @public
 */
async function show(id, input, number = 1, langType = 1) {
  input.typeIds = '1'
  const text = DEFAULT_MESSAGES[langType] || DEFAULT_MESSAGES[1]
    const noData = `<div style="text-align:center; margin-top: 50px; font-family: Arial, sans-serif;">${text}</div>`
    const noIndexMeta = '<meta name="robots" content="noindex">'
    const product = await commonProduct.show(id, input)
  if (!product) {
    return noData
  }

  try {
    const fileUrl = `${process.env.FILE_HOST_URL}file/products/${id}/backtest/render/${number}`
    let content = await httpUtil.get(fileUrl)

    const codes = Buffer.from(content)
    const encoding = Encoding.detect(codes)
    if (encoding) {
      content = Encoding.convert(content, {
        to: 'unicode',
        from: encoding,
        type: 'string',
      })
    }

    if (!content) {
      return noData
    }

    const imgData = await app.models.Images.find({
      where: {
        isValid: 1,
        imageCategoryId: 20,
        masterId: id,
      },
      fields: {
        imageNumber: true,
        imageName: true,
      },
    })

    for (const i in imgData) {
      if (imgData[i]) {
        const el = imgData[i]
        if (el.imageNumber) {
          content = content.replace(el.imageName, `/img/products/${id}/backtest/${el.imageNumber}`)
        } else {
          content = content.replace(/<img src="[^"]+"/, `<img src="/img/products/${id}/backtest"`)
        }
      }
    }

  // Delete company name
  // https://gogojungle.backlog.jp/view/OAM-28950
  content = removeCompanyName(content)

    // Insert noindex for block google crawl
    let pos = content.search('<head>')
    if (pos >= 0) {
      return content.slice(0, pos) + noIndexMeta + content.slice(pos)
    }

    pos = content.search('<html>')
    if (pos >= 0) {
      const tag = `<head>${noIndexMeta}</head>`
      return content.slice(0, pos) + tag + content.slice(pos)
    }

    pos = content.search(/<!DOCTYPE.*>/i)
    if (pos >= 0) {
      const tag = `<html><head>${noIndexMeta}</head>`
      return content.slice(0, pos) + tag + content.slice(pos) + '<html>'
    }
    return `<head>${noIndexMeta}</head>` + content
  } catch (e) {
    console.log(e)
    return noData
  }
}

async function getDirsByProductId(id) {
  try {
    if (!id) {
      return {}
    }

    const productData = await app.models.Products.findOne({
      where: {
        id,
        isValid: {
          inq: [0, 1],
        },
        typeId: 1,
        userId: {
          gt: 0,
        },
      },
      fields: {
        name: true,
        catchCopy: true,
      },
    })

    if (!productData) {
      return {}
    }

    const fileUrl = `${process.env.FILE_HOST_URL}file/products/${id}/backtest/list`
    const data = await httpUtil.get(fileUrl)
    const [dataExchange, users] = await Promise.all([
      app.models.DataExchange.findOne({
        where: {
          productId: id,
          isValid: 1,
        },
        fields: {
          displayProductId: true,
        },
      }),
      (data || []).length ? app.models.Users.find({
        where: {
          id: {
            inq: data,
          },
        },
        fields: {
          id: true,
          nickName: true,
        },
      }) : [],
    ])
    const displayProductId = dataExchange ? dataExchange['displayProductId'] : null

    return {
      id,
      name: productData['name'] || '',
      displayProductId: displayProductId || null,
      description: productData['catchCopy'] || '',
      data: users || [],
    }
  } catch (e) {
    console.log(e)
  }
}

async function backtestIndex(productId, query, userId = 0) {
  if (!productId) {
    return {}
  }
  const limit = query.limit || 8
  const page = parseInt(query.page || 1)
  const order = SORT_MAPS[query.sort || 1]
  const mineFilter = parseInt(query.mineFilter || 0)
  const where = {
    productId,
    isValid: 1,
    statusType: 1,
    // userId: {
    //   neq: [110001],
    // },
  }
  if (mineFilter && userId) {
    where.userId = userId
  }
  const [productData, backtestList] = await Promise.all([
    app.models.Products.findOne({
      where: {
        id: productId,
        isValid: {
          inq: [0, 1],
        },
        typeId: 1,
        userId: {
          gt: 0,
        },
      },
      fields: {
        name: true,
        catchCopy: true,
        userId: true,
      },
    }),
    app.models.ProductBacktest.find({
      where,
      fields: {
        id: true,
        userId: true,
        fileNumber: true,
        updatedAt: true,
        downloadCount: true,
        memo: true,
      },
      order,
    }),
  ])
  if (!productData) {
    return {}
  }
  
  const userIds = arrayUtil.column(backtestList, 'userId')

  let [dataExchange, users] = await Promise.all([
    app.models.DataExchange.findOne({
      where: {
        productId,
        isValid: 1,
      },
      fields: {
        displayProductId: true,
      },
    }),
    (userIds || []).length ? app.models.Users.find({
      where: {
        id: {
          inq: userIds,
        },
      },
      fields: {
        id: true,
        nickName: true,
      },
    }) : [],
  ])
  const displayProductId = dataExchange ? dataExchange['displayProductId'] : null
  users = arrayUtil.index(users, 'id')
  
  const data = backtestList.filter(e => e.userId != productData['userId'] && e.userId != 110001).map(el => {
    el.nickName = users[el.userId].nickName || ''
    return el
  })
  const dataGGJ = backtestList.filter(e => e.userId == 110001).map(el => {
    el.nickName = users[el.userId].nickName || ''
    return el
  })
  const lastPage = Math.round(data.length / limit)
  const pagingFrom = Math.max(page - 4 / 2, 1)
  const pagingTo = Math.min(page + 4 / 2, lastPage)

  return {
    id: productId,
    name: productData['name'] || '',
    userId: productData['userId'],
    displayProductId: displayProductId || null,
    description: productData['catchCopy'] || '',
    currentPage: page,
    lastPage,
    pagingFrom,
    pagingTo,
    data: data.slice((page - 1) * limit, page * limit),
    dataGGJ,
    ranking: backtestList.filter(e => e.userId != productData['userId'] && e.userId != 110001).sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 4),
  }
}

async function renderUserBackTest(id, input, userId, number = 1, langType = 1) {
  input.typeIds = '1'

  const text = DEFAULT_MESSAGES[langType] || DEFAULT_MESSAGES[1]
  const noData = langType == 4 ? `<div style="text-align:center;margin-top: 50px;font-family: Arial, sans-serif;">${text}</div>` : `<div style="text-align:center; margin-top: 50px;">${text}</div>`
  const noIndexMeta = '<meta name="robots" content="noindex">'
  const product = await commonProduct.show(id, input)

  if (!product) {
    return noData
  }

  try {
    const fileUrl = `${process.env.FILE_HOST_URL}file/products/${id}/backtest/render/user/${userId}/${number}`
    let content = await httpUtil.get(fileUrl)

    const codes = Buffer.from(content)
    const encoding = Encoding.detect(codes)

    if (encoding) {
      content = Encoding.convert(content, {
        to: 'unicode',
        from: encoding,
        type: 'string',
      })
    }
    
    if (!content) {
      return noData
    }

    const imgData = await app.models.Images.find({
      where: {
        isValid: 1,
        imageCategoryId: 20,
        masterId: id,
        userId,
      },
      fields: {
        imageNumber: true,
        imageName: true,
      },
    })

    for (const i in imgData) {
      if (imgData[i]) {
        const el = imgData[i]
        if (el.imageNumber) {
          content = content.replace(el.imageName, `/img/products/${id}/backtest/user/${userId}/${el.imageNumber}`)
        } else {
          content = content.replace(/<img src="[^"]+"/, `<img src="/img/products/${id}/backtest/user/${userId}"`)
        }
      }
    }

    // Delete company name
    // https://gogojungle.backlog.jp/view/OAM-28950
    content = removeRedundantInfo(content)

    // Insert noindex for block google crawl
    let pos = content.search('<head>')
    if (pos >= 0) {
      return content.slice(0, pos) + noIndexMeta + content.slice(pos)
    }

    pos = content.search('<html>')
    if (pos >= 0) {
      const tag = `<head>${noIndexMeta}</head>`
      return content.slice(0, pos) + tag + content.slice(pos)
    }

    pos = content.search(/<!DOCTYPE.*>/i)
    if (pos >= 0) {
      const tag = `<html><head>${noIndexMeta}</head>`
      return content.slice(0, pos) + tag + content.slice(pos) + '<html>'
    }
    return `<head>${noIndexMeta}</head>` + content
  } catch (e) {
    console.log(e)
    return noData
  }
}

async function renderUserBackTestv2(id, input, userId, count = 1, number = 1, langType = 1) {
  input.typeIds = '1'

  const text = DEFAULT_MESSAGES[langType] || DEFAULT_MESSAGES[1]
  const noData = langType == 4 ? `<div style="text-align:center;margin-top: 50px;font-family: Arial, sans-serif;">${text}</div>` : `<div style="text-align:center; margin-top: 50px;">${text}</div>`
  const noIndexMeta = '<meta name="robots" content="noindex">'
  const product = await commonProduct.show(id, input)
  if (!product) {
    return noData
  }

  try {
    const fileUrl = `${process.env.FILE_HOST_URL}file/products/${id}/backtest/render/user/${userId}/${count}/${number}`
    let content = await httpUtil.get(fileUrl)

    const codes = Buffer.from(content)
    const encoding = Encoding.detect(codes)

    if (encoding) {
      content = Encoding.convert(content, {
        to: 'unicode',
        from: encoding,
        type: 'string',
      })
    }
    
    if (!content) {
      return noData
    }

    const imgData = await app.models.Images.findOne({
      where: {
        isValid: 1,
        imageCategoryId: 20,
        masterId: id,
        userId,
        imageNumber: number,
      },
      fields: {
        imageNumber: true,
        imageName: true,
      },
    })

    if (imgData) {
      content = content.replace(imgData.imageName, `/img/products/${id}/backtest/user/${userId}/${imgData.imageNumber}`)
    }

    // Delete company name
    // https://gogojungle.backlog.jp/view/OAM-28950
    content = removeRedundantInfo(content)

    // Insert noindex for block google crawl
    let pos = content.search('<head>')
    if (pos >= 0) {
      return content.slice(0, pos) + noIndexMeta + content.slice(pos)
    }

    pos = content.search('<html>')
    if (pos >= 0) {
      const tag = `<head>${noIndexMeta}</head>`
      return content.slice(0, pos) + tag + content.slice(pos)
    }

    pos = content.search(/<!DOCTYPE.*>/i)
    if (pos >= 0) {
      const tag = `<html><head>${noIndexMeta}</head>`
      return content.slice(0, pos) + tag + content.slice(pos) + '<html>'
    }
    return `<head>${noIndexMeta}</head>` + content
  } catch (e) {
    console.log(e)
    return noData
  }
}

module.exports = {
  show,
  getDirsByProductId,
  renderUserBackTest,
  renderUserBackTestv2,
  backtestIndex ,
}
