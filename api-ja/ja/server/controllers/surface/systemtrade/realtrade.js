const realtradeService = require('@services/surface/systemtrade/fx/realtrade')

async function listWidgets(req, res) {
  try {
    const { id = 0 } = req.params
    const { page = 0, preview = 0} = req.query

    res.json(await realtradeService.listWidgets(Number(id), Number(page), Number(preview)))
  } catch (e) {
    res.sendStatus(e)
  }
}

module.exports = {
  listWidgets
}
