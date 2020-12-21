import SocialButtons02 from '@/components/navi/SocialButtons02.vue'
import Edit from '@@/../components/icons/Edit.vue'
import i18n from '@@/lang/desktop/navi-detail.json'
import titleI18n from '@@/lang/common/navi-title.json'
import title from '@@/../common/pages'
import authorMeta from '@@/../common/pages/author'
import { checkNested, convertToFxonHost, editCss } from '@/utils/client/common'
import { setStoreData } from '@@/../common/js/finance/utils'
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import ProductItem from '@/components/product/navi/product-item/Item.vue'
import NaviHorizontal04 from '@/components/product/navi/NaviHorizontal04.vue'
import Payment from '@/components/finance/payment/Payment.vue'
import NaviCommunity from '@/components/finance/navi/NaviCommunity.vue'
import FavoriteBtn from '@/components/finance/payment/FavoriteBtn02.vue'
import FollowBtn from '@/components/finance/payment/FollowBtn02.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import ArticleList from '@/components/product/navi/ArticleList.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import { trackingNaviArticleView } from '@@/../common/js/ga/ecom-enhance'
import generateLDJson from '@@/../common/js/generateLDJson'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
function getData(store, params, data, prefix) {
  store.commit('cart/setInfo', {
    info: data.cartInfo,
    productStatus: data.status,
    isPassword: data.isPassword,
  })
  store.commit('pushBC', {
    name: data.title,
    target: { name: 'finance-navi-index-articles-id', params: params },
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
      /<(.|\n)*?>/g,
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
    i18n: {
      messages: i18n,
    },
    components: {
      SocialButtons02,
      Edit,
      AngleLeft,
      AngleRight,
      ProductItem,
      NaviHorizontal04,
      Payment,
      NaviCommunity,
      FavoriteBtn,
      FollowBtn,
      ImgWrapper,
      ArticleList,
      GogoModal,
      LazyComp01,
      Lzimg,
      SystemProductVert,
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
        let cartInfo = this.data.cartInfo
        return cartInfo.article.price || cartInfo.serie.price
      },
    },
    validate({ params }) {
      return !isNaN(+params.id)
      // return !isNaN(filterInt(params.sid)) && !isNaN(filterInt(params.id))
    },
    watch: {
      frCo() {
        this.buildTxt = `<iframe src="${process.env.FXON_BLOG_URL}/parts/navi_article_parts.php?sid=${
          this.data.seriesId
          }&aid=${this.$route.params.id}&fr=${this.frCo.substr(
            1,
            7
          )}&fo=${this.foCo.substr(
            1,
            7
          )}" style="border: none; overflow: hidden" width="300px" height="251px"></iframe>`
      },
      foCo() {
        this.buildTxt = `<iframe src="${process.env.FXON_BLOG_URL}/parts/navi_article_parts.php?sid=${
          this.data.seriesId
          }&aid=${this.$route.params.id}&fr=${this.frCo.substr(
            1,
            7
          )}&fo=${this.foCo.substr(
            1,
            7
          )}" style="border: none; overflow: hidden" width="300px" height="251px"></iframe>`
      },
    },
    async asyncData({ app, params, error, store, req }) {
      let locale = app.i18n.locale,
        prefix = titleI18n[locale].prefix,
        title = titleI18n[locale].title,
        data = await app.GoGoHTTP.get(`/api/v3/surface/navi/${params.id}`),
        currentUrl = process.env.GOGO_URL + req.originalUrl
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
        prefix,
        titleChunk,
        descriptionMeta,
        keywordsChunk,
        localeHead: titleI18n[locale] || titleI18n['ja'],
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
    data() {
      return {
        sameSeries: [],
        seriesRank: [],
        articleRank: [],
        relatedArticles: [],
        communities: {},
        articleTab: 1,
        isShowModal: false,
        frCo: '#52b800',
        foCo: '#e4e4e4',
        password: null,
        loading: false,
        isError: false,
        buildTxt: '',
        alsoBought: [],
      }
    },
    mounted() {
      if (!this.checkShowPass) {
        this.onGetSubData()
      }
      window.productId = this.data.cartInfo.serie.productId
      trackingNaviArticleView(this.data)
    },
    methods: {
      checkNested,
      setStoreData,
      onGetSubData() {
        this.onGetAlsoBoughtProduct()
        this.onGetDataSameSeries()
        this.onGetDataSeriesRanking()
        this.onGetDataArticleRanking()
        this.onGetDataRelatedArticles()
        if (!$('script[id=sc-twitter-widget]').length) {
          let el = document.createElement('script')
          el.setAttribute('id', 'sc-twitter-widget')
          el.setAttribute('src', 'https://platform.twitter.com/widgets.js')
          document.getElementsByTagName('head')[0].appendChild(el)
        }
      },
      onGetDataSameSeries() {
        if (!this.data.seriesId) {
          return
        }
        this.GoGoHTTP.get(`/api/v3/surface/navi/${this.data.id}/sameSeriesEx`, {
          params: {
            limit: 4,
            seriesId: this.data.seriesId,
          },
        }).then(data => {
          this.sameSeries = data
          this.setStoreData(data)
        })
      },
      onGetAlsoBoughtProduct() {
        this.GoGoHTTP.get(`/api/v3/surface/navi/${this.data.productId}/${this.data.seriesProductId}/also-bought`).then(data => {
          this.alsoBought = data
        }).catch(() => {
          this.alsoBought = []
        })
      },
      onSliderReady(cls) {
        this.$nextTick(() => {
          $(cls).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 8e3,
            autoplay: true,
            items: 8,
            nav: true,
            dots: false,
            margin: 5,
            center: false,
            lazyLoad: true,
            slideBy: 7,
            smartSpeed: 500,
            autoplayHoverPause: true,
          })
        })
      },
      onGetDataRelatedArticles() {
        this.GoGoHTTP.get(`/api/v3/surface/navi/${this.data.id}/relatedArticle`, {
          params: {
            limit: 4
          },
        }).then(data => {
          this.relatedArticles = data
          this.setStoreData(data)
        })
      },
      onGetDataSeriesRanking() {
        this.GoGoHTTP.get(
          `/api/v3/surface/navi/rank/series?isCombineCategories=1&limit=5`
        ).then(data => {
          this.seriesRank = data
        })
      },
      onGetDataArticleRanking() {
        this.GoGoHTTP.get(`/api/v3/surface/navi/rank/article?limit=10`).then(
          data => {
            this.articleRank = data
          }
        )
      },
      changeArticleTab(i) {
        this.articleTab = i
      },
      onClickShare() {
        this.buildTxt = `<iframe src="${process.env.FXON_BLOG_URL}/parts/navi_article_parts.php?sid=${
          this.data.seriesId
          }&aid=${this.$route.params.id}&fr=${this.frCo.substr(
            1,
            7
          )}&fo=${this.foCo.substr(
            1,
            7
          )}" style="border: none; overflow: hidden" width="300px" height="251px"></iframe>`
        this.isShowModal = true
      },
      onCallCopy() {
        this.$refs.shareUrl.select()
        document.execCommand('copy')
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
      // head fucntions:
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
        return this.GoGoHTTP.post(
          `/api/v3/surface/navi/${this.$nuxt._route.params.id}`,
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
          if (this.isPassword === 1 && data.status == 0) {
            this.$store.commit('cart/productStatus', 0)
            this.isError = true
            this.password = null
          }
          if (this.isPassword === 1 && data.status == 1) {
            let {
              titleChunk,
              keywordsChunk,
              imgUrl,
              descriptionMeta,
            } = getData(
              this.$store,
              this.$nuxt._route.params,
              data,
              this.prefix
            )

            this.data = data
            this.titleChunk = titleChunk
            this.keywordsChunk = keywordsChunk
            this.imgUrl = imgUrl
            this.descriptionMeta = descriptionMeta
            this.$store.commit('cart/productStatus', 1)
            this.onGetSubData()
          }
        })
      },
    },
  },
  title
)
export default obj
