const axios = require('axios')

/**
 * encrypt Tag
 *
 * @param {string} tag
 * @returns {string}
 * @public
 */
async function encryptTag(tag) {
  let response = await axios({
    method: 'POST',
    url: process.env.AFFILIATE_TAG_ENCRYPTED_URL,
    headers: {
      'content-Type': 'application/x-www-form-urlencoded'
    },
    data: `i=${tag}`
  })

  return response.data
}

module.exports = {
  encryptTag,
}
