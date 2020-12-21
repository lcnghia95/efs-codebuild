import title from '@@/../common/pages'
import authorMeta from '@@/../common/pages/author.js'
import i18n from '@@/lang/desktop/navi-search.json'
import titleI18n from '@@/lang/common/navi-search-title.json'
import SearchResult from "@@/../common/pages/navi/search/search-result.vue"

const obj = Object.assign(
  {
    components: {
      SearchResult
    },
    i18n: {
      messages: i18n,
    },
    props: {
      forceSub: Object,
    },
    data() {
      return {
        titleChunk: null,
        meta: [authorMeta],
        isPaidContentList: null,
        periodTypeList: null,
        params: {},
        isLoading: false
      }
    },
    async asyncData({ app, route, store }) {
      let locale = app.i18n.locale,
        pageType = (route.path || '').includes('series') ? 'series' : 'articles',
        params = {
          searchType: route.params.searchType || 'w',
          isPaidContent: route.params.isPaidContent
            ? parseInt(route.params.isPaidContent)
            : 0,
          periodType: route.params.periodType
            ? parseInt(route.params.periodType)
            : 3,
          page: route.params.p ? parseInt(route.params.p) : 1,
          limit: 40,
          keyword: route.params.wt || '',
          isGetContent: 1,
        },
        keyword = route.params.wt || route.params.w || '',
        naviSearchUrl = `/finance/navi/${pageType}/searchresult`,
        extUrl = pageType === 'series' ? 'series/' : '',
        isPaidContentList = [
          { text: i18n[locale][1], id: 1 },
          { text: i18n[locale][2], id: 0 },
          { text: i18n[locale][13], id: 2 },
        ],
        periodTypeList = [
          { text: i18n[locale][3], id: 1 },
          { text: i18n[locale][4], id: 2 },
          { text: i18n[locale][5], id: 0 },
          { text: i18n[locale][6], id: 3 },
        ]

      if (params.searchType === 't') {
        params.tags = keyword
        store.commit('navi/pushBC', {
          name: i18n[locale].tags[params.tags],
          target: { path: route.fullPath },
        })
      } else {
        params.keyword = keyword
        store.commit('navi/pushBC', {
          name: params.keyword,
          target: { path: route.fullPath },
        })
      }

      let dataList = await app.GoGoHTTP.get(
        `/api/v3/surface/navi/search/${
          pageType === 'series' ? 'series' : 'article'
        }`,
        { params: params }
      )

      return {
        pageType,
        dataList,
        params,
        naviSearchUrl,
        extUrl,
        keyword,
        isPaidContentList,
        periodTypeList,
        titleChunk: `${params.keyword ||
          i18n[locale].tags[params.tags] ||
          ''} ${
          isPaidContentList.filter(x => x.id === params.isPaidContent)[0].text
        } ${periodTypeList.filter(x => x.id === params.periodType)[0].text}`,
        localeHead: titleI18n[locale] || titleI18n['ja'],
      }
    },
    methods: {
      gotoSearch(keyword) {
        if (!keyword) {
          return
        }
        let q = encodeURIComponent(keyword)
        let type = this.pageType === 'series' ? 'series' : 'articles'
        location.href = `/finance/navi/${type}/searchresult/p/1/ipc/0/pt/3/w/${q}`
      },
      onFilterTab(index) {
        if(index === undefined) return
        this.selectSortPrice(index)
      },
      async onPagingClick(_page) {
        this.onNavigate(_page, this.params.isPaidContent)
      },
      selectSort() {
        this.onNavigate(1, this.params.isPaidContent)
      },
      selectSortPrice(index) {
        this.onNavigate(1, index)
      },
      onNavigate(page, ipc) {
        let query = `p/${page}/ipc/${ipc}/pt/${
          this.params.periodType
        }/${
          this.keyword
            ? this.params.searchType +
              '/' +
              encodeURIComponent(this.keyword)
            : ''
        }`
        location.href = `${this.naviSearchUrl}/${query}`
      },
      async searchByPrice(index) {
        let params = {
          searchType: this.$route.params.searchType || 'w',
          isPaidContent: index,
          periodType: this.$route.params.periodType
            ? parseInt(this.$route.params.periodType)
            : 3,
          page: this.$route.params.p ? parseInt(this.$route.params.p) : 1,
          limit: 40,
        }
        this.dataList = await this.GoGoHTTP.get(
          `/api/v3/surface/navi/search/${
            this.pageType
          }`,
          { params: params }
        )
      },
      // head fucntions:
      descriptionTemplate() {
        return this.descriptionChunk
          ? `${this.localeHead.prefix} ${this.descriptionChunk}${
              this.localeHead.description
            }`
          : `${this.localeHead.prefix}`
      },
      keywordsTemplate() {
        return this.keywordsChunk
          ? `${this.localeHead.keywords},${this.keywordsChunk}`
          : `${this.localeHead.keywords}`
      },
    },
  },
  title
)
export default obj