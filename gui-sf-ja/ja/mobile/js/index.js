import i18n from '@@/lang/mobile/index.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import ProductVertical02 from '@/components/product/ProductVertical02.vue'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import RealtradeRankingProduct from '@/components/product/RealtradeRankingProduct.vue'
import NaviArticleItem from '@/components/product/navi/NaviRankHorizontal01.vue'
import LineChart from '@@/../components/icons/LineChart.vue'
import Tool from '@@/../components/icons/Tool.vue'
import Salon from '@@/../components/icons/Salon.vue'
import Other from '@@/../components/icons/Other.vue'
import title from '@@/../common/pages'
import { mapGetters } from 'vuex'
import {
  onNaviFollowItem,
  onNaviFavoriteItem,
} from '@@/../common/js/finance/utils'
import llc from '@@/../common/js/lazy-load-component'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

function randomItems(arr, n) {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len)
  if (n > len) {
    return []
  }
  while (n--) {
    let x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

const obj = Object.assign(
  {
    components: {
      RealtradeRankingProduct,
      LazyComp01,
      ProductVertical02,
      LineChart,
      Tool,
      Salon,
      Other,
      SystemProductVert,
      NaviArticleItem,
      BubbleChart02: llc({
        componentFactory() {
          return new Promise(resolve => {
            setTimeout(async () => {
              await this.$parent.$parent.getChartRanking()
              resolve(import('@/components/charts/BubbleChart02.vue'))
            }, 1000)
          })
        },
      }),
    },
    created() {
      // Banner for mobile have position_type = 7 or 8
      this.banner = this.banners[7] || this.banners[8] || {}
    },
    mounted() {
      this.$nextTick(() => {
        $(this.$refs.topSldr).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          items: 2,
          lazyLoad: true,
          loop: true,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
        })
      })
    },
    computed: {
      ...mapGetters({
        banners: 'getBanners',
      }),
      currentChart() {
        return this.chartData[this.selectedPair] || {}
      },
      chartImg() {
        return 'https://chart.gogojungle.co.jp/chart/' + (this.currentChart.pair || '').replace('/', '') + '/' + (this.currentChart.pair || '').replace('/', '') + this.TREND[this.selectedTrend] + '.png?' + this.currentTime
      }
    },
    data() {
      return {
        TRENDS: { d1: '1D' },
        TREND: { d1: 'D1', m1: 'M1', m3: 'M3', y1: 'Y1' },
        selectedTrend: 'd1',
        currentTime: this.formatTime(Date.now(), 18),
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/`,
          },
        ],
        banner: {},
        rankingActive: [],
      }
    },
    i18n: {
      messages: i18n,
    },
    methods: {
      onNaviFollowItem,
      onNaviFavoriteItem,
      onSliderReady(cls) {
        this.$nextTick(() => {
          $(cls).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 8e3,
            loop: true,
            autoplay: true,
            lazyLoad: true,
            dots: false,
            smartSpeed: 500,
            autoplayHoverPause: true,
            responsive: {
              0: {
                items: 3,
              },
              350: {
                items: 4,
              },
              500: {
                items: 6,
              },
            },
          })
        })
      },
      titleTemplate() {
        return this.$t(16)
      },
      async getChartRanking() {
        this.rankingActive = await this.GoGoHTTP.get('/api/v3/surface/top/rankingActive')
      },
    },
    async asyncData({ app, store }) {
      let [articles, tools, fx, chartData, topProductsData] = await Promise.all([
          app.GoGoHTTP.get(
            `/api/v3/surface/navi/search/article`, {
              params: { page: 1, limit: 8, periodType: 3, isGetContent: 1 },
          }),
          app.GoGoHTTP.get(`/api/v3/surface/tools/popular/price`, {
            params: {
              limit: 20,
            },
          }),
          app.GoGoHTTP.get('/api/v3/surface/systemtrade/rank/sell', {
            params: {
              limit: 20
            }
          }),
          app.GoGoHTTP.get('/api/v3/surface/top/charts'),
          app.GoGoHTTP.get('/api/v3/surface/top/products', { params: { rtRankingLimit: 10 } }),
        ]),
        topSliders = store.state.advertisements.topSliders || [],
        res = {}
      topSliders = topSliders.sort(() =>
        Math.random() > 0.5 ? 1 : -1
      ).slice(2).map(sli => {
        sli.webpUrl = (sli.imageUrl || '').replace('.jpg', '.webp')
        return sli
      })
      res.articles = articles
      res.tools = tools[1] || {}
      res.chartData = chartData
      res.bestsell = fx
      if (!topProductsData) {
        topProductsData = {}
      }
      res.rtRanking = topProductsData.rtRanking || []
      res.selectedPair = Object.keys(chartData || {})[0] || 'USD/JPY'
      const topSold = topProductsData.sold || {}
      const topNew = topProductsData.new || {}
      res.topProductsData = {
        pr: randomItems(topProductsData.pr || [], 5),
        oall: topSold.all || [],
        oadvisor: topSold.advisor || [],
        oindicator: topSold.indicator || [],
        osystemtrade: topSold.systemtrade || [],
        nsystemtrade: topNew.systemtrade || [],
        nnavi: topNew.navi || [],
        nindicator: topNew.indicator || [],
      }
      res.topSliders = topSliders
      return res
    },
  },
  title
)

export default obj
