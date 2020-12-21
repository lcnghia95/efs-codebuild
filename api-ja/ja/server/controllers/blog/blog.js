const app = require('@server/server')
const service = require('@server/services/blog/blog')

async function index(req, res) {
  try {
    res.json(await service.index(req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function show(req, res) {
  try {
    res.json(await service.show(req.params.slug, req.query, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function store(req, res) {
  try {
    res.json(await service.store(req.body, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function destroy(req, res) {
  try {
    res.json(await service.destroy(req.params.id, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function validate(req, res) {
  res.json(await service.validate(req.body))
}

async function user(req, res) {
  try {
    res.json(await service.user(req.params.slug, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function calendar(req, res) {
  try {
    res.json(await service.calendar(req.params.slug, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function monthlyArchive(req, res) {
  try {
    res.json(await service.monthlyArchive(req.params.slug, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function lastArticles(req, res) {
  try {
    res.json(await service.lastArticles(req.params.slug, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function getBlogEditIndex(req, res) {
  try {
    res.json(await service.getBlogEditIndex(app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function update(req, res) {
  try {
    res.json(await service.update(req.params.id, req.body, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function blogList(req, res) {
  try {
    res.json(await service.blogList(app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  index,
  show,
  store,
  destroy,
  validate,
  user,
  calendar,
  monthlyArchive,
  lastArticles,
  getBlogEditIndex,
  update,
  blogList,
}
