import SystemDetailHeader from '@/components/systemtrade/SystemDetailHeader.vue'
import ChartArea from '@@/../components/icons/ChartArea.vue'
import CommentSolid from '@@/../components/icons/CommentSolid.vue'
import InfoCircle from '@@/../components/icons/InfoCircle.vue'
import Community from '@/components/systemtrade/SystemCommunity.vue'
import Panel from '@/components/Panel.vue'
import SpiderWeb from '@@/../components/charts/SpiderWeb.vue'
import fxCriterial from '@/components/systemtrade/fxCriterial.vue'
import stocksCriterial from '@/components/systemtrade/stockCriterial.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import Reviews from '@/components/product/Reviews.vue'
import ShowMore from '@/components/common/ShowMore.vue'
import fxForwardTest from '@/components/systemtrade/fxForwardTest.vue'
import stocksForwardTest from '@/components/systemtrade/stocksForwardTest.vue'
import Outline from '@/components/systemtrade/Outline.vue'
import ProductVertical07 from '@/components/product/ProductVertical07.vue'
import RankingList from '@/components/systemtrade/RankingList.vue'
import ChartGroup from '@/components/systemtrade/ChartGroup.vue'
import Payment03 from '@/components/payment/Payment03.vue'
import CampaignBox from '@/components/payment/CampaignBox.vue'
import Loading from '@@/../components/icons/Loading.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import i18n from '@@/lang/components-mobile/systemtrade-detail.json'
import PaymentMethods from '@@/../components/payment-methods.js'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import getLocalize from '@@/../common/js/getLocalize'
import llc from '@@/../common/js/lazy-load-component'
import NaviRankHorizontal01 from '@/components/product/navi/NaviRankHorizontal01.vue'
import {
  onNaviFollowItem,
  onNaviFavoriteItem,
} from '@@/../common/js/finance/utils'
import { youtubeParser } from '@/utils/client/common'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import {trackingSystemtradeDetailView} from '@@/../common/js/ga/ecom-enhance'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default {
  mixins: [PaymentMethods, getLocalize],
  components: {
    SystemDetailHeader,
    ChartArea,
    CommentSolid,
    InfoCircle,
    Community,
    Panel,
    SpiderWeb,
    fxCriterial,
    stocksCriterial,
    AngleRight,
    FullCalendar01: llc({
      componentFactory: () => import('@/components/FullCalendar01.vue'),
    }),
    Reviews,
    ShowMore,
    fxForwardTest,
    stocksForwardTest,
    Outline,
    ProductVertical07,
    RankingList,
    ChartGroup,
    Payment03,
    CampaignBox,
    Loading,
    AngleDown,
    LazyComp01,
    NaviRankHorizontal01,
    BubbleChart02: llc({
      componentFactory: () => import('@/components/charts/BubbleChart02.vue'),
    }),
    GogoModal,
  },
  props: {
    detail: Object,
    id: [Number, String],
    mainChart: [Object, Array],
    isStock: Boolean,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      data: this.detail,
      banner: this.detail.ads || [],
      category: this.isStock ? 'stocks' : 'fx',
      commuTotal: this.detail.questionTotal || 0,
      detailTab: 1,
      spiderOpt: {
        width: 320,
        height: 260,
        categories: [
          this.$t('4'),
          this.$t('5'),
          this.$t('6'),
          this.$t('7'),
          this.$t('8'),
        ],
        bgColor: '#f5f5f5',
      },
      allowedBrokers: [],
      rankSelect: 'profit',
      rankList: {
        bestSell: this.$t('18'),
        returnRate: this.$t('19'),
        profit: this.$t('20'),
      },
      charts: {},
      yearSelected: 0,
      monthSelected: null,
      dateProcessing: false,
      password: null,
      loading: false,
      others: {},
      listOutline: [],
      reviews: [],
      forward: [],
      forwardDataLoaded: false,
      curDate: new Date(),
      years: [],
      relatedArticles: [],
      relatedProductWidgets: [],
      video: {},
      rankingActive: [],
      bubbleOption: {
        title: {
          text: this.$t('41')
        },
        xAxis: {
          title: {
            text: this.$t('48'),
            useHTML: true,
            textAlign: 'center'
          },
        },
        yAxis: {
          title: {
            text: this.$t('49'),
            margin: 0
          },
          labels: {
            format: '{value}%'
          },
          maxPadding: 0.15,
          max: 107,
          min: -0.5,
        },
        yTxt: this.$t('50'),
        mTxt: this.$t('43'),
        t28: this.$t('42'),
        t30: this.$t('44'),
        t31: this.$t('45'),
        t32: this.$t('46'),
        t33: this.$t('47'),
      },
      rtRanking: [],
      isShowModal: false
    }
  },
  created() {
    let curY = this.curDate.getFullYear()
    this.years = Array.from(Array(4).keys()).map(e => parseInt(curY) - e)
    this.monthSelected = this.curDate.getMonth() + 1
  },
  mounted() {
    this.getAllowedBrokers()
    this.getDataReview()
    this.getListOutline()
    this.getDataOther()
    this.getDataForward()
    this.onGetDataRelatedArticles()
    this.getRelatedProductWidget()
    this.getDataVideo()
    this.getRankingActiveData()
    if (!this.checkShowPass) {
      trackingSystemtradeDetailView(this.detail, this.isStock)
    }
    this.$nextTick(() => {
      const gotoId = this.$route.query.cmt
      if (gotoId) {
        this.goCommunity()
      }
    })
  },
  computed: {    
    advertiseBanners() {
      return this.$store.state.advertisements.advertiseBanners || {}
    },
    brokerShow() {
      let allowedBrokers = this.allowedBrokers
      return (this.data.brokers || [])
        .filter(item => {
          return Object.keys(allowedBrokers).includes(item.toString())
        })
        .map(item => {
          return allowedBrokers[item]
        })
        .filter(function(item) {
          return item != null
        })
        .join(' / ')
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
    checkShowPass() {
      let stt = this.$store.state.cart.productStatus
      return this.isPassword === 1 && (!stt || stt === -1)
    },
    userId() {
      return this.$store.state.user.id
    },
  },
  methods: {
    youtubeParser,
    getRelatedProductWidget() {
      if (!!this.$store.state.user && Number(this.detail.categories) ===
        1) {
        this.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${this.id}/realtrade/widgets?page=0&preview=1`)
          .then(data => {
            this.relatedProductWidgets = data
          })
      }
    },
    onNaviFollowItem,
    onNaviFavoriteItem,
    onGetDataRelatedArticles() {
      this.GoGoHTTP.get(`/api/v3/surface/systemtrade/${this.id}/related`)
        .then(data => {
          this.relatedArticles = data || []
        })
    },
    onSliderReady(cls) {
      this.$nextTick(() => {
        $(cls).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: true,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
          responsive: {
            0: {
              items: 4,
            },
            400: {
              items: 4,
            },
            600: {
              items: 6,
            },
          },
        })
      })
    },
    goCommunity() {
      this.detailTab = 2
      this.$nextTick(() => {
        if ($('#detail-tab').length) {
          $('html, body').animate(
            {
              scrollTop: $('#detail-tab').offset().top - 120,
            },
            'slow'
          )
        }
      })
    },
    clickDetailTab(tab) {
      this.detailTab = tab
    },
    getAllowedBrokers() {
      this.GoGoHTTP.get(`/api/v3/brokers/domestic`).then(data => {
        this.allowedBrokers = data || []
      })
    },
    getDataReview() {
      this.GoGoHTTP.get('/api/v3/surface/review/systemtrade').then(data => {
        this.reviews = data || []
      })
    },
    getListOutline() {
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.category}/${this.id}/list/outline`
      ).then(data => {
        this.listOutline = data
      })
    },
    getDataVideo() {
      this.GoGoHTTP.get(`/api/v3/surface/systemtrade/${this.id}/video`).then(
        data => {
          this.video = data || {}
        },
      )
    },
    getDataOther() {
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.category}/${this.id}/others`
      ).then(data => {
        this.others = data
      })
    },
    getDataForward(page = 1) {
      this.forwardDataLoaded = false
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.category}/${this.id}/forwardPage`,
        {
          params: {
            page,
          },
        }
      )
        .then(data => {
          this.forward = data
        })
        .finally(() => {
          this.forwardDataLoaded = true
        })
    },
    getCommunityData(cb, needRefresh = false) {
      if (!this.communities || needRefresh) {
        this.GoGoHTTP.get(`/api/v3/surface/communities?productId=${this.detail.exProductId || this.id}`)
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
    onUpdateTotal(number) {
      this.commuTotal = number
    },
    onDeleteReply() {
      this.commuTotal = this.commuTotal - 1
    },
    onPosted() {
      this.commuTotal = this.commuTotal + 1
    },
    getProductPassword(password) {
      let category = this.$route.fullPath.split('/')[2]
      return this.GoGoHTTP.post(
        `/api/v3/surface/systemtrade/${category}/${this.detail.exProductId || this.id}`,
        { pagePassword: password }
      ).then(data => {
        if (Object.keys(data).length === 0) {
          data = {}
        }
        if (this.isPassword === 2) {
          this.$store.commit('cart/productStatus', data.status)
        }
        if (this.isPassword === 1 && data.status == 0) {
          this.$store.commit('cart/productStatus', 0)
        }
        if (this.isPassword === 1 && data.status == 1) {
          this.data = data
          this.$store.commit('cart/setCart', data.cartInfo)
          this.$store.commit('cart/productStatus', 1)
          this.commuTotal = data.questionTotal || 0
        }
      })
    },
    selectYear(y) {
      this.yearSelected = y
      this.getDataChart()
    },
    showMonth() {
      $('.show-modal').modal({
        keyboard: false,
      })
      $('.modal-backdrop.in').css('opacity', '.8')
    },
    selectMonth(m) {
      this.monthSelected = m
      $('.show-modal').modal('hide')
      $('.modal-backdrop.in').css('display', 'none')
      $('body').css('overflow', 'auto')
    },
    getDataChart() {
      if (!this.yearSelected) {
        this.$nextTick(() => {
          $('html, body').animate(
            {
              scrollTop: $('#year-select').offset().top - 85,
            },
            'slow'
          )
        })
        return
      }
      this.$nextTick(() => {
        $('html, body').animate(
          {
            scrollTop: $('#chart-group').offset().top - 85,
          },
          'slow'
        )
      })
      if (this.charts[this.yearSelected]) {
        return
      }
      this.dateProcessing = true
      this.GoGoHTTP.get(
        `/api/v3/surface/systemtrade/${this.id}/chart?year=${this.yearSelected}`
      )
        .then(data => {
          this.$set(this.charts, this.yearSelected, data)
        })
        .finally(() => {
          this.dateProcessing = false
        })
    },
    getProductData() {
      if (!this.password || typeof this.password !== 'string') {
        return
      }
      this.loading = true
      return this.getProductPassword(this.password).finally(() => {
        this.loading = false
        trackingSystemtradeDetailView(this.detail, this.isStock)
      })
    },
    getRankingActiveData() {
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
    onGoToBacktest() {
      location.href = `/systemtrade/${this.category}/${this.id}/backtest`
    }
  },
}
