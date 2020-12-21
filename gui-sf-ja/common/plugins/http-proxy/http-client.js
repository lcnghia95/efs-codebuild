import Vue from 'vue'
import axios from 'axios'
import isRetryAllowed from 'is-retry-allowed'
import { isAgentMobile, getCookie } from '@/utils/client/common'

const RETRIES = 3

export default function({ app, req, res }) {
  const options = {
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }
  let http = axios.create(options)

  http.interceptors.request.use(
    config => {
      config.retryCount = config.retryCount || 0
      let r = null
      if (process.server) {
        // only accept on server side
        // in case render from server, we will re-config some options
        // 1. sync cookie
        // 2. Change baseURL
        if (config.url.startsWith('/api/v3')) {
          config.baseURL = process.env.NEW_API_URL
        } else if (config.url.startsWith('/api/kabu')) {
          config.baseURL = process.env.KABU_API_URL
        } else if (config.url.startsWith('/api/re')) {
          config.baseURL = process.env.RE_API_URL
        } else if (!config.baseURL) {
          config.baseURL = process.env.MYPAGE_URL
        }
        let reqCookie = req.headers['cookie']
        if (reqCookie) {
          config.headers['cookie'] = reqCookie
        }
        r = req.headers['user-agent']
      } else {
        r = navigator.userAgent
      }
      // platform detection:
      config.headers['platform'] =
        isAgentMobile(r) &&
        !getCookie('forceRenderDesktop', config.headers['cookie'])
          ? 'mobile'
          : 'desktop'
      return config
    },
    error => {
      // Do something with request error
      return Promise.reject(error)
    }
  )

  http.interceptors.response.use(
    response => {
      if (process.server) {
        // only accept on server side
        let resCookie = response.headers['set-cookie']
        if (resCookie) {
          res.setHeader('Set-Cookie', resCookie)
        }
      }
      return response.data
    },
    error => {
      let config = error.config,
        shouldRetry =
          error.code !== 'ECONNABORTED' &&
          error.response &&
          error.response.status === 429 &&
          config.retryCount < RETRIES &&
          isRetryAllowed(error)

      if (shouldRetry) {
        config.retryCount += 1
        let delay = error.response.headers['retry-after'] || 30

        console.log(`Too many request. Retry after ${delay} seconds`)
        return new Promise(resolve =>
          setTimeout(() => resolve(http(config)), delay * 1e3)
        )
      } else if (['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET'].includes(error.code) && config.retryCount < RETRIES) {
        config.retryCount += 1
        console.log('Call %s %s. Retry after 8 seconds', config.url, error.code)
        return new Promise(resolve =>
          setTimeout(() => resolve(http(config)), 8e3)
        )
      }
      // Do something with response error
      return Promise.reject(error)
    }
  )

  if (process.client) {
    // only affect on client side
    Vue.use({
      install: function(Vue) {
        Vue.prototype.GoGoHTTP = http
      },
    })
  }
  app.GoGoHTTP = http
  return http
}
