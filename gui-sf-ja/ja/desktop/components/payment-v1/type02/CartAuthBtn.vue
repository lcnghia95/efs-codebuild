<template>
  <div class="cart-auth-4bsIl">
    <input type="password" class="form-control mb-10" v-model="password" :placeholder="$t('9')">
    <button class="btn-auth btn border-radius-5" @click="onSubmitPass" :class="{ 'disabled': loading }">
      <span>{{ $t('8') }}</span>
    </button>
    <p class="mt-5 mb-0 remind-text text-left fs-12">{{ $t('2') }}</p>
    <p class="text-left"><b class="co-red" v-if="productStatus === 0">{{ $t('4') }}</b></p>
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
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      password: null,
      loading: null,
    }
  },
  computed: {
    productStatus() {
      return this.$store.getters['cart/productStatus']
    },
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
  width: 250px;
  margin: 0 auto;
  .btn-auth {
    width: 250px;
    height: 50px;
    background-color: #0097e6;
    color: white;
  }
  .remind-text {
    color: #2d2d2d;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  .form-control {
    outline: none;
    box-shadow: none;
  }
}
.co-red {
  color: red;
}
</style>
