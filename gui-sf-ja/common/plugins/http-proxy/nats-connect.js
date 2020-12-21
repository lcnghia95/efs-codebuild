const NATS = require('nats')

module.exports = function() {
  // TODO: hieu nguyen - temp disable for aws
  return
  return new Promise((resolve, reject) => {
    let opts = {
        json: true,
        url: process.env.NATS_URL,
        maxReconnectAttempts: -1,
      },
      nats = NATS.connect(opts)
    nats.on('connect', function() {
      console.log('Connect NATS server successfully')
      process.gogo.nats = nats
      resolve()
    })
    nats.on('error', function(err) {
      console.error('NATS error')
      reject(err)
    })
  })
}
