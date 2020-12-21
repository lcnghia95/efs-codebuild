const getTime = require('date-fns/get_time')
const format = require('date-fns/format')
const incrementMonths = require('date-fns/add_months')
const incrementDays = require('date-fns/add_days')

/**
 * Convert given date | string | number to unix timestamp
 *
 * @param time
 * @return number
 */
function toUnix(time) {
  if (!time || time == '0000-00-00 00:00:00') {
    return 0
  }
  return Math.round(getTime(time) / 1000)
}

/**
 * Get sql date as string
 * Return date as string with formatString default YYYY-MM-DD HH:mm:SS
 *
 * @param time
 * @param formatString
 */
function sqlDate(time = new Date(), formatString = 'YYYY-MM-DD HH:mm:ss') {
  return format(time, formatString)
}

/**
 * Get utc date as string
 * Return date as string with format YYYY-MM-DDTHH:mm:ss.SSSZ
 *
 * @param time
 */
function utcDate(time = new Date()) {
  return format(time)
}

/**
 * japan format date
 * Return date as string with format YYYY-MM-DDTHH:mm:ss.SSSZ
 *
 * @param time
 */
function jDate(time) {
  if (time === 0) {
    time = Date.now()
  }
  return format(time, 'YYYY&#24180;MM&#26376;DD&#26085;')
}


/**
 * Add given month(s) into given time (default time is now)
 *
 * @param {number} amount
 * @param {number} time
 * @param {Boolean} toUnixTime
 * @returns {string|number}
 */
function addMonths(amount, time = new Date(), toUnixTime = false) {
  const result = incrementMonths(time, amount)
  return toUnixTime ? toUnix(result) : result
}

/**
 * Add given day(s) into given time (default time is now)
 *
 * @param {number} amount
 * @param {number} time
 * @param {Boolean} toUnixTime
 * @returns {string|number}
 */
function addDays(amount, time = new Date(), toUnixTime = false) {
  const result = incrementDays(time, amount)
  return toUnixTime ? toUnix(result) : result
}

/**
 * Delay with promise
 * @param {Number} milliseconds
 */
function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve.bind(), milliseconds)
  })
}

module.exports = {
  toUnix,
  sqlDate,
  utcDate,
  jDate,
  format,
  addMonths,
  addDays,
  delay,
}
