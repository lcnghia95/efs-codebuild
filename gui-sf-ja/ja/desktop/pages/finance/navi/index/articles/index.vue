<template>
  <article-list :article-ranking="articleRanking" :data="articleData" />
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-new.json'
import ArticleList from '@@/../common/containers/navi/article/article-list'

const obj = Object.assign(
    {
      components: {
        ArticleList,
      },
      i18n: {
        messages: i18n,
      },
      props: {
        forceSub: Object,
        articleRanking: {
          type: Array,
          default() {return []}
        }
      },
      data() {
        return {
          filter: {},
        }
      },
      computed: {
        titleChunk() {
          return this.$t('tChunk')
        }
      },
      async asyncData({ app, query, store }) {
        let params = {
          page: 1,
          plan: isNaN(+query.plan) ? -1 : +query.plan,
          period: +query.period || 3,
          category: +query.category || 0,
          keyword: query.keyword || '',
          limit: 25
        }
        let [articleData, naviCategory] = await Promise.all([app.GoGoHTTP.get(
          '/api/v3/surface/navi/search/article/top',
          { params }
        ),app.GoGoHTTP.get(`/api/v3/surface/navi/category`)])
        store.commit("finance/setNaviCategory", naviCategory || [])
        return {
          articleData,
          linkMeta: [
            {
              rel: 'canonical',
              href: 'https://www.gogojungle.co.jp/finance/navi/articles',
            },
          ],
        }
      },
      methods: {
        descriptionTemplate() {
          return this.$t('9')
        },
      },
    },
    title
)
export default obj
</script>

<style lang="scss" scoped>
</style>
