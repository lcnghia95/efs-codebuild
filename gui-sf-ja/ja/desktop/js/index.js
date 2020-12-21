import i18n from '@@/lang/desktop/index.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import HeaderBlueZ from '@/components/common/HeaderBlueZ.vue'
import HeaderBlueLine from '@/components/common/HeaderBlueLine.vue'
import Map from '@/components/home/Map.vue'
import ProductRankHorizontal from '@/components/product/ProductRankHorizontal.vue'
import ProductHorizontal from '@/components/product/ProductHorizontal.vue'
import ProductVertical from '@@/../components/product/ProductVertical.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import ListSlider from '@/components/sliders/ListSlider.vue'
import LineChart from '@@/../components/icons/LineChart.vue'
import Tool from '@@/../components/icons/Tool.vue'
import Salon from '@@/../components/icons/Salon.vue'
import Other from '@@/../components/icons/Other.vue'
import title from '@@/../common/pages'
import { mapGetters } from 'vuex'
import { getThumbnailYoutube } from '@/utils/client/common'
import ShowMore from '@/components/common/ShowMore.vue'
import llc from '@@/../common/js/lazy-load-component'

if (process.browser) {
  // TODO: hieunt - need to import from style
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

let mapDataInit = {
  ca: {
    'hc-key': 'ca',
    height: 60,
    x: 330,
    y: 40,
    lable: { title: '', x: -50, y: -20 },
  },
  us: {
    'hc-key': 'us',
    height: 45,
    x: 330,
    y: 135,
    lable: { title: '', x: -50, y: 45 },
  },
  au: {
    'hc-key': 'au',
    height: 35,
    width: 15,
    x: 190,
    y: 240,
    lable: { title: '', x: -30, y: 35 },
  },
  jp: {
    'hc-key': 'jp',
    height: 20,
    width: 15,
    x: 195,
    y: 140,
    lable: { title: '', x: -50, y: 15 },
  },
  nz: {
    'hc-key': 'nz',
    height: 20,
    width: 30,
    type: 'l1',
    x: 235,
    y: 240,
    lable: { title: '', x: 35, y: -8 },
  },
  za: {
    'hc-key': 'za',
    height: 10,
    width: 20,
    type: 'l4',
    x: 50,
    y: 235,
    lable: { title: '', x: -40, y: 15 },
  },
  ch: {
    'hc-key': 'ch',
    height: 40,
    width: 15,
    type: 'l1',
    x: 32,
    y: 85,
    lable: { title: '' },
  },
  gb: {
    'hc-key': 'gb',
    height: 80,
    width: 25,
    type: 'l1',
    x: 20,
    y: 30,
    lable: { title: '' },
  },
}

const obj = Object.assign(
  {
    components: {
      MapWorldMarket: Map,
      LazyComp01,
      HeaderBlueLine,
      HeaderBlueZ,
      ProductRankHorizontal,
      ProductHorizontal,
      ProductVertical,
      ListSlider,
      LineChart,
      Tool,
      Salon,
      Other,
      Lzimg,
      ShowMore,
      BubbleChart02: llc({
        componentFactory() {
          return new Promise(resolve => {
            setTimeout(async () => {
              await this.$parent.$parent.getChartRanking()
              resolve(import('@/components/charts/BubbleChart02.vue'))
            }, 1e3)
          })
        },
      }),
      Scatter3d: llc({
        componentFactory() {
          return new Promise(resolve => {
            setTimeout(async () => {
              await this.$parent.$parent.getChartScatter()
              resolve(import('@/components/charts/Scatter3d.vue'))
            }, 2e3)
          })
        },
      }),
    },
    computed: {
      trendColor() {
        let _trend = parseFloat(this.currentChart.trend || 0)
        return _trend > 0
          ? this.upColor
          : _trend === 0
            ? this.green
            : this.downColor
      },
      oscillatorColor() {
        let _oscillator = parseFloat(
          this.currentChart.oscillator || 0
        )
        return _oscillator > 0
          ? this.upColor
          : _oscillator === 0
            ? this.green
            : this.downColor
      },
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
        green: 'green',
        upColor: '#0100ff',
        downColor: '#ff0400',
        TRENDS: { d1: '1D' },
        TREND: { d1: 'D1', m1: 'M1', m3: 'M3', y1: 'Y1' },
        selectedTrend: 'd1',
        selectedRank: 'all',
        currentTime: this.formatTime(Date.now(), 18),
        scatterChartData: [],
        rankingActive: [],
      }
    },
    i18n: {
      messages: i18n,
    },
    methods: {
      getThumbnailYoutube,
      onSliderReady(cls) {
        this.$nextTick(() => {
          $(cls).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 8e3,
            loop: true,
            autoplay: true,
            items: 5,
            nav: true,
            dots: false,
            margin: 25,
            center: true,
            lazyLoad: true,
            slideBy: 5,
            smartSpeed: 500,
            autoplayHoverPause: true,
            autoWidth: true,
            stagePadding: 1000,
            mergeFit: false,
          })
        })
      },
      onSliderVideoReady(cls) {
        this.$nextTick(() => {
          $(cls).owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 8e3,
            loop: true,
            autoplay: true,
            lazyLoad: true,
            items: 4,
            slideBy: 4,
            smartSpeed: 500,
            autoplayHoverPause: true,
          })
        })
      },
      onSelectPair(_index) {
        this.selectedPair = _index
      },
      onSelectTrend(_index) {
        this.selectedTrend = _index
      },
      onselectRank(_index) {
        this.selectedRank = _index
      },
      titleTemplate() {
        return this.$t(29)
      },
      async getChartRanking() {
        this.rankingActive = await this.GoGoHTTP.get('/api/v3/surface/top/rankingActive')
      },
      async getChartScatter() {
        this.scatterChartData = await this.GoGoHTTP.get('/api/v3/surface/top/charts/scatter')
      },
    },
    async asyncData({ app }) {
      let [
        chartData,
        mapData,
        topContent,
        topProductsData,
      ] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/top/charts'),
        app.GoGoHTTP.get('/api/v3/surface/top/world/market/news'),
        app.GoGoHTTP.get('/api/v3/surface/top/contents'),
        app.GoGoHTTP.get('/api/v3/surface/top/products', { params: { rtRankingLimit: 10 } }),
      ])
      mapData = (mapData || []).reduce((result, value) => {
        let _tmp = mapDataInit[value.hCKey]
        if (_tmp) {
          _tmp.countryEn = value.countryEn
          _tmp.countryJp = value.countryJp
          _tmp.lable.title = value.title
          _tmp.lable.titleUrl = value.titleUrl
          result.push(_tmp)
        }
        return result
      }, [])
      let res = {}
      res.chartData = chartData
      res.mapData = mapData
      res.topContent = topContent.articles || []
      res.topVideoData = topContent.video || []
      res.topVideos = topContent.fxVideo || []
      if (!topProductsData) {
        topProductsData = {}
      }
      res.selectedPair = Object.keys(chartData || {})[0] || 'USD/JPY'
      const topSold = topProductsData.sold || {}
      res.topProductsData = {
        advisor: topSold.advisor || [],
        all: topSold.all || [],
        indicator: topSold.indicator || [],
        new: topProductsData.new || [],
        pr: randomItems(topProductsData.pr || [], 5),
        systemtrade: topSold.systemtrade || [],
      }
      res.rankData = topProductsData.ranking || []
      res.linkMeta = [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/`,
        },
        {
          rel: 'alternate',
          hreflang: 'ja',
          href: `https://www.gogojungle.co.jp/`,
        },
        {
          rel: 'alternate',
          hreflang: 'en',
          href: `https://www.gogojungle.co.jp/en/`,
        },
        {
          rel: 'alternate',
          hreflang: 'th',
          href: `https://www.gogojungle.co.jp/th/`,
        },
        {
          rel: 'alternate',
          hreflang: 'vi',
          href: `https://www.gogojungle.co.jp/vi/`,
        },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: `https://www.gogojungle.co.jp/`,
        }
      ]
      return res
    },
  },
  title
)

export default obj
