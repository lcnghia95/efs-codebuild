<template>
  <div>
    <template v-if="info.status === 1">
      <AuthCartBtn v-if="isPassword !== 0 && productStatus !== 1" :get-product-password="getProductPassword"/>
      <ActiveCartBtn v-else/>
    </template>
    <template v-else>
      <DeactiveCartBtn/>
    </template>
    <div v-if="info.isAuth" class="web-auth fs-13 text-center mt-10">
      {{ $t('3') }}
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import ActiveCartBtn from './ActiveCartBtn.vue'
import AuthCartBtn from './AuthCartBtn.vue'
import DeactiveCartBtn from './../DeactiveCartBtn.vue'
export default {
  components: { ActiveCartBtn, AuthCartBtn, DeactiveCartBtn },
  i18n: {
    messages: i18n,
  },
  props: {
    getProductPassword: {
      type: Function,
    },
  },
  computed: {
    productStatus() {
      return this.$store.state.cart.productStatus
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
    info() {
      return this.$store.state.cart.info
    },
  },
}
</script>


<style lang="scss" scoped>
.web-auth {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: white;
  background-color: #337ab7;
  border-radius: 8px;
}
</style>
