const arrayUtils = require('./array')

/**
 * Get keywords formatted string (using '|' instead \s)
 *
 * @param keywords
 * @return {string}
 */
function getKeywords(keywords) {
  return keywords
    .trim()
    .replace(/\s+/ig, ' ')
    .replace(/ /ig, '|')
}

/**
 * Convert all break line character of given string into html break tag
 *
 * @param str
 * @returns {string}
 */
function convertCrlfBr(str) {
  if (!str || typeof str !== 'string') {
    return ''
  }

  return str.replace(/\r?\n/g, '<br>')
}

/**
 * Strip html tags in given string but preserve content of these tags
 * Return stripped string
 *
 * @param str
 * @returns {string}
 */
function stripTags(str) {
  return str
    .replace(/(&lt;)/ig, '<')
    .replace(/(&gt;)/ig, '>')
    .replace(/(<([^>]+)>)/ig, '')
}

/**
 * Strip html tags include content in given string
 * Return stripped string
 *
 * @param str
 * @returns {string}
 */
function stripTagsAndContent(str) {
  return str.replace(/<(\w+)>.*<\/\1>/ig, '')
}

/**
 * Strip html tags and remove style blocks
 * Return stripped string
 *
 * @param str
 * @returns {string}
 */
function stripTagsAndStyle(str) {
  const start = str.search('<style>')
    const end = str.search('</style>') + 8 // Length of close tag = 8
  if (start !== -1) {
    str = stripTagsAndStyle(
      str.substring(0, start) +
      str.substring(end, str.length),
    )
  }
  return stripTags(str)
}

/**
 * Convert given string from "camelCase" to "snake_case"
 *
 * @param str
 * @returns {string}
 */
function camelToSnake(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * Convert given string from "PascalCase" to "snake_case"
 *
 * @param str
 * @returns {string}
 */
function pascalToSnake(str) {
  const arr = str.split('')
  arr[0] = arr[0].toLowerCase()

  return camelToSnake(arr.join(''))
}

/**
 * Convert given string from "snake_case" to "camelCase"
 *
 * @param str
 * @returns {string}
 */
function snakeToCamel(str) {
  return str.replace(/(_\w)/g, function(m) {
    return m[1].toUpperCase()
  })
}

/**
 * Create short string with length
 *
 * @param {String} input
 * @param {Number} len
 * @returns {string}
 */
function stringShorten(input, len = 20) {
  if (!input || typeof input != 'string') {
    return ''
  }

  if (input.toString('utf8').length > len) {
    return input.substring(0, len) + '．．．'
  }

  return input
}
/**
 * Create short japanese string with the specified length (not include ASCII character length)
 *
 * @param {String} str
 * @param {Number} limit
 * @returns {string}
 */
function jpStringShorten(str, limit = 20) {
  if (!str || typeof str != 'string') {
    return ''
  }

  let utf8String = unescape(encodeURIComponent(str)),
    chars = [],
    count = 0,
    breaker = 0,
    result = [],
    len = limit * 3 - 1

  for (let i = 0; i < utf8String.length; i++) {
    chars.push(utf8String.charCodeAt(i))
  }
  for (const char of chars) {
    result.push(char)
    if (char > 127) {
      count += 1
      breaker++
      if (breaker === 3) {
        breaker = 0
      }
    } else {
      count += 1.5
    }
    if (count > len && breaker === 0) {
      break
    }
  }
  const shortedString = result.length < chars.length ? _UTF8ArrayToString(result) + '．．．' : _UTF8ArrayToString(result)
  return shortedString
}
/**
 * Convert bytes array to UTF-8 string
 *
 * @param {Array} data
 * @returns {string}
 */
function _UTF8ArrayToString(data) {
  const buffer = Buffer.from(data)
  return buffer.toString('utf8')
}
/**
 * Slugify given string
 *
 * @param str
 * @returns {string}
 */
function slugify(str) {
  str = str.toString().toLowerCase().trim() // Trim whitespace
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Replace & with 'and'
    .replace(/&/g, '-and-')
    // Replace all invalid url character except Japanese character
    .replace(
      /[^a-zA-Z0-9_\u3000-\u303F\u3040-\u309F\u30a0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\s-]/g
      ,'',
    )

  return encodeURIComponent(str)
}

/**
 * Handle special character when generate string for regex
 *
 * @param string
 * @returns {string}
 */
function _generateRegexFromString(string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

/**
 * Remove all href of a tag if it not includes gogojungle.co.jp, fx-on.com, youtube
 * @param {String} content
 * @returns {String}
 */
function externalLink(content) {
  let redirectCondition = /<\s*a.*?>/gmis,
    hrefRegex = /href\s*=\s*(.*?)(?=\s|>)/mi,
    ignoreReplace = /gogojungle\.co\.jp|fx-on\.com|http(?:s?):\/\/(?:www\.)?youtu(?:be\.com|\.be)|real-trade\.tech/gmi,
    result = null,
    hrefProhibits = []

  while((result = redirectCondition.exec(content))) {
    const hrefValue = result[0].match(hrefRegex)
    if(hrefValue) {
      const hrefString = hrefValue[0].toLowerCase()
        const testResult = hrefString.match(ignoreReplace)

      if (!testResult) {
        let minify = _separateString(content, result.index, result.index + result[0].length),
          additional = ''

        // Don't add target="_blank" with href = #
        if(hrefValue[1].trim().replace(/"|'/g, '').charAt(0) == '#') {
          additional = ' rel="nofollow noopener"'
        } else {
          hrefProhibits.push(hrefValue[0].trim())
        }

        // add new attributes to <a> tag at the end of it
        // and combine the content
        content = minify.head + minify.middle.replace('>',  additional + '>') + minify.tail
      }
    }
  }

  if(hrefProhibits.length > 0) {
    arrayUtils.unique(hrefProhibits).map(search => {
      content = content.replace(new RegExp(_generateRegexFromString(search), 'g'), '')
    })
  }

  return _convertStringtoAnchorTags(content)
}

/**
 * Add {rel, target} attributes to <a> tag of given content
 * if it's not includes gogojungle.co.jp
 * @param {String} content
 * @returns {String}
 */
function expandHyperlink(content) {
  let redirectCondition = /<a .*?>/gmi,
    hrefRegex = /href\s*=\s*(.*?)(?=\s|>)/mi,
    result = null

  while((result = redirectCondition.exec(content))) {
    const hrefValue = result[0].match(hrefRegex)
    if(hrefValue) {
      if (!hrefValue[0].toLowerCase().includes('gogojungle.co.jp')) {
        let minify = _separateString(content, result.index, result.index + result[0].length),
          additional = ' rel="nofollow noopener" target="_blank"'

        minify.middle = minify.middle.replace(/rel=".*?"|rel=.*?(?=\s|>)|target=".*?"|target=.*?(?=\s|>)/gmi, '')

        // Don't add target="_blank" with href = #
        if(hrefValue[1].trim().replace(/"|'/g, '').charAt(0) == '#') {
          additional = ' rel="nofollow noopener"'
        }

        // add new attributes to <a> tag at the end of it
        // and combine the content
        content = minify.head + minify.middle.replace('>',  additional + '>') + minify.tail
      }
    }
  }

  return _convertStringtoAnchorTags(content)
}

/**
 * Convert outlines from string like gogojungle.co.jp or fx-on.com to <a> tags
 * Ex: <p>https://www.gogojungle.co.jp</p> => <a href="https://www.gogojungle.co.jp">https://www.gogojungle.co.jp</a>
 * @param {String} content
 * @returns {String}
 */
function _convertStringtoAnchorTags(content) {
  let linkPattern = /[^(?=")(?=')](https?|ftp)(:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)/gmi,
    replacePattern = /https:\/\/www\.gogojungle\.co\.jp|https:\/\/fx-on\.com/gmi,
    attributePattern = /=\s*.*?[^>]*/, // ignore attribute of tag,
    progress = 0,
    matches = null
    // TODO detect and ignore select tag
    // <select.*?\/select>/gmi

  while((matches = linkPattern.exec(content))) {
    if(matches[0].match(replacePattern) && !matches[0].match(attributePattern)) {
      if(progress != 0 && matches.index < progress) {
        continue
      }

      const minify = _separateString(content, matches.index, matches.index + matches[0].length)
        const detectElement = minify.middle.charAt(0)
        const url = minify.middle.substr(1)
        const replace = (!url) ? '' : detectElement + '<a href="' + url + '">' + url + '</a>'

      progress = matches.index + replace.length
      content = minify.head + replace + minify.tail
    }
  }

  return content
}


/**
 * Separate string by index character
 * @param {String} content
 * @param {Number} beginPosition
 * @param {Number} endPosition
 * @returns {Object}
 */
function _separateString(content, beginPosition, endPosition) {
  const head = content.slice(0, beginPosition)
    const middle = content.slice(beginPosition, endPosition)
    const tail = content.slice(endPosition)
  return {
    head,
    middle,
    tail,
  }
}


module.exports = {
  convertCrlfBr,
  getKeywords,
  stripTags,
  stripTagsAndContent,
  stripTagsAndStyle,
  pascalToSnake,
  camelToSnake,
  snakeToCamel,
  stringShorten,
  slugify,
  externalLink,
  expandHyperlink,
  jpStringShorten,
}
