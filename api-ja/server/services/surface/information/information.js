const app = require('@server/server')

const informationModel = app.models.Information

// const userCommonService = require('@@services/common/user')

const queryUtil = require('@ggj/utils/utils/query')
const stringUtil = require('@ggj/utils/utils/string')
const objectUtil = require('@ggj/utils/utils/object')
const pagingUtil = require('@ggj/utils/utils/paging')

/**
 * Get information data
 *
 * @param {Array} infoTypes
 * @param {number} limit
 * @returns {Promise<Array>}
 * @private
 */
// async function _find(infoTypes, limit) {
//   return await informationModel.find({
//     where: {
//       isValid: 1,
//       publishedAt: {
//         lt: Date.now()
//       },
//       infoType: {
//         inq: infoTypes
//       },
//     },
//     limit,
//     order: 'publishedAt DESC',
//     fields: app.utils.query.fields('id,title,publishedAt,importantType'),
//   })
// }

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
    content = stringUtil.convertCrlfBr(content)
  }
  if (isShorten) {
    content = content.substr(0, 20)
  }
  return objectUtil.nullFilter({
    id: info.id,
    priority: info.importantType,
    date: info.publishedAt,
    title: info.title,
    content: content,
    type: _type(info.infoType),
  })
}

/*
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
 * @return {Array}
 * @public
 */
// async function recent(infoTypes, limit) {
//   let data = await _find(infoTypes, limit)
//   return data.map(_object)
// }

/**
 * Recent mailmagazine from GogoJungle
 *
 * @param {number} userId
 * @return {Object}
 * @public
 */
// async function mailmagazine(userId) {
//   let user = await userCommonService.getUser(userId, {
//       isBuyuser: true,
//       isDeveloper: true,
//       isAffiliate: true,
//     }),
//     data = await Promise.all([
//       user.isBuyuser == 1 ? _find([2, 4], 2) : [],
//       user.isDeveloper == 1 ? _find([2, 6], 2) : [],
//       user.isAffiliate == 1 ? _find([2, 8], 2) : [],
//     ])
//   return [0, 1, 2].reduce((result, idx) => {
//     if (data[idx].length > 0) {
//       result[idx + 1] = data[idx].map(_object)
//     }
//     return result
//   }, {})
// }

/**
 * Information index
 *
 * @param {Object} input
 * @return {Array}
 * @public
 */
async function index(input, meta) {
  let y = input.year,
    limit = input.limit || 40,
    from = new Date(y + '-01-01 00:00:00').getTime(),
    to = (y == (new Date()).getFullYear()) ?
      Date.now() :
      new Date(y + '-12-31 23:59:59').getTime(),
    page = parseInt(input.page || 1),
    where = objectUtil.nullFilter({
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
    }),
    offset = pagingUtil.getOffsetCondition(page, limit),
    [total, data] = await Promise.all([
      informationModel.count(where),
      informationModel.find({
        order: 'publishedAt DESC',
        where: where,
        limit,
        skip: offset.skip,
        fields: queryUtil.fields('id,title,publishedAt,infoType'),
      }),
    ])
  return pagingUtil.addPagingInformation(
    data.map(record => _object(record)),
    page,
    total,
    limit,
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
    fields: queryUtil.fields('title,publishedAt,infoType,content'),
  }) || {})
}

module.exports = {
  index,
  show,
  // recent,
  // mailmagazine,
}
