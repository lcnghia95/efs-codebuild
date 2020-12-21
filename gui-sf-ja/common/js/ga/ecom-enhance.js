'use strict'

import categories from '@@/lang/common/categories.json'
import types from '@@/lang/common/types.json'
const cateList = categories['ja']
const typeList = types['ja']

export function trackingPurchase(data) {
  if (!data || !Object.keys(data).length || !(data.items || []).length) {
    return
  }
  for (let i in data.items) {
    if (data.items[i]) {
      data.items[i].category = `${typeList[data.items[i].typeId]}${data.items[i].category ? ('/' + cateList[data.items[i].category]) : ''}`
      delete data.items[i].typeId
    }
  }
  window.gtag && window.gtag('event', 'purchase', data)
}

export function trackingEventView(data) {
  const cat = data.categories.sort((a, b) => {
    return a - b
  })[0] || undefined
  window.gtag && window.gtag('event', 'view_item', {
    items: [
      {
        id: data.pId,
        name: data.title,
        list_name: '',
        brand: data.devId,
        category: `イベント${cat ? ('/' + cateList[cat]) : ''}`,
        variant: '',
        list_position: 1,
        quantity: 1,
        price: data.price
      }
    ]
  })
}

export function trackingMagazineSalonView(data) {
  window.gtag && window.gtag('event', 'view_item', {
    items: [
      {
        id: data.id,
        name: data.name,
        list_name: '',
        brand: data.userId,
        category: `サロン${data.category ? ('/' + cateList[data.category]) : ''}`,
        variant: '',
        list_position: 1,
        quantity: 1,
        price: (data.cartInfo || {}).price || 0
      }
    ]
  })
}

export function trackingMagazineSalonDetailView(data) {
  window.gtag && window.gtag('event', 'view_item', {
    items: [
      {
        id: data.productId,
        name: data.name,
        list_name: '',
        brand: data.seller.id,
        category: `サロン${data.category ? ('/' + cateList[data.category]) : ''}`,
        variant: '',
        list_position: 1,
        quantity: 1,
        price: (data.cartInfo || {}).price || 0
      }
    ]
  })
}

export function trackingSeriesView(data) {
  window.gtag && window.gtag('event', 'view_item', {
    items: [{
      id: data.series.pId,
      name: data.series.title,
      list_name: '',
      brand: data.series.userId,
      category: '投資ナビ＋',
      variant: '',
      list_position: 1,
      quantity: 1,
      price: (data.series || {}).price || 0
    }]
  })
}

export function trackingNaviArticleView(data) {
  if (data.isPassword) {
    return
  }

  if (!data.productId && !data.seriesProductId) {
    return
  }

  window.gtag && window.gtag('event', 'view_item', {
    items: [{
      id: data.productId || data.seriesProductId,
      name: data.productName,
      list_name: '',
      brand: data.user.id,
      category: '投資ナビ＋',
      variant: '',
      list_position: 1,
      quantity: 1,
      price: data.productId ? ((data.cartInfo.article || {}).price || 0) : ((data.cartInfo.serie || {}).price || 0)
    }]
  })
}

export function trackingSalonsView(data) {
  window.gtag && window.gtag('event', 'view_item', {
    items: [{
      id: data.id,
      name: data.name,
      list_name: '',
      brand: data.userId,
      category: `サロン${data.category ? ('/' + cateList[data.category]) : ''}`,
      variant: '',
      list_position: 1,
      quantity: 1,
      price: (data.cartInfo || {}).price || 0
    }]
  })
}

export function trackingVideoView(data) {
  data.cartInfo && data.cartInfo.price &&
    window.gtag &&
    window.gtag('event', 'view_item', {
      items: [
        {
          id: data.productId,
          name: data.productName,
          list_name: '',
          brand: data.userId,
          category: `動画${data.category ? '/' + cateList[data.category] : ''}`,
          variant: '',
          list_position: 1,
          quantity: 1,
          price: (data.cartInfo || {}).price || 0,
        },
      ],
    })
}

export function trackingSystemtradeDetailView(data, isStock = false) {
  window.gtag && window.gtag('event', 'view_item', {
    items: [{
      id: data.id,
      name: data.name,
      list_name: '',
      brand: data.user.id,
      category: `システムトレード/${isStock ? '株式' : 'FX'}`,
      variant: '',
      list_position: 1,
      quantity: 1,
      price: (data.cartInfo || {}).price || 0
    }]
  })
}

export function trackingToolsDetailView(data) {
  const category = (data.categories.split(',')).sort((a, b) => a - b)[0] || ''
    let type = '電子書籍'
    if (data.typeId == 70 || data.typeId == 71) {
      type = 'セット商品'
    } else if (data.typeId == 2) {
      type = 'インジケーター'
    }
    window.gtag && window.gtag('event', 'view_item', {
      items: [{
        id: data.id,
        name: data.name,
        list_name: '',
        brand: data.user.id,
        category: `${type}${category ? ('/' + cateList[category]) : ''}`,
        variant: '',
        list_position: 1,
        quantity: 1,
        price: (data.cartInfo || {}).price || 0
      }]
    })
}

export function trackingAddToCart(data) {
  const id = (data.article || {}).productId || (data.serie || {}).productId || data.productId
  const name = (data.article || {}).name || (data.serie || {}).name || data.name
  const brand = (data.article || {}).devId || (data.serie || {}).devId || data.devId
  const price = (data.article || {}).productId ? (data.article || {}).price :
    (data.serie || {}).productId ? (data.serie || {}).price :
    data.price
  window.gtag && window.gtag('event', 'add_to_cart', {
    items: [
      {
        id,
        name,
        list_name: '',
        brand,
        category: `${typeList[data.type]}${data.category ? ('/' + cateList[data.category]) : ''}`,
        variant: '',
        list_position: 1,
        quantity: 1,
        price,
      }
    ]
  })
}

function getItemById(list, id, i = 'product') {
  return list.find(item => {
    return i
      ? item[i].id == id || (item['seriesProduct'] || {}).id == id
      : item.id == id
  })
}

export function trackingRemoveFromCart(data, index) {
  if (!data || !Object.keys(data).length || index < 0) {
    return
  }
  let price,
    pri
  if (!data.priceId) {
    price = data.prices[0]
  } else {
    price = getItemById(data.prices, data.priceId, 0)
  }
  pri = price.offType1 ? price.campaign1 : (price.offType0 ? price.campaign0 : price.price)
  const id = price.productId
  let name = data.product.name
  if (data.seriesProduct) {
    if (data.seriesProduct.id == id) {
      name = data.seriesProduct.name
    }
  }
  window.gtag && window.gtag('event', 'remove_from_cart', {
    items: [
      {
        id,
        name,
        list_name: '',
        brand: data.user.id,
        category: `${typeList[data.product.typeId]}${data.product.categories ? ('/' + cateList[data.product.categories]) : ''}`,
        variant: '',
        list_position: index + 1,
        quantity: 1,
        price: pri,
      }
    ]
  })
}

export function trackingBeginCheckout(buyNow) {
  if (!buyNow || !buyNow.length) {
    return
  }
  let items = []
  for (let i in buyNow) {
    if (buyNow[i]) {
      const data = buyNow[i]
      let price,
        pri
      if (!data.priceId) {
        price = data.prices[0]
      } else {
        price = getItemById(data.prices, data.priceId, 0)
      }
      pri = price.offType1 ? price.campaign1 : (price.offType0 ? price.campaign0 : price.price)
      const id = price.productId
      let name = data.product.name
      if (data.seriesProduct) {
        if (data.seriesProduct.id == id) {
          name = data.seriesProduct.name
        }
      }
      items.push({
        id,
        name,
        list_name: '',
        brand: data.user.id,
        category: `${typeList[data.product.typeId]}${data.product.categories ? ('/' + cateList[data.product.categories]) : ''}`,
        variant: '',
        list_position: parseInt(i) + 1,
        quantity: data.count,
        price: pri,
      })
    }
  }
  window.gtag && window.gtag('event', 'begin_checkout', {items})
}

export function trackingCheckoutProgress(buyNow) {
  if (!buyNow || !buyNow.length) {
    return
  }
  let items = []
  for (let i in buyNow) {
    if (buyNow[i]) {
      const data = buyNow[i]
      let price,
        pri
      if (!data.priceId) {
        price = data.prices[0]
      } else {
        price = getItemById(data.prices, data.priceId, 0)
      }
      pri = price.offType1 ? price.campaign1 : (price.offType0 ? price.campaign0 : price.price)
      const id = price.productId
      let name = data.product.name
      if (data.seriesProduct) {
        if (data.seriesProduct.id == id) {
          name = data.seriesProduct.name
        }
      }
      items.push({
        id,
        name,
        list_name: '',
        brand: data.user.id,
        category: `${typeList[data.product.typeId]}${data.product.categories ? ('/' + cateList[data.product.categories]) : ''}`,
        variant: '',
        list_position: parseInt(i) + 1,
        quantity: data.count,
        price: pri,
      })
    }
  }
  window.gtag && window.gtag('event', 'checkout_progress', {items})
}

export async function trackingUserRegister(lang) {
  window.gtag && window.gtag('event', 'regist', {
    event_category: 'member',
    event_label: lang || 'ja',
    value: 0
  })
  // https://gogojungle.backlog.jp/view/OAM-42012
  // add waiting time 500ms to make sure it works properly
  console.log('GA Event regist Begin')
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('GA Event regist End')
}
