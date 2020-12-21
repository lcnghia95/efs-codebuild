<template>
  <div class="lock-password flex mid" v-if="checkShowPassword">
    <input
      class="input-field pl-10 pr-10 mr-10"
      :class="(isError) ? 'is-error' : ''" v-model="password"
      :placeholder="(isError) ? $t(4) : $t(5)"
      type="password"
    />
    <button class="btn-lock flex mid center btn" @click="handleCallPassword" :class="{'disabled': loading}">
      <span>{{ $t(6) }}</span>
    </button>
  </div>
  <button v-else class="btn-orange border-radius-5 w-full" @click="addToCart">
    <div class="flex mid center">
      <Cart />
      <span class="price-wrap" v-if="discountPrice || discountPrice == 0">
        {{ discountPrice ? currency + formatNumber(discountPrice) + ' / ' + $t('1') : $t('2') }}
      </span>
      <span class="price-wrap" v-else>
        {{ price ? currency + formatNumber(price) + ' / ' + $t('1') : $t('2') }}
      </span>
    </div>
  </button>
</template>

<script>
import i18n from '@@/lang/components-mobile/mini-cart.json'
import Cart from '@@/../components/icons/Cart.vue'
export default {
  components: { Cart },
  i18n: {
    messages: i18n,
  },
  props: {
    discountPrice: [String, Number],
    price: [String, Number],
    productId: [String, Number],
    currency: {
      type: String,
      default: '￥',
    },
    getCartPassword: {
      type: Function,
    },
  },
  data() {
    return {
      cartProcesssing: false,
      password: null,
      loading: false,
    }
  },
  computed: {
    isError() {
      return this.productStatus === 0
    },
    checkShowPassword() {
      return this.isPassword !== 0 && this.productStatus !== 1
    },
    productStatus() {
      return this.$store.state.cart.productStatus
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
  },
  methods: {
    addToCart() {
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      this.$store.dispatch('cart/addToCart', {
        productId: this.productId,
        price: this.price,
      })
    },
    handleCallPassword() {
      this.loading = true
      this.getCartPassword(this.password).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>


<style lang="scss" scoped>
.btn-orange {
  width: 130px;
  font-size: 13px;
  text-decoration: none;
  color: #fff;
  outline: none;
  background-color: #ff8500;
  border: none;
  .price-wrap {
    margin-top: 1px;
  }
}
.btn-orange:hover {
  outline: none;
  background-color: #ff9929;
}
.border-radius-5 {
  border-radius: 5px;
}
.icon-cls {
  flex: 0 0 18px;
  width: 18px;
  height: 20px;
}
.lock-password {
  border-radius: 10px;
  .hint {
    color: #2d2d2d;
  }
  .input-field {
    height: 35px;
    width: 80px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    &::placeholder {
      color: #9f9f9f;
    }
    &.is-error {
      border: 1px solid red;
      &::placeholder {
        color: red;
      }
    }
  }
  .btn {
    color: white;
    background: #ff9929;
    height: 30px;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
