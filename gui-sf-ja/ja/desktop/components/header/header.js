import Header01 from '@@/../components/header/Header01.vue'
import Menu from '@/components/Menu.vue'
import { setCookie, isAgentMobile } from '@/utils/client/common'
import i18n from '@@/lang/components-desktop/header.json'

export default {
  i18n: { messages: i18n },
  components: {
    Header01,
    Menu,
  },
  mounted() {
    this.isMobile = isAgentMobile(window.navigator.userAgent)
  },
  methods: {
    switchToMobile() {
      setCookie('forceRenderDesktop', '', 0)
      // TODO: Hieu Nguyen - Correct finance navi structure
      if (this.$route.path.includes('/t/')) {
        location.href = this.$route.path.replace(
          '/articles/searchresult/',
          '/searchresult/'
        )
      } else {
        location.reload()
      }
    },
  },
  data() {
    return {
      isMobile: false,
      menus2: [
        {
          title: this.$t('41'),
          url: '/tools/ebooks/5735',
        },
        {
          title: this.$t('34'),
          url: '/tools/indicators/5939',
        },
        {
          title: this.$t('27'),
          url: this.fxonUrl('/portfolio'),
        },
        {
          title: this.$t('19'),
          url: '/markets/economics',
        },
        {
          title: this.$t('20'),
          url: '/markets/charts',
        },
        {
          title: this.$t('33'),
          url: '/markets',
        },
        {
          title: this.$t('22'),
          url: '/companies',
        },
        {
          title: this.$t('16'),
          url: '/review',
        },
        {
          title: this.$t('24'),
          url: '/markets/spreads',
        },
        {
          title: this.$t('26'),
          url: '/finance/videos',
        },
        {
          title: this.$t('42'),
          url: '/event',
        },
        {
          title: this.$t('48'),
          url: '/systemtrade/converter',
        },
      ],
    }
  },
}
