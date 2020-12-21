const { isAgentMobile, getCookie } = require('@/utils/client/common')
const NATS = require('nats')

// const zlib = require('zlib')

function handleRes(res, headers, body, resolve) {
  // check whether request is already sent to client or not
  // true means it's already send to client
  if (res.headersSent) return
  for (let headersKey in headers) {
    res.setHeader(headersKey, headers[headersKey])
  }

  if (body == null || body == undefined) {
    return resolve([])
  }
  return resolve(body)
}

/**
 * @param subject
 * @param req
 * @param res
 * @param payload
 * @returns {Promise<any>}
 */
export default function(subject, req, res, payload) {
  return new Promise((resolve, reject) => {
    let nats = process.gogo.nats
    // set value for payload from req
    payload.headers = req.headers
    payload.headers['platform'] =
      isAgentMobile(req.headers['user-agent']) &&
      !getCookie('forceRenderDesktop', req.headers['cookie'])
        ? 'mobile'
        : 'desktop'
    nats.requestOne(`gogo.surface.${process.env.LANG}.${subject}`, payload, {}, 3e4, e => {
      try {
        if (e instanceof NATS.NatsError) {
          console.error('NATS request error', e)
          if (e.code == NATS.REQ_TIMEOUT) {
            return reject({
              // request timeout
              status: 408,
              message: '408 NATS request timeout',
            })
          }
          return reject({
            status: 500,
            message: '500 NATS request error',
          })
        }
        let h = e.header
        if (!h) {
          console.error('NATS response is invalid', payload.url, e)
          return reject({
            status: 503,
            message: '503 Response is invalid',
          })
        }

        // detect request status code is ok or not
        let sc = (h['Status-Code'] || [])[0]
        if (!sc || sc < 200 || sc >= 300) {
          return reject({
            status: sc,
            message: `${sc} Response is invalid`,
          })
        }
        return handleRes(res, e.header, e.body, resolve)
        // let ce = headers['Content-Encoding']
        // if (['gzip', 'deflate', 'compress'].includes(ce)) {
        //   zlib.gunzip(body, function(err, dezipped) {
        //     if (err) return reject()
        //
        //     delete headers['content-encoding']
        //     console.log('nats response parsed by gzip')
        //     handleRes(res, headers, JSON.parse(dezipped.toString()), resolve)
        //   })
        // } else {
        //   handleRes(res, headers, JSON.parse(body), resolve)
        // }
      } catch (exc) {
        console.error('NATS request error', exc)
        reject({
          status: 500,
          message: '500 NATS request error',
        })
      }
    })
  })
}
