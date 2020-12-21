const sale = require('@services/bat/sale')
const freeFirstMonthSale = require('@services/bat/freeFirstMonthSale')

async function rechargeSale(req, res) {
  res.json(await sale.recharge(req.body))
}

async function updateFreeFirstMonth(req, res) {
  res.json(await freeFirstMonthSale.update(req.body))
}

module.exports = {
  rechargeSale,
  updateFreeFirstMonth,
}
