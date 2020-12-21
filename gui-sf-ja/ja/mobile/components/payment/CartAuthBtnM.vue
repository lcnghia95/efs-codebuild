<template>
  <div class="cart-auth-4bsIl">
    <input type="password" class="form-control w-full" v-model="password" :placeholder="$t('9')">
    <button class="btn-auth btn w-full" @click="onSubmitPass" :class="{'loading': loading}">
      <div>{{ $t('8') }}</div>
    </button>
    <b class="co-red mt-5" v-show="productStatus === 0">{{ $t('4') }}</b>
    <p class="hint">{{ $t('2') }}</p>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
export default {
  props: {
    getProductPassword: {
      type: Function,
    },
  },
  computed: {
    productStatus() {
      return this.$store.getters['cart/productStatus']
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      password: null,
      loading: null,
    }
  },
  methods: {
    onSubmitPass() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.getProductPassword(this.password).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>


<style lang="scss" scoped>
.cart-auth-4bsIl {
  .btn-auth {
    height: 15vw;
    background: #0097e6;
    font-size: 4.5vw;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    outline: none;
  }
  .btn-other {
    line-height: 5vw;
    margin-top: 1.5vw;
    span:last-child {
      font-size: 3vw;
    }
  }
  .form-control {
    height: 12vw;
    padding: 0 5vw;
    margin-bottom: 3vw;
    font-size: 3.3vw;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    -webkit-appearance: none;
    outline: none;
    box-shadow: none;
    &::placeholder {
      color: #d0d0d0;
    }
  }
  .hint {
    font-size: 3.1vw;
    color: #2d2d2d;
    margin: 3vw 0 0;
  }
  .co-red {
    color: red;
  }
}
.loading {
  pointer-events: none;
  opacity: 0.5;
}
</style>
