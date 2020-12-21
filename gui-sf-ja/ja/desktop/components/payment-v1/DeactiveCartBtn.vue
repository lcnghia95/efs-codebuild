<template>
  <button class="deactive-OaDiw w-full flex mid center mb-5">
    <template v-if="info.status != 9">
      <ShopingCart class="shoping-cart mr-5" v-if="!cate" />
      <Cart class="shoping-cart mr-5" v-else />
    </template>
    <div v-if="!info.status" class="flex layout-col center lh-20 mt-5">
      <span class="ver-mid">{{ $t('6') }}</span>
      <span class="fs-12 ver-mid">{{ $t('7') }}</span>
    </div>
    <div v-if="info.status === 4" class="flex layout-col center lh-20 mt-5">
      <span class="ver-mid">{{ $t('17') }}</span>
      <span class="fs-12 ver-mid">{{ $t('18') }}</span>
    </div>
    <span class="lh-15 mt-5" v-if="info.status === 2">
      {{ $t('10') }}<br />
      <span class="fs-13">Pre Release</span>
    </span>
    <span class="lh-15 mt-5" v-if="info.status === 3">
      {{ $t('14') }}<br />
      <span class="fs-13">Broker only</span>
    </span>
    <span class="lh-15 mt-5" v-if="info.status === 9">
      {{ $t('16') }}
    </span>
  </button>
</template>
<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import ShopingCart from '@@/../components/icons/ShopingCart.vue'
import Cart from '@@/../components/icons/Cart.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ShopingCart,
    Cart,
  },
  props: {
    cate: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
  },
}
</script>

<style lang="scss" scoped>
.deactive-OaDiw {
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
.lh-20 {
  line-height: 20px;
}
.shoping-cart {
  width: 40px;
  height: 40px;
}
.lh-15 {
  line-height: 15px;
}
.ver-mid {
  vertical-align: middle;
}
.fs-12 {
  font-size: 12px;
}
.fs-13 {
  font-size: 13px;
}
</style>
