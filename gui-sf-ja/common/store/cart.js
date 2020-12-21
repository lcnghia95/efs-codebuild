function submitCartForm(action) {
  let form = document.createElement('form'),
    element1 = document.createElement('input')
  form.method = 'POST'
  form.action = action

  element1.value = 1
  element1.name = 'add'
  element1.type = 'hidden'
  form.appendChild(element1)

  document.body.appendChild(form)
  form.submit()
  form.remove()
}

function getProductPrice(state, productId) {
  // tools, systemtrade, event, review, navi series
  if(state.info.price) {
    return state.info.price
  }

  // navi article
  if(state.info.article && state.info.article.productId == productId) { // buy article
    return state.info.article.price
  } 
  else if(state.info.serie && state.info.serie.productId == productId) { // buy series of the article
    return state.info.serie.price
  }

  // 
  return 0
}

import { gotoLogin } from '@/utils/client/common'
import {trackingAddToCart} from '@@/../common/js/ga/ecom-enhance'
export default {
  state: () => ({
    info: {},
    isPassword: 0,
    productStatus: -1,
  }),
  mutations: {
    setCart: function(state, cart) {
      state.info = cart
    },
    isPassword: function(state, isPassword) {
      if (isPassword !== undefined) {
        state.isPassword = isPassword
      }
    },
    productStatus: function(state, productStatus) {
      if (productStatus !== undefined) {
        state.productStatus = productStatus
      }
    },
    setInfo: function(state, data) {
      state.info = Object.assign(
        {},
        { isFavorite: 0, isPortfolio: 0 },
        data.info
      )
      if (data.isPassword !== undefined) {
        state.isPassword = data.isPassword
      }
      if (data.productStatus !== undefined) {
        state.productStatus = data.productStatus
      }
    },
    updateFav: function(state, prevFav) {
      state.info.isFavorite = prevFav ? 0 : 1
      state.info.favoriteCount += prevFav ? -1 : 1
    },
    updateFavv1: function(state, { prevFav, obj }) {
      // refactor later
      let info = obj ? state.info[obj] : state.info
      info.isFavorite = prevFav ? 0 : 1
      info.favoriteCount += prevFav ? -1 : 1
    },
    updatePortfolio: function(state, prevPor) {
      state.info.isPortfolio = prevPor ? 0 : 1
    },
  },
  actions: {
    addToCart(ctx, { productId, price = undefined }) {
      let _price = price === undefined ? getProductPrice(ctx.state, productId) : price

      // OAM-35661 add google event
      window.gtag && window.gtag('event', 'add', {
        event_category: 'cart',
        event_label: parseInt(productId),
        value: parseInt(_price),
      })
      trackingAddToCart(ctx.state.info)
      submitCartForm(`/cart/add/${productId}`)
    },
    favorite(ctx, vm) {
      if (!ctx.rootState.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      let prevFav = ctx.state.info.isFavorite,
        url =
          `/api/v3/surface/favorite/${ctx.state.info.productId}` +
          (prevFav === 1 ? '/remove' : '')
      vm.GoGoHTTP.post(url, { pId: ctx.state.info.productId }).then(() => {
        ctx.commit('updateFav', prevFav)
      })
    },
    favoritev1(ctx, { vm, productId, obj }) {
      // refactor later
      if (!ctx.rootState.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      let prevFav = obj
          ? ctx.state.info[obj].isFavorite
          : ctx.state.info.isFavorite,
        url =
          `/api/v3/surface/favorite/${productId}` +
          (prevFav === 1 ? '/remove' : '')
      vm.GoGoHTTP.post(url, { pId: productId }).then(() => {
        ctx.commit('updateFavv1', { prevFav, obj })
      })
    },
    portfolio(ctx, vm) {
      if (!ctx.rootState.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      let isPortfolio = ctx.state.info.isPortfolio,
        url =
          `/api/v3/surface/portfolio/${ctx.state.info.productId}` +
          (isPortfolio === 1 ? '/remove' : '/select')
      vm.GoGoHTTP.post(url, { pId: ctx.state.info.productId }).then(() => {
        ctx.commit('updatePortfolio', isPortfolio)
      })
    },
  },
  getters: {
    payments: state => {
      return state.info.payments || {}
    },
    isPassword: state => {
      return state.isPassword
    },
    productStatus: state => {
      return state.productStatus
    },
  },
}
