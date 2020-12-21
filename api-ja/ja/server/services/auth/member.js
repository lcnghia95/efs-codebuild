const app = require('@server/server')
const syncService = require('@services/common/synchronize')
const userModel = app.models.Users
/**
 * Register new user
 *
 * @param {string} userId
 * @param {Object} data
 * @returns {void}
 * @public
 */
async function updateAddressInformation(userId, data) {
  if (userId == 0) {
    return
  }
  userModel.upsert({
    id: userId,
    firstName: data.firstName,
    lastName: data.lastName,
    firstNameKana: data.firstNameKana,
    lastNameKana: data.lastNameKana,
    tel: data.tel,
    zip: data.zip,
    prefectureId: data.prefectureId,
    address1: data.address1,
    address2: data.address2,
    address3: data.address3,
  })
  syncService.syncDataToFxon('users', userId)
}

module.exports = {
  updateAddressInformation,
}
