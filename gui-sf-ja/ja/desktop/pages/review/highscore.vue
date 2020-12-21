<template>
  <div class="w-1000">
    <h3 class="mb-15">{{ titleChunk }}</h3>
    <ListB :list="ls"
           :title="this.$route.params.type ? this.$t(this.$route.params.type) : ''"
           :right-data="rightData"
           @pagingClick="pagingClick"
    />
  </div>
</template>
<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/review-list-new.json'
import ListB from '@/components/review/list/ListB.vue'
const obj = Object.assign({
  components: {
    ListB,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    let type = this.$route.params.type,
      month = this.$route.params.month,
        time = month ? this.$t('t' + month) : ''
    return {
      titleChunk: type 
                  ? this.$t(`highscore-${type}-title`, {time}) 
                  : this.$t('highscore-title', {time}),
    }
  },
  async asyncData({params, app, store}) {
    let type = params.type,
      month = params.month,
      url = type 
            ? `/api/v3/surface/review/highscore${'/' + type}${month ? '/' + month : ''}`
            : '/api/v3/surface/review/highscore/detail',
      listRankUrl = month 
                    ? '/api/v3/surface/review/highscore/' + month 
                    : '/api/v3/surface/review/highscore/all',
      [
        ls, 
        listRankData 
      ] = await Promise.all([
        app.GoGoHTTP.get(url, {params: {limit: 20, page: params.p || 1}}),
        app.GoGoHTTP.get(listRankUrl, { params: {page: 1, limit: 3}})
      ]),
      listRank = [ 'systemtrade', 'kabu', 'tools', 'navi', 'salons', 'emagazine', 'others', ].filter(item => {
        return item != type
      }),
      rightData = listRank.map(item => {
        return {
          title: i18n[app.i18n.locale][item] || item,
          list: listRankData[item],
          url: `/review/highscore/${item}${month ? '/' + month : ''}`
        }
      }),
      time = i18n[app.i18n.locale]['t'+month] || '',
      name = type ? i18n[app.i18n.locale][`highscore-${type}-title`] : i18n[app.i18n.locale][`highscore-title`]
    name = (name || '').replace('{time}', time)
    store.commit('pushBC', {
      name: name,
      path: `/review/highscore${type ? '/' + type : ''}${month ? '/' + month : ''}`,
    })
    return {
      rightData,
      ls,
      listRank,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review/review/highscore${type ? '/' + type : ''}${month ? '/' + month : ''}`,
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      let type = this.$route.params.type,
        month = this.$route.params.month,
        time = month ? this.$t('t' + month) : ''
      return  type 
              ? this.$t(`highscore-${type}-des`, {time}) 
              : this.$t('highscore-des', {time})
    },
    pagingClick(p) {
      let type = this.$route.params.type,
        month = this.$route.params.month
      location.href = `/review/highscore${ type ? '/' + type : ''}${ month ? '/' + month : ''}/p/${p}`
    },
  }
}, title)
export default obj
</script>
<style>
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