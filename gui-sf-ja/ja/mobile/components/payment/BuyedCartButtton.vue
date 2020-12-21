<template>
  <button class="btn flex mid center w-full" disabled>
    <Cart class="shoping-cart-large" />
    <span class="ver-mid">{{ $t(15) }}</span>
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
}
</script>


<style lang="scss" scoped>
.btn {
  height: 50px;
  background: #707070;
  font-size: 22px;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  outline: none;
  /deep/ .icon-cls {
    width: 30px;
    height: 36px;
  }
}
</style>
