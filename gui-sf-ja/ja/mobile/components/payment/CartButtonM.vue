<template>
  <div>
    <template v-if="info.status === 1">
      <CartAuthBtnM v-if="isPassword !== 0 && productStatus !== 1" :get-product-password="getProductPassword" />
      <BuyedCartButtton v-else-if="info.isPurchased" />
      <ActiveCartBtn v-else />
    </template>
    <template v-else>
      <DeactiveCartBtn :cate="1" />
    </template>
  </div>
</template>

<script>
import ActiveCartBtn from './ActiveCartBtn.vue'
import DeactiveCartBtn from './DeactiveCartBtn.vue'
import BuyedCartButtton from './BuyedCartButtton.vue'
import CartAuthBtnM from './CartAuthBtnM.vue'
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ActiveCartBtn,
    BuyedCartButtton,
    DeactiveCartBtn,
    CartAuthBtnM,
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
