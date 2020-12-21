<template>
  <div>
    <ListA :list="listPopular" 
           :title="$t(4)"
           :bottom-data="rightData"
           @pagingClick="pagingClick"
           :show-load-more="page < lastPage"
    />
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/review-list.json'
import ListA from '@/components/review/ListA.vue'
const obj = Object.assign({
  i18n: {
    messages: i18n,
  },
  components: {
    ListA,
  },
  data() {
    return {
      titleChunk: this.$t('popular-title'),
    }
  },
  async asyncData({app}) {
    let [
      newReview,
      rankingEA,
      rankingEbook,
      listPopular,
    ] = await Promise.all([
      app.GoGoHTTP.get('/api/v3/surface/review/popular/new', {params: {limit: 5}}),
      app.GoGoHTTP.get('/api/v3/surface/review/ranking/ea', {params: {limit: 5}}),
      app.GoGoHTTP.get('/api/v3/surface/review/ranking/ebook', {params: {limit: 5}}),
      app.GoGoHTTP.get('/api/v3/surface/review/popular/detail', {params: {limit: 20, page: 1}}),
    ]),
    rightData = [
      {
        title: i18n[app.i18n.locale][1],
        list: newReview,
        url: '/review/new'
      },
      {
        title: i18n[app.i18n.locale][2],
        list: rankingEA,
        url: '/review/highpost/systemtrade/3'
      },
      {
        title: i18n[app.i18n.locale][3],
        list: rankingEbook,
        url: '/review/highpost/tools/3'
      },
    ],
    lastPage = listPopular.lastPage || 0
    listPopular = listPopular.data || []
    return {
      newReview,
      page: 1,
      rankingEA,
      rankingEbook,
      rightData,
      listPopular,
      lastPage,
      linkMeta: [
        {
          rel: 'canonical',
          href: 'https://www.gogojungle.co.jp/review/popular',
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('popular-des')
    },
    pagingClick() {
      this.page++
      this.GoGoHTTP.get('/api/v3/surface/review/popular/detail', {
        params: {
          limit: 20, 
          page:  this.page
        }
      }).then(res => {
        this.listPopular = this.listPopular.concat(res.data || [])
      })
    },
  },
}, title)
export default obj
</script>

<style lang='scss' scoped>
/deep/ .btn-loadmore:hover {
  opacity: 0.8;
}
</style>
<style lang='scss' scoped>
body {
  background: #f7faf9;
}
#menu {
  background: #fff;
}
#header-01 {
  background: #fff;
}
</style>