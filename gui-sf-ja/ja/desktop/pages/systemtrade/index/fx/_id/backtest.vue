<template>
  <div class="w-1000">
    <a :href="`/systemtrade/fx/${id}/backtest?t=3`">
      <img src="/img/assets/pc/systemtrade/backtestbanner200930.png" style="width: 1000px; height: 120px; margin-bottom: 20px;" />
    </a>
    <backtest :id="id" :detail="detail" :q-tab="qTab" :mine-filter="mineFilter" :sort="sort" />
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-id-backtest.json'
import title from '@@/../common/pages'
import backtest from '@@/../components/systemtrade/backtest.vue'
import { filterInt } from '@/utils/client/common'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      backtest,
    },
    scrollToTop: true,
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params, error, store, query }) {
      const id = params.id
      const page = parseInt(params.p || 1)
      const locale = app.i18n.locale
      const qTab = parseInt(query.t || 0)
      const mineFilter = parseInt(query.mine || 0)
      const sort = parseInt(query.sort || 1)
      const detail = await app.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${id}/backtestv2`, {
        params: {
          page,
          mineFilter,
          sort,
        }
      })
      if (!detail || !Object.keys(detail).length) {
        return error({ statusCode: 404 })
      }
      if (detail.code) {
        return error({ statusCode: 404, exists: detail.exists })
      }
      const titleChunk = i18n[locale]['7'].replace('{name}', detail.name)
      store.commit('pushBC', {
        name: detail.name,
        target: { name: 'systemtrade-index-fx-id', params: params },
      })
      store.commit('pushBC', {
        name: titleChunk,
        target: { name: 'systemtrade-index-fx-id-backtest', params: params },
      })
      return {
        id,
        qTab,
        mineFilter,
        sort,
        detail,
        titleChunk,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/fx/${id}/backtest`,
          },
        ],
      }
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
