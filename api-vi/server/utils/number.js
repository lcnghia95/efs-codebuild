const MAX_INT32 = 2147483647

/**
 * Format currency
 *
 * @param {Number} number
 * @return {String}
 */
function formatCurrency(number) {
  if (typeof number != 'number') {
    number = parseFloat(number)
  }
  return number
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    .split('.')[0] // Remove two prefix 'e.g. 100,123.23 -> 100,123'
}

/**
 * Check is number
 *
 * @param number
 * @return Boolean
 */
function isNumeric(number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

/**
 * return: 0 <= number <= MAX_INT32
 */
function positiveInt32(number) {
  if (number < 0) {
    return 0
  } else if (number > MAX_INT32) {
    return MAX_INT32
  }
  return number
}


module.exports = {
  formatCurrency,
  isNumeric,
  positiveInt32,
}
