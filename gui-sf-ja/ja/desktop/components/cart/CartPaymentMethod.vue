<template>
  <div class="payment-wrapp">
    <template v-if="totalPrice">
      <div class="flex mid">
        <CreditCard />
        <span class="title">{{ $t('1') }}</span>
      </div>
      <div class="payments flex p-10 mt-10 mb-10">
        <div class="left flex mid center fs-12 pr-10">
          {{ $t('2') }}
        </div>
        <div class="flex layout-col w-full" v-if="sumPrice + dvdPrice + bankTranFee">
          <template v-if="$i18n.locale == 'ja'">
            <div class="a-row flex flex-wrap mid p-15" v-if="payments.bank">
              <Radio v-model.number="payId" :attrs="{value: 1}" :label="$t('pays.bank')" />
            </div>
            <div class="a-row flex flex-wrap mid p-15" v-if="payments.card">
              <Radio v-model.number="payId" :attrs="{value: 2}" :label="$t('pays.card')" />
              <img class="ml-15" :src="'/img/assets/pc/common/payment_ico_visacard.png'" alt="visacard" />
              <img class="ml-5" :src="'/img/assets/pc/common/payment_ico_mastercard.png'" alt="mastercard" />
            </div>
            <div class="a-row flex flex-wrap mid p-15" v-if="payments.card2">
              <Radio v-model.number="payId" :attrs="{value: 3}" :label="$t('pays.card')" />
              <img class="ml-15" :src="'/img/assets/pc/common/payment_ico_jcb.png'" alt="jcb" />
            </div>
            <div class="a-row flex flex-wrap mid p-15" v-if="payments.store">
              <Radio v-model.number="payId" :attrs="{value: 4}" :label="$t('pays.store')" :class="{'disable-select': dvdPrice + sumPrice > 300000}" />
            </div>
            <div class="a-row flex mid p-15 align-ver" v-if="payments.tran">
              <label class="flex flex-wrap mid cursor-pointer">
                <Radio v-model.number="payId" :attrs="{value: 5}" />
                <div :class="{'grow1': isAllSalon}"> {{ isAllSalon ? $t('pays.tran2') : $t('pays.tran') }} </div>
                <div v-if="isAllSalon" class="ml-20 fs-12" v-html="buildPay()"></div>
              </label>
            </div>
          </template>
          <template v-else>
            <div class="a-row flex flex-wrap mid p-15">
              <Radio v-model.number="payId" :attrs="{value: 3}" :label="$t('pays.card')" />
              <img class="ml-10" :src="'/img/assets/pc/common/payment_ico_visacard.png'" alt="visacard" />
              <img class="ml-10" :src="'/img/assets/pc/common/payment_ico_mastercard.png'" alt="mastercard" />
              <img class="ml-10" :src="'/img/assets/pc/common/payment_ico_jcb.png'" alt="jcb" />
            </div>
          </template>
        </div>
      </div>
      <div class="co-red mt-5" v-if="dvdPrice + sumPrice > 300000 && payments.store && $i18n.locale == 'ja'"><b>{{ $t('4') }}</b></div>
    </template>
    <slot></slot>
    <!-- banner group -->
    <template v-if="totalPrice && payments.store && $i18n.locale == 'ja'">
      <!-- banner desktop -->
      <div class="hidden-xs">
        <a href="http://www.paydesign.co.jp/service/guide/famima.html" target="_blank">
          <img src="/img/assets/pc/cart/store_famia.jpg" alt="store_famia" class="mt-15 border-all" />
        </a>
        <a href="http://www.paydesign.co.jp/service/guide/onlinekessai.html" target="_blank">
          <img src="/img/assets/pc/cart/store_kessai.jpg" alt="store_kessai" class="mt-15 border-all" />
        </a>
      </div>
      <!-- banner mobile -->
      <div class="visible-xs-block banner-mobile text-center mt-40">
        <a href="http://www.paydesign.co.jp/service/guide/famima.html" target="_blank">
          <picture>
            <source type="image/webp" srcset="/img/assets/pc/cart/mobile_store_famia.webp" sizes="100%" />
            <source type="image/jpeg" srcset="/img/assets/pc/cart/mobile_store_famia.jpg" sizes="100%" />
            <img src="/img/assets/pc/cart/mobile_store_famia.jpg" alt="mobile_store_famia" sizes="100%" />
          </picture>
        </a>
        <a href="http://www.paydesign.co.jp/service/guide/onlinekessai.html" target="_blank" class="mt-15">
          <picture>
            <source type="image/webp" srcset="/img/assets/pc/cart/mobile_store_kessai.webp" sizes="100%" />
            <source type="image/jpeg" srcset="/img/assets/pc/cart/mobile_store_kessai.jpg" sizes="100%" />
            <img src="/img/assets/pc/cart/mobile_store_kessai.jpg" alt="mobile_store_kessai" sizes="100%" />
          </picture>
        </a>
      </div>
    </template>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/cart-payments.json'
import CreditCard from '@@/../components/icons/CreditCard.vue'
import Radio from '@@/../components/form/Radio.vue'
const values = {
  1: 'bank',
  2: 'card',
  3: 'card2',
  4: 'store',
  5: 'tran',
}
export default {
  model: {
    prop: 'mValue',
    event: 'input',
  },
  props: {
    mValue: Number,
  },
  components: { CreditCard, Radio },
  i18n: {
    messages: i18n,
  },
  computed: {
    payId: {
      get() {
        return this.$store.getters['cart01/payId']
      },
      set(val) {
        this.$store.commit('cart01/setPayId', {
          payId: val,
        })
      },
    },
    payments() {
      return this.$store.getters['cart01/payments']
    },
    isAllSalon() {
      return this.$store.getters['cart01/isAllSalon']
    },
    dvdPrice() {
      return this.$store.getters['cart01/dvdPrice']
    },
    sumPrice() {
      return this.$store.getters['cart01/sumPrice']
    },
    bankTranFee() {
      return this.$store.getters['cart01/bankTranFee']
    },
    totalPrice() {
      return this.sumPrice + this.dvdPrice + this.bankTranFee
    }
  },
  watch: {
    sumPrice() {
      if (this.payId === 4 && this.sumPrice + this.dvdPrice > 300000) {
        this.$store.commit('cart01/setPayId', {
          payId: undefined,
        })
      }
    },
    dvdPrice() {
      if (this.payId === 4 && this.sumPrice + this.dvdPrice > 300000) {
        this.$store.commit('cart01/setPayId', {
          payId: undefined,
        })
      }
    },
    payments(val) {
      this.payId = val[values[this.payId]]
    }
  },
  methods: {
    buildPay() {
      let buyNow = this.$store.getters['cart01/buyNow']
      if (this.isAllSalon && this.payments.tran) {
        let text,
          price3m = '',
          price = ''
        if (buyNow.length > 1) {
          price3m = '('
          price = '('
        }
        for (let i in buyNow) {
          let pri = buyNow[i].prices[0],
            prc = pri.offType1 ? pri.campaign1 : (pri.offType0 ? pri.campaign0 : pri.price)
          price += this.formatNumber(prc)
          price3m += this.formatNumber(prc * 3)
          if (i < buyNow.length - 1) {
            price += ' + '
            price3m += ' + '
          }
        }
        if (buyNow.length > 1) {
          price3m += ')'
          price += ')'
        }
        text = this.$t('3').replace('%s', price3m)
        text = text.replace('%s', price)
        return text
      }
      return ''
    },
  },
}
</script>
<style lang="scss" scoped>
.banner-mobile {
  a, picture {
    display: inline-block;
    border: none;
    width: 100%;
    max-width: 540px;
    img, source {
      width: 100%;
    }
  }
}
.align-ver {
  /deep/ .c-label .radiomark {
    top: 50%;
    transform: translateY(-50%);
  }
  div {
    font-weight: normal;
  }
}
.payment-wrapp {
  width: 600px;
  color: #2d2d2d;
  .icon-cls {
    width: 28px;
    height: 26px;
  }
  .title {
    font-size: 18px;
    display: block;
  }
  .payments {
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    .left {
      width: 100px;
      flex: 0 0 100px;
      border-right: 1px solid #d9d9d9;
    }
    .a-row {
      border-bottom: 1px solid #d9d9d9;
      &:last-child {
        border-bottom: none;
      }
      img {
        height: 22px;
      }
      .c-label {
        margin-bottom: 0;
        font-weight: normal;
      }
      .disable-select {
        text-decoration: line-through;
        pointer-events: none;
        opacity: 0.6;
      }
    }
  }
  img {
    max-width: 100%;
  }
  .border-all {
    border: 1px solid #d9d9d9;
  }
  .co-red {
    color: #fe7fff;
  }
}
</style>
<docs>
  ```vue
  <template>
    <CartPaymentMethod v-model.number="payId"/>
  </template>
  <script>
  export default {
    data() {
      return {
        payId: undefined
      }
    },
  }
  </script>
  ```
</docs>
