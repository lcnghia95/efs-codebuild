const {
  findOne,
} = require('@@server/utils/model')
const userCommonService = require('@services/common/user')
const queryUtil = require('@ggj/utils/utils/query')


/**
 * Get specific lecture cms record
 *
 * @param cid
 * @param id
 * @returns {Promise<Object>}
 */
async function show(cid, id, userId = 0) {
  const user = userId > 0 ? await userCommonService.getUser(userId, {
    isBuyuser: true,
  }) : {}

  const data = await findOne('fx_default', 'column_report', {
    where: {
      ID: id,
      IsValid: 1,
    },
    fields: queryUtil.fields('ID,Title,Content,Language'),
  })

  if (!data || !data.Content || data.Content.length == 0) {
    return {}
  }
  
  if (data.Language != 4) {
    return {code: 404, exists: 1}
  }

  if (data.ID) {
    data.isBuyuser = user === null ? 0 : (user.isBuyuser || 0)
  }

  return data
}

module.exports = {
  show,
}
