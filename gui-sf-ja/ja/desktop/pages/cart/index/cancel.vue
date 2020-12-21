<template>
  <div class="w-1000 flex mid center" style="height: 400px;">
    <Loading style="width: 200px;" />
  </div>
</template>
<script>
import title from '@@/../common/pages'
import Loading from '@@/../components/icons/Loading.vue'

const obj = Object.assign(
  {
    components: { Loading },
    async asyncData({ app, redirect, route }) {
      if (route.query.ssid) {
        await app.GoGoHTTP.post('/api/v3/cart/rollback', {
          sessionId: route.query.ssid,
        })
      }
      redirect(302, '/cart?cancel=1')
      return {}
    },
  },
  title
)
export default obj
</script>
