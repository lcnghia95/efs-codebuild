<template>
  <div class="payment-5aRYi">
    <CampaignBox :cart-info="info" v-if="info.discountStart" />
    <div class="main-info">
      <div class="flex layout-col">
        <div class="group-1 flex layout-col">
          <span class="flex mid bold border-bottom-1">
            <span class="title02">{{ $t('2') }}</span>: {{ formatTime(info.start, 0) }}
          </span>
          <div>
            <span class="flex mid border-bottom-1 sale-remain" v-if="info.saleRemain">
              <span class="title02">{{ $t('3') }}</span>:  {{ info.saleRemain || '0' }}{{ $t('4') }}
            </span>
            <span class="flex mid border-bottom-1 sale-count" v-if="info.expectedSaleCount"><span class="title02">{{ $t('5') }}</span>:  {{ info.expectedSaleCount || '0' }}{{ $t('4') }}</span>
            <span class="flex mid ex-count"><span class="title02">{{ $t('6') }}</span>:  {{ info.count ? formatNumber(info.count) : '0' }}{{ $t('7') }}</span>
          </div>
        </div>
        <div class="group-2 flex layout-col mid">
          <div class="price-wrapp" v-if="!info.isRangePrice">
            <p v-if="info.oldPrice" class="ref-price mb-0 flex mid">
              <span class="title01 text-right">{{ $t('8') }}:</span>
              <span class="title01 line-through">￥{{ formatNumber(info.oldPrice) }}</span>
            </p>
            <p v-if="info.oldPrice" class="ref-price co-red flex mid mb-0">
              <span class="title01 co-red text-right">{{ $t('9') }}:</span>
              <span class="main-price"><b>{{ info.price ? '￥' + formatNumber(info.price) : $t('12') }}</b></span>
              <span class="title01">{{ $t('10') }}</span>
            </p>
            <p v-if="info.oldPrice" class="ref-price flex mid mb-0">
              <span class="title01 text-right">OFF:</span>
              <span class="title01 co-red">￥{{ formatNumber(info.oldPrice-info.price) }} ({{ (Math.floor((info.oldPrice-info.price)/info.oldPrice*100)) }}%)</span>
            </p>
            <p v-else class="mb-0">
              <span class="title01 text-right">{{ $t('11') }}:</span>
              <span class="main-price"><b>{{ info.price ? '￥' + formatNumber(info.price) : $t('12') }}</b></span>
              <span class="title01">{{ $t('10') }}</span>
            </p>
          </div>
          <div class="text-center w-full">
            <CartButtonM class="cart-button" :get-product-password="getProductPassword" />
            <div class="flex space-between">
              <button class="btn btn-type-1 flex mid center"
                      :class="{ 'is-fav': info.isFavorite, 'deactive': !info.isFavorite }"
                      @click="onFavorite"
                      :title="!$store.state.user.id ? $t('21') : ''"
              >
                {{ $t('13') }}
                <Star class="icon-star" />
              </button>
              <button class="btn btn-type-1 flex mid center"
                      :class="{ 'is-fav': info.isPortfolio, 'deactive': !info.isPortfolio }"
                      @click="addPortfolio"
                      :title="!$store.state.user.id ? $t('21') : ''"
              >
                {{ $t('14') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="info.isAuth" class="web-auth fs-13 text-center mt-10">
        {{ $t('50') }}
      </div>
      <div class="group-3 flex layout-col mid">
        <div class="dvd flex layout-col mid center w-full" v-if="info.isDvd">
          <p class="m-0"><b>{{ $t('15') }}</b></p>
          <p class="m-0">
            <span>{{ $t('16') }}</span>
            （<span class="co-red">+550円</span>）
            <a class="co-blue" :href="fxonUrl() + '/lecture/duty.php?c=53&i=7726'" target="_blank">{{ $t('17') }}</a>
          </p>
        </div>
        <div class="bank-transfer flex layout-col mid center w-full" v-if="!info.externalUrl">
          <p class="m-0">
            <span>{{ $t('18') }}</span>
            <b>{{ $t('19') }}</b>
          </p>
        </div>
        <LazyComp01 min-height="110px" class="cart-info-cash" v-if="!info.externalUrl">
          <p class="title mb-0"><span>●</span><b>{{ $t('20') }}</b></p>
          <div class="flex flex-wrap">
            <template v-if="payments.card === 1">
              <img :src="'/img/assets/pc/common/payment_ico_mastercard.png'" alt="" />
              <img :src="'/img/assets/pc/common/payment_ico_visacard.png'" alt="" />
            </template>
            <img v-if="payments.bank === 1" :src="'/img/assets/pc/common/payment_ico_bank.png'" alt="" />
            <template v-if="payments.store === 1">
              <img class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_jcb.png'" alt="" />
              <!-- <img :src="'/img/assets/pc/common/payment_ico_thanks.png'" alt=""> -->
              <img :src="'/img/assets/pc/common/payment_ico_D2.png'" alt="" />
              <img :src="'/img/assets/pc/common/payment_ico_D1.png'" alt="" />
              <img :src="'/img/assets/pc/common/payment_ico_familymart_new.png'" alt="" />
            </template>
            <img v-if="payments.tran === 1" :src="'/img/assets/pc/common/payment_ico_transfer.png'" alt="" />
            <!-- <img v-if="payments.btc === 1" :src="'/img/assets/pc/common/payment_ico_bitcoin_new.png'" alt=""> -->
          </div>
        </LazyComp01>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-payment02.json'
import CartButtonM from './CartButtonM.vue'
import CampaignBox from './CampaignBox.vue'
import Star from '@@/../components/icons/Star.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  components: {
    CartButtonM,
    Star,
    CampaignBox,
    LazyComp01,
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
    payments() {
      return this.$store.getters['cart/payments']
    },
  },
  methods: {
    onFavorite() {
      this.$store.dispatch('cart/favorite', this)
    },
    addPortfolio() {
      this.$store.dispatch('cart/portfolio', this)
    },
  },
  props: {
    getProductPassword: {
      type: Function,
    },
  },
  i18n: {
    messages: i18n,
  },
}
</script>


<style lang="scss" scoped>
$black1: #5b5b5b;
$vw90: 90vw;
.co-red {
  color: #ff0001;
}
.group-1 {
  padding: 1vw 4vw;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 4vw;
  font-size: 3.5vw;
  .bold {
    font-weight: bold;
  }
  .border-bottom-1 {
    border-bottom: 1px dashed #e5e1df;
  }
  .title02 {
    width: 22vw;
    padding: 1.5vw 0 1vw;
  }
}
.group-2 {
  padding: 0 4vw;
  margin-bottom: 5vw;
  .price-wrapp {
    .title01 {
      font-size: 4vw;
    }
    .main-price {
      font-size: 8vw;
      margin-right: 1vw;
    }
    .ref-price {
      > span:first-child {
        width: 30vw;
      }
    }
    .ref-price:last-child {
      margin-bottom: 3vw;
    }
  }
  .line-through {
    text-decoration: line-through;
  }
  .btn-type-1 {
    width: 45vw;
    height: 10vw;
    line-height: 7vw;
    font-size: 3.5vw;
    color: $black1;
    margin-top: 3vw;
    .icon-star {
      width: 5.5vw;
      height: 6.5vw;
      color: #cacaca;
      margin-left: 1vw;
    }
  }
  .is-fav {
    color: #ff8e02;
    border: 1px solid #ff8e02;
    .icon-star {
      color: #ff8e02;
    }
  }
}
.web-auth {
  margin: 0 4vw 4vw;
  height: 40px;
  line-height: 40px;
  color: white;
  background-color: #337ab7;
  border-radius: 8px;
}
.group-3 {
  padding: 0 4vw;
  .cart-info-cash {
    margin: 4vw 0;
    img {
      margin: 1vw;
      height: 8.5vw;
    }
  }
}
.title {
  font-size: 4vw;
  color: $black1;
  span {
    color: #d5c9bc;
  }
}
.co-blue {
  color: #003bc7;
}
.bank-transfer,
.dvd {
  height: 12vw;
  background: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MDBBQzBBMDlFMDMxMUU4ODNFREJERjc3QjA3MEI2MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MDBBQzBBMTlFMDMxMUU4ODNFREJERjc3QjA3MEI2MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgwMEFDMDlFOUUwMzExRTg4M0VEQkRGNzdCMDcwQjYwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwMEFDMDlGOUUwMzExRTg4M0VEQkRGNzdCMDcwQjYwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgABgAGAwERAAIRAQMRAf/EAaIAAAAGAgMBAAAAAAAAAAAAAAcIBgUECQMKAgEACwEAAAYDAQEBAAAAAAAAAAAABgUEAwcCCAEJAAoLEAACAQMEAQMDAgMDAwIGCXUBAgMEEQUSBiEHEyIACDEUQTIjFQlRQhZhJDMXUnGBGGKRJUOhsfAmNHIKGcHRNSfhUzaC8ZKiRFRzRUY3R2MoVVZXGrLC0uLyZIN0k4Rlo7PD0+MpOGbzdSo5OkhJSlhZWmdoaWp2d3h5eoWGh4iJipSVlpeYmZqkpaanqKmqtLW2t7i5usTFxsfIycrU1dbX2Nna5OXm5+jp6vT19vf4+foRAAIBAwIEBAMFBAQEBgYFbQECAxEEIRIFMQYAIhNBUQcyYRRxCEKBI5EVUqFiFjMJsSTB0UNy8BfhgjQlklMYY0TxorImNRlUNkVkJwpzg5NGdMLS4vJVZXVWN4SFo7PD0+PzKRqUpLTE1OT0laW1xdXl9ShHV2Y4doaWprbG1ub2Z3eHl6e3x9fn90hYaHiImKi4yNjo+DlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+v/aAAwDAQACEQMRAD8A3mmaVZo5Z0STJSRs1FSMwWlp4FVjLHHO9opKiSEOCyXYIeRYX9+631//2Q==');
  margin-bottom: 2vw;
  border-radius: 4px;
  color: #846444;
  p {
    font-size: 3.3vw;
  }
}
.deactive {
  outline: none;
  border-color: #ccc;
  &:hover {
    border-color: #adadad;
  }
}
.btn {
  background: white;
}
</style>
<docs>
  ```vue
  <template>
    <Payment03
      class="mb-30"
      :cart-info="cartInfo"
      :actions="this.cartActions"
      :is-password="2"
      :status="status"/>
  </template>
  <script>
  import PaymentMethods from '@@/../components/payment-methods.js'
  export default {
    mixins: [PaymentMethods],
    data() {
      return {
        cartInfo: {
          "price": 9800,
          "bank": 1,
          "cart": 1,
          "conv": 1,
          "id": 14911,
          "type": 2,
          "count": 0,
          "expectedSaleCount": 0,
          "is_dvd": 1,
          "version": "",
          "isFavorite": 0,
          "isSubscription": 0,
          "favoriteCount": 2,
          "isWebAuthentication": 1,
          "statusType": 1,
          "forwardAt": 1534899622,
          "oldPrice": 19800,
          "discountStartDate": 1534863600,
          "discountEndDate": 1538319599,
          "cartStatus": 2,
          "brokers": "24,125,117,114,148,156,203,265"
        },
        status: undefined
      }
    },
    methods: {
      getProductPassword() {}
    }
  }
  </script>
  ```
</docs>
