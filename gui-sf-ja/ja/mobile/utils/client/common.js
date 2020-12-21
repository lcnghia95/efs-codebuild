'use strict'

module.exports = {
  calPaging,
  createFormDataRequest,
  checkExtension,
  checkImgSize,
  checkImgWH,
  gotoLogin,
  setCookie,
  getCookie,
  encodeURL,
  getThumbnailYoutube,
  youtubeParser,
  exportCSVTemplate,
  editCss,
  pushState,
  isAgentMobile,
  isLoadMobile,
  convertToFxonHost,
  checkNested,
  filterInt,
  replaceLinkUrl,
  deleteCookie,
  formatPF,
  scollToOffest,
  tagRemoved,
}

const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/

function calPaging(data, currentPage, limit = 20, pageRange = 4) {
  if (!data || !data.length) {
    return {
      currentPage: 1,
      lastPage: 1,
      pagingFrom: 1,
      pagingTo: 1,
      data: [],
      from: 1,
      to: 1,
    }
  }
  currentPage = parseInt(currentPage) || 1
  let from = (currentPage - 1) * limit,
    to = Math.min(currentPage * limit, data.length),
    lastPage = Math.ceil(data.length / limit),
    pagingFrom = Math.max(currentPage - pageRange / 2, 1),
    pagingTo = Math.min(currentPage + pageRange / 2, lastPage),
    range = pagingTo - pagingFrom,
    dataReturn = data.slice(from, to)
  if (range < pageRange && range !== 0 && pageRange < lastPage) {
    if (pageRange - range <= lastPage - pagingTo) {
      pagingTo = pagingTo + pageRange - range
    } else {
      pagingFrom = pagingFrom - pageRange + range
    }
  }
  return {
    currentPage: currentPage,
    lastPage: lastPage,
    pagingFrom: pagingFrom,
    pagingTo: pagingTo,
    data: dataReturn,
    from: from + 1,
    to: to,
  }
}

function createFormDataRequest(files, url, propName, _isToUpdate) {
  if (files.length) {
    let fd = new FormData(),
      file = files[0],
      f = new Blob([file], { type: file.type })
    fd.append(propName || 'file', f, file.name)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ignoreAuth: true,
      isToUpdate: _isToUpdate,
    }
    return Vue.GoGoHTTP.post(url, fd, config)
  }
  return null
}

function checkExtension(file, exts) {
  let ext = file.name.split('.')
  return exts.indexOf(`.${ext[ext.length - 1].toLowerCase()}`) !== -1
}

function checkImgSize(file, maxSize) {
  // convert to MB
  return file.size / 1024 / 1024 < maxSize
}

function checkImgWH(base64, size, callbackFn) {
  if (!size || !size.w || !size.h) {
    callbackFn(base64)
    return
  }

  let i = new Image()
  i.onload = () => {
    if (i.width === size.w && i.height === size.h) {
      callbackFn(base64)
    }
  }
  i.src = base64
}

function gotoLogin(query) {
  location.href = `/login${query ? `?${query}` : ''}`
}

function setCookie(
  cookieName,
  value = '',
  expiredInMinutes = 24 * 60,
  path = '/'
) {
  let date = new Date()
  date.setTime(date.getTime() + expiredInMinutes * 60 * 1000)
  document.cookie = `${cookieName}=${value}; expires=${date.toUTCString()}; path=${path}; domain=${
    process.env.GOGO_DOMAIN
  }`
}

function deleteCookie(cookieName = '', path = '/') {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${
    process.env.GOGO_DOMAIN
  }`
}

function getCookie(cookieName, stringCookie, isGetRaw = false) {
  if (!stringCookie) {
    return ''
  }
  let cookies = stringCookie.split(';')
  for (let i = 0, l = cookies.length; i < l; i++) {
    let parts = cookies[i].split('=')
    // compare cookie name
    if (parts.shift().trim() == cookieName) {
      parts = parts.shift() || ''
      // return cookie value
      return isGetRaw ? parts : decodeURIComponent(parts)
    }
  }
  return ''
}

function encodeURL(str) {
  return encodeURIComponent(str)
    .replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16))
    .replace(/%(7C|60|5E)/g, (str, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
}

function getThumbnailYoutube(url) {
  if (!url) {
    return '/img/assets/pc/common/default/product.png'
  }
  let _match = url.match(rx)
  return _match ? `https://i.ytimg.com/vi/${_match[1]}/mqdefault.jpg` : null
}

function youtubeParser(url, autoplay = 0) {
  let _match = url.match(rx)
  if (autoplay) {
    return _match
      ? `https://www.youtube.com/embed/${_match[1]}?autoplay=1`
      : url
  } else {
    return _match ? `https://www.youtube.com/embed/${_match[1]}` : url
  }
}

function exportCSVTemplate(data, filename) {
  let blob = new Blob(['\uFEFF' + data], { type: 'text/csv;charset=utf-8' })
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    let elem = window.document.createElement('a')
    elem.href = window.URL.createObjectURL(blob)
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }
}

function editCss(outline, className) {
  let styleContent = ''
  if (outline.includes('<style type="text/css">')) {
    styleContent = outline.substring(
      '<style type="text/css">'.length,
      outline.indexOf('</style>')
    )
  } else if (outline.includes('<style>')) {
    styleContent = outline.substring(
      '<style>'.length,
      outline.indexOf('</style>')
    )
  } else {
    return outline
  }
  let fromIndex = 0,
    index = styleContent.indexOf('}', fromIndex),
    arr = []
  while (~index) {
    arr.push(className + ' ' + styleContent.substring(fromIndex, index + 1).replace(/(?:[\r])/g, '').replace(/(?:[\n])/g, ''))
    fromIndex = index + 1
    index = styleContent.indexOf('}', fromIndex)
  }
  outline = outline.replace(
    /<style[.\s\S]*<\/style>/g,
    '<style type="text/css">' + arr.join('') + '</style>'
  )
  return outline
}

function pushState(data, title, prefix = '', pathname = location.pathname) {
  let url = '',
    i,
    tmp
  if (typeof data === 'string') {
    url = data
  } else {
    for (i in data) {
      tmp = data[i]
      if (tmp !== null && tmp !== undefined) {
        url += `${i}/${tmp}/`
      }
    }
    url = url.substring(0, url.length - 1)
  }
  history.replaceState(
    data,
    title,
    `${pathname.replace(/\/$/, '')}/${prefix}${url}`
  )
  return `${pathname.replace(/\/$/, '')}/${prefix}${url}`
}

function isAgentMobile(userAgent) {
  return /mobile/i.test(userAgent) && !/ipad/i.test(userAgent)
}

function isLoadMobile(req) {
  let mobileProxy = process.env.MOBILE_SUPPORT_URL.split(',').map(
    e => new RegExp(e)
    ),
    userAgent = req ? req.headers['user-agent'] : navigator.userAgent,
    refer = (req.headers['referer'] || '')
      .split('/')
      .splice(3)
      .join('/')
      .split('?')[0],
    url = (req.originalUrl || req.url || '').split('?')[0],
    accept = req.headers['accept'] || '',
    isAcceptHtml = accept.includes('text/html'),
    forceRenderDesktop = getCookie('forceRenderDesktop', req.headers['cookie'])

  if (forceRenderDesktop) {
    return false
  }

  if (isAgentMobile(userAgent)) {
    if (isAcceptHtml) {
      if (mobileProxy.find(e => e.test(url))) {
        console.log(
          'Mobile URL',
          req.originalUrl || req.url,
          'isAcceptHtml',
          isAcceptHtml,
          'refer',
          refer,
          'userAgent',
          userAgent
        )
        return true
      }
    } else if (mobileProxy.find(e => e.test('/' + refer))) {
      return true
    }
  }
  return false
}

function convertToFxonHost(text) {
  if (!text) {
    return ''
  }
  let fxOnHost = process.env.FXON_URL
  return text
    .replace(/(?:href="\/)/g, `href="${fxOnHost}/`)
    .replace(/(?:src="\/)/g, `src="${fxOnHost}/`)
}

function checkNested(p, o) {
  return p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o)
}

function filterInt(value) {
  if (/^(-|\+)?([0-9]+|Infinity)$/.test(value)) return Number(value)
  return NaN
}

function replaceLinkUrl(content = '') {
  /* eslint-disable */
  let regex = /((http(s)?|ftp(s)?):\/\/[^"<\s]+)(?![^<>]*>|[^"]*?<\/a)/gm,
    imgEtx = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|svg)/g
  /* eslint-enable */
  content = content.slice().replace(regex, function(match) {
    if (imgEtx.test(match) || match.includes('img.gogojungle.co.jp')) {
      return match
    }
    return `<a href="${match}" target="_blank" class="cursor-pointer">${match}</a>`
  })
  return content
}

function formatPF(num) {
  if (num === undefined) {
    return '0.00'
  }
  if (parseInt(num) === 999999999 || num === '-') {
    return '-'
  }
  if (num < 0) {
    num = 0
  }
  return num.toFixed(2)
}

function scollToOffest(offet, scrollH = 10) {
  let el = $(offet)
  if (el.length) {
    $('html, body').animate(
      {
        scrollTop: $(offet).offset().top - scrollH,
      },
      800
    )
  }
}

function tagRemoved(text) {
  if (!text) {
    return text
  }
  return text
    .replace(/(&lt;)/gi, '<')
    .replace(/(&gt;)/gi, '>')
    .replace(/(<([^>]+)>)/gi, '')
    .substr(0, 300)
}
