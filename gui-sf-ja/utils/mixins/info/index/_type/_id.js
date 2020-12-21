import { filterInt,replaceLinkUrl } from '@@/utils/client/common'
import YearSlider from '@@/../components/info/YearSlider.vue'
import Info from '@@/../components/info/Info.vue'
import HeaderBrownLine from '@@/../components/common/HeaderBrownLine.vue'
import i18n from '@@/lang/desktop/info.json'

export default {
  components: {
    YearSlider,
    HeaderBrownLine,
    Info,
  },
  i18n: {
    messages: i18n
  },
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  computed: {
    content() {
      return replaceLinkUrl(this.item.content)
    },
  },
  async asyncData({ app, store, params, error }) {
    let id = params.id,
      data = await app.GoGoHTTP.get('/api/v3/surface/info' + '/' + id)
    if (!data || !data.content) {
      return error({ statusCode: 404 })
    }
    store.commit('pushBC', {
      name: 'Top',
      path: '/vi',
    })
    store.commit('pushBC', {
      name: i18n[app.i18n.locale]['1'],
      target: { path: `/${process.env.LANG}/info` },
    })
    store.commit('pushBC', {
      name: data.title,
      target: { path: `/${process.env.LANG}/info/${id}` },
    })
    return {
      item: data,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/${process.env.LANG}/info/${id}`,
        },
      ],
    }
  },
  methods: {
    onBack() {
      if (document.referrer.includes('mypage')) {
        if (this.langSupported().includes(this.$i18n.locale)) {
          location.href = `/${this.$i18n.locale}/info`  
        }
        location.href = '/info'
      } else {
        window.history.back()
      }
    },
    titleTemplate(titleL) {
      return `${this.item.title} - ${this.$t('1')} : ${titleL.title}`
    },
    descriptionTemplate() {
      let cnt = this.item.content.substr(0, 300).replace(/<(.|\n)*?>/g, '')
      return cnt
    },
  },
}