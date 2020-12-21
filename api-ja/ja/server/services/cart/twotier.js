const app = require('@server/server')

/**
 * Get twotiers data
 *
 * @param {Array} affiliateUserIds
 * @returns {Object}
 * @private
 */
async function twotiers(affiliateUserIds) {
  return app.utils.object.arrayToObject(await app.models.Twotier.find({
    where: {
      isValid: 1,
      childUserId: {
        inq: affiliateUserIds
      },
    },
    order: 'id DESC',
    fields: {
      rate: true,
      parentUserId: true,
      childUserId: true
    },
  }), 'childUserId')
}

module.exports = {
  twotiers,
}
