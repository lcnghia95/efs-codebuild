const app = require('@server/server')
const affiliateModel = app.models.Affiliates
const affiliateCompleteModel = app.models.AffiliateComplete
const arrayUtil = require('@ggj/utils/utils/array')
/**
 * Get affiliates record using id
 *
 * @param {Number} id
 * @param {Object|null} fields
 * @return {Promise<Object>}
 */
async function getAffiliateById(id, fields) {
  const affiliate = await affiliateModel.findOne({
    where: {
      id,
      isValid: 1,
    },
    fields,
  }) || {}
  return affiliate
}

/**
 * Get affiliates record using companyId
 *
 * @param {Number} companyId
 * @param {Object|null} fields
 * @return {Promise<Object>}
 */
async function _getAffiliateByCompanyId(companyId, fields) {
  const affiliate = await affiliateModel.find({
    where: {
      companyId,
      isValid: 1,
      categoryId: 1,
    },
    fields,
  }) || {}
  return affiliate
}

/**
 * Get affiliates complete record using affiliate Id
 *
 * @param {Object} opt
 * @param {Object|null} fields
 * @return {Promise<Object>}
 */
async function getAffiliateCompleteByAffiliateId(opt, fields) {
  const affiliates = await _getAffiliateByCompanyId(opt.t, {
    id: true,
  })
  const affiliateArray = arrayUtil.objectToArray(affiliates)
  const affiliateIds = arrayUtil.column(affiliateArray, 'id')

  const affiliateComplete = await affiliateCompleteModel.findOne({
    where: {
      affiliateId: {
        inq: affiliateIds,
      },
      isValid: 1,
      ipAddress: opt.ipAddress,
    },
    order: 'id DESC',
    limit: 1,
    fields,
  }) || {}
  return affiliateComplete
}

module.exports = {
  getAffiliateById,
  getAffiliateCompleteByAffiliateId,
}
