const LANGUAGE = process.env.LANGUAGE
const EMAIL_COMPOSER_URL = process.env.EMAIL_COMPOSER_URL
const CANCEL_URL = 
  process.env.GOGOJUNGLE_MAIL_SERVICE_URL +
  process.env.GOGOJUNGLE_MAIL_CANCEL_PATH

const httpUtil = require('@@server/utils/http')
const cryptoUtil = require('@@server/utils/crypto')

/* Export functions */
async function send(
  to, content, templateId, language = LANGUAGE, 
  batchId = null, sendAt = null,
) {
  return httpUtil.post(`${EMAIL_COMPOSER_URL}/v1/send`, {
    to: cryptoUtil.encrypt(to),
    content, templateId, language, 
    batchId , sendAt,
  })
}

async function sendNow(
  to, content, templateId,
  language = LANGUAGE,
) {
  return httpUtil.post(`${EMAIL_COMPOSER_URL}/v1/send/now`, {
    to: cryptoUtil.encrypt(to),
    content,
    templateId,
    language, 
  })
}

async function sendByUserId(
  userId, content, templateId, language = LANGUAGE, 
  batchId = null, sendAt = null,
) {
  if (!userId) {
    console.error('No userId to send mail!!!')
    return
  }

  return httpUtil.post(`${EMAIL_COMPOSER_URL}/v1/send/${userId}`, {
    content, templateId, language, 
    batchId , sendAt,
  })
}

async function sendNowByUserId(
  userId, content, templateId,
  language = LANGUAGE,
) {
  if (!userId) {
    console.error('No userId to send now mail!!!')
    return
  }

  return httpUtil.post(`${EMAIL_COMPOSER_URL}/v1/send/now/${userId}`, {
    content,
    templateId,
    language, 
  })
}

/**
 * Cancel send mail
 *
 * @param {Number} batchId
 * @public
 */
function cancel(batchId) {
  const content = {
    batch_id: batchId,
  }

  httpUtil.post(CANCEL_URL, content)
  return true
}


module.exports = {
  send,
  sendNow,
  sendByUserId,
  sendNowByUserId,
  cancel,
}