<template>
  <div>
    <SimplePrice :class="{ 'active-1poZh': !(prices.oldPrice || prices.offType0 || prices.offType1), 'deactive-1poZh': prices.oldPrice || prices.offType0 || prices.offType1}" :price="topPrice" :is-monthly="isMonthly && !prices.oldPrice" :is-free-first-month="isFreeFirstMonth" />
    <SimplePrice v-if="prices.oldPrice" :class="{ 'active-1poZh': !(prices.offType0 || prices.offType1 ), 'deactive-1poZh': prices.offType0 || prices.offType1 }" :price="bottomPrice" :off-per="offPer" :is-monthly="isMonthly" :is-free-first-month="isFreeFirstMonth" />
    <SimplePrice v-if="prices.offType0" :class="{ 'active-1poZh': !prices.offType1, 'deactive-1poZh': prices.offType1 }" :price="prices.campaign0" :off-per="prices.discountValue0" :is-monthly="isMonthly" :is-free-first-month="isFreeFirstMonth" />
    <SimplePrice v-if="prices.offType1" :class="{ 'active-1poZh': prices.offType1 }" :price="prices.campaign1" :off-per="prices.discountValue1" :off-type="prices.offType1" :is-monthly="isMonthly" :is-free-first-month="isFreeFirstMonth" />
    <div v-if="isSubscription" class="mt-10"><b>{{ $t('15') }}</b></div>
  </div>
</template>

<script>
import SimplePrice from './SimplePrice.vue'
import i18n from '@@/lang/components-desktop/cart-product-list.json'

export default {
  components: {
    SimplePrice,
  },
  i18n: { messages: i18n },
  computed: {
    offPer() {
      let price = this.prices.price,
        oldPrice = this.prices.oldPrice
      if (price != undefined && oldPrice != undefined) {
        return ((oldPrice - price) / oldPrice) * 100
      }
      return 0
    },
    topPrice() {
      if (this.prices.oldPrice) {
        return this.prices.oldPrice
      }
      return this.prices.price
    },
    bottomPrice() {
      return this.prices.price
    },
  },
  props: {
    prices: {
      type: Object,
      default() {
        return {}
      },
    },
    isMonthly: Boolean,
    isSubscription: [Number, Boolean],
    isFreeFirstMonth: [Number, Boolean],
  },
}
</script>

<style lang="scss" scoped>
.active-1poZh {
  color: red;
  display: inline-block;
  white-space: nowrap;
}
.deactive-1poZh {
  color: black;
  text-decoration: line-through;
}
</style>
