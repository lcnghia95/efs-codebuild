const app = require('@server/server')
const validateService = require('./validate')

//models
const nonMemberModel = app.models.NonMembers

/**
 * create non member user
 *
 * @param {string} salesSessionId
 * @param {Object} input
 * @returns {Object}
 * @public
 */
async function create(salesSessionId, input) {
  if (!salesSessionId || !validateService.checkUserInformation(input)) {
    return []
  }

  return nonMemberModel.create({
    isValid: 1,
    statusType: 1,
    isDelivery: 1,
    mailAddress: input.mailAddress,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    firstNameKana: input.firstNameKana,
    lastNameKana: input.lastNameKana,
    nickName: input.nickName,
    prefectureId: input.prefectureId,
    address1: input.address1,
    address2: input.address2,
    tel: input.tel,
    sessionId: salesSessionId,
  })
}

module.exports = {
  create,
}
