/**
 * Create fields object for attach to query filter
 *
 * @param params
 */
function fields(params) {
  let arr = {}
  params.split(',').map(field => {
    arr[field] = true
  })

  return arr
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
    }, {
      [fieldName]: {
        like: `${key},%`
      },
    }, {
      [fieldName]: {
        like: `%,${key}`
      },
    }, {
      [fieldName]: {
        like: `%,${key},%`
      },
    }, ])
  }, [])
  if (result.length > 0) {
    return {
      or: result
    }
  }
}

module.exports = {
  fields,
  commaKey,
}
