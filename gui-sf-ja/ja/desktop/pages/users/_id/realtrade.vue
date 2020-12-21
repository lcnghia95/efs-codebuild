<template>
  <div>
    <div class="panel p-40 mb-20">
      <Title04 :title="$t(39)" class="mb-30" style="text-transform: uppercase;" />
      <div class="no-data pt-20 pb-20" v-if="!(traders.length)"> {{ $t(40) }} </div>
      <TradeInfo
        v-else
        v-for="(item, index) in traders"
        :key="index"
        :data="item"
        :num="index + 1"
        class="trade-info"
      />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/users-id.json'
import Title04 from '@/components/review/Title04.vue'
import TradeInfo from '@/components/user/TradeInfo.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Title04,
    TradeInfo
  },
  created() {
    if (process.browser) {
      history.replaceState({}, '', location.pathname)
    }
  },
  async asyncData({ app, params }) {
    let obj = { products: [] }
    const result = await app.GoGoHTTP.get(`/api/v3/surface/profile/${params.id}/realtrade`)

    if (!Object.keys(result).length || !(result.data || []).length) {
      obj.traders = []
    } else {
      obj.traders = (result.data || [])
    }

    return obj
  }
}
</script>