const app = require('@server/server')

async function index() {
  return await app.models.CurrencyPairs.find({
    where: {
      isValid: 1,
    },
    fields: {
      id: true,
      name: true,
    },
    order: ['priority ASC'],
  })
}

module.exports = {
  index,
}