const app = require('@server/server')
const service = require('@server/services/labo/articles')

async function listByCategory(req, res) {
  try {
    res.json(await service.listByCategory(req.query, req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function listTopArticle(req, res) {
  try {
    res.json(await service.listTopArticle(req, res))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function listBySubCategories(req, res) {
  try {
    res.json(await service.getArticlesInSubCategories(req.query, req.query.ids))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function listBySubCategory(req, res) {
  try {
    res.json(await service.listBySubCategory(req.params.category ,req.query, req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function getRelatedArticles(req, res) {
  try {
    res.json(await service.getRelatedArticles(req.query, req.params.id))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
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

async function getDetail(req, res) {
  try {
    res.json(await service.getDetail(req.params.id, app.utils.meta.meta(req, ['userId'])))
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
      res.json(await service.store(req.body, req.files, app.utils.meta.meta(req, ['userId'])))
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

async function increaseView(req, res) {
  try {
    res.json({ status: await service.increaseView(req.body.id,  app.utils.meta.meta(req, ['userId'])) })
  } catch (e) {
    console.error(e)
    res.json({ status: 0 })
  }
}

async function setBestAnswer(req, res) {
  try {
    res.json({ status: await service.setBestAnswer(parseInt(req.params.articleId), parseInt(req.params.answerId),  app.utils.meta.meta(req, ['userId'])) })
  } catch (e) {
    console.error(e)
    res.json({ status: 0 })
  }
}

module.exports = {
  listByCategory,
  listBySubCategories,
  listBySubCategory,
  getRelatedArticles,
  search,
  getDetail,
  store,
  edit,
  increaseView,
  setBestAnswer,
  listTopArticle,
}
