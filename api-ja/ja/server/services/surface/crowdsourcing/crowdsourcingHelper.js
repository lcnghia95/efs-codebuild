const app = require('@server/server')

// Models
const crowdsourcingModel = app.models.Crowdsourcing

/**
 * Get crowdsourcing record by id
 *
 * @param {number} id
 * @param {Object} fields
 * @returns {Promise<Object> || null}
 * @public
 */
async function crowdsourcing(id, fields) {
  return await crowdsourcingModel.findOne({
    where: {
      isValid: 1,
      id
    },
    fields
  })
}

module.exports = {
  crowdsourcing,
}
