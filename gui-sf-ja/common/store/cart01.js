function dec(exec) {
  return function(state, data) {
    exec(state, data)
    data.cb && data.cb()
  }
}
function getItemById(list, id, i = 'product') {
  return list.find(item => {
    return i
      ? item[i].id == id || (item['seriesProduct'] || {}).id == id
      : item.id == id
  })
}

function submitSoftBank(action, data) {
  let form = document.createElement('form')
  form.method = 'POST'
  form.action = action
  form.name = 'sps_f'
  form.acceptCharset = 'Shift_JIS'

  for (let i in data) {
    let el = document.createElement('input'),
      d = data[i]
    el.value = d[1]
    el.name = d[0]
    el.type = 'hidden'
    form.appendChild(el)
  }

  document.body.appendChild(form)
  form.submit()
  form.remove()
}
const NAVI_PRODUCT_TYPE_ID = 3
const maps = {
  1: 'bank',
  2: 'card',
  3: 'card2',
  4: 'store',
  5: 'tran',
}
function getPayments(products) {
  let payIds = [1, 2, 3, 4, 5]
  for (let pId in products) {
    let product = products[pId] || {},
      list = [1, 2, 3, 4]
    if (!product.id) {
      continue
    }
    if (product.id == 14359) {
      // TODO: refactor this block later
      list = [2]
    } else if (product.typeId == 4) {
      list = product.isFreeFirstMonth ? [2] : [2, 5]
    } else if (
      product.typeId == NAVI_PRODUCT_TYPE_ID &&
      product.isSubscription === 1
    ) {
      list = [2]
    } else if (product.isSubscription === 1) {
      list = [2]
    }
    payIds = payIds.filter(payId => -1 !== list.indexOf(payId))

    if (payIds.length == 0) {
      return []
    }
  }
  return payIds.reduce((result, payId) => {
    result[maps[payId]] = 1
    return result
  }, {})
}
import {trackingRemoveFromCart} from '@@/../common/js/ga/ecom-enhance'
export default {
  state: () => ({
    data: {
      buyNow: [],
      buyLater: [],
      info: {},
      dvdOpt: 0,
      payId: null,
      dvdOptPrice: {
        0: 0,
        1: 550,
        2: 1100,
      },
      terms: {},
      checkList: [],
      salonsConfirm: false,
      buyer: {},
      storeId: 1,
      showUserModal: false,
    },
  }),
  mutations: {
    setData: function(state, data) {
      if (!Object.keys(data).length) {
        // TODO: Vi Nguyeen - need to review these properties
        data = {
          buyLater: [],
          buyNow: [],
          cannotBuy: [],
          conclusionBefore: {},
          info: {},
          isAddressRequired: false,
          isLoginRequired: false,
        }
      }
      state.data = Object.assign({}, state.data, data)
    },
    setPaymentType: function(state, isSub) {
      let p = state.data.info.payments
      if (isSub) {
        for (let pKey in p) {
          if (pKey != 'card') {
            p[pKey] = 0
          }
        }
      } else {
        let prod = state.data.buyNow.reduce((acc, cur) => {
          acc[cur.product.id] = cur.product
          return acc
        }, {})
        state.data.info.payments = getPayments(prod)
      }
    },
    changePrice: dec(function(state, data) {
      let p = getItemById(state.data.buyNow, data.id)
      p.priceId = data.priceId
    }),
    changeQuantity: dec(function(state, data) {
      let p = getItemById(state.data.buyNow, data.id)
      p.count = data.quantity
    }),
    moveToBuyLater: dec(function(state, data) {
      let p = getItemById(state.data.buyNow, data.id)
      state.data.buyNow = state.data.buyNow.filter(item => {
        return item.product.id != data.id
      })
      state.data.buyLater.push(p)
      state.data.buyNow.length && location.reload()
    }),
    moveToBuyNow: dec(function(state, data) {
      let p = getItemById(state.data.buyLater, data.id)
      state.data.buyLater = state.data.buyLater.filter(item => {
        return item.product.id != data.id
      })
      state.data.buyNow.push(p)
      location.reload()
    }),
    deleteFromCart: dec(function(state, data) {
      let list = data.buyLater ? 'buyLater' : 'buyNow'
      state.data[list] = state.data[list].filter(item => {
        return item.product.id != data.id
      })
      !data.buyLater && state.data.buyNow.length && location.reload()
    }),
    onAgreeContract(state, data) {
      let p = getItemById(state.data.buyNow, data.id)
      data.vm.$set(p, 'contract', data.contract)
    },
    setDvd(state, data) {
      state.data.dvdOpt = parseInt(data.dvdOpt)
    },
    setPayId(state, data) {
      state.data.payId =
        typeof data.payId === 'number' ? parseInt(data.payId) : data.payId
    },
    setTerm(state, data) {
      state.data.terms[data.id] = data.content
    },
    setCheckList(state, data) {
      state.data.checkList = data
    },
    onConfirmSalonsBefore(state, data) {
      state.data.salonsConfirm = data
    },
    setUserData(state, data) {
      state.data.buyer = data
    },
    setStoreId(state, data) {
      state.data.storeId = data
    },
    setShowUserModal(state, data) {
      state.data.showUserModal = data
    },
  },
  actions: {
    submitCreditCard(context, { action, data }) {
      submitSoftBank(action, data)
    },
    changeQuantity(context, data) {
      let { http, id, quantity, price } = data

      // https://gogojungle.backlog.jp/view/OAM-35661#comment-78114744
      window.gtag && window.gtag('event', 'change', {
        event_category: 'cart',
        event_label: parseInt(data.id),
        value: parseInt(price),
      })

      http
        .post(`/api/v3/cart/edit/${id}`, { type: 3, quantity })
        .then((cData) => {
          context.commit('setData', cData)
          context.commit('changeQuantity', data)
        })
        .catch(err => {
          data.cb(err)
        })
    },
    changePrice(context, data) {
      let { http, id, priceId } = data
      http
        .post(`/api/v3/cart/edit/${id}`, { type: 4, priceId })
        .then((cData) => {
          context.commit('setData', cData)
          context.commit('changePrice', data)
        })
        .catch(err => {
          data.cb(err)
        })
    },
    moveToBuyLater(context, data) {
      let { http, id, price } = data

      // https://gogojungle.backlog.jp/view/OAM-35661#comment-78114744
      window.gtag && window.gtag('event', 'later', {
        event_category: 'cart',
        event_label: parseInt(id),
        value: parseInt(price),
      })

      http
        .post(`/api/v3/cart/edit/${id}`, { type: 2 })
        .then(cData => {
          context.commit('setData', cData)
          // context.commit('moveToBuyLater', data)
        })
        .catch(err => {
          data.cb(err)
        })
    },
    moveToBuyNow(context, data) {
      let { http, id, price } = data

      window.gtag && window.gtag('event', 'cart', {
        event_category: 'cart',
        event_label: parseInt(id),
        value: parseInt(price),
      })

      http
        .post(`/api/v3/cart/edit/${id}`, { type: 1 })
        .then(cData => {
          context.commit('setData', cData)
          // context.commit('moveToBuyNow', data)
        })
        .catch(err => {
          data.cb(err)
        })
    },
    deleteFromCart(context, data) {
      let { http, id, price } = data

      // OAM-35661 add google event
      window.gtag && window.gtag('event', 'remove', {
        event_category: 'cart',
        event_label: parseInt(id),
        value: parseInt(price),
      })
      const buyNow = context.getters['buyNow']
      const buyLater = context.getters['buyLater']
      const idxNow = buyNow.findIndex(e => e.product.id == id)
      const idxLater = buyLater.findIndex(e => e.product.id == id)
      const dataTracking = idxNow > -1 ? buyNow[idxNow] : buyLater[idxLater]
      trackingRemoveFromCart(dataTracking, idxNow > -1 ? idxNow : idxLater)
      //
      http
        .delete(`/api/v3/cart/remove/${id}`)
        .then(cData => {
          context.commit('setData', cData)
          // context.commit('deleteFromCart', data)
        })
        .catch(err => {
          data.cb(err)
        })
    },
  },
  getters: {
    buyNow: state => {
      return (
        state.data.buyNow.filter(item => {
          return item.count
        }) || []
      )
    },
    buyLater: state => {
      return (
        state.data.buyLater.filter(item => {
          return item.count
        }) || []
      )
    },
    dataConfirm: state => {
      return state.data.data || []
    },
    sumPrice: (state, getters) => {
      return (state.data.data || state.data.buyNow).reduce((sum, product) => {
        let price,
            p,
            pri
        if (!product.priceId) {
          price = product.prices[0]
        } else {
          price = getItemById(product.prices, product.priceId, 0)
        }
        pri = price.offType1 ? price.campaign1 : (price.offType0 ? price.campaign0 : price.price)
        p = getters.isAllSalon && state.data.payId === 5
            ? pri * 3
            : pri
        sum += p * (product.count || 1)
        return sum
      }, 0)
    },
    agreeAll: state => {
      let p = state.data.buyNow.find(item => {
        return item.product.isAdvising && !item.contract
      })
      return !p
    },
    hasDvd: state => {
      return state.data.info.hasDvd
    },
    hasAdvising: state => {
      return !!state.data.buyNow.find(item => {
        return item.product.isAdvising
      })
    },
    hasError: state => {
      return !!state.data.buyNow.find(item => {
        return item.error
      })
    },
    dvdOpt: state => {
      return state.data.dvdOpt
    },
    payId: state => {
      return state.data.payId
    },
    payments: state => {
      return state.data.info.payments || {}
    },
    dvdPrice: state => {
      return state.data.dvdOptPrice[state.data.dvdOpt]
    },
    allDvDPrice: state => {
      return state.data.dvdOptPrice
    },
    productCount: state => {
      return (state.data.data || state.data.buyNow).reduce((sum, product) => {
        sum += product.count || 0
        return sum
      }, 0)
    },
    isAllSalon: state => {
      return (
        (state.data.data || state.data.buyNow).length &&
        !(state.data.data || state.data.buyNow).find(
          item => item.product.isAdvising != 1
        )
      )
    },
    bankTranFee: state => {
      return state.data.payId == 5 ? 1000 : 0
    },
    dataAdvising: state => {
      let p = state.data.buyNow.filter(item => {
        return item.product.typeId == 4
      })
      return p
    },
    checkList: state => {
      return state.data.checkList
    },
    normalAll: state => {
      let normal = state.data.buyNow.filter(item => {
        return !item.product.isAdvising && item.product.typeId !== 4
      })
      return state.data.checkList.length == normal.length
    },
    confirmAgreeAll: (state, getters) => {
      return (
        getters.normalAll &&
        (getters.hasAdvising ? state.data.salonsConfirm : true)
      )
    },
    buyer: state => {
      return state.data.buyer
    },
    getContractBefore: state => {
      return state.data.conclusionBefore || {}
    },
    getConclusion: state => {
      return state.data.conclusion || {}
    },
    storeId: state => {
      return state.data.storeId
    },
    isUserInfoOk: state => {
      return (
        !state.data.isAddressRequired ||
        !!(state.data.isAddressRequired &&
          state.data.buyer.firstName &&
          state.data.buyer.lastName &&
          state.data.buyer.firstNameKana &&
          state.data.buyer.lastNameKana &&
          state.data.buyer.zip &&
          state.data.buyer.prefectureId &&
          state.data.buyer.address1 &&
          state.data.buyer.address2 &&
          state.data.buyer.tel)
      )
    },
    isUserForeignInfoOk: state => {
      return (
        !!state.data.buyer.firstName &&
        !!state.data.buyer.lastName
      )
    },
    showUserInfoPopup: state => {
      return state.data.showUserModal
    },
    isCampaign: state => {
      let bn = state.data.buyNow
      if (!bn || !bn.length || !state.data.showFFM) {
        return false
      }
      return bn.some(e => e.product && e.product.id == 18725) ? '18725' : 'N'
    },
  },
}
