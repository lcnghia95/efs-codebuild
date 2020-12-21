<template>
  <div class="list-syoUp" v-if="productList.length">
    <div class="flex mid">
      <slot/>
      <span class="title ml-5">{{ title }} <span v-if="buyLater">({{ productList.length + $t('1') }})</span></span>
    </div>
    <div class="flex content-end list-header text-right border-bottom fs-12" v-if="!buyLater">
      <div class="price">{{ $t('2') }}</div>
      <div class="type ml-5">{{ $t('3') }}</div>
      <div class="quantity ml-5">{{ $t('4') }}</div>
    </div>
    <CartProduct v-for="cart in productList" :buy-later="buyLater" :key="'aXweA'+ cart.product.id" :data="cart" class="mt-20 pb-20"/>
  </div>
</template>

<script>
import CartProduct from '@/components/cart/CartProduct.vue'
import i18n from '@@/lang/components-mobile/cart-product-list.json'
export default {
  components: {
    CartProduct,
  },
  props: {
    buyLater: {
      type: Boolean,
      default: false,
    },
    title: String,
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    productList() {
      return this.buyLater
        ? this.$store.getters['cart01/buyLater']
        : this.$store.getters['cart01/buyNow']
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 22px;
}
.list-header {
  padding-bottom: 2px;
  .price {
    width: 140px;
  }
  .type {
    width: 100px;
  }
  .quantity {
    width: 55px;
  }
}
.border-bottom {
  border-bottom: 1px solid #d9d9d9;
}
</style>
