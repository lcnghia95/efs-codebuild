const app = require('@server/server')

/**
 * Get login user id of current user
 *
 * @returns {number}
 */
function userId(req) {
  const {
    userId,
  } = app.utils.meta.meta(req, ['userId'])
  return userId || 0
}

/**
 * Get meta data
 *
 * @returns {object}
 */
function meta(req) {
  const meta = app.utils.meta.meta(req, ['userId', 'ipAddress', 'userAgent'])
  return {
    userId: meta.userId || 0,
    ipAddress: meta.ipAddress || '',
    userAgent: meta.userAgent || '',
  }
}


module.exports = {
  userId,
  meta,
}
