const crypto = require('@server/utils/crypto')
const string = require('@server/utils/string')
const map = require('@server/configs/encrypt.json')

module.exports = function(Model) {
  // Encrypt query data for query in database
  Model.observe('access', function encryptForQuery(ctx, next) {
    let name = string.pascalToSnake(Model.name),
      columns = map[name],
      properties = Model.definition.properties

    // Ignore if current model doesn't have any encrypted column
    if (!columns || !ctx.query.where) {
      return next()
    }
    ctx.query.where = _handle(columns, properties, ctx.query.where, crypto.encrypt)

    next()
  })

  // Decrypt loaded data for use on server
  Model.observe('loaded', function decrypt(ctx, next) {
    let name = string.pascalToSnake(Model.name),
      columns = map[name],
      properties = Model.definition.properties

    // Ignore if current model doesn't have any encrypted column
    if (!columns) {
      return next()
    }
    ctx.data = _handle(columns, properties, ctx.data, crypto.decrypt)

    next()
  })

  // Encrypt new data for store in database
  Model.observe('before save', function encrypt(ctx, next) {
    // TODO encrypt importance data before store into database
    let name = string.pascalToSnake(Model.name),
      columns = map[name],
      properties = Model.definition.properties

    // Ignore if current model doesn't have any encrypted column
    if (!columns) {
      return next()
    }
    // Convert for upsert
    if (ctx.data) {
      ctx.data = _handle(columns, properties, ctx.data, crypto.encrypt)
    }
    // Convert for create
    else if (ctx.instance) {
      ctx.instance = _handle(columns, properties, ctx.instance, crypto.encrypt)
    }

    next()
  })
}

function _handle(columns, properties, data, cb) {
  columns.forEach(column => {
    // Model definition properties is camelCase
    // So we need convert raw name of properties in database to camelCase
    let camelCol = string.snakeToCamel(column)
    properties[camelCol] && data[camelCol] && (data[camelCol] = cb(data[camelCol]))
  })

  return data
}
