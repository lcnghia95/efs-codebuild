const app = require('@server/server')

const sitesModel = app.models.Sites
const masterSearchModel = app.models.MasterAffiliateSearch
const specialRewardsModel = app.models.SpecialRewards
const affiliateSitesModel = app.models.AffiliateSites
const affiliateSpecialModel = app.models.AffiliateSpecial
const articlesModel = app.models.Articles

const arrayUtil = require('@ggj/utils/utils/array')

const NOT_SUPPORT_LANGS = [2, 3, 4]

async function index(query, metaInfo) {
  const siteId = query.siteId || 0
  const {langType, userId} = metaInfo
  const isGetAff = !NOT_SUPPORT_LANGS.includes(langType)

  const [site, special] = await Promise.all([
    sitesModel.findOne({
      where: {
        id: siteId,
        isValid: 1,
        isAffiliate: 1,
        userId,
        statusType: 1,
      },
      fields: {
        id: true,
        siteUrl: true,
      },
    }),
    isGetAff ? affiliateSpecialModel.find({
      where: {
        isValid: 1,
        siteId: {
          neq: siteId,
        },
      },
      fields: {
        affiliateId: true,
      },
    }) : [],
  ])

  if (!site) {
    return []
  }
  const keyword = query.keywords
  const fields = 'id,typeId,categories,masterType,masterId,name,price,affiliateMargin,affiliateReward,isCampaign,registeredAt'
  const where = {
    isValid: 1,
    masterType: 2,
    languages: langType,
  }
  const ignoreMIds = special.map(e => e.affiliateId).filter((v, i, a) => a.indexOf(v) === i)
  const where2 = {
    masterType: 1,
    masterId: {
      nin: ignoreMIds,
    },
    affiliateTypeId: {
      gte: 1,
    },
    languages: 1,
    isValid: 1,
  }
  
  if (keyword) {
    where.masterId = '%keyword%'
    where.name = '%keyword%'
    where2.masterId = '%keyword%'
    where2.name = '%keyword%'
  }
  let [products, specialRewards, affiliates, affiliateSites] = await Promise.all([
    masterSearchModel.find({
      where,
      fields: app.utils.query.fields(fields),
    }),
    rewards(userId),
    isGetAff ? masterSearchModel.find({
      where: where2,
      fields: app.utils.query.fields(fields),
    }) : [],
    isGetAff ? getAffiliateSites(siteId) : [],
  ])
  specialRewards = arrayUtil.index(specialRewards, 'productId')
  affiliateSites = arrayUtil.index(affiliateSites, 'affiliateId')

  const articlePids = products.filter(e => e.typeId == 3).map(e => e.masterId)
  let articles = await articlesModel.find({
    where: {
      isValid: 1,
      statusType: 1,
      productId: {
        inq: articlePids,
      },
    },
    fields: {
      id: true,
      productId: true,
    },
  })
  articles = arrayUtil.index(articles, 'productId')
  const masterRecords = products.concat(affiliates)
  const res = []
  for (const record of masterRecords) {
    const {masterId, masterType, price} = record
    let affiliateMargin = record.affiliateMargin, 
      affiliateReward = record.affiliateReward,
      specialRate = 0
    if (masterType == 2) {
      const rewardRecord = specialRewards[masterId] || {}
      affiliateMargin = Math.max(rewardRecord.rate || 0, affiliateMargin)
      affiliateReward = Math.round((affiliateMargin * price ) / 100)
      specialRate = rewardRecord.rate ? 1 : 0
      if (articles[masterId]) {
        record.articleId = articles[masterId].id
      }
    } else if (masterType == 1) {
      const affSiteRecord = affiliateSites[masterId] || {}
      affiliateReward = affSiteRecord.affiliateReward || affiliateReward
    }
    record.affiliateMargin = affiliateMargin
    record.affiliateReward = affiliateReward
    record.specialRate = specialRate
    record.date = record.registeredAt
    delete record.registeredAt
    res.push(record)
  }

  return res
}

async function getAffiliateSites(siteId) {
  return affiliateSitesModel.find({
    where: {
      isValid: 1,
      statusType: 1,
      siteId,
    },
    fields: app.utils.query.fields('affiliateId,affiliateReward'),
    order: ['id DESC'],
  })
}

async function rewards(userId) {
  return specialRewardsModel.find({
    where: {
      isValid: 1,
      userId,
    },
    fields: app.utils.query.fields('productId,rate'),
  })
}

module.exports = {
  index,
}