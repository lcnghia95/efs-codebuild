const ip = require('ip')

module.exports = {
  getIp(req) {
    let ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress

    // only get the first ip
    ipAddress = ipAddress.split(',')[0]

    if (ip.isV6Format(ipAddress) && ~ipAddress.indexOf('::ffff')) {
      ipAddress = ipAddress.split('::ffff:')[1]
    } else if (ip.isV4Format(ipAddress) && ~ipAddress.indexOf(':')) {
      ipAddress = ipAddress.split(':')[0]
    }
    return ipAddress
  },
}