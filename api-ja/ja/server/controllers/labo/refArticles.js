const app = require('@server/server')
const service = require('@server/services/labo/refArticles')

// utils
const metaUtil = app.utils.meta
const fileUtil = app.utils.file

async function getCategories(req, res) {
  try {
    res.json(await service.getCategories())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function listLatest(req, res) {
  try {
    res.json(await service.listLatest(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function listByCategory(req, res) {
  try {
    res.json(await service.listByCategory(req.query, req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function listBySubject(req, res) {
  try {
    res.json(await service.listBySubject(req.query, req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

// TODO: backup for future need
/* async function getRelatedArticles(req, res) {
  try {
    res.json(await service.getRelatedArticles(req.query, req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
} */

async function getDetail(req, res) {
  try {
    res.json(await service.getDetail(req.params.category, req.params.subject, req.params.id, metaUtil.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function store(req, res) {
  fileUtil.multerUploadMul(req, res, async function(err) {
    if (err) {
      console.log('File upload error: ', err.message)
      return res.sendStatus(500)
    }
    try {
      res.json(await service.store(req.body, req.files, req.body['key_ref']))
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  })
}

async function edit(req, res) {
  try {
    res.json(await service.update(req.params.id, req.body,  metaUtil.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function increaseView(req, res) {
  try {
    res.json({ status: await service.increaseView(req.body.id,  metaUtil.meta(req, ['userId'])) })
  } catch (e) {
    console.error(e)
    res.json({ status: 0 })
  }
}

async function search(req, res) {
  try {
    res.json(await service.search(req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  search,
  getCategories,
  listLatest,
  listByCategory,
  listBySubject,
  getDetail,
  store,
  edit,
  increaseView,
}
