const app = require('@server/server')
const contentModel = app.models.Contents

async function show(id) {
  return await contentModel.findOne({
    where: {
      id: id
    },
    fields: {content: true}
  })
}

module.exports = {
  show,
}
