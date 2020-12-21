const app = require('@server/server')
const helper = require('./helper')
const userCommonService = require('@services/common/user')
const commonEmailV1 = require('@@services/common/emailv1')
const { getLanguages } = require('./getLanguages')
const { SALON_EXPENSE_FEE, SPECIAL_PRODUCTS } = require('@@server/common/data/hardcodedData')
const BANK_AUTO_TRANSFER_PAYMENT_TYPE = 5
const MAP_EMAIL_TEMPLATES = {
  0: 0, // Free records, based on isFree instead payId
  1: 44,
  2: 0,
  3: 0,
  4: 45,
  5: 47,
}
const MAP_LANG_EMAIL_TEMPLATES = {
  0: {
    1: 55, // JP
    2: 57, // En
    3: 56, // Th
    4: 60, // Vi
    5: 59, // Ch
    6: 58, // Tw
  },
  2: {
    1: 43,
    2: 50,
    3: 49,
    4: 53,
    5: 52,
    6: 51,
  },
  3: {
    1: 43,
    2: 50,
    3: 49,
    4: 53,
    5: 52,
    6: 51,
  },
}
const MAP_TYPEID_COMMENT_URL = {
  multiple: {
    comment: '[ マイページ＞利用する ] の各コーナーからご入手ください。\n' +
      '会員様マイページ',
    url: 'https://www.gogojungle.co.jp/mypage/',
  },
  download: {
    comment: {
      1: 'ダウンロードページ',
      2: 'Download Page',
      3: 'หน้าดาวน์โหลด',
      4: 'Trang Download',
      5: 'ダウンロードページ',
      6: 'ダウンロードページ',
    },
    url: 'https://www.gogojungle.co.jp/mypage/download',
  },
  3: {
    comment: '購入した投資ナビはコチラから',
    url: 'https://www.gogojungle.co.jp/mypage/navi',
  },
  4: {
    comment: '掲示板や過去ログはこちら',
    url: 'https://www.gogojungle.co.jp/mypage/mailmagazine',
  },
  5: {
    comment: '動画の閲覧はコチラから',
    url: 'https://www.gogojungle.co.jp/mypage/video',
  },
  19: {
    comment: 'イベント情報はこちら',
    url: 'https://www.gogojungle.co.jp/mypage/event',
  },
}

const langMap = {
  1: {
    convenience: 'オンライン決済番号: ',
    convenience1: '第1番号(企業コード): ',
    convenience2: '第2番号(注文番号): ',
    expensePrice: '事務手数料',
    name: '商品名：　',
    number: '個数：　',
    amount: '金額：　',
  },
  2: {
    convenience: 'Online Payment Number: ',
    convenience1: 'The first number (Company Code): ',
    convenience2: 'The second number (Order Code): ',
    expensePrice: 'Administrative Fee',
    name: 'Product Name: ',
    number: 'Quantity: ',
    amount: 'Total: ',
  },
  3: {
    convenience: 'หมายเลขการชำระเงินออนไลน์ :',
    convenience1: 'หมายเลข 1 (รหัสบริษัท) :',
    convenience2: 'หมายเลข 2 (หมายเลขคำสั่งซื้อ) :',
    expensePrice: 'ค่าธรรมเนียม',
    name: 'ชื่อสินค้า :',
    number: 'จำนวน :',
    amount: 'จำนวนเงิน :',
  },
  4: {
    convenience: 'Mã số thanh toán Online: ',
    convenience1: 'Mã công ty: ',
    convenience2: 'Mã đặt hàng: ',
    expensePrice: 'Phí nghiệp vụ',
    name: 'Tên sản phẩm: ',
    number: 'Số lượng: ',
    amount: 'Số tiền: ',
  },
}

const commentTxt = {
  1: 'ダウンロードページ',
  2: 'Download Page',
  3: 'หน้าดาวน์โหลด',
  4: 'Trang Download',
  5: 'ダウンロードページ',
  6: 'ダウンロードページ',
}

const langText2Int = {
  ja: 1,
  en: 2,
  th: 3,
  vi: 4,
}

// Utils
const numberUtils = app.utils.number
const arrayUtil = require('@ggj/utils/utils/array')

/**
 * Get type ids for given products
 *
 * @param {Array} products
 * @returns {Array}
 * @private
 */
function _commentUrl(products, langType = 1) {
  /*
    memo: https://gogojungle.backlog.jp/view/OAM-14845#comment-52996655
    Privacy.products.type_id = Multiple
      return MAP_TYPEID_COMMENT_URL.multiple
    Privacy.products.type_id = 1,2,70,71
      return MAP_TYPEID_COMMENT_URL.download

    Privacy.products.type_id = 3
    Privacy.products.type_id = 4
    Privacy.products.type_id = 19
    Privacy.products.type_id = 5
      return MAP_TYPEID_COMMENT_URL[Privacy.products.type_id]
   */
  const typeIds = arrayUtil.column(products, 'typeId', true)

  // if given products have the same typeId and typeId is in 3, 4, 5, 19
  // exp: [3], [4], [5], [9]
  if (typeIds.length === 1 && [3, 4, 5, 19].includes(typeIds[0])) {
    return MAP_TYPEID_COMMENT_URL[typeIds[0]]
  }

  // if given products have typeIds in 1, 2, 70, 71
  // exp: [1, 2], [70, 1], [1, 70, 2, 71], ...
  if (typeIds.every(val => [1, 2, 70, 71].includes(val))) {
    const res = MAP_TYPEID_COMMENT_URL.download
    res.comment = commentTxt[langType]
    return res
  }

  // otherwise return multiple case
  // exp: [3, 4], [6], [4, 2], [19, 4], ...
  return MAP_TYPEID_COMMENT_URL.multiple
}

/**
 * Get `master.products` data
 *
 * @param {Array} productIds
 * @returns {Array}
 * @private
 */
async function _products(productIds) {
  return productIds.length == 0 ? [] : await app.models.Products.find({
    where: {
      id: {
        inq: productIds,
      },
    },
    fields: {
      id: true,
      name: true,
      typeId: true,
      languages: true,
    },
  })
}

function _content(sessionId, payId, user, sales, products, opt, langProducts = []) {
  /*
    ・銀行振込 1
    email_templates.id : 44
    ・口座振替 5
    email_templates.id : 47

    ・ソフトバンク決済 2
    ・テレコムクレジット決済 3
    email_templates.id : 48
    email_templates.id : 43

    ・コンビニ決済 4
    email_templates.id : 45
    ・コンビニ決済(リターン) 4, complete
    email_templates.id : 46

    email_templates.id :48
    E-mailの対応表です
    */
  const totalPrice = helper.totalPrice(sales)
  const information = _information(sales, products, langProducts)
  const date = opt.expiredAt ? new Date(parseInt(opt.expiredAt) * 1000) : null
  const price3Month = payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE ? totalPrice - SALON_EXPENSE_FEE : null
  const langType = (sales[0] || {}).langType || 1

  let convenience = null

  if (payId == 4 && opt.code) {
    convenience = ((langMap[langType] || {}).convenience || 'オンライン決済番号: ') + opt.code
  } else if (payId == 4 && opt.code1) {
    convenience = ((langMap[langType] || {}).convenience1 || '第1番号(企業コード): ') + opt.code1 + '\r\n' +
      ((langMap[langType] || {}).convenience2 || '第2番号(注文番号): ') + opt.code2
  }

  const commentUrl = _commentUrl(products) || {}

  return {
    last_name: user.lastName || '',
    first_name: user.firstName || '',
    order_number: sessionId,
    information,
    all_price: numberUtils.formatCurrency(totalPrice),
    price_3month: numberUtils.formatCurrency(price3Month),
    product_price: numberUtils.formatCurrency(price3Month / 3),
    transfer_number: user.id,
    // company_code: opt.code || opt.code1 || null,
    // order_number_convenience_store: opt.code2 || null,
    comment: commentUrl.comment,
    URL: commentUrl.url,
    convenience,
    // Should we display `null` in email when sending?
    payment_year: date ? date.getFullYear() : '',
    payment_month: date ? date.getMonth() + 1 : '',
    payment_day: date ? date.getDate() : '',
    order_number_url: opt.confirmUrl || '',
  }
  /*
    if (code.length == 1) {
      return {
        payId,
        code: code[0],
        expiredAt,
        sessionId,
        confirmUrl,
      }
    } else if (code.length == 2) {
      return {
        payId,
        code1: code[0],
        code2: code[1],
        expiredAt,
        sessionId,
        confirmUrl,
      }
    }
  */
}

function _information(sales, products, langProducts = []) {
  const productObjects = arrayUtil.index(products)
  const langProductObjects = arrayUtil.index(langProducts, 'productId')
  const langType = (sales[0] || {}).langType || 1
  const information = sales.reduce((result, sale) => {
    if (!result[sale.productId]) {
      result[sale.productId] = {
        price: 0,
        name: (langProductObjects[sale.productId] || {}).name || productObjects[sale.productId].name,
        count: sale.payId == BANK_AUTO_TRANSFER_PAYMENT_TYPE ? 2 : 0,
      }
    }
    result[sale.productId].count = result[sale.productId].count + 1
    result[sale.productId].price = sale.price - sale.expensePrice + result[sale.productId].price

    if (sale.expensePrice > 0) {
      result.expensePrice = {
        name: (langMap[langType] || {}).expensePrice || '事務手数料',
        count: 1,
        price: sale.expensePrice,
      }
    }
    return result
  }, {})
  const nameTxt = (langMap[langType] || {}).name || '商品名：　'
  const numberTxt = (langMap[langType] || {}).number || '個数：　'
  const amountTxt = (langMap[langType] || {}).amount || '金額：　'
  return Object.keys(information).map(idx => {
    const item = information[idx]
    return nameTxt + item.name + '\r\n' + numberTxt + item.count + '\r\n' + amountTxt + numberUtils.formatCurrency(item.price)
  }).join('\r\n\r\n')
}

/**
 * Send email to buyer with salesSessionId
 *
 * @param {String} sessionId
 * @param {Number} userId
 * @param {Number} templateId
 * @param {Object} opt
 * @return {Void}
 * @public
 */
async function sendMailToBuyer(sessionId, userId, templateId, opt = {}) {
  const fields = 'id,salesType,typeId,productId,payId,price,isFree,expensePrice,langType'
  const [user, sales] = await Promise.all([
    userCommonService.getUserFullInformation(userId, true),
    helper.sales(userId, sessionId, fields),
  ])
  const head = sales[0] || {}
  const pIds = arrayUtil.column(sales, 'productId')
  const [products, langProducts] = await Promise.all([
    _products(pIds),
    getLanguages(pIds, head.langType),
  ])

  if (!templateId) {
    templateId = _defaultTemplate(head)
  }

  const content = _content(sessionId, head.payId, user, sales, products, opt, langProducts)
  commonEmailV1.sendByUserId(userId, content, templateId, head.langType || 1)
  return content
}

/**
 * Send email to seller with each sale record
 *
 * @param sales
 * @param templateId
 * @return {Promise<void>}
 */
async function sendMailToSeller(sales, templateId) {
  if (!sales || !sales.length) {
    return
  }

  const productIds = arrayUtil.column(sales, 'productId')
  const sellerIds = arrayUtil.column(sales, 'developerUserId')

  let [products, sellers] = await Promise.all([
    _products(productIds),
    userCommonService.getUsers(sellerIds, {
      id: true,
      mailAddress: true,
      lastName: true,
      firstName: true,
      // languages: true,
    }),
  ])

  products = arrayUtil.index(products)
  sellers = arrayUtil.index(sellers)

  // Group sales data
  const mailData = sales.reduce((res, sale) => {
    if (res[sale['productId']]) {
      res[sale['productId']]['product_number'] += 1
      const totalPrice = res[sale['productId']]['product_number'] * sale.price
      res[sale['productId']]['product_price'] = numberUtils.formatCurrency(totalPrice)
      return res
    }

    const product = products[sale['productId']]
    const seller = sellers[sale['developerUserId']]

    if (!product || !seller) {
      return res
    }

    const name = product.name
    const price = numberUtils.formatCurrency(sale.price)
    const langType = langText2Int[product.languages] || 1

    res[sale['productId']] = {
      mailAddress: seller.mailAddress,
      last_name: seller.lastName || '',
      first_name: seller.firstName || '',
      userId: seller.id,
      product_name: name,
      product_number: 1,
      product_price: price,
      information: (langMap[langType].name || '商品名：　') + name + '\r\n' + (langMap[langType].number || '個数：　') + price,
      langType,
    }
    return res
  }, {})

  // Send mail to seller
  // Each record in mail data is a email that will be send
  Object.keys(mailData).forEach(productId => {
    if (SPECIAL_PRODUCTS.includes(parseInt(productId))) {
      return
    }
    const item = mailData[productId]

    if (item) {
      commonEmailV1.sendByUserId(
        item.userId,
        item,
        templateId,
        item.langType,
      )
    }
  })
}

/**
 * Get template id for given sale record
 * base on payId & langType
 *
 * @param sale
 * @return {number}
 * @private
 */
function _defaultTemplate(sale) {
  const isFree = sale.isFree && sale.price === 0
  const payId = isFree ? 0 : sale.payId // Free sale records will have different template
  const template = MAP_EMAIL_TEMPLATES[payId]

  if (template === 0) {
    const langType = sale.langType || 1
    return MAP_LANG_EMAIL_TEMPLATES[2][langType]
  }
  
  return template
}

module.exports = {
  sendMailToBuyer,
  sendMailToSeller,
}
