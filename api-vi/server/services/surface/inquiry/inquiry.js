const app = require('@server/server')
const inquiryModel = app.models.Inquiries
const syncService = require('@services/common/synchronize')
const commonEmailV1 = require('@@services/common/emailv1')
async function sendInquiry(input,meta) {
  const language = meta.langType
  input.requestId && delete input.requestId
  let dataPost = Object.assign({}, input, {
      isValid: 1,
      statusType: 0,
      language,
      publishedAt: Date.now(),
      siteType: 1,
      isReply:0,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    }),
    inquiry = await inquiryModel.create(dataPost),
    inquiryContent = {
      name: input.name,
      tel: input.tel,
      content: input.content
    }
  syncService.syncDataToFxon('inquiries', inquiry.id)
  if (process.env.EMAIL_SUPPORT && process.env.EMAIL_TEMPLATE_ID_INQUIRY) {
    commonEmailV1.send(process.env.EMAIL_SUPPORT, inquiryContent, process.env.EMAIL_TEMPLATE_ID_INQUIRY, language)
  }
  if (input.mailAddress && input.name) {
    commonEmailV1.send(input.mailAddress, {name: input.name}, 110, language)
  }
  return {}
}
module.exports = {
  sendInquiry,
}
