<template>
  <ListTools class="w-1000" :tab-list="tabList" :data="data" :list-title="list" :type="type" />
</template>
<script>
import i18n from '@@/lang/desktop/tools-index.json'
import title from '@@/../common/pages'
import ListTools from '@/components/tools/ListTools.vue'

const list = {
  price: 2,
  count: 3,
  free: 4,
}
const obj = Object.assign(
  {
    validate({ params }) {
      return ['price', 'count', 'free'].includes(params.sub)
    },
    components: { 
      ListTools,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        list,
        tabList: [
          { id: 12, url: '' },
          { id: 13, url: '1m' },
          { id: 14, url: '1w' },
          { id: 15, url: 'all' },
        ]
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('dp' + this.sub)
      },
    },
    async asyncData({ app, params, store }) {
      let locale = app.i18n.locale,
        sub = params.sub,
        type = params.type || '',
        titleChunk = i18n[locale]['tp'+sub],
        data = await app.GoGoHTTP.get(`/api/v3/surface/tools/popular/${sub}`, {
          params: {
            limit: 0,
          },
        }),
        name = i18n[locale]['t' + list[sub]]

      store.commit('pushBC', {
        name: name,
        target: {
          name: 'tools-popular-sub',
          params: params,
        },
      })
      return {
        sub,
        data,
        type,
        titleChunk,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools/popular/${sub}`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>