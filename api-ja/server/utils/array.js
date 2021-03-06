/**
 * Swap array possition
 *
 * @param {Array} array
 * @param {Number} i
 * @param {Number} j
 * @returns {Void}
 * @private
 */
function _swap(array, i, j) {
  let tmp = array[i]
  array[i] = array[j]
  array[j] = tmp
}

/**
 * Shuffle given array
 * Return a new array
 * Ref: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 *
 * @param {Array} array
 * @param {Number} count
 * @returns {Array}
 * @public
 */
function shuffle(array, count = 0) {
  // TODO: CONSIDER MEMORY ISSUE HERE!!!
  let clonedArr = JSON.parse(JSON.stringify(array))

  for (let i = clonedArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    _swap(clonedArr, i, j)
  }

  // Slice array
  return count == 0 ? clonedArr : clonedArr.slice(0, count)
}

/**
 * Indexing given array by given key
 * Return new object {key => record, ...}
 *
 * @param {Array} array
 * @param {String} key
 * @param {String} valKey
 * @returns {Object}
 */
function index(array, key = 'id', valKey = undefined) {
  return array.reduce((obj, record) => {
    record[key] != null &&
    record[key] != undefined &&
    (!valKey || record[valKey] != undefined) &&
    (obj[record[key]] = valKey ? record[valKey] : record)
    return obj
  }, {})
}

/**
 * Filter all value that have value in given key not match with given value
 * Return new array that was filtered
 *
 * @param {Array} arr
 * @param {String} key
 * @param {} value
 * @return {Array}
 */
function keyFilter(arr, key, value) {
  return arr.reduce((arr, item) => {
    if (item[key] === value) {
      arr.push(item)
    }
    return arr
  }, [])
}

/**
 * Get an array that contain only value of specific field based on given array
 * Return new Array
 *
 * @param {Array} array
 * @param {String} key
 * @param {Boolean} isUnique
 * @returns {Array}
 */
function column(array, key = 'id', isUnique = false) {
  let data = array.reduce((arr, record) => {
    record[key] && arr.push(record[key])
    return arr
  }, [])
  return isUnique ? unique(data) : data
}

/**
 * Remove dupplicated items in array
 *
 * @param {Array} array
 * @returns {Array}
 * @public
 */
function unique(array) {
  return array.filter(
    (item, idx) => (item && (array.indexOf(item) === idx))
  )
}

/**
 * Get difference between two array
 *
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Array}
 * @public
 */
function arrayDiff(array1, array2) {
  return array1.filter(x => !array2.includes(x))
}

/**
 * Sum a array by given key
 *
 * @param array
 * @param key
 * @return {*}
 */
function sum(array, key = null) {
  return array.reduce((sum, record) => {
    if (key) {
      return sum + (record[key] || 0)
    }
    return sum + record
  }, 0)
}

/**
 * Group given data based on given key
 * e.g: { 15: [{}, {}, ...], ...}
 *
 * @param data
 * @param field
 * @return {object}
 */
function groupArray(data, field) {
  return data.reduce((res, record) => {
    let key = record[field]

    if (!res[key]) {
      res[key] = []
    }
    res[key].push(record)
    return res
  }, {})
}

//========================================================
// TODO: No use
// TODO: Need to remove the below functions
/**
 * Convert object to array
 *
 * @param {Object} object
 * @returns {Array}
 * @public
 */
function objectToArray(object) {
  let array = []
  for (const key in object) {
    array.push(object[key])
  }
  return array
}

/**
 * Get array's attribute as array
 *
 * @param {Array} array
 * @param {*} key
 * @param {Boolean} isUnique
 * @returns {Array}
 * @public
 */
function attributeArray(array, key = 'id', isUnique = true) {
  let attributes = array.map(item => item[key])
  // Unique attributes
  return isUnique ? unique(attributes) : attributes
}

module.exports = {
  shuffle,
  index,
  keyFilter,
  column,
  unique,
  arrayDiff,
  sum,
  groupArray,

  objectToArray,
  attributeArray,
}
