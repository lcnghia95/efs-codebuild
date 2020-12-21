<template>
  <series-list :series-ranking="seriesRanking" :data="seriesData" />
</template>

<script>
import title from '@@/../common/pages'
import SeriesList from '@@/../common/containers/navi/series/series-list'
import i18n from '@@/lang/mobile/navi-new.json'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      SeriesList
    },
    props: {
      seriesRanking: {
        type: Array,
        default() {return []}
      }
    },
    data() {
      return {
        titleChunk: this.$t('tChunk'),
      }
    },
    async asyncData({ app, query, store }) {
      let params = {
        page: 1,
        plan: isNaN(+query.plan) ? -1 : +query.plan,
        period: isNaN(+query.period) ? 3 : +query.period,
        category: isNaN(+query.category) ? 0 : +query.category,
        keyword: query.keyword || '',
      }
      let [seriesData, naviCategory] = await Promise.all([app.GoGoHTTP.get(
        '/api/v3/surface/navi/search/series/top',
        { params }
      ),app.GoGoHTTP.get(`/api/v3/surface/navi/category`)])
      store.commit("finance/setNaviCategory", naviCategory || [])
      return {
        seriesData,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/finance/navi/series',
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('11')
      },
      titleTemplate() {
        return this.$t('seriesTitle')
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
</style>
