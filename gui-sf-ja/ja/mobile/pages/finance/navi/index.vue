<template>
  <div v-if="isArticleDetailPage || isSeriesDetailPage || isSearchPage || isAuthorPage || $route.path === '/finance/navi' || isSeriesListPage || isArticleListPage">
    <nuxt-child ref="navi" :series-ranking="seriesRanking" :article-ranking="articleRanking" />
  </div>
  <div class="navi-wrapper w-full" v-else>
    <img class="w-full" height="auto" src="/img/assets/mobile/navi/navi_main.jpg" v-if="$route.path.startsWith('/finance/navi')" />
    <TopMenu />
    <NaviTabMenu class="flex" />
    <SearchBox :placeholder="$t(1)" v-model="keyword" @enter="gotoSearch" @search="gotoSearch" />
    <nuxt-child ref="navi" />
  </div>
</template>

<script>
import TopMenu from '@/components/finance/TopMenu.vue'
import NaviTabMenu from '@/components/finance/navi/NaviTabMenu.vue'
import SearchBox from '@/components/finance/SearchBox.vue'
import i18n from '@@/lang/mobile/navi.json'
import NaviMixin from '@@/../common/containers/navi/mixin'
export default {
  i18n: {
    messages: i18n,
  },
  mixins: [NaviMixin],
  components: {
    TopMenu,
    NaviTabMenu,
    SearchBox,
  },
  data() {
    return {
      keyword: this.$route.params.w,
      seriesRanking: [],
      articleRanking: []
    }
  },
  async mounted() {
    const [seriesRanking, articleRanking, categories] = await Promise.all([
      this.GoGoHTTP.get(`/api/v3/surface/navi/rank/series`, {params: {limit: 5}}),
      this.GoGoHTTP.get(`/api/v3/surface/navi/rank/article`, {params: {limit: 5}}),
      this.GoGoHTTP.get(`/api/v3/surface/navi/category`)
    ])
    this.articleRanking = articleRanking
    this.seriesRanking = seriesRanking
    this.$store.commit("finance/setNaviCategory", categories || [])
  },
  methods: {
    gotoSearch() {
      let query = `p/1/ipc/0/pt/3/${
        this.keyword ? `w/${encodeURIComponent(this.keyword)}` : ''
      }`

      location.href = `/finance/navi/${
        this.$store.state.navi.searchType
      }searchresult/${query}`
    },
  },
}
</script>
