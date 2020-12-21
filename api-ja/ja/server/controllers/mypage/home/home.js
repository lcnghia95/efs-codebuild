const app = require('@server/server')
const bannerService = require('@services/advertise/banner')
const buyerService = require('@services/mypage/contact/buyer')
const partnerService = require('@services/mypage/contact/partner')
const messageService = require('@services/mypage/message/message')
const informationService = require('@services/surface/information/information')
const MYPAGE_SERVICE_PATH = '/mypage'

async function banner(req, res) {
  res.json(await bannerService.show(MYPAGE_SERVICE_PATH))
}

async function notice(req, res) {
  res.json(await informationService.recent([1, 3], 3, _language(req)))
}

async function mailmagazine(req, res) {
  res.json(await informationService.mailmagazine(_userId(req), _language(req)))
}

async function message(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await messageService.new(userId))
}

async function buyer(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await buyerService.recent(userId, 3, _language(req)))
}

async function partner(req, res) {
  const userId = _userId(req)
  if (userId == 0) {
    res.json({})
    return
  }
  res.json(await partnerService.recent(userId, 3, _language(req)))
}

/**
 * Get login user id
 *
 * @returns {number}
 */
function _userId(req) {
  const {
    userId,
  } = app.utils.meta.meta(req, ['userId'])
  return userId || 0
}

/**
 * Get curent language
 *
 * @returns {number}
 */
function _language(req) {
  return app.utils.meta.meta(req, ['langType']).langType
}

module.exports = {
  buyer,
  banner,
  notice,
  message,
  partner,
  mailmagazine,
}
