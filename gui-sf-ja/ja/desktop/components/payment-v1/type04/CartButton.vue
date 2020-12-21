<template>
  <div>
    <template v-if="info.status === 1">
      <CartAuthBtn v-if="isPassword !== 0 && productStatus !== 1" :get-product-password="getProductPassword"/>
      <ActiveCartBtn v-else/>
    </template>
    <template v-else>
      <DeactiveCartBtn :cate="1"/>
    </template>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import Cart from '@@/../components/icons/Cart.vue'
import ActiveCartBtn from './ActiveCartBtn.vue'
import CartAuthBtn from './CartAuthBtn.vue'
import DeactiveCartBtn from './../DeactiveCartBtn.vue'
export default {
  components: { Cart, ActiveCartBtn, CartAuthBtn, DeactiveCartBtn },
  i18n: {
    messages: i18n,
  },
  props: {
    btnText: String,
    getProductPassword: Function,
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
