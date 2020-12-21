const COMMON = {
  YES: 1,
  NO: 0
}
const HTTP_CODE = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401
}
const FIELDS = {
  STATUS_TYPE: 'statusType',
  PRODUCT_ID: 'productId',
  TYPE_ID: 'typeId',
  IMAGE: 'image',
  IS_SUBSCRIPTION: 'isSubscription',
  USER_ID: 'userId',
  ARTICLE_ID: 'articleId',
  SERIES_ID: 'seriesId',
  PRODUCT_TYPE_ID: 'productTypeId',
}
const PRODUCT = {
  TYPE: {
    SYSTEM_TRADE: 1,
    INDICATOR: 2,
    NAVI: 3,
    MAIL_MAGAZINE: 4,
    VIDEO: 5,
    EBOOK: 6,
    PREMIER_MEMBER: 7,
    AD: 8,
    SEMINAR: 9,
    SALE: 10,
    INVESTMENT_CROWDSOURCING: 11,
    SHARE_ROOM: 13,
    OPTION: 18,
    EVENT: 19,
    SET_PRODUCT_70: 70,
    SET_PRODUCT_71: 71,
    SET_PRODUCT_72: 72,
  },
  STATUS_TYPE: {
    NO_POSTING: 0,
    POSTING: 1,
    POSTING_BEFORE_SALE: 2
  },
  DISPLAY_STATUS: {
    // 掲載無効
    NO_POSTING: 0,
    // 販売中
    ON_SALE: 1,
    // 販売停止
    STOP_SALE: 2,
    // 表示中
    DISPLAYING: 21,
    // 認証中
    AUTHENTICATING: 22,
    // 非表示
    NO_DISPLAY: 23,
    // 商品ファイル未UP
    BEFORE_UP_PRODUCT: 24
  },
  IMAGE_CATEGORY_TYPE: {
    // 会員画像
    MEMBER: 1,
    // マイプロフィールバナー画像
    MY_PROFILE_BANNER: 2,
    // 商品画像
    PRODUCT: 3,
    // 商品バナー画像
    PRODUCT_BANNER: 4,
    // 商品概要挿入画像
    PRODUT_OVERVIEW_INSERT: 5,
    // アフィリエイトバナー画像
    AFFILIATE_BANNER: 6,
    // トップインパクト広告画像
    TOP_IMPACT_ADVERTISEMENT: 7,
    // メールマガジン添付画像
    EMAIL_MAGAZINE_ATTACHMENT: 8,
    // プロモーション添付画像
    PROMOTION_ATTACHMENT: 9,
    // 動画バナー画像
    VIDEO_BANNER: 10,
    // クラウドソーシング投稿画像
    CROWDSOURCING_POST: 11,
    // コミュニティ投稿画像
    COMMUNITY_POST: 12,
    // よくある質問挿入画像
    COMMON_QUESTION_INSERT: 13,
    // トップスライダー画像
    TOP_SLIDER: 14,
    // 商品スライダー画像
    PRODUCT_SLIDER: 15,
    // 商品オーナー画像
    PRODUCT_OWNER: 16,
    // 商品ウェルカム画像
    PRODUCT_WELCOME: 17,
    // 投資ナビ記事画像
    INVESTMENT_NAVIGATION_ARTICLE: 18,
    // 会社バナー画像
    COMPANY_BANNER: 19,
    // 商品バックテスト画像
    PRODUCT_BACK_TEST: 20,
    // 商品カード画像
    PRODUCT_CARD: 21,
    // コンテンツ画像
    CONTENT: 23,
    // ご利用ガイド画像
    USAGE_GUIDE: 24,
    // お知らせ画像
    NOTIFICATION: 25,
    // 商品購入者向けメルマガ画像
    EMAIL_MAGAZINE_FOR_PURCHASING: 26,
    // Share room
    SHARE_ROOM: 29,
  }
}

const ARTICLE = {
  STATUS_TYPE: {
    //非公開
    NO_PUBLIC: 0,
    //公開
    PUBLIC: 1
  }
}

const CATEGORY = {
  FX: 1,
  STOCK: 2,
  BITCOIN: 3
}

const MY_PAGE = {
  DOWNLOAD_PRODUCTS: [
    PRODUCT.TYPE.SYSTEM_TRADE,
    PRODUCT.TYPE.INDICATOR,
    PRODUCT.TYPE.EBOOK,
    PRODUCT.TYPE.SEMINAR,
    PRODUCT.TYPE.SHARE_ROOM,
    PRODUCT.TYPE.SET_PRODUCT_70,
    PRODUCT.TYPE.SET_PRODUCT_71,
  ]
}

const PRICE = {
  STATUS_TYPE: {
    NO_DISPLAY: 0,
    DISPLAY: 1,
  }
}

const UPDATABLE = {
  PRODUCT_STATUS: [
    PRODUCT.DISPLAY_STATUS.NO_POSTING,
    PRODUCT.DISPLAY_STATUS.ON_SALE,
    PRODUCT.DISPLAY_STATUS.STOP_SALE,
  ],
  PRODUCT_TYPE_IDS: [
    PRODUCT.TYPE.INDICATOR,
    PRODUCT.TYPE.NAVI,
    PRODUCT.TYPE.MAIL_MAGAZINE,
    PRODUCT.TYPE.EBOOK,
    PRODUCT.TYPE.SEMINAR,
    PRODUCT.TYPE.SALE,
    PRODUCT.TYPE.EVENT,
    PRODUCT.TYPE.SET_PRODUCT_70,
    PRODUCT.TYPE.SET_PRODUCT_71,
    PRODUCT.TYPE.SET_PRODUCT_72
  ],
  NAVI_STATUS: [
    ARTICLE.STATUS_TYPE.NO_PUBLIC,
    ARTICLE.STATUS_TYPE.PUBLIC
  ]
}

// https://gogojungle.backlog.jp/view/OAM-23498
const OAM23498 = {
  BOUGHT_ARTICLES: [21308, 21309],
  SEE_SERIES: 1072
}

const consts = {
  PRODUCT,
  MY_PAGE,
  COMMON,
  CATEGORY,
  PRICE,
  UPDATABLE,
  ARTICLE,
  FIELDS,
  HTTP_CODE,
  OAM23498
}

global.consts = consts
module.exports = {}
