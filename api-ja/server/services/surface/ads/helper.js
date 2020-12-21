// Utils
const numberUtil = require('@ggj/utils/utils/number')

/**
  * Handle service path
  *  Ex: Handle /markets/economics/35140 → [/markets/economics/35140, /markets/economics/0]
  *
  * @param {String} servicePath
  * @return {Array}
*/
function handleServicePath(servicePath) {
  let list = servicePath.split('/')

  // Detail page
  if (numberUtil.isNumeric(list.slice(-1))) {
    list.map((item, index) => {
      if(numberUtil.isNumeric(item)) {
        if (servicePath.startsWith('/post') && item == 1) {
          return list[index] = item
        }
        return list[index] = 0
      }
    })

    list = list.join('/')
    return [list, servicePath]
  }

  return [servicePath]
}


module.exports = {
  handleServicePath,
}
