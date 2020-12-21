import title from '@@/../common/pages'
import authorMeta from '@@/../common/pages/author.js'
import Edit from '@@/../components/icons/Edit.vue'
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import SocialButtons02 from '@/components/navi/SocialButtons02.vue'
import FollowBtn from '@/components/finance/payment/FollowBtn02.vue'
import FavoriteBtn from '@/components/finance/payment/FavoriteBtn02.vue'
import Payment from '@/components/finance/payment/Payment.vue'
import NaviRankHorizontal01 from '@/components/product/navi/NaviRankHorizontal01.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import LoadMore from '@/components/common/LoadMore.vue'
import { editCss, convertToFxonHost, filterInt } from '@/utils/client/common'
import i18n from '@@/lang/mobile/navi-detail.json'
import titleI18n from '@@/lang/common/navi-title.json'
import {
  onNaviFollowItem,
  onNaviFavoriteItem,
} from '@@/../common/js/finance/utils'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import {trackingNaviArticleView} from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'

function getData(store, params, data, prefix) {
  // Commit store
  store.commit('cart/setInfo', {
    info: data.cartInfo,
    productStatus: data.status,
    isPassword: data.isPassword,
  })

  data.outline = convertToFxonHost(data.outline)
  if (data.outline && data.outline.indexOf('<style type="text/css">') !== -1) {
    data.outline = editCss(data.outline, '.outline-IbBKtrbLMt')
  }
  let titleChunk = data.title
    ? `${data.title} ${data.productName ? '- ' + data.productName : ''} - ${prefix}`
      : prefix,
    keywordsChunk = data.title,
    imgUrl =
      process.env.GOGO_URL +
      '/img/products/' +
      (data.productId || data.seriesProductId)

  if (data.user) {
    data.user.selfIntroduction = (data.user.selfIntroduction || '').replace(
      '<br>',
      ''
    )
  }

  data.freeContent &&
    (data.freeContent = data.freeContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>'))
  data.paidContent &&
    (data.paidContent = data.paidContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>'))

  let descriptionMeta = (data.paidContent || data.freeContent || '')
    .substr(0, 300)
    .replace(/<(.|\n)*?>/g, '')

  return {
    titleChunk,
    keywordsChunk,
    imgUrl,
    descriptionMeta,
  }
}

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    i18n: {
      messages: i18n,
    },
    mounted() {
      window.productId = this.data.productId
      trackingNaviArticleView(this.data)
      this.onLoadMore(1)
    },
    components: {
      Lzimg,
      LazyComp01,
      Edit,
      AngleLeft,
      AngleRight,
      SocialButtons02,
      FollowBtn,
      FavoriteBtn,
      Payment,
      ImgWrapper,
      NaviRankHorizontal01,
      LoadMore,
    },
    data() {
      return {
        articleTab: 1,
        articleRank: [],
        isLoading: false,
        page: 1,
        password: null,
        loading: false,
        isError: false,
        seriesRank: [],
        dataSameSeries: [],
      }
    },
    async asyncData({ app, params, error, store, req }) {
      let data = await app.GoGoHTTP.get(`/api/v3/surface/navi/${params.id}`),
        locale = app.i18n.locale,
        prefix = titleI18n[locale].prefix,
        title = titleI18n[locale].title,
        currentUrl = process.env.GOGO_URL + req.originalUrl,
        relatedArticles = await app.GoGoHTTP.get(
          `/api/v3/surface/navi/${params.id}/relatedArticle`, {
          params: {
            limit: 4,
            isGetContent: 1,
          },
        })

      if (
        !data ||
        !Object.keys(data).length
      ) {
        return error({ statusCode: 404 })
      }

      let { titleChunk, keywordsChunk, imgUrl, descriptionMeta } = getData(
        store,
        params,
        data,
        prefix
      )
      const {
        cartInfo: { serie: { price } = {} } = {},
        review: { count, stars } = {},
        isPassword,
      } = data
      return {
        data,
        titleChunk,
        descriptionMeta,
        keywordsChunk,
        relatedArticles,
        localeHead: titleI18n[locale],
        meta: [
          {
            name: 'og:site_name',
            content: 'GogoJungle',
            hid: 'og:site_name',
          },
          {
            name: 'og:type',
            content: 'website',
            hid: 'og:type',
          },
          {
            name: 'og:title',
            content: `${titleChunk} - ${title}`,
            hid: 'og:title',
          },
          {
            name: 'og:description',
            content: descriptionMeta,
            hid: 'og:description',
          },
          {
            name: 'og:url',
            content: currentUrl,
            hid: 'og:url',
          },
          {
            name: 'og:image',
            content: imgUrl,
            hid: 'og:image',
          },
          authorMeta,
        ],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/navi/articles/${params.id}`,
          },
        ],
        jsonLDTemplate: generateLDJson({
          title: data.productName,
          id: params.id,
          description: descriptionMeta || data.productName,
          url: currentUrl,
          image_link: imgUrl,
          product_type: 3,
          status: isPassword ? 3 : 1,
          price,
          count,
          rate: stars,
        }),
      }
    },
    computed: {
      isPassword() {
        return this.$store.getters['cart/isPassword']
      },
      checkShowPass() {
        let stt = this.$store.state.cart.productStatus
        return this.isPassword === 1 && (!stt || stt === -1)
      },
      intro() {
        return this.data.user.selfIntroduction.replace('<br>', '')
      },
      showPayment() {
        return (
          this.data.cartInfo.article.price >= 0 ||
          this.data.cartInfo.serie.price >= 0
        )
      },
    },
    methods: {
      onNaviFollowItem,
      onNaviFavoriteItem,
      async onLoadMore(_page) {
        if (this.isLoading) return
        this.isLoading = true
        await this.loadSameSeries(_page)
        this.page = _page
        this.isLoading = false
      },
      onFollowed() {
        this.GoGoHTTP.post('/api/v3/surface/navi/readlater/article', {
          articleId: this.data.id,
        })
          .then(res => {
            this.data.readLater = res.status
          })
          .catch(err => {
            console.log('Cannot follow this series! ', err)
          })
      },
      onFavorite() {
        this.GoGoHTTP.post('/api/v3/surface/navi/favorite/article', {
          articleId: this.data.id,
        })
          .then(res => {
            this.data.isFavorite = res.status
          })
          .catch(err => {
            console.log('Cannot favorite this article! ', err)
          })
      },
      changeArticleTab(i) {
        this.articleTab = i
      },
      async onGetDataArticleRanking() {
        this.articleRank = await this.GoGoHTTP.get(
          '/api/v3/surface/navi/rank/article?limit=10'
        )
      },
      async onGetDataSeriesRanking() {
        this.seriesRank = await this.GoGoHTTP.get(
          `/api/v3/surface/navi/rank/series?isCombineCategories=1&limit=4`
        )
      },
      descriptionTemplate() {
        return this.descriptionMeta
      },
      keywordsTemplate() {
        return `${this.localeHead.keywords},${this.keywordsChunk}`
      },
      getArticleData() {
        if (!this.password || typeof this.password !== 'string') {
          this.isError = true
          return
        }
        this.loading = true
        return this.getArticlePassword(this.password).finally(() => {
          this.loading = false
        })
      },
      getArticlePassword(password) {
        return this.GoGoHTTP.post(`/api/v3/surface/navi/${this.data.id}`, {
          pagePassword: password,
        }).then(data => {
          if (Object.keys(data).length === 0) {
            data = {}
          }
          if (this.isPassword === 2) {
            this.$store.commit('cart/productStatus', data.status)
          }
          if (this.isPassword === 1 && data.status == 0) {
            this.$store.commit('cart/productStatus', 0)
            this.isError = true
            this.password = null
          }
          if (this.isPassword === 1 && data.status == 1) {
            let params = this.$nuxt._route.params,
              { titleChunk, keywordsChunk, imgUrl, descriptionMeta } = getData(
                this.$store,
                params,
                data,
                this.prefix
              )

            this.data = data
            this.titleChunk = titleChunk
            this.keywordsChunk = keywordsChunk
            this.imgUrl = imgUrl
            this.descriptionMeta = descriptionMeta
            this.$store.commit('cart/productStatus', 1)
            this.onGetDataArticleRanking()
            this.onGetDataSeriesRanking()
          }
        })
      },
      async loadSameSeries(p = 1) {
        if (!this.data.seriesId) {
          return
        }
        let res = await this.GoGoHTTP.get(
          `/api/v3/surface/navi/${this.data.id}/sameSeriesEx`,
          {
            params: {
              limit: 3,
              seriesId: this.data.seriesId,
              page: p,
              isGetContent: 1,
            },
          }
        )
        this.dataSameSeries = this.dataSameSeries.concat(res.data)
      },
    },
  },
  title
)
export default obj
