const time = require('@ggj/utils/utils/time')
// const start = 0 // 01/01/1970 @ 12:00am (UTC)
const end = 4102444800000 // 01/01/2100 @ 7:00am (UTC)
const fields = [
  'publishedAt',
  'publishedDate',
  'accessedAt',
  'versionUpdatedAt',
  'reservedStartAt',
  'reservedEndAt',
  'eventAt',
  'endAt',
  'reserveStartAt',
  'specialDiscountStartAt',
  'specialDiscountEndAt',
  'forwardAt',
  'createdAt',
  'updatedAt',
  'serviceStartAt',
  'serviceEndAt',
  'expiredAt',
  'reviewPublishedAt',
  'payAt',
  'birthday',
  'bidEndAt',
  'deadLineAt',
  'completedAt',
  'depositAt',
]

module.exports = function(Model) {
  Model.observe('loaded', function convertTimestamp(ctx, next) {
    fields.map(field => {
      if (ctx.data[field] === null || ctx.data[field]) {
        ctx.data[field] = (ctx.data[field] === null || ctx.data[field] === '0000-00-00 00:00:00') ?
          0 :
          time.toUnix(ctx.data[field])
      }
    })

    next()
  })

  Model.observe('before save', function revertTimestamp(ctx, next) {
    // Convert for upsert
    if (ctx.data) {
      fields.map(field => {
        if (ctx.data[field] && typeof ctx.data[field] === 'number') {
          const timeData = ctx.data[field] * 1000

          // If new time (after * 1000) is larger than end time
          // Hold old value
          // Else assign new time value to this field
          ctx.data[field] = timeData > end ?
            ctx.data[field] :
            timeData
        }
      })
    }
    // Convert for create
    else if (ctx.instance) {
      fields.map(field => {
        if (ctx.instance[field] && (typeof ctx.instance[field] === 'number' || (ctx.instance[field].constructor && ctx.instance[field].constructor.name === 'Date'))) {
          const timeData = ctx.instance[field] * 1000

          // If new time (after * 1000) is larger than end time
          // Hold old value
          // Else assign new time value to this field
          ctx.instance[field] = timeData > end ?
            ctx.instance[field] :
            timeData
        }
      })
    }

    next()
  })
}
