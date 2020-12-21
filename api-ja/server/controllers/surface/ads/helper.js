const { meta } = require('@@server/utils/meta')
const toolMembers = [
  '/tools/osusume',
  '/tools/psum',
  '/tools/pcount',
  '/tools/free',
  '/tools/newproduct',
  '/tools/sold',
  '/tools/productreview',
]

/**
 * Get service path
 *
 * @params {Object}
 * @returns {String}
 */
function servicePath(req) {
  // let referer = req.headers['service-path'] || ''
  let referer = req.body.service_path || ''

  // replace 'https://www.gogojungle.co.jp/tools' → '/tools'
  referer = referer.replace(process.env.GOGO_HOST_URL, '')

  if (referer.length == 0 || referer == '/') {
    // 'https://www.gogojungle.co.jp/' → '/'
    return '/'
  }

  // Handle 'tools' → '/tools'
  if (referer.charAt(0) != '/') {
    referer  = '/' + referer
  }

  // Handle '/tools/' → '/tools'
  if (referer.charAt(referer.length - 1) == '/') {
    referer = referer.substring(0, referer.length - 1)
  }

  // If referer is member of tools, redirect tools
  toolMembers.map(item => {
    if(referer.includes(item)) {
      return '/tools'
    }
  })

  return referer
}

/**
 * Get meta data language & platform
 *
 * @params {Object}
 * @returns {Object}
 */
function languageAndPlatform(req) {
  let data = meta(req, ['langType', 'platform']),
    referer = req.body.service_path || '',
    langType = data.langType
  referer = referer.replace(process.env.GOGO_HOST_URL, '')
  if (referer.startsWith('/en')) {
    langType = 2
  } else if (referer.startsWith('/th')) {
    langType = 3
  } else if (referer.startsWith('/vi')) {
    langType = 4
  }
  return {
    langType,
    platform: _platform(data.platform),
  }
}

/**
 * Handle platform
 *
 * @params {String} platform
 * @return {Number}
 */
function _platform(platform) {
  if(platform == 'desktop') {
    return 1
  }
  if(platform == 'mobile') {
    return 2
  }

  return 0
}


module.exports = {
  servicePath,
  languageAndPlatform,
}
