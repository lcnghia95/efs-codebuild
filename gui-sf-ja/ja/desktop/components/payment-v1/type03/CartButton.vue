<template>
  <div>
    <template v-if="info.status === 1">
      <template v-if="info.isPurchased == 1">
        <button class="deactive-FNfUZ w-full flex mid center mb-5">
          {{ $t('15') }}
        </button>
      </template>
      <template v-else>
        <CartAuthBtn v-if="isPassword !== 0 && productStatus !== 1" :get-product-password="getProductPassword"/>
        <ActiveCartBtn v-else/>
      </template>
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

<style lang="scss" scoped>
.deactive-FNfUZ {
  height: 50px;
  line-height: 52px;
  text-decoration: none;
  color: #fff;
  position: relative;
  border: none;
  outline: none;
  background: #707070;
  font-size: 22px;
  border-radius: 4px;
  cursor: not-allowed;
}
</style>
