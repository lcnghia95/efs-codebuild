const app = require('@server/server')
const commonProductUrl = require('@server/services/common/productUrl')

// models
const commonCampaignsModel = app.models.CommonCampaigns
const companySpreadSwapsModel = app.models.CompanySpreadSwaps
const companyReviewsModel = app.models.CompanyReviews
const companiesModel = app.models.Companies
const companyCommissionModel = app.models.CompanyCommission
const affiliateProductsModel = app.models.AffiliateProducts
const affiliateSpecialModel = app.models.AffiliateSpecial
const affiliateModel = app.models.Affiliates
const affiliateTagModel = app.models.AffiliateTag
const redirectModel = app.models.Redirect
const productModel = app.models.Products
const productCategoriesModel = app.models.ProductCategories
const masterAffiliateSearchModel = app.models.MasterAffiliateSearch

// utils
const arrayUtil = require('@ggj/utils/utils/array')
const stringUtil = app.utils.string
const objectUtil = app.utils.object
const modelUtil = require('@server/utils/model')
const timeUtil = require('@server/utils/time')


const ONE_MONTH = 2592000000

const currencyPairs = {
  USDJPY: 1,
  GBPJPY: 2,
  EURJPY: 3,
  AUDJPY: 4,
  CHFJPY: 5,
  CADJPY: 6,
  NZDJPY: 7,
  EURUSD: 8,
  GBPUSD: 9,
  NZDUSD: 10,
  AUDUSD: 11,
  USDCHF: 12,
  USDCAD: 13,
  EURGBP: 14,
  EURAUD: 15,
  EURCHF: 16,
  AUDCHF: 17,
  AUDCAD: 18,
  GBPCHF: 19,
  XAUUSD: 20,
  USDTWD: 21,
  USDMXN: 22,
  USDCNH: 23,
  XAGUSD: 24,
  USDKRW: 25,
  USDTRY: 26,
  USDHKD: 27,
  EURCAD: 28,
  OILUSD: 29,
  USDCNY: 30,
  USDINR: 31,
  EURTRY: 32,
  USDSGD: 33,
  AUDNZD: 34,
  JPN225: 35,
  ZARJPY: 36,
  EURNZD: 37,
  GBPAUD: 38,
  GBPNZD: 39,
  CADCHF: 40,
  NZDCHF: 41,
  CrudeOIL: 42,
  SGDJPY: 43,
  GBPCAD: 44,
  BTCJPY: 45,
  BTCUSD: 46,
  BTCEUR: 47,
  BTCAUD: 48,
  BTCGBP: 49,
  BTCNZD: 50,
  DJ30: 51,
  AUSSIE200: 52,
  EUROPE50: 53,
  CAC40: 54,
  DAX30: 55,
  UK100: 56,
  HK50: 57,
  NASDAQ: 58,
  SPX500: 59,
}

// https://gogojungle.backlog.jp/view/OAM-35053
// https://gogojungle.backlog.jp/view/OAM-38897
const CLOSED_AFFILIATES = '977,981,988,989'
// https://gogojungle.backlog.jp/view/OAM-35053#comment-76755867
const CLOSED_AFFILIATES_NAME = {
  977: 'FOREX.com MT4口座開設',
  981: 'FOREX.com ノックアウトオプション',
  988: 'FOREX.com × Angel Heart USDJPY MT4口座開設キャンペーン',
  989: 'FOREX.com × Estoc GBPUSD M15 MT4口座開設キャンペーン',
}

/**
 * Response data for index campaign page
 * @return {Promise<Object>}
 * @public
 */
async function campaign() {
  const data = await commonCampaignsModel.find({
    where: {
      isValid: 1,
    },
    limit: 0,
    order: 'id ASC',
  })
  const affiliateIds = arrayUtil.column(data || [], 'affiliateId')
  const companyIds = arrayUtil.column(data || [], 'companyId')

  let [affiliates, companies] = await Promise.all([
    affiliateModel.find({
      where: {
        id: {
          inq: affiliateIds,
        },
      },
      fields: {
        id: true,
        createdAt: true,
      },
    }),
    companiesModel.find({
      where: {
        id: {
          inq: companyIds,
        },
      },
      fields: {
        id: true,
        name: true,
      },
    }),
  ])

  affiliates = arrayUtil.index(affiliates || [], 'id'),
  companies = arrayUtil.index(companies || [], 'id')

  for(const record of data) {
    const aId = record.affiliateId
    const cId = record.companyId

    if (!affiliates[aId] || !record.companyId) {
      continue
    }

    if ((companies[cId]['affiliates'] || []).find(e => e.id === aId)) {
      continue
    }

    const affiliate = {
      id: aId || null,
      name: record.affiliateName || null,
      tag: record.redirectTag || null,
      cId,
      company_name: record.companyName || null,
      redirectUrl: record.redirectUrl || null,
      isNew: Date.now() - affiliates[aId].createdAt * 1000 < ONE_MONTH,
    }

    !companies[cId]['affiliates'] ?
      companies[cId]['affiliates'] = [affiliate] :
      companies[cId]['affiliates'].push(affiliate)
  }

  return companies
}

/**
 * Response data for index campaign page
 * @return {Promise<Object>}
 * @public
 */
async function newCampaign() {
  const [data, affiliateSpecials] = await Promise.all([
    masterAffiliateSearchModel.find({
      where: {
        isValid: 1,
        masterType: 1,
      },
      fields: {
        id: true,
        masterId: true,
        name: true,
      },
    }),
    affiliateSpecialModel.find({
      where: {
        isValid: 1,
      },
      fields: {
        affiliateId: true,
      },
    }),
  ])
  const affiliateSpecialIds = arrayUtil.column(affiliateSpecials || [], 'affiliateId', true)
  const dataIds = arrayUtil.column(data || [], 'masterId')
  const affiliateIds = dataIds.filter(e => !affiliateSpecialIds.includes(e))

  let affiliates = await affiliateModel.find({
    where: {
      id: {
        inq: affiliateIds,
      },
      isValid: 1,
      companyId: {
        gte: 1,
      },
    },
    fields: {
      id: true,
      createdAt: true,
      companyId: true,
      name: true,
    },
  })

  const companyIds = arrayUtil.column(affiliates || [], 'companyId')

  let [companies, redirects, affiliateTags] = await Promise.all([
    companiesModel.find({
      where: {
        id: {
          inq: companyIds,
        },
      },
      fields: {
        id: true,
        name: true,
        priority: true,
      },
      order: 'priority ASC',
    }),
    redirectModel.find({
      where: {
        masterId: {
          inq: affiliateIds,
        },
        masterType: 1,
        isValid: 1,
        and: [{
          or: [{
            internalUrl: {nin: ['', '']},
          }, {
            externalUrl: {nin: ['', '']},
          }],
        }],
      },
      fields: {
        id: true,
        masterId: true,
        internalUrl: true,
        externalUrl: true,
      },
    }),
    affiliateTagModel.find({
      where: {
        masterId: {
          inq: affiliateIds,
        },
        isValid: 1,
        class: {
          inq: ['d', 'g'],
        },
        siteId: 4,
        imageNumber: 0,
        affiliateUserId: 120001,
      },
      fields: {
        id: true,
        masterId: true,
        shortTag: true,
        redirectUrl: true,
      },
      order: 'id DESC',
    }),
  ])
  const res = []
  const curTime = Date.now()

  redirects = arrayUtil.index(redirects || [], 'masterId')
  affiliateTags = arrayUtil.index(affiliateTags || [], 'masterId')
  
  affiliates = affiliates.reduce((record, aff) => {
    const cId = aff.companyId
    const aId = aff.id
    const re = redirects[aId] || {}
    const tag = affiliateTags[aId] || {}
      
    aff.redirectUrl = tag.shortTag ? '/re/' + tag.shortTag : (tag.redirectUrl || re.internalUrl || re.externalUrl)
    aff.isNew = curTime - aff.createdAt * 1000 < ONE_MONTH,
    record[cId] ? record[cId].push(aff) : record[cId] = [aff]
    return record
  }, {})

  for(const record of companies) {
    const cId = record.id
    let affiliate = affiliates[cId]

    affiliate = affiliate.filter(e => e.redirectUrl)

    if (!(affiliate || []).length) {
      continue
    }

    res.push({
      name: record.name,
      affiliates: affiliate,
    })
  }

  return res
}

/**
 * Response data for index campaign page
 * @return {Promise<Object>}
 * @public
 */
async function campaignv2(isMobile) {
  const sql = `
    SELECT 
      a.id as affiliateId,
      b.id as companyId,
      c.id as categoryId,
      c.name as categoryName, 
      b.name as companyName, 
      a.name as affiliateName,
      a.created_at as createdAt,
      a.catch_copy as description
    FROM 
      affiliates a, 
      companies b, 
      campaign_category c
    WHERE 
      a.is_valid = 1 AND 
      b.is_valid =1 AND 
      c.is_valid =1 AND 
      a.company_id = b.id AND 
      c.id = a.campaign_category_id AND 
      a.id NOT IN 
        (
          SELECT DISTINCT affiliate_id 
          FROM affiliate_special 
          WHERE is_valid = 1 AND 
          affiliate_id NOT IN (${CLOSED_AFFILIATES})
        ) 
    ORDER BY 
      c.priority ASC, 
      b.priority ASC, 
      c.created_at ASC, 
      c.priority ASC
  `
  const data = await modelUtil.excuteQuery('master', sql)

  if (!data || !data.length) {
    return []
  }

  const affiliateIds = data.map(e => e.affiliateId)
  let [redirects, affiliateTags] = await Promise.all([
    redirectModel.find({
      where: {
        masterId: {
          inq: affiliateIds,
        },
        masterType: 1,
        isValid: 1,
        and: [{
          or: [{
            internalUrl: {nin: ['', '']},
          }, {
            externalUrl: {nin: ['', '']},
          }],
        }],
      },
      fields: {
        id: true,
        masterId: true,
        internalUrl: true,
        externalUrl: true,
      },
    }),
    affiliateTagModel.find({
      where: {
        masterId: {
          inq: affiliateIds,
        },
        isValid: 1,
        class: {
          inq: ['d', 'g'],
        },
        siteId: 4,
        imageNumber: 0,
        affiliateUserId: 120001,
      },
      fields: {
        id: true,
        masterId: true,
        shortTag: true,
        redirectUrl: true,
      },
      order: 'id DESC',
    }),
  ]),
  res = []

  const curTime = Date.now()
  redirects = arrayUtil.index(redirects || [], 'masterId')
  affiliateTags = arrayUtil.index(affiliateTags || [], 'masterId')

  for(const record of data) {
    const id = record.affiliateId
    const categoryId = record.categoryId
    const categoryName = record.categoryName
    const companyId = record.companyId
    const companyName = record.companyName
    const description = record.description
    const tag = affiliateTags[id] || {}
    const re = redirects[id] || {}

    let iCat = res.findIndex(e => e.categoryId === categoryId)
    if (!~iCat) {
      res.push({categoryId, categoryName})
      iCat = res.findIndex(e => e.categoryId === categoryId)
    }
    if (iCat > -1) {
      if (!res[iCat].companies) {
        res[iCat].companies = []
      }
      let iCom = res[iCat].companies.findIndex(e => e.companyId === companyId)
      if (!~iCom) {
        res[iCat].companies.push({companyId, companyName, affiliates: []})
        iCom = res[iCat].companies.findIndex(e => e.companyId === companyId)
      }
      if (iCom > -1) {
        const redirectUrl = tag.shortTag ? '/re/' + tag.shortTag : (tag.redirectUrl || re.internalUrl || re.externalUrl)
        if (redirectUrl) {
          res[iCat].companies[iCom].affiliates.push({
            id,
            companyId,
            name: CLOSED_AFFILIATES_NAME[id] || record.affiliateName,
            description,
            redirectUrl,
            isNew: curTime - timeUtil.toUnix(record.createdAt) * 1000 < ONE_MONTH,
          })
        }
      }
    }
  }

  if (isMobile) {
    res = res.map(cat => {
      const companies = cat.companies
      for (const i in companies) {
        if (!companies[i].affiliates.length) {
          delete cat.companies[i]
        }
      }
      cat.companies = cat.companies.filter(Boolean)
      return cat.companies.length ? cat : null
    }).filter(Boolean)
  } else {
    res = res.map(cat => {
      const companies = cat.companies
      const left = []
      const right = []
      let leftLengt = 0, rightLength = 0
      for (const i in companies) {
        if ((companies[i].affiliates || []).length) {
          if (leftLengt <= rightLength) {
            left.push(companies[i])
            leftLengt += companies[i].affiliates.length
          } else {
            right.push(companies[i])
            rightLength += companies[i].affiliates.length
          }
        }
      }
      delete cat.companies
      return Object.assign(cat, {companiesLeft: left, companiesRight: right})
    })
  }
  return res
}

/**
 * Get compare reviews data for company compare page
 *
 * @returns {Promise<Array>}
 */
async function reviews() {
  let reviews = await _reviews()
  const companies = await _getCompanies(arrayUtil.column(reviews, 'companyId'))
  const info = companies.reduce((record, company) => {
    const cId = _cleanedId(company.id)
    record[cId] = {
      id: cId,
      name: company.name,
      url: company.url,
    }
    return record
  }, {})

  reviews = reviews.reduce((record, review) => {
    const cId = _cleanedId(review.companyId)
    if (info[cId]) {
      if (!record[cId]) {
        record[cId] = {}
        record[cId]['total'] = review.reviewStars
        record[cId]['eval1'] = review.eval1
        record[cId]['eval2'] = review.eval2
        record[cId]['eval3'] = review.eval3
        record[cId]['eval4'] = review.eval4
        record[cId]['count'] = 1
      }
      else {
        record[cId]['total'] += review.reviewStars
        record[cId]['eval1'] += review.eval1
        record[cId]['eval2'] += review.eval2
        record[cId]['eval3'] += review.eval3
        record[cId]['eval4'] += review.eval4
        record[cId]['count'] += 1
      }
    }
    return record
  }, {})

  // averaging review data
  const listCIds = Object.keys(reviews)
  for (let i = 0; i < listCIds.length; i++) {
    const cId = listCIds[i]
    if (!info[cId] || !reviews[cId]['count']) {
      continue
    }
    const count = parseInt(reviews[cId]['count'])
    reviews[cId]['total'] /= count
    reviews[cId]['eval1'] /= count
    reviews[cId]['eval2'] /= count
    reviews[cId]['eval3'] /= count
    reviews[cId]['eval4'] /= count
    reviews[cId] = Object.assign(reviews[cId], (info[cId]))
  }

  return Object.keys(reviews).reduce((res, key) => {
    const review = reviews[key]
    const subData = []
    const intId = parseInt(review['id'].replace('_', ''))

    subData.push(Math.round(review['total'] * 100) / 100)
    subData.push(Math.round(review['eval1'] * 100) / 100)
    subData.push(Math.round(review['eval2'] * 100) / 100)
    subData.push(Math.round(review['eval3'] * 100) / 100)
    subData.push(Math.round(review['eval4'] * 100) / 100)
    subData.push(Math.round(review['count'] * 100) / 100)

    res.push({
      data: subData,
      id: intId,
      name: review['name'],
      url: review['url'],
    })
    return res
  }, [])
}

/**
 * Get compare spreads data for company compare page
 *
 * @returns {Promise<array>}
 */
async function spreads() {
  const spreads = {}
  const spreadSwaps = await _getSpreadSwaps()
  const companies = await _getCompanies(arrayUtil.column(spreadSwaps, 'companyId'))

  const info = companies.reduce((record, company) => {
    const cId = _cleanedId(company.id)
    record[cId] = {
      id: cId,
      name: company.name,
      url: company.url,
    }
    return record
  }, {})

  // to make sure CurrencyPair is exist
  spreadSwaps.map((record) => {
    const cId = _cleanedId(record.companyId)
    const pairId = parseInt(currencyPairs[record.currencyPair] || 0)

    if (info[cId] || pairId != 0) {
      spreads[cId]
        ? spreads[cId]['data'].push(record.spread)
        : spreads[cId] = {data: [record.spread]}

      spreads[cId] = Object.assign(
        spreads[cId],
        info[cId],
      )
    }
  })

  return Object.keys(spreads).reduce((res, key) => {
    const spread = spreads[key]
    const intId = parseInt(spread['id'].replace('_', ''))
    const sum = spread['data'].reduce((acc, cur) => {
      return acc + cur
    }, 0)

    if (sum > 0) {
      spread['data'].push(Math.round(sum * 100) / 100)
      res.push({
        data: spread['data'],
        id: intId,
        name: spread['name'],
        url: spread['url'],
      })
    }
    return res
  }, [])
}

/**
 * Get compare swaps data for company compare page
 *
 * @returns {Promise<array>}
 */
async function swaps() {
  const swaps = {}
  const spreadSwaps = await _getSpreadSwaps()
  const companies = await _getCompanies(arrayUtil.column(spreadSwaps, 'companyId'))

  const info = companies.reduce((record, company) => {
    const cId = _cleanedId(company.id)
    record[cId] = {
      id: cId,
      name: company.name,
      url: company.url,
    }
    return record
  }, {})

  // to make sure CurrencyPair is exist
  spreadSwaps.map((record) => {
    const cId = _cleanedId(record.companyId)
    const pairId = parseInt(currencyPairs[record.currencyPair] || 0)

    if (info[cId] || pairId != 0) {
      swaps[cId]
        ? swaps[cId]['data'].push(record.swap)
        : swaps[cId] = {data: [record.swap]}

      swaps[cId] = Object.assign(
        swaps[cId],
        info[cId],
      )
    }
  })

  return Object.keys(swaps).reduce((res, key) => {
    const swap = swaps[key]
    const intId = parseInt(swap['id'].replace('_', ''))
    const sum = swap['data'].reduce((acc, cur) => {
      return acc + cur
    }, 0)

    if (sum > 0) {
      swap['data'].push(Math.round(sum * 100) / 100)
      res.push({
        data: swap['data'],
        id: intId,
        name: swap['name'],
        url: swap['url'],
      })
    }
    return res
  }, [])
}

/**
 * Response data for index present page
 * @return {Promise<Object>}
 * @public
 */
async function present() {
  const affiliateSpecials = await _getAffiliateSpecial()
  const affiliateSpecialIds =  arrayUtil.column(affiliateSpecials, 'affiliateId')

  let affiliateProducts = await _getAffiliateProduct(affiliateSpecialIds)
  const affiliateProductIds = arrayUtil.unique(arrayUtil.column(affiliateProducts, 'affiliateId'))
  const productIds = arrayUtil.column(affiliateProducts, 'productId')

  let [products, productCategories, redirects, affiliates] = await Promise.all([
    _getProducts(productIds),
    _getProductCategories(productIds),
    _getRedirects(affiliateProductIds),
    _getAffiliates(affiliateProductIds),
  ])

  const productUrls = await commonProductUrl.productDetailUrls(products)
  products = arrayUtil.index(products, 'id')
  productCategories = arrayUtil.index(productCategories, 'productId')
  redirects = arrayUtil.index(redirects, 'masterId')
  affiliateProducts = arrayUtil.index(affiliateProducts, 'affiliateId')

  const res = []
  affiliates.forEach(affiliate => {
    const data = _object(
      affiliate,
      affiliateProducts,
      products,
      productUrls,
      productCategories,
      redirects,
    )
    if (data.id) {
      res.push(data)
    }
  })
  return res
}
/**
 * Response list of affiliate product except product in special affiliate
 * @param {Array} affiliateSpecialIds
 * @return {Promise<Array>}
 */
function _getAffiliateProduct(affiliateSpecialIds) {
  return affiliateProductsModel.find({
    where: {
      affiliateId:{
        nin: affiliateSpecialIds,
      },
      isValid: 1,
      productId: {
        gt: 0,
      },
    },
    fields:{
      id: true,
      productId: true,
      affiliateId: true,
    },
  })
}
/**
 * Response list of special affiliate
 * @return {Promise<Array>}
 */
function _getAffiliateSpecial() {
  return affiliateSpecialModel.find({
    where: {
      isValid: 1,
    },
    fields:{
      id: true,
      affiliateId: true,
    },
  })
}
/**
 * Response list of affiliate
 * @param {Array} affiliateProductIds
 * @return {Promise<Array>}
 */
function _getAffiliates(affiliateProductIds) {
  return affiliateModel.find({
    where:{
      id: {
        inq: affiliateProductIds,
      },
    },
    fields:{
      id: true,
      categoryId: true,
      name: true,
      pr: true,
    },
    order: 'createdAt DESC',
  })
}
/**
 * Response list of product
 * @param {Array} productIds
 * @return {Promise<Array>}
 */
function _getProducts(productIds) {
  return productModel.find({
    where:{
      id: {
        inq:productIds,
      },
    },
  })
}
/**
 * Response list of product categories with given product
 * @param {Array} productIds
 * @return {Promise<Array>}
 */
function _getProductCategories(productIds) {
  return productCategoriesModel.find({
    where:{
      isValid: 1,
      productId: {
        inq:productIds,
      },
    },
    fields:{
      productId:true,
      categoryId: true,
    },
  })
}
/**
 * Response list of redirect information
 * @param {Array} affiliateIds
 * @return {Promise<Array>}
 */
function _getRedirects(affiliateIds) {
  return redirectModel.find({
    where:{
      isValid: 1,
      masterType: 1,
      masterId:{
        inq: affiliateIds,
      },
    },
    fields:{
      masterId: true,
      internalUrl: true,
      externalUrl: true,
    },
  })
}
/**
 * Response data for index stocks page
 * @return {Promise<Object>}
 * @public
 */
async function stocks() {
  const data = await companyCommissionModel.find({
    where: {
      isValid: 1,
    },
    limit: 0,
    fields: {
      id: true,
      companyId: true,
      commissionType: true,
      executionPrice: true,
      commission: true,
    },
  })
  const companyIds = arrayUtil.column(data, 'companyId')
  const companies = arrayUtil.index(await _getCompanies(companyIds))

  const map = {
    100000: 0,
    200000: 1,
    300000: 2,
    500000: 3,
    1000000: 4,
    3000000: 5,
  }
  const transation = {}
  const date = {}

  data.forEach((record) => {
    let id = record.companyId
    const type = record.commissionType
    const company = companies[id]
    id = _cleanedId(id)
    if (company && type !== 0) {
      if (type == 1 && !transation[id]) {
        transation[id] = _init(id, company)
      }

      if (type == 2 && !date[id]) {
        date[id] = _init(id, company)
      }

      const  idx = record.executionPrice ? map[record.executionPrice] : -1
      if (idx > -1) {
        if (type == 1) {
          transation[id]['data'][idx] = record.commission
        }

        else if (type == 2) {
          date[id]['data'][idx] = record.commission
        }
      }
    }
  })

  return {
    transation: Object.values(transation) || {},
    date: Object.values(date) || {},
  }
}

/**
 * Response data for index bitcoin page
 * @return {Promise<Object>}
 * @public
 */
async function bitcoin() {
  const companies = await companiesModel.find({
    where: {
      id: {inq: [292,266,261,310,308]},
      isValid: 1,
    },
    fields: {
      id: true,
      name: true,
      appendix: true,
    },
    limit: 0,
    order: ['priority ASC', 'id ASC'],
  })

  return companies.map((company) => {
    return {
      id: company.id,
      name: company.name,
      pr: company.appendix,
    }
  })
}

/**
 * Get company detail
 * @param {Number} id
 * @return {Promise<Object>}
 * @public
 */
async function show(id) {
  const company = await companiesModel.findOne({
    where: {
      id: id,
      isValid: 1,
      statusType: 1,
    },
    fields: {
      id: true,
      name: true,
      url: true,
      appendix: true,
    },
  })

  if (!company) {
    return {}
  }

  const reviews = await companyReviewsModel.find({
    where: {
      companyId: id,
      isValid: 1,
      statusType: 1,
    },
    limit: 0,
    order: 'publishedAt DESC',
  })

  const sum = reviews.reduce((sum, review) => {
    return sum + review.reviewStars || 0
  }, 0)

  const count = reviews.length

  const avg = Math.round(sum * 2 / count) / 2

  const res = objectUtil.filter({
    id: parseInt(id),
    name: company.name || '',
    companyPr: stringUtil.convertCrlfBr(company.appendix || ''),
    url: company.url,
    avg: avg,
    tieUpData: await _tieUpdata(company.id),
    reviews: [],
  })

  res.reviews = reviews.reduce((acc, record) => {
    acc.push({
      id: record.id || 0,
      statusId: record.statusType || 0,
      userId: record.userId || 0,
      eval1: record.eval1 || 0,
      eval2: record.eval2 || 0,
      eval3: record.eval3 || 0,
      eval4: record.eval4 || 0,
      eval5: record.eval5 || 0,
      reviewStars: record.reviewStars || 0,
      title: record.title || '',
      content: record.content || '',
      publishedDate: record.publishedAt || 0,
    })
    return acc
  }, [])

  return objectUtil.filter(res) || {}
}

/**
 * Get review
 * @param {Number} cId
 * @param {Object} meta
 * @return {Promise<Object>}
 * @public
 */
async function review(cId, meta) {
  const uId = meta.userId

  if (uId == 0 || cId == 0) {
    return {}
  }

  const review = await companyReviewsModel.findOne({
    where: {
      isValid: 1,
      userId: uId,
      companyId: cId,
    },
  })

  if (!review) {
    return {
      eval1: 0,
      eval2: 0,
      eval3: 0,
      eval4: 0,
      eval5: 0,
      reviewStars:0,
      title: '',
      content: '',
    }
  }

  return {
    eval1: review.eval1 || 0,
    eval2: review.eval2 || 0,
    eval3: review.eval3 || 0,
    eval4: review.eval4 || 0,
    eval5: review.eval5 || 0,
    reviewStars: review.reviewStars || 0,
    title: review.title || '',
    content: review.content || '',
  }
}

/**
 * Post a review
 * @param {Number} cId
 * @param {Array} input
 * @return {Promise<Object>}
 * @public
 */
async function postReview(cId ,input = {}, meta) {
  input = objectUtil.filter(input)

  if (Object.keys(input).length === 0) {
    return {}
  }

  const uId = meta.userId
  const review = uId !== 0 ? await companyReviewsModel.findOne({
    where: {
      isValid: 1,
      userId: uId,
      companyId: cId,
    },
    fields: {id: true},
  }) || {id: 0} : {id: 0}

  const reviewId = review.id
  const now = Date.now()
  const data = {
    isValid: 1,
    statusType: 1,
    userId: uId,
    companyId: cId,
    publishedAt: now,
    eval1: input.eval1 || 0,
    eval2: input.eval2 || 0,
    eval3: input.eval3 || 0,
    eval4: input.eval4 || 0,
    eval5: input.eval5 || 0,
    reviewStars: input.reviewStars || 0,
    title: input.title || '',
    content: input.content || '',
  }

  const insertStatus = await companyReviewsModel.findOrCreate({
    where:{
      id: reviewId,
    },
  }, data)

  return insertStatus[1] ? insertStatus[0] : await companyReviewsModel.updateAll({
    id: reviewId,
  }, data)
}

/**
 * Get valid spread swaps data
 *
 * @returns {Promise<array>}
 * @private
 */
async function _getSpreadSwaps() {
  return await companySpreadSwapsModel.find({
    where: {
      isValid: 1,
    },
    fields: {
      id: true,
      companyId: true,
      currencyPair: true,
      spread: true,
      swap: true,
    },
    limit: 0,
  })
}

/**
 * Get companies data based on given id
 *
 * @param ids
 * @returns {Promise<array>}
 * @private
 */
async function _getCompanies(ids) {
  return await companiesModel.find({
    where: {
      id: {
        inq: ids,
      },
      isValid: 1,
      statusType: 1,
    },
    fields: {
      id: true,
      name: true,
      url: true,
    },
    limit: 0,
  })
}

/**
 * Get object for present
 * @param {Object} affiliate
 * @param {Array} affiliateProducts
 * @param {Array} products
 * @param {Array} productUrls
 * @param {Array} productCategories
 * @param {Array} redirects
 * @return {Object}
 * @private
 */
function _object(
  affiliate,
  affiliateProducts,
  products,
  productUrls,
  productCategories,
  redirects) {
  const productId = affiliateProducts[affiliate.id]['productId']
  const product = products[productId]

  if (!product) {
    return {}
  }

  const pUrl = productUrls[productId] || ''
  const affiliateOutlines = stringUtil.jpStringShorten(stringUtil.convertCrlfBr(affiliate.pr), 140)
  const productCategory = productCategories[productId] || {}
  const redirect = redirects[affiliate.id] || {}
  let rUrl = redirect.internalUrl ? redirect.internalUrl : redirect.externalUrl
  rUrl = rUrl ? rUrl + (rUrl.match(/\?/) ? '&necap' : '?necap') : ''

  return {
    id: affiliate.id,
    name: affiliate.name,
    pr: affiliateOutlines,
    pId: productId,
    productCategoryId: productCategory.categoryId || 0,
    tId: product.typeId ,
    rUrl,
    cId: affiliate.categoryId,
    pUrl,
  }
}
/**
 * Get object for present
 * @param {Array} companyIds
 * @return {Object}
 * @private
 */
function _init(id, company) {
  return {
    id: parseInt(id.replace('_','')),
    name: company.name,
    url: company.url,
    data: [
      null, null, null, null, null, null,
    ],
  }
}


/**
 * Add _ to 'id' to avoid automatic sort of Object
 * @param {Number} id
 * @return {Number}
 * @private
 */
function _cleanedId(id) {
  return id + '_'
}

/**
 * Get reviews data
 * @return {Promise<Object>}
 * @private
 */
async function _reviews() {
  return await companyReviewsModel.find({
    where: {
      isValid: 1,
      statusType: 1,
    },
    fields: {
      companyId: true,
      eval1: true,
      eval2: true,
      eval3: true,
      eval4: true,
      eval5: true,
      reviewStars: true,
      title: true,
      content: true,
    },
    limit: 0,
  })
}

/**
 * Get tie up data
 * @param {Number} cId
 * @return {Promise<Object>}
 * @private
 */
async function _tieUpdata(cId) {
  let aIds = arrayUtil.column(
    await affiliateProductsModel.find({
      where: {
        isValid: 1,
        productId: {gt: 1},
      },
      fields: {
        affiliateId: true,
      },
      limit: 0,
    }), 'affiliateId')

  aIds = arrayUtil.column(
    await affiliateModel.find({
      where: {
        isValid: 1,
        id: {inq: aIds},
        companyId: cId,
      },
      fields: {id : true},
      limit: 0,
    }), 'id')

  const data = await redirectModel.find({
    where: {
      isValid: 1,
      masterType: 1,
      masterId: {inq: aIds},
    },
    limit: 0,
  })

  const res = data.reduce((res, record) => {
    const url = record.internalUrl || record.externalUrl
    if (url) {
      res.push({
        id: record.masterId,
        linkUrl: url,
      })
    }
    return res
  }, []) || {}

  return res
}

/**
 * Get url for given companies
 */
async function companyUrls(ids) {
  return arrayUtil.index(await companiesModel.find({
    where: {
      id: { inq: ids},
    },
    fields: { id: true, url: true },
  }), 'id', 'url')
}

module.exports = {
  campaign,
  campaignv2,
  newCampaign,
  reviews,
  spreads,
  swaps,
  present,
  stocks,
  bitcoin,
  show,
  review,
  postReview,
  companyUrls,
}
