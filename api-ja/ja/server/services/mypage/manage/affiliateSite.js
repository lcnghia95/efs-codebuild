const app = require('@server/server')

// Models
const affiliateSiteModel = app.models.AffiliateSites
const affiliateModel = app.models.Affiliates
const siteModel = app.models.Sites
const userModel = app.models.Users

// Utils
const arrayUtil = require('@ggj/utils/utils/array')
const commonEmailV1 = require('@@services/common/emailv1')
const commonUser = require('@services/common/user')
const numberUlti = require('@@server/utils/number')
const GOGO_ADDRESS = 'info@gogojungle.co.jp'

/**
 * Update `master`.`affiliate_sites`
 * @param {Number} id
 * @param {Object} input
 * @returns {Promise<Object>}
 * @public
 */
async function update(userId, id, input) {
  if (!id) {
    return {}
  }

  input.affiliateReward = numberUlti.positiveInt32(input.affiliateReward)
  const user = await _user(userId)
    const affiliates = await _affiliates(user)
    const preUpdate = await _affiliateSite(affiliates, id, input.siteId)
    const preUpdateClone = _clone(preUpdate)

  input.id = id
  if (!_canUpdate(preUpdate, input)) {
    return {}
  }

  preUpdate.statusType = input.statusType
  preUpdate.affiliateReward = input.affiliateReward
  preUpdate.approvedAt = Date.now()
  preUpdate.save()

  input.affiliateId = preUpdate.affiliateId
  _sendMailToGogo(user, [input])
  _sendMailToUsers(
    {
      [id]: preUpdateClone,
    }, {
      [id]: input,
    },
    affiliates,
  )

  return { count: 1 }
}

/**
 * Bulk update `master`.`affiliate_sites`
 * @param {Number} userId
 * @param {Array} input
 * @returns {Promise<Object>}
 * @public
 */
async function bulkUpdate(userId, input) {
  if (!input.length) {
    return {}
  }
  const siteIds = arrayUtil.attributeArray(input, 'siteId', true)
  input = arrayUtil.index(input)
  const user = await _user(userId)
  const affiliates = await _affiliates(user)
  const preUpdateData = await _affiliateSites(affiliates, Object.keys(input), siteIds)
  const preUpdateClone = _clone(preUpdateData)
  let count = 0
  const updated = []
  const failed = []

  await Promise.all(
    Object.keys(preUpdateData).map(async id => {
      input[id].affiliateReward = numberUlti.positiveInt32(input[id].affiliateReward)
      input[id].affiliateId = preUpdateData[id].affiliateId
      if (_canUpdate(preUpdateData[id], input[id])) {
        preUpdateData[id].affiliateReward = input[id].affiliateReward
        preUpdateData[id].statusType = input[id].statusType
        preUpdateData[id].approvedAt = Date.now()
        await preUpdateData[id].save()
        count ++
        updated.push(input[id])
      } else {
        failed.push(id)
      }
    }),
  )

  _sendMailToGogo(user, updated)
  _sendMailToUsers(preUpdateClone, arrayUtil.index(updated), affiliates)

  return { count, failed }
}

/**
 * Get records from `master`.`affiliate_sites` by ids
 * @param {Object} affiliates
 * @returns {Promise<Object>}
 * @private
 */
async function _affiliateSites(affiliates, ids, siteIds = []) {
  if (!affiliates) {
    return []
  }

  const affiliateSites = await affiliateSiteModel.find({
    where: {
      id: {
        inq: ids,
      },
      // records is correspond with `privacy`.`users`.company_id
      affiliateId: {
        inq: Object.keys(affiliates),
      },
      siteId: {
        inq: siteIds,
      },
      isValid: 1,
    },
    fields: {
      id: true,
      affiliateReward: true,
      statusType: true,
      affiliateId: true,
      siteId: true,
      approvedAt: true,
    },
  }) || []

  return arrayUtil.index(affiliateSites)
}

/**
 * Get record from `master`.`affiliate_sites` by id
 * @param {Object} affiliates
 * @param {Number} id
 * @returns {Object}
 * @private
 */
async function _affiliateSite(affiliates, id, siteId) {
  const affiliateSites = await _affiliateSites(affiliates, [id], [siteId])
  return affiliateSites[id] || {}
}

/**
 * Get marchant user infomation
 */
async function _user(id) {
  return await userModel.findOne({
    where: {
      id,
      isMarchant: 1,
    },
    fields: {
      id: true,
      companyId: true,
    },
  })
}

/**
 * get affiliates based on user
 * @param {Object} user
 * @return {Promise<Array>}
 * @private
 */
async function _affiliates(user) {
  const affiliates = await affiliateModel.find({
    where: {
      marchantCompanyId: user.companyId,
      isValid: {
        inq: [0, 1],
      },
    },
    fields: {
      id: true,
      name: true,
    },
  }) || []
  return arrayUtil.index(affiliates)
}

/**
 * Check if new data can update or not
 * @param {Object} preUpdate // affiliate_sites instance
 * @param {Object} input // input from user
 * @param {Array} excepts
 * @returns {Boolean}
 * @private
 */
function _canUpdate(preUpdate, input, excepts = ['approvedAt']) {
  if (!preUpdate) {
    return false
  }

  // validate input
  if (
    typeof input.affiliateReward !== 'number' ||
    typeof input.statusType !== 'number' ||
    typeof input.siteId !== 'number' ||
    typeof input.id !== 'number' ||
    input.statusType < 0 ||
    input.statusType > 2
  ) {
    return false
  }

  // validate site_id input
  if (preUpdate.siteId !== input.siteId) {
    return false
  }

  let isDiff = false
  // Do not update data when input data is the same with data in db
  Object.keys(input).forEach(key => {
    if (
      !excepts.includes(key) &&
      typeof preUpdate[key] !== 'undefined' &&
      preUpdate[key] !== input[key]
    ) {
      isDiff = true
      return
    }
  })
  return isDiff
}

/**
 * Send email notify to gogojungle
 * @param {Object} user
 * @param {Array} input
 */
async function _sendMailToGogo(user, input) {
  input = arrayUtil.groupArray(input, 'statusType')
  const approvedList = input[1] || []
    const unApprovedList = input[2] || []
    const mailData = {
      user_id: user.id || 0,
      company_id: user.companyId || 0,
    }

  if (approvedList.length) {
    mailData.site_data = approvedList.reduce((acc, item) => {
      acc += `\t${item.id}: \t${item.url}\r\n`
      return acc
    }, '')
    mailData.affiliate_id = arrayUtil.attributeArray(
      approvedList,
      'affiliateId',
      true).join(', ')

    commonEmailV1.sendNow(GOGO_ADDRESS, mailData, 40)
  }

  if (unApprovedList.length) {
    mailData.site_data = unApprovedList.reduce((acc, item) => {
      acc += `\t${item.id}: \t${item.url}\r\n`
      return acc
    }, '')
    mailData.affiliate_id = arrayUtil.attributeArray(
      unApprovedList,
      'affiliateId',
      true).join(', ')

    commonEmailV1.sendNow(GOGO_ADDRESS, mailData, 41)
  }
}

/**
 * Send email notify to site owners
 * @param {Object} preUpdateData // indexed by id
 * @param {Object} updateData
 * @param {Object} affiliates
 */
async function _sendMailToUsers(preUpdateData, updateData, affiliates) {
  const siteIds = arrayUtil.column(Object.values(updateData), 'siteId')
  let sites = await siteModel.find({
      where: {
        id: {inq: siteIds},
      },
      fields: {id: true, siteUrl: true, userId: true},
    })
    const users = arrayUtil.index(await commonUser.getUsers(
      arrayUtil.column(sites, 'userId'),
      {id: true, lastName: true, firstName: true, mailAddress: true, languages: true},
    ))

  sites = arrayUtil.index(sites)
  Object.keys(preUpdateData).forEach(key => {
    const preUpdateRecord = preUpdateData[key]
      const updateRecord = updateData[key]
    if (!updateRecord) {
      return
    }

    // need to confirm approvedAt
    // if this record hasn't updated before, send email
    if (!preUpdateRecord.approvedAt || preUpdateRecord.approvedAt == '0000-00-00 00:00:00') {
      const site = sites[preUpdateRecord.siteId] || {}
        const user = users[site.userId] || {}
        const mailContent = {
          site_url: site.siteUrl,
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          affiliate_name: (affiliates[preUpdateRecord.affiliateId] || {}).name,
        }

      if (updateRecord.statusType === 1) {
        commonEmailV1.sendNowByUserId(user.id, mailContent, 31, user.languages)
      } else if (updateRecord.statusType === 2) {
        commonEmailV1.sendNowByUserId(user.id, mailContent, 32, user.languages)
      }
    }
  })
}

/**
 * Clone javascript object
 * @param {Object|Array} data
 */
function _clone(data) {
  // consider memory usage and performance
  return JSON.parse(JSON.stringify(data))
}

module.exports = {
  update,
  bulkUpdate,
}
