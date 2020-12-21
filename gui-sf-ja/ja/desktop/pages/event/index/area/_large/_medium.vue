<template>
  <list :data="data" :on-paging-click="onPagingClick" />
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/components-desktop/event-jpmap.json'
import list from '@/components/event/list.vue'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign(
  {
    validate({ params }) {
      return (
        !isNaN(filterInt(params.large)) &&
        (!params.medium || !isNaN(filterInt(params.medium)))
      )
    },
    components: {
      list,
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      titleChunk() {
        return this.$t('5', { area: this.areaName })
      },
    },
    async asyncData({ app, params, store, error }) {
      let locale = app.i18n.locale,
        data = await app.GoGoHTTP.get('/api/v3/surface/event', {
          params: {
            lAreaId: params.large || null,
            mAreaId: params.medium || null,
            page: params.p || 1,
          },
        }),
        path = `/event/area/${params.large}`,
        areaName = i18n[locale]['large-areas'][params.large]

      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }

      if (params.medium) {
        areaName = i18n[locale]['medium-areas'][params.medium]
        path = `/event/area/${params.large}/${params.medium}`
      }
      store.commit('pushBC', {
        name: areaName,
        path,
      })

      return {
        data,
        params,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp${path}`,
          },
        ],
        areaName,
      }
    },
    methods: {
      async onPagingClick(_page) {
        location.href = `/event/area/${this.params.large}${
          this.params.medium ? `/${this.params.medium}` : ''
        }/p/${_page}`
      },
      descriptionTemplate() {
        return this.$t('4', { area: this.areaName })
      },
    },
  },
  title
)
export default obj
</script>
