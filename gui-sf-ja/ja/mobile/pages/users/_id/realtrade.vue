<template>
  <div class="mb-50">
    <div class="page-title col-gray flex space-between">
      <b>{{ $t(39) }}</b>
    </div>
    <div class="no-data pt-20 pb-20" v-if="!(traders.length)"> {{ $t(40) }} </div>
    <div v-else>
      <TradeInfo
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
import TradeInfo from '@@/desktop/components/user/TradeInfo.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
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
<style lang="scss" scoped>
.page-title {
  font-size: 16px;
  padding: 12px 5px 5px 10px;
  border-bottom: 1px solid #b4b5b6;
}
.no-data {
  text-align: center;
  background-color: #fff;
}
.trade-info {
  background: white;
  padding: 12px;
}
</style>