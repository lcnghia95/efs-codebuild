const app = require('@server/server')
const contentModel = app.models.Contents

async function show(id, input) {
  let data = await contentModel.findOne({
    where: {
      id: id
    },
    fields: {content: true}
  })

  if(!data) {
    return {}
  }
  if (input.isMobile) {
    let pattern = /<a.*?<\/a>/gmi,
      result = null,
      matchedData = []

    while((result = pattern.exec(data.content))) {
      matchedData.push(result[0])
    }

    return matchedData
  }
  return data
}

module.exports = {
  show,
}
