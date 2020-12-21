const slackUtil = require('@@server/utils/slack')

const {
  uniq,
} = require('lodash')


const ERROR_SLACK_CHANNEL = process.env.ERROR_SLACK_CHANNEL
const LANGUAGE = 'vi'

/**
 * send slack notification for multi languages
 *
 * @param {object} model
 * @param {Array} ids
 * @param {string} fieldDefineId
 *
 * @public
 */
function sendSlackLanguages(model, ids, fieldDefineId) {
  if(!ERROR_SLACK_CHANNEL) {
    return
  }
  let errorMsg = ''
  errorMsg += ' `MULTI-LANGUAGES`: Missing data fields \r\n'
  errorMsg += ` Model: \`${model.definition.name}\` \r\n`
  errorMsg += ` ${fieldDefineId}: \`${ids}\` \r\n`
  errorMsg += ` LANGUAGE: \`${LANGUAGE}\` \r\n`

  slackUtil.sendV2(errorMsg, null, ERROR_SLACK_CHANNEL)
}

/**
 * get error ids if don't have fieldName
 *
 * @param {object} item
 * @param {Array} errIds
 * @param {String} fieldName
 * @param {String} fieldId
 *
 * @return {Array}
 *
 * @public
 */
function getItemError(item, errIds = [], fieldName, fieldId) {
  if (!item[fieldName]) {
    errIds.push(item[fieldId])
  }
  errIds = uniq(errIds)
  return errIds
}

module.exports = {
  sendSlackLanguages,
  getItemError,
}
