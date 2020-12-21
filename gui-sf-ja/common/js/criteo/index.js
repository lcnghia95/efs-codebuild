// OAM-17509
import wrapper from './wrapper'
import { isAgentMobile } from '@/utils/client/common'

let REGEX = /.+\/(\d+)$/i
let REGEX_2ID = /.+\/(\d+)\/(\d+)$/i

const takenArea = {
  mobile: {
    '/systemtrade': 'main a[href*=\\/{href}\\/]',
    '/finance': 'main .sal-h01__l--fi a[href*=\\/{href}\\/]',
  },
  desktop: {
    '/systemtrade': 'main .right-content > div a[href*=\\/{href}\\/]',
    '/tools': 'main .slider-container a[href*=\\/{href}\\/]',
    '/finance': 'main .sal-h01__l--fi a[href*=\\/{href}\\/]',
    '/finance/navi': 'main .finance-layout .left-content a[href*=\\/{href}\\/]',
    '/finance/mailmagazine': 'main .salon-item .content a[href*=\\/{href}\\/]:nth-child(1)',
    '/products': 'main a[href*=systemtrade]:lt(5), main a[href*=tools]:lt(5)'
  }
}

const processList = {
  '/finance/navi': financeNavi,
  '/finance/videos': financeVideos,
  '/finance/mailmagazine': financeMailmagazine,
  '/event': event,
}

const processDetail = ['/finance/navi', '/finance/mailmagazine', '/finance/videos', '/event']

async function criteo() {
  if (location.pathname == '/') {
    // top page
    return { event: 'viewHome' }
  } else {
    // detect whether current URL is list or detail page
    let canon = $('head link[rel=canonical]'),
      href = (canon.get(0) || {}).href || '',
      isDetailUrl = REGEX.exec(href)

    if (isDetailUrl) {
      if (processDetail.some(e => href.includes(e))) {
        // window.productId will be set in each page
        // for example: /finance/navi/134/512 ==> ja/desktop/pages/finance/navi/_sid/_id.vue
        if (!window.productId) {
          return null
        }
        return { event: 'viewItem', item: `P${window.productId}` }
      }
      return { event: 'viewItem', item: `P${isDetailUrl[1]}` }
    } else {
      let subUrl = href.replace(/(.+:\/\/)?([^\/]+)/, '')
      href = subUrl.split('/')[1]
      let links, ta = takenArea[isAgentMobile(navigator.userAgent) ? 'mobile' : 'desktop'][subUrl]
      if (ta) {
        links = $(ta.replace(/{href}/, href))
      } else {
        links = $(`main a[href*=\\/${href}\\/]`)
      }
      return { event: 'viewList', item: await (processList[subUrl] || defaultProcessId).call(this, links) }
    }
  }
}

async function financeNavi(links) {
  let arr = [], obj = []
  for (let i in links) {
    let e = REGEX_2ID.exec(links[i].href)
    e && !obj.includes(e[1]) && obj.push(e[1]) && arr.push(this.GoGoHTTP.get(`/api/v3/surface/navi/series/${e[1]}`))
    if (arr.length == 3) {
      break
    }
  }
  return (await Promise.all(arr)).map(e => `P${e.series.pId}`)
}

async function financeVideos(links) {
  let arr = []
  for (let i in links) {
    let e = REGEX.exec(links[i].href)
    e && arr.push(this.GoGoHTTP.get(`/api/v3/surface/ggjtv/${e[1]}`))
    if (arr.length == 3) {
      break
    }
  }
  return (await Promise.all(arr)).map(e => `P${e.productId}`)
}

async function financeMailmagazine(links) {
  let arr = [], obj = []
  for (let i in links) {
    let e = REGEX_2ID.exec(links[i].href)
    e && !obj.includes(e[1]) && obj.push(e[1]) && arr.push(this.GoGoHTTP.get(`/api/v3/surface/mailmagazine/${e[2]}?salonId=${e[1]}`))
    if (arr.length == 3) {
      break
    }
  }
  return (await Promise.all(arr)).map(e => `P${e.productId}`)
}

async function event(links) {
  let arr = []
  for (let i in links) {
    let e = REGEX.exec(links[i].href)
    e && arr.push(this.GoGoHTTP.get(`/api/v3/surface/event/${e[1]}`))
    if (arr.length == 3) {
      break
    }
  }
  return (await Promise.all(arr)).map(e => `P${e.pId}`)
}

function defaultProcessId(links) {
  let arr = []
  for (let i = 0, l = links.length; i < l; i++) {
    let e = REGEX.exec(links[i].href)
    if (e && !~arr.indexOf(`P${e[1]}`)) {
      arr.push(`P${e[1]}`)
    }
    if (arr.length == 3) {
      break
    }
  }
  return arr
}

export default async function() {
  wrapper.call(this, await criteo.bind(this))
}