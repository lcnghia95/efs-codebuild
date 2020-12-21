module.exports = function(Model) {
  Model.observe('access', function convertTimestamp(ctx, next) {
    if (!ctx.query.where || ctx.query.where.isValid === undefined) {
      ctx.query.where = Object.assign(
        ctx.query.where || {},
        {isValid: 1}
      )
    }

    next()
  })
}
