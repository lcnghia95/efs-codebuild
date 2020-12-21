const test = require('@services/test/test')

async function show(req, res) {
  try {
    res.json(await test.show())
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  show,
}
