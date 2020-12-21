<template>
  <div class="payment-yZtzqpGG" :class="theme" :style="{ 'width': width }">
    <div class="header text-center">{{ $t('28') }}</div>
    <div class="campaign-box text-center fs-12" v-if="info.discountStart">
      <div v-if="info.discountEnd" class="border-radius-5 co-red info p-15">
        {{ formatTime(info.discountEnd, 9) }}<br /><span v-html="$t('41')"></span>
      </div>
      <div v-if="info.discountLimit" class="border-radius-5 co-red2 info p-15">
        {{ info.discountLimit }}{{ $t('40') }}<br />
      </div>
    </div>
    <div class="main-info p-15">
      <div class="flex" :class="{'layout-col': !isHor, 'space-around': isHor}">
        <div class="rv-price m-b-15 p-lr-5" :class="{ 'text-left': info.oldPrice, 'text-center': !info.oldPrice }">
          <template v-if="info.oldPrice">
            <div class="rv-price co-red2">{{ ((info.oldPrice-info.price)/info.oldPrice*100).toFixed(2) }}% OFF</div>
            <span class="co-grey old-price fs-16">￥{{ formatNumber(info.oldPrice) }}</span>
            <span>&rarr;</span>
          </template>
          <span v-if="info.price" class="co-red2"><b>￥{{ formatNumber(info.price) }}</b><span class="co-red fs-12 p-l-5">{{ $t('10') }}</span></span>
          <span v-else-if="info.status" class="co-red2"><b>￥{{ formatNumber(info.price) }}</b> <span class="co-red fs-12 p-l-5">{{ $t('10') }}</span></span>
        </div>
        <div class="flex center fs-18 p-5" v-if="info.isSub">{{ $t('24') }}</div>
      </div>
      <div class="pr-25 pl-25">
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
        <div class="mb-20 mt-10">
          <p class="title mt-5 mb-0 text-center"><span>●</span><b>{{ $t('20') }}</b></p>
          <img class="girl-msg" src="/img/assets/pc/common/message.png" alt="" />
          <div class="pm-icons flex">
            <template v-if="payments.card === 1">
              <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_mastercard.png'" alt="" />
              <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_visacard.png'" alt="" />
            </template>
            <img class="mr-5" v-if="payments.bank === 1" :src="'/img/assets/pc/common/payment_ico_bank.png'" alt="" />
            <template v-if="payments.store === 1">
              <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_D2.png'" alt="" />
              <img class="mr-5" :src="'/img/assets/pc/common/payment_ico_D1.png'" alt="" />
              <img class="mr-5 mb-5" height="35" :src="'/img/assets/pc/common/payment_ico_jcb.png'" alt="" />
              <img class="mr-5" height="35" :src="'/img/assets/pc/common/payment_ico_familymart_new.png'" alt="" />
            </template>
            <img v-if="payments.tran === 10" :src="'/img/assets/pc/common/payment_ico_transfer.png'" alt="" />
            <!-- <img v-if="payments.btc === 10" :src="'/img/assets/pc/common/payment_ico_bitcoin.png'" alt=""> -->
          </div>
        </div>
      </div>
      <div class="fav-wrapp flex space-between" v-if="!isHor">
        <button class="btn btn-fav fs-12 mr-5 flex mid center"
                :class="{ 'is-fav': info.isFavorite }"
                @click="onFavorite"
                :title="favTitle"
        >
          <div class="flex mid">
            {{ $t('13') }} <StarO class="icon-star" :class="{ 'co-ff8e02': info.isFavorite }" />
          </div>
        </button>
      </div>
    </div>
    <div data-toggle="collapse" data-target="#product-details" aria-expanded="false" aria-controls="product-details" class="footer text-center cursor-pointer prod-dt" @click="Collapse">
      {{ $t('29') }}
      <Plus v-if="collapsed" />
      <Minus v-else />
    </div>
    <div id="product-details" class="collapse" aria-expanded="false">
      <div class="cart-detail">
        <div class="cart-info m-b-20 m-lr-15 p-t-10">
          <h5><b>■{{ $t('30') }}</b></h5>
          <p class="flex space-between m-b-5">
            {{ $t('31') }}
            <span class="text-align">{{ formatTime(info.start, 7) }}</span>
          </p>
          <p class="flex space-between m-b-15">
            {{ $t('32') }}
            <span class="text-align">{{ info.count }}{{ $t('33') }}</span>
          </p>
        </div>
        <div class="cart-info m-b-20 m-lr-15" v-if="info.type==1">
          <h5><b>■{{ $t('34') }}</b></h5>
          <p class="flex space-between m-b-5">
            {{ $t('35') }}
            <span class="text-align">{{ info.updated ? formatTime(info.start, 7) : null }}</span>
          </p>
          <p class="flex space-between m-b-15">
            {{ $t('36') }}
            <span class="text-align">{{ info.version || null }}</span>
          </p>
        </div>
        <div class="cart-info m-b-20" v-if="info.type==1">
          <h5 class="m-lr-15"><b>■{{ $t('37') }}</b></h5>
          <div class="cart-info-tag m-lr-5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-payment02.json'
import CartButton from './CartButton.vue'
import StarO from '@@/../components/icons/StarO.vue'
import Plus from '@@/../components/icons/Plus.vue'
import Minus from '@@/../components/icons/Minus.vue'
export default {
  components: {
    CartButton,
    StarO,
    Plus,
    Minus,
  },
  data() {
    return {
      collapsed: true,
    }
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
    Collapse() {
      this.collapsed = !this.collapsed
    },
  },
}
</script>


<style lang="scss" scoped>
$favCo: #ff8e02;
.payment-yZtzqpGG {
  width: 300px;
  border: 2px solid #eee;
  background: #fcfcfc;
  color: #666;
  .prod-dt {
    height: 40px;
    background: #eee;
    border: 2px solid #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    /deep/ .icon-cls {
      width: 20px;
      margin-top: 11px;
    }
  }
  .header {
    height: 40px;
    border-bottom: 2px solid #eee;
    font-size: 14px;
    text-align: center;
    padding-top: 10px;
  }
  .rv-price {
    font-size: 18px;
  }
  .pm-icons {
    width: 260px;
    flex-wrap: wrap;
    justify-content: center;
    margin-left: -18px;
  }
  .girl-msg {
    margin-left: 7px;
    margin-bottom: 5px;
  }
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
.cart-detail {
  .cart-info {
    color: #666;
    border-bottom: 1px dotted #d9d9d9;
    padding: 10px 20px;
  }
}
.campaign-box {
  color: white;
  padding: 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  .discount-date {
    font-size: 18px;
  }
}
.title {
  color: #5b5b5b;
  margin-top: -13px;
  margin-bottom: 0;
  span {
    font-size: 18px;
    color: #666;
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
  width: 25px;
  height: 25px;
  margin-top: -6px;
}
.co-ff8e02 {
  color: $favCo;
}
.btn {
  padding: 6px 10px;
}
.btn-fav {
  outline: none;
  height: 35px;
  line-height: 24px;
  border: 1px solid #f90;
  color: #f90;
  background: white;
  width: 214px;
  font-size: 14px;
  margin-left: 25px;
  &:hover {
    background: #f90;
    color: white;
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
    justify-content: center;
  }
  &.is-fav {
    background: #f90;
    color: white;
    i {
      color: white;
    }
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
.co-red2 {
  color: #ff0400;
}
.co-grey {
  color: #666;
}
.old-price {
  text-decoration: line-through;
}
.fs-16 {
  font-size: 16px;
}
.info {
  background: #eee;
  font-size: 18px;
  border-radius: 5px;
}
.m-b-15 {
  margin-bottom: 15px;
}
.p-lr-5 {
  padding-left: 5px;
  padding-right: 5px;
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
