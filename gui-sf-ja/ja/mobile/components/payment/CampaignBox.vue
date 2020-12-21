<template>
  <div class="campaign-box text-center">
    <p class="campaign-title m-0"><b>{{ $t('1') }}</b></p>
    <span class="discount-date">
      {{ formatTime(cartInfo.discountStart, 0) }}
      <span>～</span>
      {{ cartInfo.discountEnd ? formatTime(cartInfo.discountEnd, 0) : '～' }}
    </span>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-payment02.json'
export default {
  props: {
    cartInfo: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.campaign-box {
  background: #ff0001;
  color: white;
  padding: 2vw 0 3vw;
  .campaign-title {
    font-size: 5.5vw;
    border-bottom: 1px solid white;
    padding-bottom: 1vw;
  }
  .discount-date {
    display: block;
    font-size: 3.5vw;
    padding-top: 3vw;
  }
}
</style>
