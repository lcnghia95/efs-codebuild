const inquiryService = require('@services/surface/inquiry/inquiry')
const app = require('@server/server')

async function usb(req, res) {
  try {
    res.json(await inquiryService.usb(req.params.pId, req.params.devId))
  } catch (e) {
    res.sendStatus(500)
  }
}

async function usa(req, res) {
  try {
    res.json(await inquiryService.usa(req.params.pId))
  } catch (e) {
    res.sendStatus(500)
  }
}

async function usl(req, res) {
  try {
    res.json(await inquiryService.usl(app.utils.meta.meta(req, ['langType']).langType))
  } catch (e) {
    res.sendStatus(500)
  }
}

async function ust(req, res) {
  try {
    res.json(await inquiryService.ust(req.params.id))
  } catch (e) {
    res.sendStatus(500)
  }
}

module.exports = {
  usb,
  usa,
  usl,
  ust,
}
