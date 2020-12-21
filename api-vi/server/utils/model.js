/**
 * @note
 * Don't add this util file into utils/index.js
 * Because this file required app (server) for get datasouces & discover model
 * So we need avoid loop require
 * Reason example:
 * -> server.js require(utils/index)
 * -> utils/index.js require(model)
 * -> utils/model.js require(server)
 * -> bug
 */

const app = require('@server/server')

/**
 * Store all models that was discovered before
 *
 * @type {object}
 */
const discoverdModels = {}

/**
 * Discover model dynamic
 * Return model object (promise)
 *
 * @param {string} schema
 * @param {string} table
 * @returns {Promise<Object>}
 */
async function discoverModel(schema, table) {
  // Get model from discovered list if exist
  if (discoverdModels[`${schema}_${table}`]) {
    return discoverdModels[`${schema}_${table}`]
  }

  // Get new model
  let ds = app.datasources[schema]
  return new Promise(((resolve, reject) => {
    ds.discoverAndBuildModels(table, {
      visited: {},
      nameMapper: (type, name) => name,
      associations: false
    }, function (err, models) {
      if (err) reject(err)
      if (!models || !models[table]) {
        return reject('Model not found')
      }

      // Get model and store it into discovered list
      // Then resolve it
      let model = models[table]
      discoverdModels[`${schema}_${table}`] = model
      resolve(model)
    })
  }))
}

/**
 * Find records using dynamic schema
 * Return result array
 *
 * @param schema
 * @param table
 * @param conditions
 * @returns {Promise<Array>}
 */
async function find(schema, table, conditions) {
  try {
    let model = await discoverModel(schema, table)
    return await model.find(conditions)
  } catch (e) {
    return []
  }
}

/**
 * Find one record using dynamic schema
 * Return result object
 *
 * @param schema
 * @param table
 * @param conditions
 * @returns {Promise<Object>}
 */
async function findOne(schema, table, conditions) {
  try {
    let model = await discoverModel(schema, table)

    return await model.findOne(conditions)
  } catch (e) {
    return null
  }
}

/**
 * Count total records using dynamic schema
 * Return number (int)
 *
 * @param schema
 * @param table
 * @param where
 * @returns {Promise<Number>}
 */
async function count(schema, table, where) {
  try {
    let model = await discoverModel(schema, table)

    return await model.count(where)
  } catch (e) {
    return 0
  }
}

/**
 * Execute native SQL
 * Return result of sql
 *
 * @param schema
 * @param query
 * @param params
 */
async function excuteQuery(schema, query, params = []) {
  return new Promise(function(resolve, reject) {
    let ds = app.datasources[schema]
    ds.connector.query(query, params, function(err, data) {
      if(err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

/**
 * Destroy all records that matching given key-value condition
 * Alternate for model.destroyAll
 * Use when need cascade delete
 * (model.destroyAll not have primary id so we can't determine related data)
 *
 * @param model
 * @param {string} primaryKey
 * @param {*} primaryValue
 * @return {Promise<number>}
 */
async function destroyAll(model, primaryKey, primaryValue) {
  let data = await model.find({
      where: {
        [primaryKey]: primaryValue
      },
      fields: {id: true}
    }),
    promises = []

  // Async loop over each instance and push delete promise into promises array
  data.forEach(instance => {
    promises.push(model.destroyById(instance.id))
  })
  return (await Promise.all(promises)).length
}

module.exports = {
  discoverModel,
  find,
  findOne,
  count,
  excuteQuery,
  destroyAll,
}
