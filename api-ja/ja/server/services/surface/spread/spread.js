const app = require('@server/server')

const modelUtil = require('@server/utils/model')
const timeUtil = app.utils.time
const objectUtil = app.utils.object
const arrayUtil = require('@ggj/utils/utils/array')

const companiesModel = app.models.Companies
const brokersModel = app.models.Brokers

/**
 * get list of economics
 *
 * @param {object} input
 * @return {object}
 */
async function market(limit) {
  const where = {
    CheckDate: {
      // TODO verify logic here
      // CheckDate in `fx_default`.`economic` has time zone +9
      // gte compare date value in datebase with GMT
      gte: Date.now() + 3600000 * 9,
    },
  }
  const fields = {
    CreatedDate: false,
    UpdatedDate: false,
    IsTarget: false,
  }
  const economics = await _getEconomics(limit, where, fields)

  return economics.reduce((acc, economic) => {
    const date = timeUtil.toUnix(timeUtil.sqlDate(economic.CheckDate, 'YYYY-MM-DD'))
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(_generateEconomic(economic))
    return acc
  }, {})
}

/**
 * get list of economics from 7 days ago -> now
 *
 * @return {array}
 */
async function marketDetail() {
  const now = Date.now() + 3600000 * 9

  const fields = {
    ID: true,
    CheckDate: true,
    Name: true,
  }
  const conditions = {
    and: [{
      CheckDate: {
        lt: now,
      },
    }, {
      CheckDate: {
        gt: timeUtil.addDays(-7, now),
      },
    }],
  }
  const economics = await _getEconomics(0, conditions, fields)

  return economics.map((economic, index) => ({
    x: new Date(economic.CheckDate).getTime(),
    title: index + 1,
    name: economic.Name,
    id: economic.ID,
  }))
}

/**
 * show company
 *
 * @param {number} companyId
 * @return {array|object} (object if has companyId)
 */
async function company(companyId) {
  const companyIds = companyId ? [companyId] : await _getCompanyIds()
  const companies = await _getCompanies(companyIds)

  if (!companies.length) {
    return companyId ? {} : []
  }

  return companyId ? _updateSpecialLink(companies[0]) : companies
}

/**
 * get realtime companies
 *
 * @return {array}
 */
async function realtime() {
  const companyIds = await brokersModel.find({
    where: {
      isValid: 1,
      isDomestic: 1,
    },
    fields: {
      id: true,
    },
  }).map(companyId => companyId['id'])

  // companyIds = [114, 47, 24, 166, 117, 149, 203, 148, 268],
  if (!companyIds.length) {
    return []
  }

  const denies = [193, 265, 273]

  let [comparisons, companies] = await Promise.all([
    _getComparison([0, 1], companyIds),
    _getCompanies(companyIds),
  ])

  companies = arrayUtil.index(companies, 'id')

  const res = comparisons.map(comparison => {
    if (!companies[comparison.TraderID]) {
      return null
    }

    const newObjCompany = _updateSpecialLink(companies[comparison.TraderID])

    return {
      id: newObjCompany.id,
      name: newObjCompany.name,
      link: newObjCompany.link,
      url: denies.indexOf(newObjCompany.id) == -1 ? '/company' : null,
      newUrl: newObjCompany.url,
      real: comparison.IsReal || 0,
    }
  })

  return res.filter(company => company != null)
}

/**
 * get chart
 *
 * @return {}
 */
async function chart() {
  return {}
}

/**
 * get companies
 *
 * @param {array} companyIds
 * @return {array}
 */
async function _getCompanies(companyIds) {
  return await companiesModel.find({
    where: {
      isValid: 1,
      statusType: 1,
      id: {
        inq: companyIds,
      },
    },
    fields: {
      id: true,
      name: true,
      url: true,
    },
  })
}

/**
 * get comparison
 *
 * @param {array} IsValid
 * @param {array} TraderIds
 * @return {array}
 */
async function _getComparison(IsValid, TraderIDs) {
  return await modelUtil.find('fx_default', 'spread_comparison', {
    where: objectUtil.nullFilter({
      IsValid: {
        inq: IsValid,
      },
      TraderID: TraderIDs ? {
        inq: TraderIDs,
      } : null,
    }),
    fields: {
      CreatedDate: false,
      UpdatedDate: false,
      IsValid: false,
      SortNo: false,
    },
    order: 'SortNo ASC',
  })
}

/**
 * get companies
 *
 * @param {number} companyId
 * @return {array}
 */
async function _getCompanyIds() {
  const comparison = await _getComparison([1], undefined)
  return arrayUtil.column(comparison, 'TraderID', true)
}

/**
 * update special link company
 *
 * @param {object} company
 * @return {object}
 */
function _updateSpecialLink(company) {
  const obj = {
    117: 'https://fx-on.com/re/?i=N0YHh2kGF3DorPxAQW8UPAUroLcySbXcI3w%2FVsqyuJ4',
    203: 'https://fx-on.com/re/?i=RxrArsy0B2MoRnv5au3teazTnbUdChI95K6swqa03cw',
    114: 'https://fx-on.com/re/?i=NjAu2YhPbJXfnClNFNHr%2Fcamj9M7NgiqBESrM3cOfFo',
    148: 'https://fx-on.com/re/?i=acKx0A7zCIM1JONRMi7GIkhxncpT3lKQchTA71ERPqA',
    24: 'https://fx-on.com/re/?i=Ae2UhVxDmoE6jlxt2pVG4IcTs3YZzJ5%2Fe8JTBmUXiZg',
    166: 'https://fx-on.com/re/?i=ZaL1hejUe9bVLH1L9VxJQg2wElcgCr30erfxLtPU4Nk',
    265: 'https://fx-on.com/re/?i=cpyM0oQKVtajSGe%2BSeZstmxBqlmQgpOEb6j62HzYl3I',
    268: 'https://fx-on.com/re/?i=DTMoWIsdoSNQ27Vsyrz32imctqwjb7vMsmhaF2AZho4',
  }
  return {
    id: company.id,
    name: company.name,
    link: obj[company.id] || null,
    url: company.url,
  }
}

/**
 * generate economic object
 *
 * @param {object} economic
 * @return {object}
 */
function _generateEconomic(economic) {
  return {
    ID: economic.ID,
    CheckDate: timeUtil.toUnix(economic.CheckDate),
    DayOfWeek: economic.DayOfWeek.toString(),
    Country: economic.Country,
    Name: economic.Name,
    Value: economic.Value.toString(),
    LastTime: economic.LastTime,
    ThisTime: economic.ThisTime,
    Result: economic.Result,
    date: timeUtil.toUnix(timeUtil.sqlDate(economic.CheckDate, 'YYYY-MM-DD')),
  }
}

/**
 * get economics
 *
 * @param {number} limit
 * @param {object} where
 * @param {object} fields
 * @return {array}
 */
async function _getEconomics(limit, where, fields) {
  return await modelUtil.find('fx_default', 'economic', {
    where,
    fields,
    limit,
    order: 'CheckDate ASC',
  })
}

module.exports = {
  market,
  marketDetail,
  company,
  chart,
  realtime,
}
