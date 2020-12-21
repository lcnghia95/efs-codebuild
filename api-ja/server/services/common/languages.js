const app = require('@server/server')
const userModel = app.models.Users

/**
 * change user language
 *
 * @param {Object} meta
 * @return {Promise<Object>}
 */
async function change(meta) {
  let {userId, langType} = meta
  if (!userId) {
    return {code: 400}
  }
  let user = await userModel.findOne({
    where: {
      id: userId,
    },
    fields: {
      id: true,
      languages: true
    }
  })
  if (!user) {
    return {code: 400}
  }
  user.languages = langType
  user.save()
  return {}
}

module.exports = {
  change,
}
