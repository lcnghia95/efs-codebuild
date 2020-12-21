import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-seriesdetail.json'
import titleI18n from '@@/lang/common/navi-series-detail-title.json'
import { calPaging, filterInt, pushState, gotoLogin } from '@/utils/client/common'
import {trackingSeriesView} from '@@/../common/js/ga/ecom-enhance'
import SeriesDetailPage from "@@/../common/pages/navi/series/series-detail-page.vue"
import { checkNested } from "@/utils/client/common"

function getData(store, params, data) {
  store.commit('cart/setInfo', {
    productStatus: data.status,
    isPassword: data.isPassword,
    productId: data.pId,
    devId: data.userId,
    name: data.title,
    price: data.price,
    type: 3,
    page: 1,
  })

  let titleChunk = (data.series || { title: '' }).title,
    originUrl = `/finance/navi/series/${params.id}`,
    sortType = parseInt(params.s || 0)
  if (sortType) {
    data.articles = data.articles.sort((a, b) => {
      if (a.paid === b.paid) {
        return b.publishedAt - a.publishedAt
      }
      return b.paid - a.paid
    })
  }

  let dataShow = calPaging(data.articles || [], params.p || 1, 10)

  let datas = data.articles

  store.commit('pushBC', {
    name: titleChunk,
    path: originUrl,
  })

  return {
    dataShow,
    originUrl,
    titleChunk,
    sortType,
    datas
  }
}

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      SeriesDetailPage
    },
    i18n: {
      messages: i18n,
    },
    props: {
      forceSub: Object,
    },
    data() {
      return {
        dataShow: {
          data: [],
        },
        sortArticle: [
          {
            id: 0,
            text: this.$t('5'),
          },
          {
            id: 1,
            text: this.$t('6'),
          },
        ],
        likeStatus: {},
        page: 1,
        frCo: '#52b800',
        foCo: '#e4e4e4',
        loading1: false,
        loading2: false,
        isUnFav: true,
        isUnFollow: true,
        loading: false,
        isError: false,
        FXON_BLOG_URL: process.env.FXON_BLOG_URL,
      }
    },
    computed: {
      productStatus() {
        return this.$store.state.cart.productStatus
      },
      isPassword() {
        return this.$store.getters['cart/isPassword']
      },
      checkShowPass() {
        return (
          this.isPassword === 1 &&
          (!this.productStatus || this.productStatus === -1)
        )
      },
      checkShowPayment() {
        // Series has password with free price can be bought
        return this.isPassword
          ? this.data.series.price >= 0
          : this.data.series.price
      }
    },
    async asyncData({ app, params, store, error }) {
      let data = await app.GoGoHTTP.get(
        `/api/v3/surface/navi/series/${params.id}`
        )
        if ((!data || !data.series) && !data.isPassword) {
          return error({ statusCode: 404 })
        }
        let { dataShow, originUrl, titleChunk, sortType, datas } = getData(
          store,
          params,
          data
          )
          if (!data.series) {
            data.series = {}
          }

      return {
        data,
        dataShow,
        originUrl,
        titleChunk,
        sortType,
        datas,
        seriesId: data.series.id || 0,
        localeHead: titleI18n[app.i18n.locale] || titleI18n['ja'],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/navi/series/${
              params.id
            }`,
          },
        ],
      }
    },
    mounted() {
      this.getInfoStore()
      this.$nuxt.$on('upDateDataItem', this.getInfoStore)
      // OAM-17509
      window.productId = this.data.series.pId
      trackingSeriesView(this.data)
      this.getCategory()
      this.getLike()
    },
    beforeDestroy() {
      this.$nuxt.$off('upDateDataItem')
    },
    methods: {
      checkNested,
      getLike() {
        if(!this.seriesId) return
        this.GoGoHTTP.get(
          `/api/v3/surface/navi/series/${this.seriesId}/like`
        ).then(res => (this.likeStatus = res))
      },
      onLike() {
        if(!this.seriesId) return
        this.GoGoHTTP.post(
          `/api/v3/surface/navi/series/${this.seriesId}/like`
        ).then(() => {
          this.likeStatus = {
            totalLike: this.likeStatus.isLiked
              ? --this.likeStatus.totalLike
              : ++this.likeStatus.totalLike,
            isLiked: !this.likeStatus.isLiked
          }
        })
      },
      onFilterTab(index) {
        // filter all list
        // get 10 elements
        // update page = 1
        // 0 all
        // 1 price
        // 2 free
        const articles = this.data.articles
        if(index) {
          this.page = 1
          if(index === 1) {
            const articlesHasPrice = articles.filter(i => i.price !== 0) || []
            this.datas = articlesHasPrice
            this.dataShow.data = articlesHasPrice.slice(0, 10)
          }
          if(index === 2) {
            const freeArticles = articles.filter(i => (!i.price || i.price === 0)) || []
            this.datas = freeArticles
            this.dataShow.data = freeArticles.slice(0, 10)
          }
        }else {
          this.page = 1
          this.datas = articles
          this.dataShow.data = (articles || []).slice(0, 10)
        }
        this.dataShow = calPaging(
          this.datas || [],
          this.dataShow.currentPage,
          10
        )
      },
      getCategory() {
        if (!this.$store.getters["finance/naviCategories"].length)
        this.GoGoHTTP.get(`/api/v3/surface/navi/category`).then(response =>
            this.$store.commit("finance/setNaviCategory", response)
        )
      },
      async onLoadMore() {
        this.dataShow.data = (this.datas || []).slice(0, this.page * 10 + 10)
        this.page++
      },
      isFavoriteStore() {
        let favData = this.$store.getters['finance/getFavData'],
          item = this.data.series
          if(favData) {
            return favData.favorite.findIndex(favItem => favItem.id == item.id)
          }
      },
      isFollowStore() {
        let favData = this.$store.getters['finance/getFavData'],
          item = this.data.series
          if(favData) {
            return favData.follow.findIndex(followItem => followItem.id == item.id)
          }
      },
      getUnFav() {
        let favData = this.$store.getters['finance/getFavData'],
          isFavoriteStore = this.isFavoriteStore()
        if (favData && isFavoriteStore != -1) {
          this.isUnFav = favData.favorite[isFavoriteStore]['isUnFav']
        } else {
          this.isUnFav = true
        }
      },
      getUnFollow() {
        let favData = this.$store.getters['finance/getFavData'],
          isFollowStore = this.isFollowStore()
        if (favData && isFollowStore != -1) {
          this.isUnFollow = favData.follow[isFollowStore]['isUnFollow']
        } else {
          this.isUnFollow = true
        }
      },
      getInfoStore() {
        this.getUnFav()
        this.getUnFollow()
      },
      forceFavorite() {
        this.onFavoriteSeries()
      },
      changeFollow(data) {
        let s = this.data.articles.find(el => {
          return el.id === data.item.id
        })
        if (s) {
          s.isReadLater = data.action
        }
      },
      changeFavorite(data) {
        let s = this.data.articles.find(el => {
          return el.id === data.item.id
        })
        if (s) {
          s.isFavorite = data.action
        }
      },
      onPagingClick(page) {
        pushState({ p: page, s: this.sortType }, null, '', this.originUrl)
        this.dataShow = calPaging(this.data.articles || [], page, 10)
      },
      addFavorite(item) {
        let elTopBar = $('#info_fav')
        if (elTopBar.hasClass('active')) {
          item['isUnFav'] = false
        }
        this.$store.commit('finance/addFavItem', item)
      },
      removeFavorite(item) {
        let elTopBar = $('#info_fav')
        if (elTopBar.hasClass('active')) {
          item['isUnFav'] = true
          this.$store.commit('finance/addFavItem', item)
        } else {
          this.$store.commit('finance/removeFavItem', item)
        }
      },
      onFavoriteSeries() {
        if (!this.$store.state.user.id) {
          gotoLogin(`u=${location.pathname}`)
          return
        }
        if (this.loading2) {
          return
        }
        this.loading2 = true
        this.GoGoHTTP.post(`/api/v3/surface/navi/favorite/series`, {
          seriesId: this.data.series.id,
        })
          .then(res => {
            let item = this.data.series
            if (res.status) {
              this.addFavorite(item)
            } else {
              this.data.series.isFavorite = res.status
              this.removeFavorite(item)
            }
            this.getInfoStore()
            this.$nuxt.$emit('upDateData')
          })
          .finally(() => {
            this.loading2 = false
          })
      },
      selectSort(sortType) {
        this.sortType = sortType
        pushState(
          { p: this.dataShow.currentPage, s: this.sortType },
          null,
          '',
          this.originUrl
        )
        if (!sortType) {
          this.datas = this.datas.sort((a, b) => {
            return b.publishedAt - a.publishedAt
          })
        } 
        // ascending low to hight
        if(sortType === 1) {
          this.datas = this.datas.sort((a, b) => {
            if (a.price === b.price) {
              return a.publishedAt - b.publishedAt
            }
            return a.price - b.price
          })
        } 
        // descending hight to low
        if(sortType === 2) {
          this.datas = this.datas.sort((a, b) => {
            if (a.price === b.price) {
              return b.publishedAt - a.publishedAt
            }
            return b.price - a.price
          })
        } 
        this.dataShow = calPaging(
          this.datas || [],
          this.dataShow.currentPage,
          10
        )
      },
      descriptionTemplate() {
        return (this.data.series || {}).content || ''
      },
      keywordsTemplate() {
        return `${this.localeHead.keywords}`
      },
      getSeries(password) {
        if (!password || typeof password !== 'string') {
          this.isError = true
          return
        }
        this.loading = true
        return this.getPasswordSeries(password).finally(() => {
          this.loading = false
        })
      },
      getPasswordSeries(password) {
        return this.GoGoHTTP.post(
          `/api/v3/surface/navi/series/${this.$nuxt._route.params.id}`,
          {
            pagePassword: password,
          }
        ).then(data => {
          if (Object.keys(data).length === 0) {
            data = {}
          }
          if (this.isPassword === 2) {
            this.$store.commit('cart/productStatus', data.status)
          }
          if (this.isPassword == 1 && data.status == 0) {
            this.$store.commit('cart/productStatus', 0)
            this.isError = true
            this.password = null
          }
          if (this.isPassword === 1 && data.status == 1) {
            let { dataShow, originUrl, titleChunk, sortType } = getData(
              this.$store,
              this.$nuxt._route.params,
              data
            )

            this.data = data
            this.dataShow = dataShow
            this.originUrl = originUrl
            this.titleChunk = titleChunk
            this.sortType = sortType
          }
        })
      },
    },
  },
  title
)
export default obj



