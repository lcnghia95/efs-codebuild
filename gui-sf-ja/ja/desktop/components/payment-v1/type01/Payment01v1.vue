<template>
  <div class="payment-ZhXPn">
    <div v-if="!info.isRangePrice">
      <p v-if="info.oldPrice" id="oldPrice" class="co-grey fs-18 flex space-between">
        <span class="mt-3">{{ $t('16') }}:</span>
        <span><b class="line-through fs-22">￥{{ formatNumber(info.oldPrice) }} {{ $t('5') }}</b></span>
      </p>
      <p v-if="info.oldPrice" class="fs-20"><b>{{ $t('17') }}:</b></p>
      <p v-if="info.price" id="currentPrice" class="co-red fs-34 text-center"><b>￥{{ formatNumber(info.price) }}<span class="co-red fs-34">{{ $t('5') }}</span></b></p>
      <p v-else class="co-red fs-30"><b>{{ $t('6') }}</b></p>
      <p v-if="info.oldPrice" id="reducedPrice" class="fs-20 text-right">
        OFF: <span class="rv-price co-red">￥{{ formatNumber(info.oldPrice-info.price) }} ({{ (Math.floor((info.oldPrice-info.price)/info.oldPrice*100)) }}%)</span>
      </p>
      <div class="mb-10 flex mid center" v-if="info.price && info.isSub">
        <b class="ml-5 fs-18">{{ $t('19') }}</b>
        <b class="ml-5 fs-18" v-if="info.isFFM">{{ $t('20') }}</b>
      </div>
    </div>
    <CartButton01v1 class="mb-10" :get-product-password="getProductPassword" />
    <template v-if="info.price && !info.externalUrl">
      <template v-if="info.isDvd">
        <div class="mb-10 flex mid">
          <CD class="cd-icon" />
          <b class="ml-5 fs-18">{{ $t('7') }}</b>
        </div>
        <div class="fs-16 mb-20">
          <span>{{ $t('8') }}</span>
          (<b class="co-red">{{ $t('9') }}</b>)
          <span class="text-underline"><a :href="fxonUrl() + '/lecture/duty.php?c=53&i=7726'" target="_blank">{{ $t('10') }}</a></span>
        </div>
      </template>
      <div class="cart-title flex mid mb-15">
        <b>{{ $t('18') }}</b>
        <span class="ml-10 mb-5 w-full"></span>
      </div>
      <template v-if="payments.bank === 1">
        <div class="flex space-between mb-20">
          <div class="payment-method flex mid pl-10 pr-10 fs-16"><b>{{ $t('15') }}</b></div>
          <img src="/img/assets/pc/common/message_tools.png" alt="" width="200" height="39" />
        </div>
      </template>
      <div class="card-img flex flex-wrap">
        <template v-if="payments.card === 1">
          <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_mastercard.png" alt="" />
          <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_visacard.png" alt="" />
        </template>
        <template v-if="payments.store === 1">
          <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_D1.png" alt="" />
          <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_D2.png" alt="" />
          <img class="mr-5 mb-5" height="35" src="/img/assets/pc/common/payment_ico_jcb.png" alt="" />
          <!-- <img class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_thanks.png'" alt=""> -->
          <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_familymart_new.png" alt="" />
        </template>
        <!-- <img v-if="payments.btc === 1" class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_bitcoin_new.png'" alt=""> -->
      </div>
    </template>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-payment.json'
import CartButton01v1 from './CartButton01v1.vue'
import CD from '@@/../components/icons/CD.vue'
export default {
  components: {
    CartButton01v1,
    CD,
  },
  props: {
    getProductPassword: {
      type: Function,
    },
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
    payments() {
      return this.$store.getters['cart/payments']
    },
  },
}
</script>

<style lang="scss" scoped>
$font18: 18px;
.fs-16 {
  font-size: 16px;
}
.fs-18 {
  font-size: $font18;
}
.fs-20 {
  font-size: 20px;
}
.fs-22 {
  font-size: 22px;
}
.fs-30 {
  font-size: 30px;
}
.fs-34 {
  font-size: 34px;
}
.payment-ZhXPn {
  color: #666;
}
.fav-button {
  width: 214px;
  height: 35px;
  line-height: 31px;
  background: white;
  border: 1px solid #f90;
  color: #f90;
  margin: 10px auto 0;
  outline: none;
  &:hover,
  &.is-fav {
    background: #f90;
    color: white;
  }
}
.info {
  background: #eee;
  font-size: $font18;
}
.border-button-001 {
  height: 35px;
  line-height: 33px;
  color: #333;
  border-radius: 18px;
  border: solid 3px #b4b5b6;
}
.min-400 {
  min-height: 300px;
}
.co-grey {
  color: #666;
}
.co-red {
  color: #ff0400;
}
.border-radius-5 {
  border-radius: 5px;
}
.icon-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
  margin-bottom: 2px;
}
.icon-star {
  width: 24px;
  height: 24px;
}
.icon-plus {
  width: 18px;
  height: 18px;
}
.payment-method {
  background: #337ab7;
  border-radius: 4px;
  color: white;
}
.line-through {
  text-decoration: line-through;
}
.cart-title {
  font-size: 16px;
  color: #337ab7;
  b {
    flex: 0 0 100px;
  }
  span {
    display: inline-block;
    height: 3px;
    background: #337ab7;
  }
}
.text-underline {
  text-decoration: underline;
}
.card-img img {
  width: inherit;
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <Payment01v1 :cartInfo="cartInfo"/>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        cartInfo: {
          price: 119800,
          oldPrice: 49800,
          discountLimit: 5,
          discountRemain: 5,
          remain: 5,
          bank: 1,
          cart: 1,
          conv: 1,
          bit: 1,
          id: 10494,
          type: 1,
          status: 1,
          count: 0,
          expectedSaleCount: 0,
          date: 1477233747,
          is_dvd: 1,
          update: 0,
          isSaleStop: 0,
          isFavorite: 0,
          isPortfolio: 0,
          isSubscription: 0,
          favoriteCount: 0,
          isWebAuthentication: 1,
          forwardAt: 1477233747
          }
      }
    },
  }
  </script>
  ```
</docs>
