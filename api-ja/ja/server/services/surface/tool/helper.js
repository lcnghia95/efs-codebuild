const app = require('@server/server')
const sfProduct = require('@services/common/surfaceProduct')
const arrayUtil = require('@ggj/utils/utils/array')
const { TOOLS_TYPE_ID } = require('@@server/common/data/hardcodedData')

/**
 * List of type_id for gogojungle.co.jp/tools
 *
 * @param {Number}  isDetailPage
 * @return {String}
 */
function typeIds(isDetailPage = 0)
{
  return isDetailPage == 1
    ? [6,8,9,10,13,70,71,72]
    : TOOLS_TYPE_ID
}

/**
 * Get data for given model and conditions
 *
 * @param {Object} model
 * @param {String} fields
 * @param {Object} conditions
 * @returns {Promise<Array>}
 */
async function data(model, fields, conditions = []) {
  return await model.find(Object.assign({
    fields: app.utils.query.fields(fields),
    limit: 10,
  }, conditions))
}

/**
 * Convert given data to response object
 *
 * @param {Array} data
 * @param {Function} idxCb
 * @returns {Promise<*>}
 */
async function response(data, idxCb = null) {
  const sfProductData = arrayUtil.index(
    await sfProduct.sfProductObjects(data),
    'id',
  )

  data = data.reduce((obj, record) => {
    const idx = idxCb ? idxCb(record) : _idx(record)
    if (idx > 0) {
      if (!obj[idx]) {
        obj[idx] = []
      }
      sfProductData[record['productId']]
        && obj[idx].push(sfProductData[record['productId']])
    }
    return obj
  }, {})

  return data
}

/**
 * Get id of given record
 *
 * @param record
 * @returns {Number}
 * @private
 */
function _idx(record) {
  return record.dataType || 0
}

/**
 * Slice given object
 *
 * @param {Object} data
 * @returns {Object}
 */
function slice(data, limit = 10) {
  if (!data || !Object.keys(data).length) {
    return {}
  }

  Object.keys(data).forEach(key => {
    data[key] = data[key] && data[key].slice(0, limit)
  })
  return data
}

module.exports = {
  data,
  response,
  typeIds,
  slice,
}
