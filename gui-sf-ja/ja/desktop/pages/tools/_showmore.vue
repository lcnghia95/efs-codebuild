<template>
  <ListTools class="w-1000" :tab-list="tabList[showmore]" :data="data" :list-title="list" :type="type" />
</template>
<script>
import i18n from '@@/lang/desktop/tools-index.json'
import title from '@@/../common/pages'
import ListTools from '@/components/tools/ListTools.vue'

const list = {
  recommend: 1,
  new: 5,
  recent: 6,
  review: 7,
}
const tabList = {
  recommend: [
    { id: 6, url: '' },
    { id: 7, url: 'indicator' },
    { id: 8, url: 'tool' },
    { id: 9, url: 'ebook' },
    { id: 10, url: 'set' },
  ],
  new: [
    { id: 17, url: 'kabu' },
    { id: 18, url: '' },
    { id: 19, url: 'other' },
  ],
  recent: [{ id: 21, url: '' }, { id: 22, url: 'free' }],
  review: [{ id: 24, url: '' }, { id: 25, url: 'count' }],
}
const obj = Object.assign(
  {
    validate({ params }) {
      if(!tabList[params.showmore]) {
        return false
      }
      let types = tabList[params.showmore].map(item => item.url)
      return !params.type || types.includes(params.type)
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
        tabList
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('d' + this.showmore)
      },
    },
    async asyncData({ app, params, store }) {
      let locale = app.i18n.locale,
        showmore = params.showmore,
        titleChunk = i18n[locale]['t'+showmore],
        type = params.type || '',
        data = await app.GoGoHTTP.get(`/api/v3/surface/tools/${showmore}`, {
          params: {
            limit: 0,
          },
        }),
        name = i18n[locale]['t' + list[showmore]]

      store.commit('pushBC', {
        name: name,
        target: {
          name: 'tools-showmore',
          params: params,
        },
      })
      return {
        showmore,
        data,
        titleChunk,
        tabList,
        type,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools/${showmore}`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>