<template>
  <div>
    <p class="text-note"><b>{{ $t('2') }}</b></p>
    <input class="w-full password mb-15 p-10" v-model="password" type="password">
    <button class="btn-cart-wma0Q flex mid center mb-5 is-password" :class="{ 'disabled': loading }" @click="getAuthProduct">
      <LockOpen class="mr-5 shoping-cart"/>
      <div>
        <span class="ver-mid">{{ $t('5') }}</span>
      </div>
    </button>
    <b class="co-red" v-if="productStatus === 0">{{ $t('4') }}</b>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import LockOpen from '@@/../components/icons/LockOpen.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    LockOpen,
  },
  props: {
    getProductPassword: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      password: null,
    }
  },
  computed: {
    productStatus() {
      return this.$store.getters['cart/productStatus']
    },
  },
  methods: {
    getAuthProduct() {
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
.btn-cart-wma0Q {
  height: 50px;
  line-height: 52px;
  text-decoration: none;
  color: #fff;
  position: relative;
  border: none;
  outline: none;
  font-size: 22px;
  border-radius: 4px;
  &:hover {
    opacity: 0.85;
  }
  > span {
    margin-top: 2px;
  }
}
.is-password {
  width: 100%;
  background-color: #707070;
  .shoping-cart {
    width: 40px;
    height: 40px;
    margin-bottom: 4px;
  }
}
.lh-20 {
  line-height: 20px;
}
.ver-mid {
  vertical-align: middle;
}
.text-note {
  font-size: 16px;
  line-height: 1.5;
}
.password {
  height: 50px;
  border: 1px solid #707070;
}
.co-red {
  color: red;
}
.disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>
