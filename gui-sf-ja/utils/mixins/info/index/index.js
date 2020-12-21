import { filterInt } from '@@/utils/client/common'
import YearSlider from '@@/../components/info/YearSlider.vue'
import Paging from '@@/../components/paging/Paging.vue'
import Info from '@@/../components/info/Info.vue'
import i18n from '@@/lang/desktop/info.json'

export default {
  data: function () {
    return {
      uid: '7xlS1',
    }
  },
  i18n: {
    messages: i18n
  },
  components: {
    YearSlider,
    Paging,
    Info,
  },
  async asyncData({ app, params, store }) {
    let page = filterInt(params.p) || 1,
      year = filterInt(params.y) || new Date().getFullYear(),
      productList = await app.GoGoHTTP.get(
        `/api/v3/surface/info?page=${page}&year=${year}&type=1,3`
      ),
      titleChunk = i18n[app.i18n.locale]['1']
    store.commit('pushBC', {
      name: 'Top',
      path: `/${process.env.LANG}`,
    })
    store.commit('pushBC', {
      name: titleChunk,
      target: { path: `/${process.env.LANG}/info` },
    })
    return {
      productList,
      titleChunk,
      page,
      year,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/${process.env.LANG}/info`,
        },
        {
          rel: 'alternate',
          hreflang: 'ja',
          href: `https://www.gogojungle.co.jp/info`,
        },
        {
          rel: 'alternate',
          hreflang: 'en',
          href: `https://www.gogojungle.co.jp/en/info`,
        },
        {
          rel: 'alternate',
          hreflang: 'th',
          href: `https://www.gogojungle.co.jp/th/info`,
        },
        {
          rel: 'alternate',
          hreflang: 'vi',
          href: `https://www.gogojungle.co.jp/vi/info`,
        },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: `https://www.gogojungle.co.jp/info`,
        }
      ],
    }
  },
  watch: {
    filter() {
      this.page = 1
      this.changeRoute()
    },
  },
  methods: {
    getDataPaging(page) {
      this.page = page
      this.changeRoute()
    },
    changeRoute() {
      let _url = `/info${
        this.year ? '/y/' + this.year : ''
        }${this.page ? '/p/' + this.page : ''}`
      location.href = _url
    },
    descriptionTemplate() {
      return this.$t(`Des`)
    },
  },
}
