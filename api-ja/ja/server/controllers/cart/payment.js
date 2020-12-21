'use strict'
const paymentService = require('@services/payment/payment')

async function sbpsComplete(req, res) {
  res.set({
    'Content-Type': 'text/csv',
    'charset': 'Shift_JIS',
  })
  res.send(await paymentService.sbpsReceive(req.body))
}

async function teleComplete(req, res) {
  const input = req.body
  if (input.clientip) {
    res.send(await paymentService.teleReceive(input))
    return
  }
  res.send(await paymentService.teleReceive(req.query))
}

async function metaComplete(req, res) {
  const method = req.method.toLowerCase()
  res.set({
    'Content-Type': 'text/plain',
    'charset': 'Shift_JIS',
  })
  let result
  if (method == 'post') {
    result = await paymentService.metaReceive(req.body)
  }
  if (method == 'get') {
    result = await paymentService.metaReceive(req.query || req.body)
  }
  res.send(result)
}

async function metaCancel(req, res) {
  res.set({
    'Content-Type': 'text/plain',
    'charset': 'Shift_JIS',
  })
  res.send(await paymentService.metaCancel(req.body))
}

async function metaWeb(req, res) {
  res.set({
    'Content-Type': 'text/plain',
    'charset': 'Shift_JIS',
  })
  res.send('0\r\n')
  res.send(await paymentService.metaReceive(req.body))
}

module.exports = {
  sbpsComplete,
  teleComplete,
  metaComplete,
  metaCancel,
  metaWeb,
}
