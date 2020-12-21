<template>
  <div class="cart-button-container" :class="containerClass">
    <div v-if="info.discountEnd" class="pl-15 discount-time">{{ formatTime(info.discountEnd, 6) }}まで </div>
    <div class="navi-cart-button inline-flex" :class="{'discount-button': !!info.oldPrice, [buttonClass || '']: true}" @click="addToCart">
      <div class="flex mid price">
        <span>
          <cart-icon v-if="showCart" class="mr-5" />
          <template v-if="leftText">{{ leftText }}</template>
        </span>
      </div>
      <div class="flex layout-col center">
        <span class="current-price">
          \{{ formatNumber(price) }}
          <span v-if="monthly">/月</span>
        </span>
        <span v-if="info.oldPrice" class="discount-price pt-5">
          \{{ formatNumber(info.oldPrice) }}<span v-if="monthly">/月</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import CartIcon from '../../cart-icon'
export default {
  components: { CartIcon },
  props: {
    monthly: {
      type: Boolean,
      default: false
    },
    showCart: {
      type: Boolean,
      default: true
    },
    price: [String, Number],
    leftText: String,
    productId: {
      type: [String, Number],
      default: 0
    },
    containerClass: String,
    buttonClass: String
  },
  data: () => ({ isProcessing: false }),
  computed: {
    /**
     * @returns {{discountEnd: number, oldPrice: number, price: number}}
     */
    info() {
      const _info = this.$store.state.cart.info
      return this.monthly ? _info.serie : _info.article
    }
  },
  methods: {
    addToCart() {
      if (!this.isProcessing) {
        this.isProcessing = true
        this.$store.dispatch('cart/addToCart', {
          productId: this.productId
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.discount-time {
  font-size: 12px;
  color: #cccccc;
  background-color: #5b5b5b;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  line-height: 22px;
}
.navi-cart-button {
  cursor: pointer;
  background-color: #ff8500;
  color: white !important;
  justify-content: space-between;
  width: 100%;

  /deep/ svg {
    width: 26px;
    height: 26px;
  }

  &:hover {
    background-color: darken(#ff8500, 10%);
    transition: background-color 0.5s;
  }
  .price {
    justify-content: space-between;
  }
}

.discount-price {
  text-decoration: line-through;
  color: #5B5B5B;
  font-size: 12px;
  align-self: flex-end;
}
</style>
