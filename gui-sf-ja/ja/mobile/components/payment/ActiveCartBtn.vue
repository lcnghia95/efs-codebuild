<template>
  <button class="btn flex mid center w-full" @click="onClicked">
    <Cart class="shoping-cart-large" />
    <span class="ver-mid">{{ $t(info.externalUrl ? 19 : 1) }}</span>
  </button>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import Cart from '@@/../components/icons/Cart.vue'

export default {
  components: { Cart },
  i18n: {
    messages: i18n,
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
  },
  data() {
    return {
      cartProcesssing: false,
    }
  },
  props: {
    btnText: String,
  },
  methods: {
    async onClicked() {
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      this.$store.dispatch('cart/addToCart', {
        productId: this.info.productId,
      })
    },
  },
}
</script>


<style lang="scss" scoped>
.btn {
  height: 50px;
  background: #ff8500;
  font-size: 20px;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  outline: none;
}
</style>
