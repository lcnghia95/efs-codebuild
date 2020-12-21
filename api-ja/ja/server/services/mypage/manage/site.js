const app = require('@server/server')

const { orderBy } = require('lodash')

// Models
const affiliateSitesModel = app.models.AffiliateSites
const sitesModel = app.models.Sites
const affiliateModel = app.models.Affiliates


// Utils
const arrayUtil = require('@ggj/utils/utils/array')
const pagingUtil = app.utils.paging

// one week 60*60*24*7*1000 =  604800000
const ONE_WEEK_AGO = Date.now() - 604800000

/**
 * get sites apply to affiliate with paging
 * @param {object} input
 * return object
 */
async function sites(input) {
  const page = input.page || 1
  const offset = pagingUtil.getOffsetCondition(page, input.limit)
  const limit = parseInt(offset.limit)
  const skip = offset.skip
  let sites = await _getAffiliateSites(input)
  const total = sites.length

  // when download all limit = 0, only slice when get by paging
  if (limit != 0) {
    sites = sites.slice(skip, limit * page)
  }

  return pagingUtil.addPagingInformation(sites, page, total, limit)
}

/**
 * get sites apply to affiliate
 * @param {object} input
 * return array
 */
async function _getAffiliateSites(input) {
  const [affiliates, affiliateSites] = await Promise.all([
      _getAffiliates(input),
      affiliateSitesModel.find(_generateConditions(input)),
    ])
    const siteIds = arrayUtil.column(affiliateSites, 'siteId', true)
    const sites = await _getSites(siteIds, input.keywords)

  return _sitesObject(affiliates, affiliateSites, sites)
}

/**
 * get sitesModel data
 * @param {array} siteIds
 * @param {string} keywords
 * return array
 */
async function _getSites(siteIds, keywords) {
  const conditions = {
    where: {
      isValid: 1,
      isAffiliate: 1,
      id: {
        inq: siteIds,
      },
    },
    order: 'updatedAt DESC',
    fields: {
      id: true,
      siteUrl: true,
      updatedAt: true,
    },
  }

  if (keywords) {
    // copy url from browser will auto add "/" at the end
    // remove "/ at the end of url
    keywords = keywords.trim().replace(/\/$/, '')

    const urlCondition = {
      siteUrl: {
        like: '%' + keywords + '%',
      },
    }
    conditions.where = Object.assign(conditions.where, urlCondition)
  }

  return await sitesModel.find(conditions)
}

/**
 * get status of affiliate  0:none 1:NEW、2:UPDATE
 * @param {object} affiliateSite
 * return number
 */
function _getStatus(affiliateSite) {
  let status = 0
  if (affiliateSite.createdAt * 1000 > ONE_WEEK_AGO) {
    status = 1
  } else if (affiliateSite.updatedAt * 1000 > ONE_WEEK_AGO) {
    status = 2
  }

  return status
}

/**
 * generate data response
 * @param {array} affiliates
 * @param {array} affiliateSites
 * @param {array} sites
 * return object
 */
function _sitesObject(affiliates, affiliateSites, sites) {
  const objAffiliates = arrayUtil.index(affiliates, 'id')
    const objSites = arrayUtil.index(sites, 'id')

    const res = affiliateSites.reduce((acc, affiliate) => {
      if (!objSites[affiliate.siteId] || !objAffiliates[affiliate.affiliateId]) {
        return acc
      }
      const obj = {
        id: affiliate.id,
        siteId: objSites[affiliate.siteId].id,
        serviceId: affiliate.affiliateId,
        affiliateName: objAffiliates[affiliate.affiliateId].name || '',
        url: objSites[affiliate.siteId].siteUrl || '',
        statusType: affiliate.statusType || 0,
        affiliateReward: affiliate.affiliateReward || 0,
        status: _getStatus(affiliate),
        siteUpdatedAt: objSites[affiliate.siteId].updatedAt,
      }

      acc.push(obj)
      return acc
    }, [])

  return orderBy(res, ['siteUpdatedAt'], ['desc'])
}

/**
 * get data from affiliateModel
 * @param {object} input
 * return array
 */
async function _getAffiliates(input) {
  return await affiliateModel.find({
    where: {
      id: input.serviceId ? parseInt(input.serviceId) : {
        inq: input.serviceIds || [],
      },
      isValid: {
        inq: [0, 1],
      },
    },
    fields: {
      id: true,
      name: true,
    },
  })
}

/**
 * generate condition to find affiliate_sites
 * @param {object} input
 * return object
 */
function _generateConditions(input) {
  const status = input.status || 0
  const statusType = input.statusType

  const conditions = {
      where: {
        affiliateId: input.serviceId ? parseInt(input.serviceId) : {
          inq: input.serviceIds || [],
        },
        isValid: 1,
        statusType,
      },
      order: 'id DESC',
      fields: {
        id: true,
        siteId: true,
        statusType: true,
        affiliateReward: true,
        affiliateId: true,
        createdAt: true,
        updatedAt: true,
      },
    }
  let date = {}
  if (status == 1) {
    date = {
      createdAt: {
        gte: ONE_WEEK_AGO,
      },
    }
  } else if (status == 2) {
    date = {
      createdAt: {
        lte: ONE_WEEK_AGO,
      },
      updatedAt: {
        gte: ONE_WEEK_AGO,
      },
    }
  }
  conditions.where = Object.assign(conditions.where, date)

  return conditions
}


module.exports = {
  sites,
}
