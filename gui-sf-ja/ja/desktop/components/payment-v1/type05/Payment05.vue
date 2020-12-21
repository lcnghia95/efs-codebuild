<template>
  <div class="payment-05">
    <div class="area-1" style="margin: 10px auto 4px auto;">
      {{ $t('42') }}
    </div>
    <div class="area-2" style="margin: 4px auto 10px auto;">
      <span class="fs-16 bold m-10-auto">{{ info.name }}</span>
      <div class="price m-10-auto">{{ '¥' + formatNumber(info.price) + '/ 月' }}</div>
      <div class="cart-btn mt-20 m-10-auto flex mid center" @click="addToCart"><Cart />{{ $t('44') }}</div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-payment02.json'
import Cart from '@@/../components/icons/Cart.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Cart,
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
  },
  methods: {
    addToCart() {
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
.payment-05 {
  width: 460px;
}
.area-1 {
  font-size: 20px;
  padding: 10px 20px;
  background: repeating-linear-gradient(#fff0, #fafafa 2px),
    repeating-linear-gradient(0.25turn, #fff0, #e7e7e7 2px);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.area-2 {
  font-size: 20px;
  padding: 10px 20px 30px 20px;
  background: repeating-linear-gradient(#fff0, #fafafa 2px),
    repeating-linear-gradient(0.25turn, #fff0, #e7e7e7 2px);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.fs-15 {
  font-size: 15px;
}
.m-10-auto {
  margin: 10px auto;
}
.bold {
  font-weight: bold;
}
.price {
  background: #666;
  width: 340px;
  color: white;
  border-radius: 5px;
  height: 25px;
  font-size: 12px;
  line-height: 25px;
}
.cart-btn {
  background: #f60;
  width: 340px;
  color: white;
  border-radius: 5px;
  height: 50px;
  padding: 5px;
  line-height: 45px;
  font-size: 16px;
  cursor: pointer;
  .icon-cls {
    width: 30px;
  }
  &:active {
    box-shadow: 0 2px #b85;
    transform: translateY(4px);
  }
  &:hover {
    opacity: 0.8;
  }
}
</style>
