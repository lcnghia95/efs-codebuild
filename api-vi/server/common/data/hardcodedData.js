// TODO: hieunt - apply monorepo here
exports.SYSTEMTRADE_SPIDER_CHART = Object.freeze({
  PROFIT_FACTOR_RANGE: [0, 2, 2.5, 3, 5, 5],
  WINNING_RATE_RANGE: [0, 30, 45, 50, 65, 70],
  PERIOD_RANGE: [0, 180, 360, 1440, 1800, 1800],
  TRANSACTION_COUNT_RANGE: [0, 100, 200, 300, 500, 500],
  RISK_RERTURN_RATE_RANGE: [-100, 2, 4, 7.5, 10, 10],
})
exports.SALON_PRODUCT_IDS = [7650, 8812, 9154, 8592, 10520, 8697, 10340, 8955, 14150, 14359, 16211, 21105, 22458, 22425, 23136, 10032, 19108]
exports.TIED_UP_PRODUCT = Object.freeze( { 15153: 18725 })
exports.TIED_UP_PRODUCT_PRICES = Object.freeze({
  52569: Object.freeze({
    TIED_UP_PRICE_ID: 48366,
    PID: 15153,
    TIED_UP_PID: 18725,
  }),
})
exports.TOP_SALE_CHANGE_LINK = Object.freeze({
  15153: '/post/46/15418',
  18725: '/post/46/15418',
})
exports.SALON_EXPENSE_FEE = 1000
exports.IGNORE_PRODUCTS_MAP = Object.freeze({
  110001: [8030,8031,11882],
})
exports.DISPLAYPRODUCT_TYPE_IDS = [1, 2, 3, 4, 5, 6, 8, 10, 19, 70, 71]
exports.SYSTEMTRADE_CATEGORY_IDS = [1, 3, 18]
exports.SYSTEMTRADE_PRODUCT_URL = Object.freeze({
  1: '/systemtrade/fx/',
  3: '/systemtrade/stocks/',
  18: '/systemtrade/bitcoin/',
})
exports.SYSTEMTRADE_ECONOMIC = Object.freeze({
  Flags: ['JP', 'GB', 'US', 'AU', 'DE', 'CH', 'EU', 'NZ', 'ZA', 'CA', 'FR'],
  AllEconomicValue: [1,2],
})
exports.SEARCH_ENGINE = [
  'google.co.jp',
  'google.com',
  'yahoo.co.jp',
  'msn.com',
  'baidu.com',
]

exports.DISCOUNT_TYPE_COUNT = 0
exports.DISCOUNT_TYPE_TOTAL_PRICE = 1

// https://gogojungle.backlog.jp/view/OAM-44365
exports.SPECIAL_PRODUCTS = [25455]

exports.DOWNLOAD_PRODUCT_TYPE_IDS = [1, 2, 6, 9, 13, 70, 71]
exports.TOOLS_TYPE_ID = [2, 6, 9, 10, 13, 70, 71, 72]
exports.EBOOK_TYPE_IDS = [2, 6, 9, 10, 13]
exports.TYPE_IDS = [1, 2, 3, 4, 5, 6, 8, 9, 13, 19, 70, 71, 72]
exports.ALLOW_CONTRACT_TYPE_IDS = [2, 3, 5, 6, 9, 13, 19, 70, 71, 72]