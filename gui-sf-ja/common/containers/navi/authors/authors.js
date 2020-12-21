import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-authors.json'
import AuthorsPage from "@@/../common/pages/navi/authors/authors.vue"

const obj = Object.assign(
  {
    components: {
      AuthorsPage
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        keyword: this.$route.params.w || '',
        filters: {},
      }
    },
    async asyncData({ app, params }) {
      // limit: parseInt(params.sort) === 1 ? 50 : 45,
      let query = {
        searchType: parseInt(params.sort),
        page: parseInt(params.p) || 1,
        limit: 40,
        keyword: params.w || ''
      }

      if (query.searchType == undefined || isNaN(query.searchType))
        query.searchType = 1

      let dataList = await app.GoGoHTTP.get(
        `/api/v3/surface/navi/search/author`,
        { params: query }
      )

      return {
        dataList: dataList,
        filters: query,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/navi/authors`,
          },
        ],
      }
    },
    methods: {
      async gotoSearch(keyword) {
        let query = `st/${this.filters.searchType}/w/${keyword}`
        location.href = `/finance/navi/authors/${query}`
      },
      async onPagingClick(_page) {
        let query = this.filters.keyword 
        ? `st/${this.filters.searchType}/p/${_page}/w/${this.filters.keyword}`
        : `st/${this.filters.searchType}/p/${_page}`
        location.href = `/finance/navi/authors/${query}`
      },
      selectSort() {
        let query = this.filters.keyword
        ? `st/${this.filters.searchType}/w/${this.filters.keyword}`
        : `st/${this.filters.searchType}`
        location.href = `/finance/navi/authors/${query}`
      }
    },
  },
  title
)
export default obj
