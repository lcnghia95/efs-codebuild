const app = require('@server/server')
const service = require('@server/services/labo/refComments')

async function getByArticle(req, res) {
  try {
    res.json(await service.getByArticle(req.params.id, req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function store(req, res) {
  app.utils.file.multerUploadMul(req, res, async function(err) {
    if (err) {
      console.log('File upload error: ', err.message)
      return res.sendStatus(500)
    }
    try {
      res.json(await service.store(req.body, req.files,  app.utils.meta.meta(req, ['userId'])))
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  })
}

async function edit(req, res) {
  try {
    res.json(await service.update(req.params.id, req.body,  app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  getByArticle,
  store,
  edit,
}
