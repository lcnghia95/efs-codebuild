<template>
  <button class="btn flex mid center w-full disabled">
    <Cart class="shoping-cart-large" v-if="info.status != 9" />
    <div v-if="!info.status" class="btn-other flex layout-col center">
      <span class="ver-mid">{{ $t('6') }}</span>
      <span class="fs-12 ver-mid">{{ $t('7') }}</span>
    </div>
    <span class="btn-other flex layout-col center" v-if="info.status === 2">
      {{ $t('10') }}<br />
      <span class="fs-13">Pre Release</span>
    </span>
    <span class="btn-other flex layout-col center" v-if="info.status === 3">
      {{ $t('14') }}<br />
      <span class="fs-13">Broker only</span>
    </span>
    <span v-if="info.status === 4" class="btn-other flex layout-col center">
      {{ $t('17') }}<br />
      <span class="fs-13">{{ $t('18') }}</span>
    </span>
    <span class="btn-other flex layout-col center" v-if="info.status === 9">
      {{ $t('16') }}
    </span>
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
  props: {
    btnText: String,
  },
}
</script>


<style lang="scss" scoped>
.btn {
  height: 15vw;
  font-size: 4.5vw;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  outline: none;
  .btn-other {
    line-height: 5vw;
    margin-top: 1.5vw;
    span:last-child {
      font-size: 3vw;
    }
  }
  &.disabled {
    pointer-events: none;
    background: #707070;
  }
  .shoping-cart-large {
    width: 10vw;
    height: 10vw;
  }
}
</style>
