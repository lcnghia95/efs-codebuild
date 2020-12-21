const crypto = require('crypto')
const key = process.env.ENC_KEY

function encrypt(data) {
  if (!data) {
    return ''
  }
  let cipher = crypto.createCipheriv('rc4', key, ''),
    crypted = cipher.update(data, 'utf8', 'base64')
  crypted += cipher.final('base64')
  return crypted
}

function decrypt(data) {
  if (!data) {
    return ''
  }
  let decipher = crypto.createDecipheriv('rc4', key, ''),
    decrypted = decipher.update(data, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

function simpleEncode(data) {
  return Buffer
    .from(
      Math.random().toString(36).substr(2, 5) + data
    )
    .toString('base64')
}

function simpleDecode(code) {
  return Buffer
    .from(code, 'base64')
    .toString('ascii')
    .substr(5)
}

module.exports = {
  encrypt,
  decrypt,
  simpleEncode,
  simpleDecode,
}
