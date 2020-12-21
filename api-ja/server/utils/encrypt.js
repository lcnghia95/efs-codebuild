const bcrypt = require('bcrypt')
const crypto = require('crypto')
const pepper = process.env.PASSWORD_PEPPER

/**
 * Convert hash to nodejs format
 *  Note: We use bcrypt to hash password
 *    in php, hash should be $2y$....
 *    in nodejs, hash should be $2a$....
 *
 * @param {string} hash
 * @returns {string}
 * @private
 */
function _nodejsBcryptHash(hash) {
  return (hash.substring(0, 4) == '$2y$') ? hash.replace('$2y$', '$2a$') : hash
}

/**
 * Convert hash to php format
 *
 * @param {string} hash
 * @returns {string}
 * @private
 */
function _phpBcryptHash(hash) {
  const algoIdentifier = hash.substring(0, 4)
  return (['$2a$', '$2b$'].includes(algoIdentifier)) ? hash.replace(algoIdentifier, '$2y$') : hash
}

/**
 * Add pepper to raw password
 *
 * @param {string} raw
 * @returns {string}
 * @private
 */
function _addPepper(raw) {
  return crypto.createHash('md5').update(raw).digest('hex') + pepper
}

/**
 * Verify password
 *
 * @param {string} raw
 * @param {string} hash
 * @returns {Boolean}
 * @public
 */
async function verifyPassword(raw, hash) {
  return await bcrypt.compare(_addPepper(raw), _nodejsBcryptHash(hash))
}

/**
 * Hash password
 *
 * @param {string} raw
 * @returns {string}
 * @public
 */
function hashPassword(raw) {
  return _phpBcryptHash(bcrypt.hashSync(_addPepper(raw), 0))
}

module.exports = {
  hashPassword,
  verifyPassword,
}
