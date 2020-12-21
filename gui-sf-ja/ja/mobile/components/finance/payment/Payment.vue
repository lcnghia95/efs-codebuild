<template>
  <div class="panel panel-default payment-5ATzP">
    <div class="panel-heading text-center" v-if="isFreeArticleAndPaidSeries">
      {{ $t('12') }}
    </div>
    <div class="panel-heading text-center" v-else-if="from==1" v-html="$t('1')"/>
    <div class="panel-heading text-center" v-else>
      {{ $t('5') }}
    </div>
    <div class="panel-body flex layout-col mid text-center pb-40">
      <h4 v-if="isFreeArticleAndPaidSeries">{{ $t('13') }}</h4>
      <h4 v-else-if="from==1">{{ $t('2') }}</h4>
      <h4 v-else>{{ $t('6') }}</h4>
      <div class="lock-password" v-if="checkShowPassword">
        <div class="password-title"><b>{{ $t('7') }}</b></div>
        <p class="mt-40 fs-12 hint">{{ $t('8') }}</p>
        <input class="input-field pl-20 pr-20" :class="(isError) ? 'is-error' : ''" v-model="password" :placeholder="(isError) ? $t('9') : $t('10')" type="password">
        <div class="flex mid center mb-50">
          <button class="btn-lock flex mid center btn mt-10" @click="handleCallPassword" :class="{'disabled': loading}">
            <span>{{ $t('11') }}</span>
          </button>
        </div>
      </div>
      <div v-else>
        <Info v-if="checkSerie" :type="1" :info="info.serie" :btn-text="$t('3')"/>
        <Info v-if="checkArticle" :type="2" class="mt-20" :info="info.article" :btn-text="$t('4')"/>
      </div>
    </div>
  </div>
</template>

<script>
import Info from './Info.vue'
import i18n from '@@/lang/components-desktop/finance-payment.json'
export default {
  components: {
    Info,
  },
  props: {
    from: {
      type: Number,
      default: 1,
    },
    getCartPassword: {
      type: Function,
    },
    isFreeArticle: {
      type: Boolean,
    },
  },
  data() {
    return {
      password: null,
      loading: false,
    }
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
    checkArticle() {
      if (!this.info.article || !this.info.article.price) {
        return false
      }
      return Object.keys(this.info.article).length
    },
    checkSerie() {
      if (!this.info.serie) {
        return false
      }

      // Series has password with free price can be bought
      if (
        this.isPassword &&
        (this.info.serie.price == undefined || this.info.serie.price == null)
      ) {
        return false
      } else if (!this.isPassword && !this.info.serie.price) {
        return false
      }

      return Object.keys(this.info.serie).length
    },
    isFreeArticleAndPaidSeries() {
      if (!this.info.serie) {
        return false
      }

      return this.info.serie.price > 0 && this.isFreeArticle
    },
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
.payment-5ATzP {
  color: #5b5b5b;
  border-radius: 0;
  .panel-heading {
    background: white;
    border-bottom-style: dashed;
    border-bottom-color: #c6c6c6;
  }
  /deep/ .info-1lDFf {
    width: 100%;
  }
}
.lock-password {
  border-radius: 10px;
  .password-title {
    display: inline-block;
    font-size: 26px;
    border-bottom: 1px solid #d9d9d9;
  }
  .hint {
    color: #2d2d2d;
  }
  .input-field {
    height: 35px;
    width: 310px;
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
    width: 310px;
    background: #00a0e9;
    height: 50px;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>

<docs>
  ```vue
  <template>
    <Payment/>
  </template>
  ```
</docs>
