'use strict'

const {createWinstonLogger} = require('./winston-log')
/**
 * Cart log
 * How to use:
 *    calg.debug(data)  // for log DEBUG level
 *    calg.info(data)   // for log INFO level
 *    calg.warn(data)   // for log WARN level
 *    calg.error(data)  // for log ERROR level
 *
 *    Log format https://nodejs.org/dist/latest/docs/api/util.html#util_util_format_format_args
 *    calg.info('test message %s, %s', 'first', 'second')
 *
 * @param logFile
 * @param loggerName
 */
module.exports = function (logFile, loggerName) {
  const logger = createWinstonLogger(logFile, {
    dirname: 'logs/cart',
  })

  global[[loggerName || logFile]] = logger
}
