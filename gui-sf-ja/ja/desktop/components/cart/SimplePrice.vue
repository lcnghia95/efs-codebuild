<template>
  <div v-if="price != undefined">
    <span v-if="isFreeFirstMonth">{{ $t('1') }}</span>￥{{ formatNumber(price) }} <span v-if="isMonthly">/ 月</span><span v-if="offPer">{{ offTxt }}</span>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/cart-price.json'
export default {
  i18n: { messages: i18n },
  props: {
    price: Number,
    isMonthly: Boolean,
    offPer: {
      type: Number,
      default: 0,
    },
    offType: {
      type: Number,
      default: 1,
    },
    isFreeFirstMonth: [Number, Boolean],
  },
  computed: {
    offTxt() {
      if (this.offType == 1) {
        return `(${this.offPer.toFixed(0)}％ OFF)`
      } else {
        return `(￥${this.formatNumber(this.offPer)} OFF)`
      }
    }
  }
}
</script>
