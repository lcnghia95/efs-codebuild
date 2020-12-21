import Vue from 'vue'
import { TIME_ZONE, dateFormat, MOMENT_LOCALE } from '../assets/js/consts'
import localCurrency from '@@/lang/common/currencies.json'
import './event-bus'

if (process.browser) {
  require('moment/locale/ja.js')
  require('moment/locale/th.js')
  require('moment/locale/zh-cn.js')
  require('moment/locale/zh-tw.js')
  require('moment/locale/vi.js')
}

const val = {
  methods: {
    formatNumber: (val, defaultVal, floatNum = 0) => {
      let n = Number.parseFloat(val)
      return n
        ? val.toLocaleString('en-GB', {
          minimumFractionDigits: floatNum,
        })
        : defaultVal || val
    },
    formatTime(val, type = 0, prefixVal = 1e3) {
      return moment(val * prefixVal)
        .locale(MOMENT_LOCALE[this.$i18n.locale] || MOMENT_LOCALE['ja'])
        .tz(TIME_ZONE[this.$i18n.locale])
        .format(dateFormat[this.$i18n.locale][type])
    },
    fxonUrl(url = '') {
      return process.env.FXON_URL + url
    },
    realtradeUrl(url = '') {
      return process.env.REAL_TRADE_URL + url
    },
    /* eslint-disable */
    sendPageView(page = this.$route.fullPath) {
      if(gtag) {
        gtag('set', 'page', page)
        gtag('send', 'pageview')
      }
    },
    /* eslint-enable */
    formatCurrency(value, currencyType = 1, showUnit = true) {
      let result = ''
      if (value) {
        value = Math.round(value)
        result =
          currencyType > 1
            ? this.formatNumber(value, value, 2)
            : this.formatNumber(value)
      } else {
        result += value
      }
      if (showUnit) {
        result += localCurrency[this.$i18n.locale][currencyType || 1]
      }
      return result
    },
    langSupported() {
      return ['en', 'th', 'vi']
    },
    formatPips(val) {
      const valNum = Number(val)
      if (!val || isNaN(valNum)) return val
      const divideValue = valNum % 10
      if (!divideValue) return `${this.formatNumber(valNum / 10, val, 0)}.0`
    
      const result = this.formatNumber(valNum / 10, valNum, 1)
      if (!`${result}`.includes('.')) return parseFloat(`${result}`).toFixed(1)
    
      return result
    },
    isElementInViewport(el, top = 0) {
      const rect = el.getBoundingClientRect()

      return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left <
        (window.innerWidth ||
          document.documentElement.clientWidth) /* or $(window).width() */ &&
        rect.top <
        (top ||
          window.innerHeight ||
          document.documentElement.clientHeight) /* or $(window).height() */
      )
    },
    getURLParams() {
      if (!location.search) return {}
      return location.search.slice(1).split('&').reduce((acc, s) => {
        const [k, v] = s.split('=')
        return Object.assign(acc, {[k]: v})
      }, {})
    }
  },
}

Vue.mixin(val)
