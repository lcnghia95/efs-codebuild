const inquiryService = require('@@/server/services/surface/inquiry/inquiry')
const { meta } = require('@@server/utils/meta')

async function sendInquiry(req, res) {
  try {
    res.json(await inquiryService.sendInquiry(req.body,meta(req, ['ipAddress', 'userAgent', 'langType'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}
module.exports = {
  sendInquiry,
}
