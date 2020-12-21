<template>
  <div @click="onClick" class="price-type-9i5JU p-10 mb-10 cursor-pointer" :class="{'active-GG5sO': active}">
    <span v-if="active" class="glyphicon glyphicon-ok"/><span v-else class="ml-15"/> <b class="ml-5">{{ priceName() }}</b>
    <ProductPrice class="ml-15" :prices="prices" :is-monthly="isMonthly"/>
  </div>
</template>

<script>
import ProductPrice from './ProductPrice.vue'
import i18n from '@@/lang/components-desktop/cart-product-list.json'
export default {
  components: {
    ProductPrice,
  },
  i18n: { messages: i18n },
  props: {
    prices: {
      type: Object,
      default() {
        return {}
      },
    },
    isMonthly: Boolean,
    active: Boolean,
  },
  methods: {
    onClick() {
      this.$emit('changeprice', this.prices.id)
    },
    priceName() {
      return this.prices.name || this.prices.isSeries
        ? this.$t('16')
        : this.$t('17')
    },
  },
  watch: {
    active(val) {
      if (val) {
        this.$store.commit('cart01/setPaymentType', this.prices.chargeType == 2)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.price-type-9i5JU {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  width: 180px;
  &:hover {
    border-color: #fc6721;
  }
}
.glyphicon-ok {
  font-size: 11px;
  color: #fc6721;
}
.dis-count {
  color: red;
}
.active-GG5sO {
  border-color: #fc6721;
}
</style>
