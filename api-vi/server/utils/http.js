const axios = require('axios')
const baseOptions = {}

function http() {
  let options = Object.assign(baseOptions, {
    headers: {
      'Content-Type': 'application/json',
      'api-access-key': process.env.API_ACCESS_KEY,
      'special': process.env.API_SPECIAL_TAG,
    },
    baseURL: process.env.API_V2_HOST_URL,
  })
  return axios.create(options)
}

function imgHttp(userId) {
  let options = Object.assign(baseOptions, {
    headers: {
      'user-id': userId,
    },
    baseURL: process.env.IMG_HOST_URL,
  })
  return axios.create(options)
}

function httpV1() {
  let options = Object.assign(baseOptions, {
    headers: {
      'Content-Type': 'application/json',
      'api-access-key': process.env.API_ACCESS_KEY,
      'special': process.env.API_SPECIAL_TAG,
    },
    baseURL: process.env.API_V1_HOST_URL,
  })
  return axios.create(options)
}

async function post(url, data) {
  try {
    let response = await axios.post(url, data)
    if (response.status >= 200 && response.status <= 299) {
      return response.data
    }
    return {}
  } catch (error) {
    console.error(error)
    return {}
  }
}

async function get(url) {
  try {
    let response = await axios.get(url)
    if (response.status >= 200 && response.status <= 299) {
      return response.data
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  http,
  imgHttp,
  httpV1,
  post,
  get,
}
