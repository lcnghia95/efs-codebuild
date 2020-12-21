const app = require('@server/server')
const service = require('@server/services/labo/categories')

async function listCategories(req, res) {
  try {
    res.json(await service.listCategories(1))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function getWaitList(req, res) {
  try {
    res.json(await service.listCategories(0))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function listSubCategories(req, res) {
  try {
    res.json(await service.listSubCategories(req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

// TODO:
async function getSubWaitList(req, res) {
  try {
    res.json(await service.listSubCategories(req.params.id, false))
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

async function newSubCategory(req, res) {
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

async function updateSubCategory(req, res) {
  try {
    res.json(await service.updateSubCategory(req.params.id, req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  listCategories,
  getWaitList,
  listSubCategories,
  getSubWaitList,
  newCategory,
  newSubCategory,
  updateCategory,
  updateSubCategory,
}
