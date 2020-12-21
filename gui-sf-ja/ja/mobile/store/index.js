import { getCookie } from '@/utils/client/common'

export const state = () => ({
  user: {},
  banners: {},
  advertisements: {},
  cartCnt: null,
  isBot: false,
  // camBan: true,
})

export const mutations = {
  setUser: function (state, user){
    state.user = user
  },
  setBanners: function(state, banners) {
    state.advertisements.banners = banners
  },
  setCartCount: function(state, count) {
    state.cartCnt = count
  },
  setAdvertisements: function(state, advertisements) {
    state.advertisements = advertisements
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
    return state.advertisements || []
  },
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
  path = pathRoute.route.path
  for (let r in routeParams) {
    path = path.replace(routeParams[r], params[r])
  }
  return path
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
      if (data && data.banners) {
        commit('setBanners', data.banners)
      }
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
      isaff = parseInt(getCookie('isaff', stringCookie))
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
    // toolsCategories &&
    //   commit('tools/setToolsCategories', toolsCategories.split(','))
    // toolsKeywords && commit('tools/setToolsKeywords', toolsKeywords.split(','))
    resolve()
  })
}

async function checkBot(req, commit) {
  let ua = req.headers['user-agent'] || ''
  commit('setIsBot', /(Chrome-Lighthouse|bot)/i.test(ua))
}
