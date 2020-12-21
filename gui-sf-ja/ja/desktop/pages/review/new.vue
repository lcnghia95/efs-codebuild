<template>
  <div class="w-1000">
    <h2 class="mt-30">{{ $t('1') }}</h2>
    <ListA :list="newReviewDetail"
           :right-data="rightData"
           @pagingClick="pagingClick"
    />
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/review-list-new.json'
import ListA from '@/components/review/list/ListA.vue'
const obj = Object.assign({
  i18n: {
    messages: i18n,
  },
  components: {
    ListA,
  },
  data() {
    return {
      titleChunk: this.$t('new-title'),
    }
  },
  async asyncData({app, store, params}) {
    let [
      newReview,
      rankingEA,
      rankingEbook,
      newReviewDetail,
    ] = await Promise.all([
      app.GoGoHTTP.get('/api/v3/surface/review/popular/new', {params: {limit: 5}}),
      app.GoGoHTTP.get('/api/v3/surface/review/ranking/ea', {params: {limit: 5}}),
      app.GoGoHTTP.get('/api/v3/surface/review/ranking/ebook', {params: {limit: 5}}),
      app.GoGoHTTP.get('/api/v3/surface/review/new/detail', {params: {limit: 20, page: params.p || 1}}),
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
    ]
    store.commit('pushBC', {
      name: i18n[app.i18n.locale]['new-title'],
      path: '/review/new',
    })
    return {
      newReview,
      rankingEA,
      rankingEbook,
      rightData,
      newReviewDetail,
      linkMeta: [
        {
          rel: 'canonical',
          href: 'https://www.gogojungle.co.jp/review/review/new',
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('new-des')
    },
    pagingClick(p) {
      location.href = '/review/new/p/' + p
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
<style lang='scss'>
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
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
