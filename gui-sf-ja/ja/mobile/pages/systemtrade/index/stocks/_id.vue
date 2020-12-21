<template>
  <detail :detail="detail" :id="id" :is-stock="true" />
</template>
<script>
import { getData } from '@/js/systemtrade/id'
import i18n from '@@/lang/mobile/systemtrade-id.json'
import title from '@@/../common/pages'
import detail from '@/components/systemtrade/detail.vue'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign(
  {
    scrollToTop: true,
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: { detail },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params, error, req, route, store }) {
      return await getData(
        app,
        params,
        error,
        req,
        route,
        store,
        i18n[app.i18n.locale].titlePrefix
      )
    },
    methods: {
      descriptionTemplate() {
        return this.detail.description || this.detail.name
      },
    },
  },
  title
)
export default obj
</script>
