const app = require('@server/server')
const modelUtil = require('@server/utils/model')

const REAL_TRADE_WIDGET_URL = process.env.REALTRADE_WIDGETS_URL
const PAGE_SIZE = 3
const DEV_WIDGET_COLOR = 'ff8400'
const BUYER_WIDGET_COLOR = '41C9B4'
const PREVIEW_WIDTH = 290


function _getProductUserById(pId) {
  return app.models.Products.findOne({
    where: {
      id: pId,
    },
    fields: ['userId'],
  })
}

function _getAccountRelatedProduct(pId) {
  const query = `
  SELECT
    rp.account_id as accountId, rp.product_id as productId, rp.magic_number as magicNumber, ia.UserId as userId, ia.ModeId as modeId, ia.Name as accountName
  FROM
    fx_account.related_products AS rp
  INNER JOIN
    fx_account._info_account AS ia
  ON
    rp.account_id = ia.id
  WHERE
  rp.is_valid = 1 AND rp.is_public_widget  = 1 AND ia.IsValid = 1 AND rp.product_id = ${pId} AND ia.AccountPublic  = 1`

  return modelUtil.excuteQuery('fx_account', query)
}

function _generateWidgetsData(accountRelatedProducts, product, pageNum, isPreview) {
  let widgetType = 'previewData'
  const widgets = accountRelatedProducts.reduce((acc, relatedProduct) =>{
    const modeId = relatedProduct.modeId
    const accountId = relatedProduct.accountId
    const userId = relatedProduct.userId
    const isBuyer = product.userId !== relatedProduct.userId
    const color = isBuyer ? BUYER_WIDGET_COLOR : DEV_WIDGET_COLOR
    const width = isPreview ? PREVIEW_WIDTH : 500
    const widgetUrl = `${REAL_TRADE_WIDGET_URL}/embed/minnanotrade/charts?i=39&a=${relatedProduct.accountId}&u=${relatedProduct.userId}&m=${modeId}&l=ja&c=${color}&w=${width}&mn=${relatedProduct.magicNumber}`

    if (!isPreview) {
      widgetType = isBuyer ? 'buyerWidgetUrls' : 'devWidgetUrls'
    }

    if(!acc[widgetType][accountId]) {
      acc[widgetType][accountId] = {
        widgetUrl,
        modeId,
        isBuyer,
        color,
        accountId,
        userId,
      }

      return acc
    }

    acc[widgetType][accountId].widgetUrl += `,${relatedProduct.magicNumber}`
    return acc
  }, {
    devWidgetUrls: {},
    buyerWidgetUrls: {},
    previewData: {},
  })

  const devWidgetUrls = Object.values(widgets.devWidgetUrls)
  const buyerWidgetUrls = Object.values(widgets.buyerWidgetUrls)
  const previewData = Object.values(widgets.previewData)
  const buyerTotalWidget = buyerWidgetUrls.length
  const totalWidget = [...devWidgetUrls, ...buyerWidgetUrls, ...previewData].length

  return {
    devWidgetUrls,
    buyerWidgetUrls: buyerWidgetUrls.slice(pageNum * PAGE_SIZE, (pageNum * PAGE_SIZE) + PAGE_SIZE),
    buyerTotalWidget,
    previewData: previewData.slice(0, PAGE_SIZE),
    totalWidget,
  }
}

async function listWidgets(productId, pageNum, preview) {
  const [mainProduct, accountRelatedProducts] = await Promise.all([
    _getProductUserById(productId),
    _getAccountRelatedProduct(productId),
  ])

  if (!mainProduct) {
    return {}
  }
  return _generateWidgetsData(accountRelatedProducts, mainProduct, pageNum, preview)
}


async function listWidgetsByProductSeller(productId) {
  const user = await _getProductUserById(productId)
  if (!Object.keys(user || {}).length) {
    return []
  }
  const accounts = await _getAccountRelatedUser(user.userId)

  const result = accounts.reduce((acc, account) =>{
    const modeId = account.ModeId
    const accountId = account.Id
    const userId = account.UserId
    const color = DEV_WIDGET_COLOR
    const width = 500
    const widgetUrl = `${REAL_TRADE_WIDGET_URL}/embed/minnanotrade/charts?i=39&a=${accountId}&u=${userId}&m=${modeId}&l=ja&c=${color}&w=${width}`

    if(!acc[accountId]) {
      acc[accountId] = {
        widgetUrl,
        modeId,
        isBuyer: false,
        color,
        accountId,
        userId,
      }

      return acc
    }
    return acc
  }, {})

  return Object.values(result)
}

function _getAccountRelatedUser(uId) {
  const query = `
        SELECT Id, ModeId, UserId
        FROM _info_account
        WHERE IsValid=1 AND IsDelete = 0 AND AccountPublic=1 AND UserId = ?
        ORDER BY RAND() LIMIT 3;`
  return modelUtil.excuteQuery('fx_account', query, [uId])
}

module.exports = {
  listWidgets,
  listWidgetsByProductSeller,
}
