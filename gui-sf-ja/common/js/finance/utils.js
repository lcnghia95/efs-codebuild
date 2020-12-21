'use strict'

import { gotoLogin } from '@/utils/client/common'

export function onNaviFollow() {
  if (this.loadingFollow) return
  if (!this.$store.state.user.id) {
    gotoLogin(`u=${location.pathname}`)
    return
  }

  this.loadingFollow = true
  if (this.followFn) {
    this.followFn(this.item).finally(() => {
      this.loadingFollow = false
    })
  } else {
    this.GoGoHTTP.post('/api/v3/surface/navi/readlater/article', {
      articleId: this.item.id,
    }).finally(() => {
      this.loadingFollow = false
    })
  }
}

export async function onNaviFollowItem(item) {
  let res = {}
  if (this.loadingFollow) return Promise.resolve()
  if (!this.$store.state.user.id) {
    gotoLogin(`u=${location.pathname}`)
    return Promise.resolve()
  }

  this.loadingFollow = true
  res = await this.GoGoHTTP.post('/api/v3/surface/navi/readlater/article', {
    articleId: item.id,
  }).finally(() => {
    this.loadingFollow = false
  })
  item.isReadLater = res.status
  Promise.resolve(res.status)
}

export function onNaviFavorite() {
  let isSeries = this.item.isReadLater === undefined
  if (this.loadingFavorite) return
  if (!this.$store.state.user.id) {
    gotoLogin(`u=${location.pathname}`)
    return
  }

  this.loadingFavorite = true
  if (this.favoriteFn) {
    this.favoriteFn(this.item).finally(() => {
      this.loadingFavorite = false
    })
  } else {
    this.GoGoHTTP.post(
      isSeries
        ? '/api/v3/surface/navi/favorite/series'
        : '/api/v3/surface/navi/favorite/article',
      isSeries ? { seriesId: this.item.sId } : { articleId: this.item.id }
    ).finally(() => {
      this.loadingFavorite = false
    })
  }
}

export async function onNaviFavoriteItem(item) {
  let res = {},
    isSeries = item.isReadLater === undefined,
    apiUrl = isSeries
      ? '/api/v3/surface/navi/favorite/series'
      : '/api/v3/surface/navi/favorite/article'
  if (this.loadingFavorite) return Promise.resolve()
  if (!this.$store.state.user.id) {
    gotoLogin(`u=${location.pathname}`)
    return Promise.resolve()
  }

  this.loadingFavorite = true
  res = await this.GoGoHTTP.post(
    apiUrl,
    isSeries ? { seriesId: item.sId } : { articleId: item.id }
  ).finally(() => {
    this.loadingFavorite = false
  })
  item.isFavorite = res.status
  Promise.resolve(res.status)
}

export function getNaviImg(data, url) {
  if (data.image) {
    return data.image
  }
  return url + data.id + '/small'
}

export function setStoreData(data) {
  let storeData = this.$store.getters['finance/getFavData']
  let favData = {
      favorite: storeData.favorite.slice(0),
      follow: storeData.follow.slice(0),
      purchase: storeData.purchased.slice(0)
    }

  data.map(article => {
    let obj = {
      id: article.id,
      seriesId: article.seriesId,
      title: article.title
    }
    if (article.isFavorite) {
      favData.favorite.push(obj)
    }
    if (article.isReadLater) {
      favData.follow.push(obj)
    }
    if (article.isPurchased) {
      favData.purchase.push(obj)
    }
  })
  this.$store.commit('finance/setFavData', favData)
}