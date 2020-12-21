<template>
  <list :data="data" :on-paging-click="onPagingClick" />
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/event-index.json'
import list from '@/components/event/list.vue'

const obj = Object.assign(
  {
    components: {
      list,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('28'),
      }
    },
    async asyncData({ app, params, store, query }) {
      let locale = app.i18n.locale,
        data = await app.GoGoHTTP.get('/api/v3/surface/event', {
          params: {
            from: params.from ? Date.parse(params.from) / 1000 : null,
            to: params.to ? Date.parse(params.to) / 1000 : null,
            keywords: query.w || '',
            categories: params.categories || null,
            page: params.page || 1,
          },
        })
      params = Object.assign(params, {keywords: query.w})
      if (params.keywords) {
        store.commit('pushBC', {
          name: params.keywords,
          path: `/event/search/w/${params.keywords}`,
        })
      } else {
        store.commit('pushBC', {
          name: i18n[locale]['3'],
          path: `/event/search`,
        })
      }
      return {
        data,
        params,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/event/search',
          },
        ],
      }
    },
    methods: {
      async onPagingClick(_page) {
        location.href = `/event/search${
          this.params.from ? `/from/${this.params.from}` : ''
        }${this.params.to ? `/to/${this.params.to}` : ''}${
          this.params.categories ? `/cat/${this.params.categories}` : ''
        }/p/${_page}${
          this.params.keywords ? `?w=${encodeURIComponent(this.params.keywords)}` : ''
        }`
      },
      descriptionTemplate() {
        return this.$t('26')
      },
    },
  },
  title
)
export default obj
</script>
