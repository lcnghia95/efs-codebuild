<template>
  <div class="payment-aMqcC" :class="theme" :style="{ 'width': width }">
    <div class="campaign-box text-center fs-13" v-if="info.discountStart">
      {{ $t('1') }}<br v-if="!type" /><span v-if="type">:</span>
      <span class="discount-date">
        {{ formatTime(info.discountStart, 0) }}
        <span>～</span><br v-if="!type" />
        <span>{{ info.discountEnd ? formatTime(info.discountEnd, 0) : '～' }}</span>
      </span>
    </div>
    <div class="main-info" :style="{ 'padding': type ? '0 50px' : '0', 'margin': type ? '25px 0 20px' : '0' }">
      <div class="flex layout-col" :class="{ 'col-reverse': type }">
        <div class="group-1 flex mt-25 mb-15" :class="layoutClass">
          <div :class="{ 'w-full': this.type }">
            <hr v-if="this.type" />
            <span class="fs-12 flex mid mb-3 bold"><span class="title02 text-left">{{ $t('2') }}</span>: {{ formatTime(info.start, 0) }}</span>
            <div :class="{ 'flex': this.type }">
              <span class="fs-12 flex mid mb-3 mr-20" v-if="info.saleRemain">
                <span class="title02 text-left">{{ $t('3') }}</span>:  {{ info.saleRemain || '0' }}{{ $t('4') }}
              </span>
              <span class="fs-12 flex mid mb-3 mr-20" v-if="info.expectedSaleCount"><span class="title02 text-left">{{ $t('5') }}</span>:  {{ info.expectedSaleCount || '0' }}{{ $t('4') }}</span>
              <span class="fs-12 flex mid mb-3 mr-20" v-if="info.type === 1"><span class="title02 text-left">{{ $t('6') }}</span>:  {{ info.count ? formatNumber(info.count) : '0' }}{{ $t('7') }}</span>
            </div>
            <hr />
          </div>
        </div>
        <div id="price-area" class="group-2 flex" :class="[layoutClass, { 'mid': this.type }]">
          <div v-if="!info.isRangePrice" :style="{ 'margin-right': this.type ? '20px' : '0', 'margin-bottom': this.type ? '20px' : '0' }">
            <p id="old-price" v-if="info.oldPrice" class="mb-0 flex mid">
              <span class="title01 mt-3 text-right">{{ $t('8') }}:</span>
              <span class="line-through">￥{{ formatNumber(info.oldPrice) }}</span>
            </p>
            <p id="current-price" v-if="info.oldPrice" class="fs-20 co-red flex mid mb-0">
              <span class="title01 co-red text-right">{{ $t('9') }}:</span>
              <span class="fs-26">{{ info.price ? '￥' + formatNumber(info.price) : $t('12') }}</span>
              {{ $t('10') }}
            </p>
            <p id="price-reduced" v-if="info.oldPrice" class="fs-20 flex mid">
              <span class="text-right title01">OFF:</span><span class="co-red">￥{{ formatNumber(info.oldPrice-info.price) }} ({{ (Math.floor((info.oldPrice-info.price)/info.oldPrice*100)) }}%)</span>
            </p>
            <p id="price-no-discount" v-else class="fs-30 mb-5">
              <span class="title01 text-right">{{ $t('11') }}:</span>
              <b><span class="fs-26">{{ info.price ? '￥' + formatNumber(info.price) : $t('12') }}</span></b>
              {{ $t('10') }}
            </p>
          </div>
          <div class="text-center" :style="{ 'margin-left': this.type ? '20px' : '0' }">
            <CartButton :get-product-password="getProductPassword" />
            <div class="mt-15 flex">
              <button class="btn fs-11 mr-5 co-5b5b5b"
                      :class="{ 'is-fav': info.isFavorite, 'deactive': !info.isFavorite }"
                      @click="onFavorite"
                      :title="favTitle"
              >
                <div class="flex mid">
                  {{ $t('13') }} <Star class="icon-star" :class="{ 'co-ff8e02': info.isFavorite }" />
                </div>
              </button>
              <button class="btn fs-11 ml-5 co-5b5b5b"
                      :class="{ 'is-fav': info.isPortfolio, 'deactive': !info.isPortfolio }"
                      @click="addPortfolio"
                      :title="portfTitle"
              >
                {{ $t('14') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="group-3 flex mt-25" :class="layoutClass">
        <div :style="{ 'margin-right': this.type ? '20px' : '0' }">
          <div class="dvd text-center" v-if="info.isDvd">
            <span class="fs-15 co-7a593a">{{ $t('15') }}</span><br />
            <span class="fs-11">
              {{ $t('16') }}<span class="co-red">（+550円）</span><a :href="fxonUrl() + '/lecture/duty.php?c=53&i=7726'" target="_blank"><span class="co-blue">{{ $t('17') }}</span></a>
            </span>
          </div>
          <div class="bank-transfer text-center">
            <span class="co-7a593a">{{ $t('18') }}</span><br />
            <b class="co-7a593a">{{ $t('19') }}</b>
          </div>
        </div>
        <div class="cart-info-cash mb-20" :style="{ 'margin-left': this.type ? '20px' : '0' }">
          <p class="title mt-5 mb-0"><span>●</span><b>{{ $t('20') }}</b></p>
          <div class="flex flex-wrap">
            <template v-if="payments.card === 1">
              <img class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_mastercard.png'" alt="" />
              <img class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_visacard.png'" alt="" />
            </template>
            <img class="mr-5 mb-5" v-if="payments.bank === 1" :src="'/img/assets/pc/common/payment_ico_bank.png'" alt="" />
            <template v-if="payments.store === 1">
              <img class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_D2.png'" alt="" />
              <img class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_D1.png'" alt="" />
              <img class="mr-5 mb-5" height="35" :src="'/img/assets/pc/common/payment_ico_jcb.png'" alt="" />
              <img class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_familymart_new.png'" alt="" />
              <!-- <img class="mr-5 mb-5" :src="'/img/assets/pc/common/payment_ico_thanks.png'" alt=""> -->
            </template>
            <!-- <img class="mr-5 mb-5" v-if="payments.btc === 1" :src="'/img/assets/pc/common/payment_ico_bitcoin_new.png'" alt=""> -->
            <img class="mr-5 mb-5" v-if="payments.tran === 1" :src="'/img/assets/pc/common/payment_ico_transfer.png'" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-payment02.json'
import CartButton from './CartButton.vue'
// import CartAuthBtn from './CartAuthBtn.vue'
import Star from '@@/../components/icons/Star.vue'
export default {
  components: {
    CartButton,
    // CartAuthBtn,
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
    portfTitle() {
      if (!this.$store.state.user.id) {
        return this.$t('21')
      }
      return this.info.isPortfolio ? this.$t('26') : this.$t('25')
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
    type: {
      type: Number,
      default: 0,
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
  data() {
    return {
      width: this.type ? '680px' : '300px',
      layoutClass: {
        'layout-col': !this.type,
        mid: !this.type,
        'layout-row': this.type,
        center: this.type,
      },
    }
  },
}
</script>


<style lang="scss" scoped>
$black1: #5b5b5b;
$favCo: #ff8e02;
.mb-3 {
  margin-bottom: 3px;
}
.payment-aMqcC {
  border: 4px solid #d4d4d4;
  border-radius: 10px;
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
  margin: 2px;
  background: #ff0001;
  color: white;
  padding: 10px 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight: bold;
  .discount-date {
    font-size: 18px;
  }
}
.co-5b5b5b {
  color: $black1;
}
.title {
  color: $black1;
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
.bank-transfer,
.dvd {
  border-radius: 4px;
  padding: 5px 0;
  background: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MDBBQzBBMDlFMDMxMUU4ODNFREJERjc3QjA3MEI2MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MDBBQzBBMTlFMDMxMUU4ODNFREJERjc3QjA3MEI2MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgwMEFDMDlFOUUwMzExRTg4M0VEQkRGNzdCMDcwQjYwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwMEFDMDlGOUUwMzExRTg4M0VEQkRGNzdCMDcwQjYwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgABgAGAwERAAIRAQMRAf/EAaIAAAAGAgMBAAAAAAAAAAAAAAcIBgUECQMKAgEACwEAAAYDAQEBAAAAAAAAAAAABgUEAwcCCAEJAAoLEAACAQMEAQMDAgMDAwIGCXUBAgMEEQUSBiEHEyIACDEUQTIjFQlRQhZhJDMXUnGBGGKRJUOhsfAmNHIKGcHRNSfhUzaC8ZKiRFRzRUY3R2MoVVZXGrLC0uLyZIN0k4Rlo7PD0+MpOGbzdSo5OkhJSlhZWmdoaWp2d3h5eoWGh4iJipSVlpeYmZqkpaanqKmqtLW2t7i5usTFxsfIycrU1dbX2Nna5OXm5+jp6vT19vf4+foRAAIBAwIEBAMFBAQEBgYFbQECAxEEIRIFMQYAIhNBUQcyYRRxCEKBI5EVUqFiFjMJsSTB0UNy8BfhgjQlklMYY0TxorImNRlUNkVkJwpzg5NGdMLS4vJVZXVWN4SFo7PD0+PzKRqUpLTE1OT0laW1xdXl9ShHV2Y4doaWprbG1ub2Z3eHl6e3x9fn90hYaHiImKi4yNjo+DlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+v/aAAwDAQACEQMRAD8A3mmaVZo5Z0STJSRs1FSMwWlp4FVjLHHO9opKiSEOCyXYIeRYX9+631//2Q==');
  margin: 10px 0;
  width: 250px;
}
.fs-15 {
  font-size: 15px;
}
.fs-11 {
  font-size: 11px;
}
.fs-18 {
  font-size: 18px;
}
.fs-26 {
  font-size: 26px;
}
.co-7a593a {
  color: #7a593a;
}
.cart-info-cash {
  max-width: 250px;
}
.cart-button.btn {
  padding: 5px 0;
  width: 250px;
  height: 45px;
}
.cart-auth-button {
  width: 250px;
}
.line-through {
  text-decoration: line-through;
}
.co-grey {
  color: #2a2a2a;
}
.title01 {
  width: 100px;
  padding-right: 5px;
}
.icon-star {
  width: 20px;
  height: 20px;
  color: #cacaca;
  margin-left: 3px;
}
.is-fav {
  outline: none;
  color: $favCo;
  border: 1px solid $favCo;
  &:active {
    color: $favCo;
  }
}
.deactive {
  outline: none;
  border-color: #ccc;
  &:hover {
    border-color: #adadad;
  }
}
.co-ff8e02 {
  color: $favCo;
}
.btn {
  padding: 6px 10px;
}
.title02 {
  width: 95px;
}
.col-reverse {
  flex-direction: column-reverse;
}
hr {
  margin-top: 10px;
  margin-bottom: 10px;
}
.bold {
  font-weight: bold;
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
