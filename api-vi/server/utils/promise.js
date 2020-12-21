'use strict'

module.exports = function(promise) {
  return promise.then(data => {
    return [null, data]
  })
    .catch(err => {
      console.log('Promise error: ', err)
      return [err]
    } )
}
