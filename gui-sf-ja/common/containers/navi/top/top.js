import NaviTop from '@@/../common/containers/navi/top/navi-top'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-index.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    NaviTop,
  },
  async asyncData({app, query = {}}) {
    const res = await Promise.all([
      app.GoGoHTTP.get('/api/v3/surface/navi/top/new', { params: query }),
      app.GoGoHTTP.get(`/api/v3/surface/navi/rank/article`, {params: { limit: 10 }}),
      app.GoGoHTTP.get(`/api/v3/surface/navi/rank/series`, { params: { limit: 10 }}),
    ])

    return {
      naviList: res[0] || [],
      articleRanking: res[1] || [],
      seriesRanking: res[2] || [],
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/finance/navi`,
        },
      ],
    }
  },
  data() {
    return {
      titleChunk: this.$t('1'),
    }
  },
  mounted() {
    const html = document.querySelector('html'), body = document.querySelector('body')
    if (html) html.setAttribute('style', 'width: 100% !important; overflow: hidden;')
    if (body) body.setAttribute('style', 'width: 100% !important; overflow: hidden auto')
  },
  beforeDestroy() {
    const html = document.querySelector('html'), body = document.querySelector('body')
    if (html) html.removeAttribute('style')
    if (body) body.removeAttribute('style')
  },
  methods: {
    descriptionTemplate() {
      return this.$t('5')
    }
  },
  ...title
}