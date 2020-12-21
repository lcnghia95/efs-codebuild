<template>
  <div class="payment-yZtzqpG" :class="theme" :style="{ 'width': width }">
    <div class="campaign-box text-center fs-12" v-if="info.discountStart">
      {{ $t('1') }}<br />
      <span class="discount-date">
        {{ formatTime(info.discountStart, 0) }}<br v-if="!isHor" />
        <span v-if="isHor">～</span>
        {{ info.discountEnd ? formatTime(info.discountEnd, 0) : '～' }}
      </span>
    </div>
    <div class="main-info p-10">
      <div class="flex pr-10 pl-10" :class="{'layout-col': !isHor, 'space-around': isHor}">
        <div>
          <div class="group-2 flex layout-col center">
            <p v-if="info.oldPrice" class="mb-0 flex mid">
              <span class="title01 mt-3 text-right">{{ $t('8') }}</span>
              <span class="line-through">￥{{ formatNumber(info.oldPrice) }}</span>
            </p>
            <p v-if="info.oldPrice" class="fs-18 co-red flex mid mb-0">
              <span class="title01 co-red text-right">{{ $t('9') }}</span>
              <span class="pl-5">{{ info.price ? '￥' + formatNumber(info.price) : $t('12') }}</span>
              {{ $t('10') }}
            </p>
            <p v-if="info.oldPrice" class="fs-18 flex mid">
              <span class="text-right title01">OFF:</span>
              <span class="co-red pl-5">
                ￥{{ formatNumber(info.oldPrice-info.price) }}
                ({{ (Math.floor((info.oldPrice-info.price)/info.oldPrice*100)) }}%)
              </span>
            </p>
            <p v-else class="fs-18 mb-5 text-center">
              <span class="title01 text-right">{{ $t('11') }}</span>
              <b><span class="pl-10">{{ info.price ? '￥' + formatNumber(info.price) : $t('12') }}</span></b>
              {{ $t('10') }}
            </p>
          </div>
          <div class="flex mid center fs-18 p-5" v-if="info.isSub">
            <span>{{ $t('24') }}</span>
            <span class="ml-10" v-if="info.isFFM">{{ $t('49') }}</span>
          </div>
        </div>
        <CartButton :get-product-password="getProductPassword" />
      </div>
      <div class="pr-25 pl-25" :class="{'mt-20': !isHor}" v-if="!isHor">
        <div :class="{'flex space-around': isHor}">
          <div class="flex center">
            <div class="dvd text-center" v-if="info.isDvd">
              <span class="co-7a593a">{{ $t('15') }}</span><br />
              <span class="fs-11">
                {{ $t('16') }}<span class="co-red">（+550円）</span><a :href="fxonUrl() + '/lecture/duty.php?c=53&i=7726'" target="_blank"><span class="co-blue">{{ $t('17') }}</span></a>
              </span>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <p class="title mt-5 mb-0 text-center"><span>●</span><b>{{ $t('20') }}</b></p>
          <template v-if="payments.card === 1">
            <img class="ml-8 mr-5" src="/img/assets/pc/common/payment_ico_mastercard.png" alt="" />
            <img class="ml-10 mr-5" src="/img/assets/pc/common/payment_ico_visacard.png" alt="" />
          </template>
          <img class="mr-5" v-if="payments.bank === 1" src="/img/assets/pc/common/payment_ico_bank.png" alt="" />
          <template v-if="payments.store === 1">
            <img class="mr-5" src="/img/assets/pc/common/payment_ico_D2.png" alt="" />
            <img class="mr-5" src="/img/assets/pc/common/payment_ico_D1.png" alt="" />
            <img class="mr-5 mb-5" height="35" src="/img/assets/pc/common/payment_ico_jcb.png" alt="" />
            <img class="mr-5" src="/img/assets/pc/common/payment_ico_familymart_new.png" alt="" />
            <!-- <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_thanks.png'" alt=""> -->
          </template>
          <img v-if="payments.tran === 1" class="ml-10" src="/img/assets/pc/common/payment_ico_transfer.png" alt="" />
          <!-- <img v-if="payments.btc === 1" :src="'/img/assets/pc/common/payment_ico_bitcoin.png'" alt=""> -->
        </div>
      </div>
      <div class="fav-wrapp flex space-between" v-if="!isHor">
        <button class="btn btn-fav fs-12 mr-5 flex mid center" 
                :class="{ 'is-fav': info.isFavorite }"
                @click="onFavorite"
                :title="favTitle"
        >
          <div class="flex mid">
            {{ $t('13') }} <Star class="icon-star" :class="{ 'co-ff8e02': info.isFavorite }" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-payment02.json'
import CartButton from './CartButton.vue'
import Star from '@@/../components/icons/Star.vue'
export default {
  components: {
    CartButton,
    Star,
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
    payments() {
      return this.$store.getters['cart/payments']
    },
    favTitle() {
      if (!this.$store.state.user.id) {
        return this.$t('21')
      }
      return this.info.isFavorite ? this.$t('22') : this.$t('23')
    },
  },
  props: {
    theme: {
      type: String,
      default: '',
    },
    getProductPassword: {
      type: Function,
    },
    width: {
      type: String,
      default: '300px',
    },
    isHor: {
      type: Boolean,
      default: false,
    },
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    onFavorite() {
      this.$store.dispatch('cart/favorite', this)
    },
    addPortfolio() {
      this.$store.dispatch('cart/portfolio', this)
    },
  },
}
</script>


<style lang="scss" scoped>
$favCo: #ff8e02;
.mb-3 {
  margin-bottom: 3px;
}
.payment-yZtzqpG {
  background: white;
  color: #666;
  &.theme-hor {
    .discount-date {
      font-size: 16px;
    }
    .group-1 {
      margin-top: 15px;
      margin-bottom: 0;
    }
    .group-2 > div {
      margin-bottom: 0 !important;
    }
    .group-3 {
      margin-top: 0;
    }
  }
}
.campaign-box {
  background: #ff0001;
  color: white;
  padding: 10px 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  .discount-date {
    font-size: 18px;
  }
}
.title {
  color: #5b5b5b;
  span {
    font-size: 18px;
    color: #d0c3b5;
  }
}
.co-blue {
  color: #003bc7;
}
.co-red {
  color: #ff0001;
}
.fs-11 {
  font-size: 11px;
}
.bank-transfer,
.dvd {
  border-radius: 4px;
  padding: 5px 0;
  background: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MDBBQzBBMDlFMDMxMUU4ODNFREJERjc3QjA3MEI2MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MDBBQzBBMTlFMDMxMUU4ODNFREJERjc3QjA3MEI2MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgwMEFDMDlFOUUwMzExRTg4M0VEQkRGNzdCMDcwQjYwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwMEFDMDlGOUUwMzExRTg4M0VEQkRGNzdCMDcwQjYwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgABgAGAwERAAIRAQMRAf/EAaIAAAAGAgMBAAAAAAAAAAAAAAcIBgUECQMKAgEACwEAAAYDAQEBAAAAAAAAAAAABgUEAwcCCAEJAAoLEAACAQMEAQMDAgMDAwIGCXUBAgMEEQUSBiEHEyIACDEUQTIjFQlRQhZhJDMXUnGBGGKRJUOhsfAmNHIKGcHRNSfhUzaC8ZKiRFRzRUY3R2MoVVZXGrLC0uLyZIN0k4Rlo7PD0+MpOGbzdSo5OkhJSlhZWmdoaWp2d3h5eoWGh4iJipSVlpeYmZqkpaanqKmqtLW2t7i5usTFxsfIycrU1dbX2Nna5OXm5+jp6vT19vf4+foRAAIBAwIEBAMFBAQEBgYFbQECAxEEIRIFMQYAIhNBUQcyYRRxCEKBI5EVUqFiFjMJsSTB0UNy8BfhgjQlklMYY0TxorImNRlUNkVkJwpzg5NGdMLS4vJVZXVWN4SFo7PD0+PzKRqUpLTE1OT0laW1xdXl9ShHV2Y4doaWprbG1ub2Z3eHl6e3x9fn90hYaHiImKi4yNjo+DlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+v/aAAwDAQACEQMRAD8A3mmaVZo5Z0STJSRs1FSMwWlp4FVjLHHO9opKiSEOCyXYIeRYX9+631//2Q==');
  margin: 5px 0;
  width: 250px;
}
.fs-15 {
  font-size: 15px;
}
.fs-18 {
  font-size: 18px;
}
.co-7a593a {
  color: #7a593a;
}
.line-through {
  text-decoration: line-through;
}
.title01 {
  width: 120px;
  flex: 0 0 120px;
  padding-right: 10px;
  border-right: 1px dotted #eee;
}
.icon-star {
  width: 20px;
  height: 20px;
  color: #cacaca;
  margin-left: 3px;
  margin-bottom: 1px;
}
.co-ff8e02 {
  color: $favCo;
}
.btn {
  padding: 6px 10px;
}
.btn-fav {
  width: 190px;
  height: 35px;
  outline: none;
  line-height: initial;
  border-radius: 18px;
  margin: auto;
  border: 4px solid #d4d4d4;
  background: white;
  padding: 0;
  &:hover {
    opacity: 0.85;
  }
  &:active {
    box-shadow: none;
  }
  &:focus {
    outline: none;
  }
  > div {
    width: 100%;
    padding: 0 20px;
    justify-content: space-between;
  }
  &.is-fav {
    color: $favCo;
    border: 3px solid $favCo;
  }
}
.question {
  height: 35px;
  border-radius: 50%;
  border: 4px solid #d4d4d4;
  font-size: 20px;
  font-weight: bold;
  color: #d4d4d4;
  padding: 0 8px;
  &:hover {
    opacity: 0.85;
  }
}
</style>
<docs>
  ```vue
  <template>
    <Payment02 :cartInfo="cartInfo"
                :getProductPassword="getProductPassword"
                :status="1"/>
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
    methods: {
      getProductPassword() {}
    }
  }
  </script>
  ```
</docs>
