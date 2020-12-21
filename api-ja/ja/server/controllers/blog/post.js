const app = require('@server/server')
const service = require('@server/services/blog/post')

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

async function duplicate(req, res) {
  try {
    res.json(await service.duplicate(req.params.id, req.body, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function showEdit(req, res) {
  try {
    res.json(await service.showEdit(req.params.id, app.utils.meta.meta(req, ['userId'])))
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

async function destroy(req, res) {
  try {
    res.json(await service.destroy(req.params.id, app.utils.meta.meta(req, ['userId'])))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function searchByTag(req, res) {
  try {
    res.json(await service.searchByTag(req.params.tagName))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

async function surfaceIndex(req, res) {
  try {
    res.json(await service.surfaceIndex(req.params.slug, req.query))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  index,
  show,
  showEdit,
  update,
  store,
  duplicate,
  destroy,
  searchByTag,
  surfaceIndex,
}
