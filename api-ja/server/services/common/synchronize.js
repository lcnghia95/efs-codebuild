const axios = require('axios')
const httpUtil = require('../../utils/http')
const timeUtil = require('../../utils/time')

/**
 * sync data from GOGO to FXON
 *
 * @param {string} table
 * @param {number} id
 * @param {object} data
 * @returns {void}
 * @private
 */
async function syncDataToFxon(table, id, data = null) {
  httpUtil.httpV1().put(table + '/' + id, data || {is_valid: 1})
}

/**
 * Sync data from GOGO to FXON using new sync service
 *
 * @param {String} modelName
 * @param {Array} ids
 * @param {Object} data
 * @returns {void}
 * @public
 */
async function newSyncDataToFxon(modelName, ids, data = {}) {
  const syncServiceHostUrl = process.env.SYNC_SERVICE_HOST_URL

  if(!syncServiceHostUrl) {
    console.log('Please add config SYNC_GOGO_SERVICE_HOST_URL in gogo.api.ja')
    return
  }

  const gogoSyncUrl = syncServiceHostUrl + 'gogo'
  
  return axios({
    method: 'post',
    url: gogoSyncUrl,
    data: {
      model: modelName,
      ids,
      data, // TODO - Long: add optional data (https://gogojungle.backlog.jp/view/OAM-33683)
    },
  })
}

/**
 * sync multi data from GOGO to FXON
 *
 * @param {string} table (fxon table)
 * @param {array object} data
 *  - must has id
 *  - column name same as db
 * @param {number} retryDelay (milliseconds)
 * @param {number} retryCount
 *
 * @returns { promise object }
 */

async function syncMultiDataToFxon(table, data = [], retryDelay = 20000, retryCount = 3) {
  if (!data.length) {
    return
  }

  for (let i = 0; i <= retryCount;) {
    try {
      const res = await httpUtil.httpV1().post(table, data)
      return res
    } catch (error) {
      if (++i <= retryCount) {
        await timeUtil.delay(retryDelay)
        console.warn('Retry sync count: ', i)
        continue
      }

      throw new Error(error)
    }
  }
}

module.exports = {
  syncDataToFxon,
  newSyncDataToFxon,
  syncMultiDataToFxon,
}
