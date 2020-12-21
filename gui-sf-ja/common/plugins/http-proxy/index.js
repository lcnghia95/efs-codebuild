import httpClient from './http-client'

const { encodeURL } = require('@/utils/client/common')

const API_V3 = '/api/v3'

function isApplyMQ(url, req, config) {
  return (
    url.startsWith(API_V3) && req.headers['public-nats'] && !config.ignoreNats
  )
}

async function cacheFn(e, methodFn, url, ...args) {
  /*
   * 408 request timeout
   * 400 bad request
   * */
  if ([408, 400].includes(e.status)) {
    console.error(`Call ${url} failed. Send API direct to V3`, e)
    return methodFn(url, ...args)
  }
  // 503 service unavailable, in case restart server
  if (503 == e.status) {
    // re-try 3 times before throwing error
    for (let i = 0; i < 5; i++) {
      console.log('503 Retry call API', url, i + 1)
      await new Promise(resolve => setTimeout(resolve, 3e3))
      try {
        let res = await methodFn(url, ...args)
        return res
      } catch (err) {
        console.log('503 Retry call API', url, i + 1, 'failed')
      }
    }
  }
  console.error(`Call ${url} failed`, e)
  let er = new Error(e.message)
  er.statusCode = e.status
  return Promise.reject(er)
}

export default function(args) {
  if (process.browser) {
    // keep using http as normal on client side
    return httpClient.call(null, args)
  } else {
    let http = httpClient.call(null, args),
      getFn = http.get,
      postFn = http.post,
      putFn = http.put,
      deleteFn = http.delete

    http.get = async function(url, config = {}) {
      if (isApplyMQ(url, args.req, config)) {
        let params = config.params,
          tmp = ''
        if (params) {
          let { pathname, query } = require('url').parse(url, true)
          query = Object.assign(query, params)
          for (let k in query) {
            tmp += `${k}=${encodeURL(query[k])}&`
          }
          tmp = `${pathname}?${tmp}`
        } else {
          tmp = url
        }
        return require('./nats-request').default(API_V3, args.req, args.res, {
          url: tmp,
          method: 'GET',
        }).catch(e => cacheFn(e, getFn, url, config))
      }
      return getFn(url, config)
    }
    http.post = async function(url, body, config = {}) {
      if (isApplyMQ(url, args.req, config)) {
        return require('./nats-request').default(API_V3, args.req, args.res, {
          url,
          body,
          method: 'POST',
        }).catch(e => cacheFn(e, postFn, url, body, config))
      }
      return postFn(url, body, config)
    }
    http.put = async function(url, body, config = {}) {
      if (isApplyMQ(url, args.req, config)) {
        return require('./nats-request').default(API_V3, args.req, args.res, {
          url,
          body,
          method: 'PUT',
        }).catch(e => cacheFn(e, putFn, url, body, config))
      }
      return putFn(url, body, config)
    }
    http.delete = async function(url, config = {}) {
      if (isApplyMQ(url, args.req, config)) {
        return require('./nats-request').default(API_V3, args.req, args.res, {
          url,
          method: 'DELETE',
        }).catch(e => cacheFn(e, deleteFn, url, config))
      }
      return deleteFn(url, config)
    }
    return http
  }
}
