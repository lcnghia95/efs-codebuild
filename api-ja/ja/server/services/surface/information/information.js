const app = require('@server/server')
const userCommonService = require('@services/common/user')
const informationModel = app.models.Information

/**
 * Get information data
 *
 * @param {Array} infoTypes
 * @param {number} limit
 * @param {Object} extendConditions
 * @returns {Promise<Array>}
 * @private
 */
async function _find(infoTypes, limit, extendConditions = {}) {
  return await informationModel.find({
    where: Object.assign({
      isValid: 1,
      publishedAt: {
        lt: Date.now(),
      },
      infoType: {
        inq: infoTypes,
      },
    }, extendConditions),
    limit,
    order: 'publishedAt DESC',
    fields: app.utils.query.fields('id,title,publishedAt,importantType'),
  })
}

/**
 * Information object
 *
 * @param {Object} info
 * @param isShorten
 * @return {Object}
 * @private
 */
function _object(info, isShorten = false) {
  let content = info.content || ''
  if (content) {
    content = app.utils.string.convertCrlfBr(content)
  }
  if (isShorten) {
    content = content.substr(0, 20)
  }
  return app.utils.object.nullFilter({
    id: info.id,
    priority: info.importantType,
    date: info.publishedAt,
    title: info.title,
    content: content,
    type: _type(info.infoType),
  })
}

/**
 * Convert info type for response object
 *
 * @param infoType
 * @returns {*}
 * @private
 */
function _type(infoType) {
  if (infoType === null || infoType === undefined) {
    return null
  }
  if (infoType % 2 === 1) {
    return 1
  }
  return 2
}

/**
 * Recent notice from GogoJungle
 *
 * @param {Array} infoTypes
 * @param {number} limit
 * @param {number} languages
 * @return {Array}
 * @public
 */
async function recent(infoTypes, limit, language = 1) {
  const data = await _find(infoTypes, limit, {languages: language})
  return data.map(_object)
}

/**
 * Recent mailmagazine from GogoJungle
 *
 * @param {number} userId
 * @param {number} language
 * @return {Object}
 * @public
 */
async function mailmagazine(userId, language = 1) {
  if(language != 1) {
    return null
  }

  const user = await userCommonService.getUser(userId, {
      isBuyuser: true,
      isDeveloper: true,
      isAffiliate: true,
    })
    const data = await Promise.all([
      user.isBuyuser == 1 ? _find([2, 4], 2) : [],
      user.isDeveloper == 1 ? _find([2, 6], 2) : [],
      user.isAffiliate == 1 ? _find([2, 8], 2) : [],
    ])
  return [0, 1, 2].reduce((result, idx) => {
    if (data[idx].length > 0) {
      result[idx + 1] = data[idx].map(_object)
    }
    return result
  }, {})
}

/**
 * Information index
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input, meta) {
  const y = input.year
  const from = new Date(y + '-01-01 00:00:00').getTime()
  const to = (y == (new Date()).getFullYear()) ?
      Date.now() :
      new Date(y + '-12-31 23:59:59').getTime()
  const page = parseInt(input.page || 1)
  const where = app.utils.object.nullFilter({
      infoType: !input.type ? null : {
        inq: input.type.split(','),
      },
      isValid: 1,
      languages: meta.langType || 1,
      and: [{
        publishedAt: {
          gte: from,
        },
      }, {
        publishedAt: {
          lte: to,
        },
      }],
    })
    const offset = app.utils.paging.getOffsetCondition(page, 40)
    const [total, data] = await Promise.all([
      informationModel.count(where),
      await informationModel.find({
        order: 'publishedAt DESC',
        where: where,
        limit: 40,
        skip: offset.skip,
        fields: app.utils.query.fields('id,title,publishedAt,infoType'),
      }),
    ])
  return app.utils.paging.addPagingInformation(
    data.map(record => _object(record)),
    page,
    total,
    40,
  )
}

/**
 * Get specific information record
 *
 * @param id
 * @returns {Promise<Object>}
 */
async function show(id, meta) {
  return _object(await informationModel.findOne({
    where: {
      id: id,
      languages: meta.langType || 1,
    },
    fields: app.utils.query.fields('title,publishedAt,infoType,content'),
  }) || {})
}

module.exports = {
  index,
  show,
  recent,
  mailmagazine,
}
