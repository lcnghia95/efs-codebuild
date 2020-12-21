const axios = require('axios')

async function getRealTradeAccount(userId, query){
  const limit = query.limit
  const url = `${process.env.REALTRADE_API}/api/real-trade/v2/account/${userId}/realtrade?limit=${limit || 0}`
  const response = await axios.get(url) || {}
  return response.data
}

module.exports = {
  getRealTradeAccount,
}
