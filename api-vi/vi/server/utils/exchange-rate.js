'use strict'

const request = require('request')

const GET_URL = 'https://rate.gogojungle.co.jp/chart/?s=35'
async function getExchangeRate() {
  return new Promise((resolve, reject) => {
    request(
      {
        url: GET_URL,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
      (error, response, body) => {
        if (error) {
          console.log('body', body)
          return reject(error)
        }
        try {
          const data = JSON.parse(body)
          if (!data.length) {
            resolve([])
            return
          }
          process.api.JPYVND = parseFloat((data[0] || {}).bid || 0)
          resolve(data)
        } catch (e) {
          console.log('body', body)
          reject(e)
        }
      },
    )
  })
}

async function exchangeRate() {
  console.log('Begin run get Exchange Rate')
  await getExchangeRate()

  setInterval(() => {
    try {
      console.log('RUN get Exchange Rate interval')
      getExchangeRate()
    } catch (err) {
      console.error(err)
    }
  }, 5 * 60 * 1e3) // 5 minutes
}

module.exports = exchangeRate
