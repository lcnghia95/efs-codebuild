import { getCookie } from '@/utils/client/common'

export const state = () => ({
  user: {},
  cartCnt: null,
  banners: {},
  advertisements: {},
  bcRoutes: [],
  isBot: false,
  // camBan: true,
})

export const mutations = {
  setUser: function(state, user) {
    state.user = user
  },
  setCartCount: function(state, count) {
    state.cartCnt = count
  },
  setBanners: function(state, banners) {
    state.advertisements.banners = banners
  },
  setAdvertisements: function(state, advertisements) {
    state.advertisements = advertisements
  },
  setBC: function(state, bcRoutes) {
    state.bcRoutes = bcRoutes
  },
  pushBC: function(state, bcRoute) {
    state.bcRoutes.push(bcRoute)
  },
  setIsBot: function(state, isBot) {
    state.isBot = isBot
  },
  // setCamBan: function(state, camBan) {
  //   state.camBan = camBan
  // },
}

export const getters = {
  getBanners: state => {
    return (state.advertisements || {}).banners || []
  },
  getAdvertisements: state => {
    return state.advertisements || {}
  },
  getUser: state => {
    return state.user || {}
  }
}

async function getAdvertisements(route, app, params, commit) {
  return new Promise(resolve => {
    if (!route.matched.length) {
      return resolve()
    }
    let path = getServicePath(app, route, params)
    app.GoGoHTTP.post('/api/v3/surface/advertisement', {
      service_path: path,
    }).then(data => {
      commit('setAdvertisements', data)
      resolve()
    })
  })
}

async function processCookie(req, commit) {
  return new Promise(resolve => {
    let stringCookie = req.headers['cookie'],
      uid = getCookie('uid', stringCookie),
      uname = getCookie('uname', stringCookie, true),
      isBuyuser = getCookie('isBuyuser', stringCookie),
      llt = parseInt(getCookie('llt', stringCookie)),
      isaff = parseInt(getCookie('isaff', stringCookie)),
      toolsCategories = getCookie('toolsCategories', stringCookie),
      toolsKeywords = getCookie('toolsKeywords', stringCookie)
      // camBan = getCookie('camBan', stringCookie)

    // OAM-24576
    uname = uname ? decodeURIComponent(uname.replace(/\+/g, ' ')) : ''
    commit('setUser', {
      id: uid,
      name: uname,
      isBuyuser: parseInt(isBuyuser),
      llt,
      isaff,
    })
    // commit('setCamBan', camBan != '0')
    toolsCategories &&
      commit('tools/setToolsCategories', toolsCategories.split(','))
    toolsKeywords && commit('tools/setToolsKeywords', toolsKeywords.split(','))
    resolve()
  })
}

function getServicePath(app, route, params) {
  let matched = route.matched[route.matched.length - 1],
    path,
    metaNewPath = matched.meta.originalPath
  if (metaNewPath || (!metaNewPath && metaNewPath === '')) {
    path = matched.parent
      ? [matched.parent.path, metaNewPath].join('/')
      : metaNewPath
  } else {
    path = matched.path
  }
  let pathRoute = app.router.resolve(path),
    routeParams = pathRoute.route.params
  path = path.replace(/\?/g, '')
  for (let r in routeParams) {
    let pr = (params[r] === undefined || params[r] === null) ? '' : params[r]
    path = path.replace(':' + r, pr)
  }
  return path
}

function checkBot(req, commit) {
  let ua = req.headers['user-agent'] || ''
  commit('setIsBot', /(Chrome-Lighthouse|bot)/i.test(ua))
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  async nuxtServerInit({ commit }, { req, route, app, params }) {
    try {
      await Promise.all([
        getAdvertisements(route, app, params, commit),
        processCookie(req, commit),
        checkBot(req, commit)
      ])
    } catch (e) {
      console.error(e)
    }
  },
}
