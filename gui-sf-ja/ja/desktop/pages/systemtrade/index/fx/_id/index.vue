<template>
  <detail :detail="detail" :main-chart="mainChart" :id="id" />
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-id.json'
import title from '@@/../common/pages'
import detail from '@@/../components/systemtrade/detail.vue'
import { getData } from '@/js/systemtrade/id'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id)) && params.id > 0
    },
    scrollToTop: true,
    components: { detail },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params, error, req, route, store, query }) {
      return await getData(
        app,
        params,
        error,
        req,
        route,
        store,
        i18n[app.i18n.locale].titlePrefix,
        query,
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
