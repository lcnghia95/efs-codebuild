/**
 * Compare values of two given objects
 * Note: not deep
 *
 * @param {object} obj1
 * @param {object} obj2
 * @param {array} excepts
 * @return {boolean}
 */
function isEqual(obj1, obj2, excepts = []) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }

  let diffFlag = true
  Object.keys(obj1).forEach(key => {
    if (!excepts.includes(key) && obj1[key] !== obj2[key]) {
      diffFlag = false
    }
  })

  return diffFlag
}

/**
 * Filter all value that is same with false in given object
 * Return object that was filtered
 *
 * @param {Object} obj
 * @returns {Object}
 */
function filter(obj) {
  Object.keys(obj).forEach(key => {
    if (!obj[key] || (typeof obj[key] === 'object' && Object.keys(
      obj[key]).length === 0)) {
      delete obj[key] // Delete false value (all value same with false) value
    }
  })

  return obj
}

/**
 * Filter all value that is same with false in given object
 * Return object that was filtered
 *
 * @param {Object} obj
 * @returns {Object}
 */
function deepFilter(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      obj[key] = deepFilter(obj[key])
    }
    if (!obj[key] || (typeof obj[key] === 'object' && Object.keys(
      obj[key]).length === 0)) {
      delete obj[key] // Delete false value (all value same with false) value
    }
  })

  return obj // Return new object.
}

/**
 * Filter all value that is undefined or null in given object
 * Return object that was filtered
 *
 * @param {Object} obj
 * @returns {Object}
 */
function nullFilter(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key] // Delete undefined and null.
    }
  })

  return obj // Return new object.
}

/**
 * Filter all value that is undefined or null in given object
 * Return object that was filtered
 *
 * @param {Object} obj
 * @returns {Object}
 */
function deepNullFilter(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      obj[key] = deepNullFilter(obj[key])
    }
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key] // Delete undefined and null.
    }
  })

  return obj // Return new object.
}

/**
 * Filter all value that have value in given key not match with given value
 * Return new Object that was filtered
 *
 * @param obj
 * @param key
 * @param value
 * @return {Object}
 */
function keyFilter(obj, key, value) {
  let res = {}

  Object.keys(obj).forEach(itemKey => {
    if (obj[itemKey][key] === value) {
      res[itemKey] = obj[itemKey]
    }
  })

  return res
}

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

//========================================================
// TODO: No use
// TODO: Need to remove the below functions

/**
 * Convert array to object
 *
 * @param {Array} array
 * @param {string} key
 * @returns {Object}
 * @public
 */
function arrayToObject(array, key = 'id') {
  return array.reduce((result, item) => {
    item[key] && (result[item[key]] = item)
    return result
  }, {})
}

/**
 * Index array
 *
 * @param {Array} array
 * @param {string} idxKey
 * @param {string} valKey
 * @returns {Object}
 * @public
 */
function indexArray(array, idxKey, valKey) {
  if (!Array.isArray(array) || array.length == 0) {
    return {}
  }
  return array.reduce((result, object) => {
    if (object[idxKey] && object[valKey]) {
      if (!result[object[idxKey]]) {
        result[object[idxKey]] = object[valKey]
      }
    }
    return result
  }, {})
}

/**
 * genarate array commaKey from string keys
 *
 * @param {String} keys // ex: '1,2,3,4'
 * @param {String} fieldName // ex: 'currencyPairs'
 * @returns {Object}
 * @public
 */
function commaKey(keys, fieldName) {
  if (!keys) {
    return
  }
  keys = keys.split(',')
  let result = keys.reduce((result, key) => {
    return result.concat([{
      [fieldName]: key,
    },
    {
      [fieldName]: {
        like: `${key},%`
      },
    },
    {
      [fieldName]: {
        like: `%,${key}`
      },
    },
    {
      [fieldName]: {
        like: `%,${key},%`
      },
    },
    ])
  }, [])
  if (result.length > 0) {
    return {
      or: result
    }
  }
}

function isEmpty(obj) {
  if (Array.isArray(obj) && obj.length == 0) {
    return true
  } else if (typeof(obj) === 'object') {
    for(let key in obj) {
      if(obj.hasOwnProperty(key))
        return false
    }
    return true
  } else if (typeof(obj) === 'string' && obj.length == 0) {
    return true
  } else if (typeof(obj) === 'undefined') {
    return true
  }
  return false
}

function isPresent(obj) {
  return !isEmpty(obj)
}

module.exports = {
  isEqual,
  filter,
  keyFilter,
  deepFilter,
  indexArray,
  nullFilter,
  deepNullFilter,
  objectToArray,
  arrayToObject,
  commaKey,
  isEmpty,
  isPresent,
}
