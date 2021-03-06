// Cryptr
const Cryptr = require('cryptr')
const SECRET_KEY = 'https://gogojungle.co.jp'
let _CRYPTR


/**
 * Get cryptr
 */
function _cryptr() {
  if (!_CRYPTR) {
    _CRYPTR  = new Cryptr(SECRET_KEY)
  }
  return _CRYPTR
}

/**
 * Simple encrypt
 */
function encrypt(str) {
  return _cryptr().encrypt(str)
}

/**
 * Simple decrypt
 */
function decrypt(code) {
  try {
    return _cryptr().decrypt(code)
  } catch(e) {
    return 0
  }
}

module.exports = {
  encrypt,
  decrypt,
}
