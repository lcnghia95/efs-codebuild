const app = require('@server/server')
const service = require('@server/services/labo/refCategories')

async function listRefCategories(req, res) {
  try {
    res.json(await service.listRefCategories())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function refSubjectInfo(req, res) {
  try {
    res.json(await service.refSubjectInfo(req.params.category, req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function listSubjects(req, res) {
  try {
    res.json(await service.listSubjects(req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function newCategory(req, res) {
  app.utils.file.multerUpload(req, res, async function(err) {
    if (err) {
      console.log('File upload error: ', err.message)
      return res.sendStatus(500)
    }

    try {
      res.json(await service.newCategory(req.body, req.file, app.utils.meta.meta(req, ['userId'])))
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  })
}

async function newSubject(req, res) {
  try {
    res.json(await service.newSubCategory(req.body, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function updateCategory(req, res) {
  try {
    res.json(await service.updateCategory(req.params.id, req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function updateSubject(req, res) {
  try {
    res.json(await service.updateSubCategory(req.params.id, req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  listRefCategories,
  refSubjectInfo,
  listSubjects,
  newCategory,
  newSubject,
  updateCategory,
  updateSubject,
}
