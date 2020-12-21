const fs = require('fs')
const util = require('util')
const path = require('path')
const timeUtil = require('./time')
const mkdirp = require('mkdirp')

/**
 * log file
 *
 * @param {String} content
 * @param {String} dir
 * @param {String} fileName
 * @return {Void}
 *
 * @public
 */
function file(content, dir, fileName) {
  if (!content) {
    return
  }

  let fullDir = path.join(__dirname, '../../logs/', dir),
    now = timeUtil.sqlDate()

  // create folder if not exists
  mkdirp.sync(fullDir)

  // create fileName(YYYY-MM-DD.log) if not exists
  fileName = `${
    fileName ? fileName : now.substr(0, 10) // get YYYY-MM-DD
  }.log`

  // write content into file
  let logFile = fs.createWriteStream(fullDir + '/' + fileName, {
    flags: 'a'
  })
  logFile.write(now + ': ' + util.inspect(content) + '\n')
}

module.exports = {
  file,
}
