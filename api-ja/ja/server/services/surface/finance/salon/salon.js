const app = require('@server/server')
const commonPrice = require('@services/common/price')
const product = require('@services/common/product')
const user = require('@services/common/user')
const cart = require('@services/common/cart')
const time = require('@server/utils/time')
const review = require('@services/surface/review/product')

const {
  find,
  findOne,
} = require('@server/utils/model')

const { SALON_PRODUCT_IDS } = require('@@server/common/data/hardcodedData')

// host urls
const IMG_HOST = process.env.IMG_HOST_URL
const FX_HOST = process.env.FXON_HOST_URL

// models
const surfaceProductDetailsModel = app.models.SurfaceProductDetails
const topSliderModel = app.models.TopSliders
const productModel = app.models.Products
const salonModel = app.models.Salons
const mailMagazineModel = app.models.Mailmagazine
const threadModel = app.models.Threads
const articleModel = app.models.Articles
const columnModel = app.models.Columns

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const stringUtil = app.utils.string

/**
 * Get salons
 *
 * @param  {Number}  limit
 * @returns {Array}
 * @public
 */
async function index(limit = 0) {
  // TODO: HARDCODE HERE
  const pIds = SALON_PRODUCT_IDS
  const productSerialId = [16211, 21105]
  const salonNonAd = [23136, 19108]
  const mailMagazines = [10032]
  const fields = {
    id: true,
    productName: true,
    corporateName: true,
    categories: true,
    catchCopy: true,
    isSubscription: true,
    isAdvising: true,
    price: true,
    specialDiscountPrice: true,
  }
  const [detail, salons] = await Promise.all([
    arrayUtil.index(surfaceProductDetailsModel.find({
      where: {
        id: {
          inq: pIds,
        },
        isValid: 1,
        statusType: 1,
        isSaleStop: 0,
        typeId: { inq: [3, 4] },
      },
      fields,
    })),
    arrayUtil.index(salonModel.find({
      where: {
        isValid: 1,
        statusType: 1,
        productId: {
          inq: pIds,
        },
      },
      fields: {
        id: true,
        productId: true,
        categoryId: true,
      },
    }), 'productId'),
  ])
  const res = []

  pIds.forEach((id) => {
    if (detail[id] != undefined) {
      res.push(Object.assign(
        _getDetailProduct(id, detail[id]),
        {
          categoryId: productSerialId.includes(id) ? 0 : (salonNonAd.includes(id) ? 2 : ((salons[id] || {}).categoryId || 0)),
          isMagazine: mailMagazines.includes(id) ? (salons[id] || {}).id : 0,
        },
      ))
    }
  })
  return !limit ? res : res.slice(0, limit)
}

/**
 * Get finance sliders
 *
 * @returns {Array}
 * @public
 */
async function financeSliders() {
  const [topSliders, salonSliders] = await Promise.all([
    topSliderModel.find({
      where: {
        isValid: 1,
        servicePath: '/finance',
      },
      fields: {
        content: true,
      },
    }),
    _salonSliders(),
  ])
  return topSliders.concat(salonSliders)
}

/**
 * Get detail data for salon
 *
 * @param  {Number}  pId
 * @return {Promise<Object>}
 * @public
 */

async function show(pId, userId) {
  const [data, salon] = await Promise.all([
    product.show(pId, { typeIds: '4' }),
    _salon(pId),
  ])

  if (!data || !Object.keys(data).length || !salon) {
    return {}
  }

  // TODO: HARDCODE HERE
  if (pId == 14359) {
    const profiles = salon.ownerProfile.split('</div><div>')
      const profile = profiles[0] + '</div>'
      // profile2 = "<div>" + profiles[1],
      const nickName = 'ひろぴー'
      const imageUrl1 = '/img/assets/pc/salons/profile/' + pId + '.jpg'
    // imageUrl2 = '/img/assets/pc/salons/profile/' + toString(pId) + '_2.jpg'

    return await _salonDetailObject(pId, data, salon, {
      nickName: nickName,
      profile: profile,
      // profile2: profile2,
      profileImg: imageUrl1,
      // profile2Img2: imageUrl2,
      userIntroduction: '',
    }, userId)
  }

  // TODO: HARDCODE HERE
  if (pId == 8812) {
    data.productOutline = data.productOutline.replace('</center>', '</div>')
  }

  // TODO: OPTIMIZE THIS BLOCK
  const url = `assets/pc/salons/profile/${pId}.jpg`
  const nickName = data.nickName
  const profile = salon.ownerProfile
  const [salonDetailObj, { isExist }] = await Promise.all([
    _salonDetailObject(pId, data, salon, {
      profile: !profile ? null : profile,
      nickName: nickName,
    }, userId),
    await app.utils.http.get(`${IMG_HOST}exist?path=${url}`),
  ])
  salonDetailObj.profileImg = isExist ? '/img/' + url : null
  return salonDetailObj
}

/**
 * Get detail data for salon
 *
 * @param  {Number}  pId
 * @param  {Number}  sId
 * @return {Promise<Object>}
 * @public
 */

async function sample(pId, sId) {
  // TODO: HARDCODE HERE!!!
  if (pId == 14359) {
    return [
      {
        content: 'みなし業者の承認が降りる可能性あるのか\r\nサポートの児山です。\r\n\r\n' +
          '昨日のコインチェックの新規口座開設を受けて、bitFlyerの新規口座開設の再開とコインチェ' +
          'ックなどのみなし業者の登録の思惑が高まってきています。\r\n\r\n関係各所にヒアリングを' +
          '行いましたが、驚くほど情報がありませんでした。\r\n過去の業者の処分の場合は事前にメデ' +
          'ィアリークが行われたり、SNSにま噂が流れるなど本当かどうかは置いておいて情報が飛び交っ' +
          'ていました。\r\n昨年9月末の最初のみなし業者の登録の際には、記者会見を行うこともあり、や' +
          'はり情報は流れていました。\r\nしかし、今回はそういった情報は全くありません。\r\n\r\nみ' +
          'なし業者は既に管理態勢を整え、書類提出の完全に終わっているようですので、ボールは金融庁にあ' +
          'る状態。\r\nしかし金融庁内部での、登録を許可するorしない勢で分かれているようですから、も' +
          'う暫くかかるのかもしれません。\r\n\r\n先に新規口座開設は許可するということで、29日に仮想' +
          '通貨自主規制団体JVCEAが、第二種会員としてみなし業者の入会受付開始を始めた経緯があるのかもしれません。',
      },
      {
        content: 'イエレンFRB議長がビットコイン批判（ひろぴーポエム）\r\n仮想通貨市場は大きな材料' +
          '待ちです。\r\n特に変わらず小動きの展開が続いております。先程コインテレグラフをみていたら、FRB' +
          '前議長のイエレンさんがビットコイン批判をしておりましたので取り上げます。\r\n' +
          '出所：https://jp.cointelegraph.com/news/janet-yellen-said-she-is-not-a-fan-of-bitcoin\r\n\r\n' +
          '「通貨として失格」、「不正取引の温床」、「環境問題の原因」、「金融システムの脅威」と痛烈批判です。\r\nまあ、正直、' +
          'そのとおりだと思います（笑）\r\n\r\n僕も、このイノベーションには大いに期待をしておりますが、正直、根本なところは' +
          '実は懐疑的です。\r\nこういったデジタルコインが決済手段として本当に成り上がってきたら『価値』としての基準がまった' +
          'くもって不可解になるからです。\r\n既存の金融システムを半壊させるところまでいくでしょう。特に新興国の通貨は機能し' +
          'なくなり、こういったビットコインなど信用力の高いデジタル貨幣を使うようになるはずです。\r\n\r\nそれはともあれ、「仮' +
          '想通貨」という言葉を作ったのは日本のメディアであり、一説によると日本のどこかの政府期間が怪しいものとして認識させ' +
          'るため、架空のニセ通貨的な印象を持たせるために作った造語とも言われております。\r\n元々海外では、Cryptoカレンシー' +
          'やデジタルカレンシーとして言葉が使われておりましたが、日本語を英訳するせいで海外のサイトでもバーチャルカレンシーと' +
          'して紹介されているコラムも増えてきたぐらいです。',
      },
    ]
  }

  // TODO: HARDCODE HERE!!!
  const maps = {
    14150: {
      where: {
        id: 38240,
      },
      fields: {
        title: true,
        content: true,
        publishedAt: true,
      },
    },
    8697: {
      where: {
        id: 5745,
      },
      fields: {
        title: true,
        content: true,
        publishedAt: true,
      },
    },
  }

  const condition = maps[pId] || {
    where: {
      isValid: 1,
      salonId: sId,
      publishedAt: {
        lte: time.addMonths(-6),
      },
    },
    order: 'publishedAt DESC',
    limit: 5,
    fields: {
      title: true,
      content: true,
      publishedAt: true,
    },
  }
  const data = await mailMagazineModel.find(condition)

  return data.map((record) => {
    // TODO [^"] is cheat for not replace image tags
    // E.g. src="http..."
    const match = record.content.match(/([^"]https?|ftp)(:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)/)
    return {
      title: record.title,
      content: match ?
        record.content.replace(match[0], `<A href="${match[1]}${match[2]}">${match[1]}${match[2]}</A>`) :
        record.content,
      date: record.publishedAt,
    }
  }) || {}
}

/**
 * Get latest threads
 *
 * @param {Number}  pId
 * @return {Promise<Object>}
 * @public
 */
async function threads(pId) {
  const ids = arrayUtil.column(
    await find('asp', '_mailmagazine_comment', {
      where: {
        ProductId: pId,
        IsValid: 1,
        StatusId: 2,
        TypeId: 1,
      },
      order: 'id DESC',
      fields: {
        Id: true,
      },
      limit: 5,
    }), 'Id')

  const threads = await threadModel.find({
    where: {
      id: {
        inq: ids,
      },
    },
    fields: {
      id: true,
      content: true,
      publishedAt: true,
      userId: true,
    },
    order: 'id DESC',
  })

  let users = await user.getUsers(arrayUtil.column(threads, 'userId'))

  users = arrayUtil.index(users, 'id')
  return threads.map((thread) => {
    const uId = thread.userId
    const user = users[uId]
    return {
      id: thread.id,
      userId: uId,
      userName: user ? user.nickName : null,
      content: stringUtil.externalLink(stringUtil.stripTags(thread.content)),
      date: thread.publishedAt,
    }
  }) || {}
}

/**
 * Reviews of product, display of side menu of detail page
 *
 * @param  {Number}  pId
 * @return {Promise<Object>}
 * @public
 */

async function reviews(pId) {
  return await review.index(pId, { limit: 5 }, 2, false)
}

/**
 * Get related article & column of salon
 *
 * @param  {Number} pId
 * @param  {Number} limit
 * @return {Promise<Object>}
 * @public
 */
async function related(pId, limit = 5) {
  const [relatedArticles, relatedColumns] = await Promise.all([
    _relatedArticles(pId, limit),
    _relatedColumns(pId, limit),
  ])
  const res = relatedArticles.concat(relatedColumns)

  res.sort((a, b) => {
    return b.date - a.date
  })

  return res.slice(0, limit)
}

/**
 * Get related articles of salon
 *
 * @param  {Number} pId
 * @param  {Number} limit
 * @return {Promise<Object>}
 * @private
 */
async function _relatedArticles(pId, limit) {
  const aIds = arrayUtil.column(
    await find('fx_default', 'article_relation_product', {
      where: {
        ProductId: pId,
      },
      limit: 0,
      fields: {
        ArticleId: true,
      },
    }), 'ArticleId')

  const articles = await articleModel.find({
    where: {
      id: {
        inq: aIds,
      },
      isValid: 1,
      statusType: 1,
    },
    order: 'publishedAt DESC',
    fields: {
      id: true,
      title: true,
      publishedAt: true,
    },
    limit: limit,
  })

  return articles.map((article) => {
    return {
      title: article.title,
      img: '/img/articles/' + article.id,
      url: FX_HOST + '/navi/detail?id=' + article.id,
      date: article.publishedAt,
    }
  }) || {}
}

/**
 * Get related columns of salon
 *
 * @param  {Number} pId
 * @param  {Number} limit
 * @return {Promise<Object>}
 * @private
 */
async function _relatedColumns(pId, limit) {
  const cIds = arrayUtil.column(
    await find('fx_default', 'column_product', {
      where: {
        product_id: pId,
      },
      limit: 0,
      fields: {
        column_id: true,
      },
    }), 'column_id')

  const columns = await columnModel.find({
    where: {
      id: {
        inq: cIds,
      },
      isValid: 1,
    },
    order: 'publishedAt DESC',
    fields: {
      id: true,
      title: true,
      imageUrl1: true,
      publishedAt: true,
    },
    limit: limit,
  })

  return columns.map((column) => {
    return {
      title: column.title,
      img: column.imageUrl1,
      url: FX_HOST + 'news/detail/?id=' + column.id + '&c=1',
      date: column.publishedAt,
    }
  }) || {}
}

/**
 * Get salon from product id
 *
 * @param {Number} pId
 * @return {Promise<Object>}
 * @private
 */

async function _salon(pId) {
  return await salonModel.findOne({
    where: {
      isValid: 1,
      productId: pId,
    },
    fields: {
      id: true,
      ownerProfile: true,
    },
  })
}

/**
 * Generate salon detail object
 *
 * @param  {Number} pId
 * @param  {Object} data : product info
 * @param  {Object} salon : salon info
 * @param  {Object} extend : extends condition
 * @return {Promise<Object>}
 * @private
 */
async function _salonDetailObject(pId, data, salon, extend = {}, userId = 0) {
  const uId = data.userId
  const devUserInfo = findOne(
    'asp',
    '_info_devuser', {
      where: {
        id: user.oldDeveloperId(uId),
      },
      fields: {
        blogUrl: true,
      },
    })
  const category = ((data.categories || '').split(',')).sort((a, b) => a - b)[0] || ''
  return Object.assign(
    {}, {
      id: pId,
      salonId: salon.id,
      name: data.productName,
      category,
      outline: stringUtil.externalLink(data.productOutline),
      cartInfo: await cart.show(pId, data, userId),
      description: data.catchCopy,
      transaction: data.isTransaction ? (data.transaction || null) : null,
      userIntroduction: data.userSelfIntroduction,
      userId: uId,
      userUrl: devUserInfo.blogUrl || data.saleUrl || '',
      reviewsStars: data.reviewsStars,
      reviewsCount: data.reviewsCount,
    }, extend)
}

/**
 * Get salon Sliders
 *
 * @returns {Array}
 * @private
 */
async function _salonSliders() {
  // list ignore products
  const ignorePids = [8697, 10520, 10340]
  const salons = await salonModel.find({
    where: {
      isValid: 1,
      categoryId: {
        gte: 1,
      },
      isSlider: 1,
      productId: {
        nin: ignorePids,
      },
    },
    fields: {
      productId: true,
    },
    order: 'priority DESC',
  })
  const products = await productModel.find({
    where: {
      id: {
        inq: arrayUtil.column(salons, 'productId'),
      },
      isValid: 1,
      statusType: 1,
      typeId: 4,
      isSaleStop: 0,
    },
    fields: {
      id: true,
    },
  })
  const res = []

  salons.forEach((salon) => {
    const check = products.find(product => product.id == salon.productId) !=
      undefined
    if (check) {
      res.push({
        url: '/finance/salons/' + salon.productId,
        img: '/img/assets/pc/salons/banners/' + salon.productId +
          '_top_banner.jpg',
      })
    }
  })
  return res
}

/**
 * Get detail product object
 *
 * @returns {Object}
 * @private
 */
function _getDetailProduct(id, product) {
  const sfPrice = commonPrice.sfPrice(product)
  return {
    id,
    name: product.productName,
    description: product.catchCopy,
    isSubscription: product.isSubscription,
    isAdvising: product.isAdvising,
    company: product.isAdvising == 1 ?
      '株式会社ゴゴジャン　関東財務局(金商）第1960号' : product.corporateName,
    price: sfPrice[0].price,
    discountPrice: sfPrice[0].discountPrice,
    img: '/img/assets/pc/salons/banners/' + id + '_banner_320.jpg',
  }
}

module.exports = {
  index,
  financeSliders,
  show,
  sample,
  threads,
  reviews,
  related,
}
