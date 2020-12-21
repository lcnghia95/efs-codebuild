import i18n from '@@/lang/components-desktop/systemtrade-detail.json'
import SystemDetailHeader from '@@/../components/systemtrade/SystemDetailHeader.vue'
import LeftTitle from '@@/../components/systemtrade/LeftTitle.vue'
import ChartArea from '@@/../components/icons/ChartArea.vue'
import CommentSolid from '@@/../components/icons/CommentSolid.vue'
import Loading from '@@/../components/icons/Loading.vue'
import ChartGroup from '@@/../components/systemtrade/ChartGroup.vue'
import stocksForwardTest from '@@/../components/systemtrade/stock/ForwardTest.vue'
import fxForwardTest from '@@/../components/systemtrade/fx/ForwardTest.vue'
import RankingList from '@@/../components/systemtrade/RankingList.vue'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import Community from '@@/../components/systemtrade/SystemCommunity.vue'
import ProductReview from '@/components/product/ProductReview.vue'
import ShowMore from '@@/../components/common/ShowMore.vue'
import Payment02 from '@/components/payment-v1/type02/Payment02.vue'
import Outline from '@@/../components/systemtrade/Outline.vue'
import Communicates from '@@/../components/product/Communicates.vue'
import DetailBanner from '@@/../components/common/DetailBanner.vue'
import ArticleList from '@/components/product/navi/ArticleList.vue'
import NaviHorizontal04 from '@/components/product/navi/NaviHorizontal04.vue'
import { youtubeParser, getCookie } from '@/utils/client/common'
import { setStoreData } from '@@/../common/js/finance/utils'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import llc from '@@/../common/js/lazy-load-component'
import AngleUp from '@@/../components/icons/AngleUp.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import {trackingSystemtradeDetailView} from '@@/../common/js/ga/ecom-enhance'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default {
  components: {
    SystemDetailHeader,
    LeftTitle,
    ChartArea,
    CommentSolid,
    Loading,
    FullCalendar: llc({
      componentFactory: () => import('@/components/calendar/FullCalendar.vue'),
    }),
    ChartGroup,
    stocksForwardTest,
    fxForwardTest,
    RankingList,
    SystemProductVert,
    Community,
    ProductReview,
    ShowMore,
    Payment02,
    Outline,
    Communicates,
    DetailBanner,
    ArticleList,
    NaviHorizontal04,
    LazyComp01,
    AngleUp,
    BubbleChart02: llc({
      componentFactory: () => import('@/components/charts/BubbleChart02.vue'),
    }),
    GogoModal,
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    advertiseBanners() {
      return this.$store.state.advertisements.advertiseBanners || {}
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
    checkShowPass() {
      let stt = this.$store.state.cart.productStatus
      return this.isPassword === 1 && (!stt || stt === -1)
    },
    monthList() {
      let year = this.myChart[this.yearSelect]
      if (!year) {
        return []
      }
      return (this.myChart[this.yearSelect] || {}).monthList
    },
    userId() {
      return this.$store.state.user.id
    },
  },
  props: {
    detail: Object,
    id: [Number, String],
    mainChart: [Object, Array],
    isStock: Boolean,
  },
  data() {
    return {
      detailTab: 1,
      curDate: new Date(),
      years: [],
      shortMonths: this.$t('short-months'),
      yearSelect: null,
      monthSelect: null,
      communities: null,
      dateProcessing: false,
      loading: false,
      password: null,
      category: this.isStock ? 'stocks' : 'fx',
      data: this.detail,
      commuTotal: this.detail.questionTotal || 0,
      myChart: {},
      lastestCommu: [],
      listOutline: [],
      others: {},
      reviews: [],
      isError: false,
      forward: [],
      forwardDataLoaded: false,
      video: {},
      relatedArticles: [],
      relatedProductWidgets: [],
      rankingActive: [],
      isShowModal: false,
    }
  },
  created() {
    let curY = this.curDate.getFullYear()
    this.years = Array.from(Array(5).keys()).map(e => parseInt(curY) - e)
    this.yearSelect = curY
    this.monthSelect = this.curDate.getMonth() + 1
  },
  updated() {
    if (process.browser) {
      this.menu2Pos = $('.menu2').position().top + $('.menu2').height()
      window.addEventListener('scroll', this.onScroll)
    }
  },
  mounted() {
    this.getDataReview()
    this.getDataLastestCommu()
    this.getDataChart()
    this.getListOutline()
    this.getDataOther()
    this.getDataForward()
    this.getDataVideo()
    this.onGetDataRelatedArticles()
    this.getRelatedProductWidget()
    if(!this.langSupported().includes(this.$i18n.locale)) {
      this.getRankingActiveData()
    }
    if (!this.checkShowPass) {
      trackingSystemtradeDetailView(this.detail, this.isStock)
    }
    this.$nextTick(() => {
      const section = getCookie('sf-sys-gosec', document.cookie)
      if (section) {
        if (section === 'st-product-comment') {
          this.detailTab = 2
          this.$nextTick(() => {
            this.$eb.$emit(this.$ebc.SYSTEMTRADE_GO_COMMUNITY)
          })
        } else {
          setTimeout(() => {
            if ($(`#${section}`).length) {
              this.gotoSection(section)
            }
          }, 2000)
        }
      }
      const cmtField = this.$route.query.cmt
      if (cmtField) {
        this.goCommunity(cmtField)
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    youtubeParser,
    setStoreData,
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
    onUpdateTotal(number) {
      this.commuTotal = number
    },
    onDeleteReply() {
      this.commuTotal = this.commuTotal - 1
    },
    onPosted() {
      this.commuTotal = this.commuTotal + 1
    },
    clickDetailTab(tab) {
      this.detailTab = tab
      if (tab == 2) {
        this.$nextTick(() => {
          this.$eb.$emit(this.$ebc.SYSTEMTRADE_GO_COMMUNITY)
        })
      }
    },
    clickYear(y) {
      this.yearSelect = y
      this.getDataChart()
    },
    clickMonth(y) {
      if (this.monthList.includes(y)) {
        this.monthSelect = y
      }
    },
    getListOutline() {
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.category}/${this.id}/list/outline`,
      ).then(data => {
        this.listOutline = data
      })
    },
    getDataOther() {
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.category}/${this.id}/others`,
      ).then(data => {
        this.others = data
      })
    },
    getDataForward(page = 1) {
      this.forwardDataLoaded = false
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.category}/${this.detail.displayProductId || this.id}/forwardPage`,
        {
          params: {
            page,
          },
        },
      )
        .then(data => {
          this.forward = data
        })
        .finally(() => {
          this.forwardDataLoaded = true
        })
    },
    getDataLastestCommu() {
      this.GoGoHTTP.get(
        `/api/v3/surface/communities/${this.id}/lastest/?typeId=1`).then(
        data => {
          this.lastestCommu = data || []
        },
      )
    },
    getDataReview() {
      this.GoGoHTTP.get(
        `/api/v3/surface/review/product/${this.id}?limit=3`,
      ).then(data => {
        this.reviews = data.data || []
      })
    },
    getDataVideo() {
      this.GoGoHTTP.get(`/api/v3/surface/systemtrade/${this.id}/video`).then(
        data => {
          this.video = data || {}
        },
      )
    },
    getDataChart() {
      if (this.myChart[this.yearSelect] && this.monthList.length) {
        this.monthSelect =
          this.monthList[this.monthList.length - 1] ||
          this.curDate.getMonth() + 1
        return
      }
      this.dateProcessing = true
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.detail.displayProductId || this.id}/chart?year=${this.yearSelect}`,
      )
        .then(data => {
          if (!Object.keys(data).length) {
            data = {}
          }
          if (data) {
            data.monthList = [
              ...new Set([
                ...Object.keys(data.bar || {}),
                ...Object.keys(data.pie || {}),
                ...Object.keys(data.stackBar || {}),
              ]),
            ]
            if (
              data.monthList.length &&
              (!this.monthSelect || !data.monthList.includes(this.monthSelect))
            ) {
              this.monthSelect =
                data.monthList[data.monthList.length - 1] ||
                this.curDate.getMonth() + 1
            }
          }
          this.$set(this.myChart, this.yearSelect, data || {})
        })
        .finally(() => {
          this.dateProcessing = false
        })
    },
    goCommunity(c) {
      this.detailTab = 2
      this.$nextTick(() => {
        this.$eb.$emit(this.$ebc.SYSTEMTRADE_GO_COMMUNITY, c)
      })
    },
    getCommunityData(cb) {
      if (!this.communities) {
        this.GoGoHTTP.get(`/api/v3/surface/communities?productId=${this.id}`)
          .then(data => {
            if (!data.comments) {
              data.comments = []
            }
            this.communities = data
            cb(data)
          })
          .catch(() => {
            cb({ comments: [] })
          })
      } else {
        cb(this.communities)
      }
    },
    getProductData() {
      if (!this.password || typeof this.password !== 'string') {
        this.isError = true
        return
      }
      this.loading = true
      return this.getProductPassword(this.password).finally(() => {
        this.loading = false
        trackingSystemtradeDetailView(this.detail, this.isStock)
      })
    },
    getProductPassword(password) {
      let category = this.$route.fullPath.split('/')[2]
      return this.GoGoHTTP.post(
        `/api/v3/surface/systemtrade/${category}/${this.id}`,
        { pagePassword: password },
      ).then(data => {
        if (Object.keys(data).length === 0) {
          data = {}
        }
        if (this.isPassword === 2) {
          this.$store.commit('cart/productStatus', data.status)
        }
        if (this.isPassword === 1 && data.status == 0) {
          this.$store.commit('cart/productStatus', 0)
          ;(this.isError = true), (this.password = null)
        }
        if (this.isPassword === 1 && data.status == 1) {
          this.data = data
          this.$store.commit('cart/setCart', data.cartInfo)
          this.$store.commit('cart/productStatus', 1)
          this.communityTotal = data.communityTotal || 0
        }
      })
    },
    onGetDataRelatedArticles() {
      this.GoGoHTTP.get(`/api/v3/surface/systemtrade/${this.id}/related`)
        .then(data => {
          this.relatedArticles = data || []
          this.setStoreData(data || [])
        })
    },
    getRelatedProductWidget() {
      if (!!this.$store.getters['getUser'] && Number(this.detail.categories) ===
        1) {
        this.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${this.id}/realtrade/widgets?page=0&preview=1`)
          .then(data => {
            if(!data) return
            this.relatedProductWidgets = data
          })
      }
    },
    scrollTop() {
      $('html, body').animate({ scrollTop: 0 })
    },
    onScroll() {
      if (window.scrollY > this.menu2Pos) {
        $('.tool-detail-menu').slideDown(300)
      } else {
        $('.tool-detail-menu').slideUp(300)
      }
    },
    gotoSection(sectionName) {
      if (sectionName === 'st-product-comment') {
        this.detailTab = 2
      } else {
        this.detailTab = 1
      }
      this.$nextTick(() => {
        $('html, body').animate(
          { scrollTop: $(`#${sectionName}`).offset().top - 65 },
          'slow'
        )
      })
    },
    getRankingActiveData() {
      if (this.detail.isPassword) {
        return
      }
      this.GoGoHTTP.get(`/api/v3/surface/top/rankingActive?uid=${this.detail.user.id}`)
        .then(data => {
          this.rankingActive = data || []
        })
    },
    onShowModal() {
      this.isShowModal = true
    },
    onGoToRegister() {
      location.href = `/register?u=/systemtrade/${this.category}/${this.id}`
    },
    onClose() {
      this.isShowModal = false
    },
    onGoToBacktest() {
      location.href = `/systemtrade/${this.category}/${this.id}/backtest`
    }
  }
}
