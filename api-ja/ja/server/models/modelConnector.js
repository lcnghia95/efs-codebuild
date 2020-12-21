'use strict'

const app = require('@server/server')

/**
 * Get information from respective models and condition
 *
 * @param {object} model model
 * @param {object} condition condition
 * @returns {Array}
 * @public
 */
async function select(model, condition) {
  return await model.find(buildParams(condition)) || []
}

function buildParams(condition) {
  let findParams = {}
  Object.assign(findParams, condition)
  if (Array.isArray(findParams.fields)) {
    findParams.fields = app.utils.query.fields(findParams.fields.join())
  }
  return findParams
}

/**
 * Get information from respective models and condition
 *
 * @param {object} model model
 * @param {object} condition condition
 * @returns {object}
 * @public
 */
async function selectOne(model, condition) {
  return await model.findOne(buildParams(condition)) || {}
}

/**
 * Count the number of existed row in db
 *
 * @param {object} model model
 * @param {object} condition condition
 * @returns {BigInteger}
 * @public
 */
async function count(model, condition) {
  return await model.count(buildParams(condition)) || 0
}

module.exports = {
  select,
  selectOne,
  count,
}
