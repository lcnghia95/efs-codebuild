<template>
  <div>
    <div class="product p-10 mb-5">
      <div class="name mb-10" v-wrap-lines="2">{{ cartInfo.name }}</div>
      <div class="flex space-between">
        <no-ssr>
          <a :href="`/review/detail/${cartInfo.productId}`" class="no-underlying">
            <Rate
              :stars="cartInfo.reviewsStars"
              :number="cartInfo.reviewsCount"
              :target="cartInfo.productId"
              :alway-show="true"
              class="mt-3"
            />
          </a>
        </no-ssr>
        <button class="btn btn-fav fs-12 mr-5 flex mid center"
                :class="{ 'is-fav': cartInfo.isFavorite }"
                @click="onFavorite"
        >
          <div class="flex mid pl-5 pr-5">
            {{ $t('1') }} <Star class="icon-star" :class="{ 'co-ff8e02': cartInfo.isFavorite }" />
          </div>
        </button>
      </div>
    </div>
    <div class="cart-area text-center">
      <span v-html="$t('2', {price: formatNumber(cartInfo.price)})"></span>
      <div class="mb-10">{{ $t('3') }}</div>
      <button ref="btnOrange" class="btn-orange w-full" @click="addToCart">
        <div class="flex mid center">
          <Cart class="mr-10" />
          <span class="ver-mid">{{ $t('4') }}</span>
        </div>
      </button>
      <button class="btn-white w-full mt-10">
        <Payment02 :is-hor="true" />
      </button>
    </div>
    <div ref="cartFixed" class="fixed-cart text-center">
      <div class="flex space-around price-info mb-5">
        <span v-html="$t('2', {price: formatNumber(cartInfo.price)})"></span>
        <span>{{ $t('3') }}</span>
      </div>
      <button class="btn-orange w-full" @click="addToCart">
        <div class="flex mid center">
          <Cart class="mr-10" />
          <span class="ver-mid">{{ $t('4') }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/finance-top-payment.json'
import Star from '@@/../components/icons/Star.vue'
import Cart from '@@/../components/icons/Cart.vue'
import Payment02 from '@/components/finance/payment/Payment02.vue'
import Rate from '@@/../components/product/Rate.vue'
export default {
  i18n: {
    messages: i18n
  },
  components: {
    Star,
    Cart,
    Payment02,
    Rate,
  },
  computed: {
    cartInfo() {
      return this.$store.state.cart.info
    },
  },
  data() {
    return {
      isFixed: false,
    }
  },
  methods: {
    addToCart() {
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      this.$store.dispatch('cart/addToCart', {
        productId: this.cartInfo.productId,
      })
    },
    onFavorite() {
      this.$store.dispatch('cart/favorite', this)
    },
  },
  mounted() {
    let me = this,
      $cart_container = $(me.$refs.btnOrange),
      offset =  $cart_container.offset().top + $cart_container.outerHeight() // offset top + height
    $(window).on('load scroll', function() {
      if ($(window).scrollTop() > offset) {
        $(me.$refs.cartFixed).fadeIn(300)
      } else {
        $(me.$refs.cartFixed).fadeOut(300)
      }
    })
  },
}
</script>

<style lang="scss" scoped>
$favCo: #ff8e02;
.product {
  background-color: #f3f0ef;
  .name {
    font-weight: bold;
    line-height: 1.1em;
    height: 2.2em;
  }
  .btn-fav {
    border-radius: 18px;
    background: white;
    border: 1px solid #fff;
    outline: none;
    padding: 2px 5px;
    line-height: 20px;
    font-size: 15px;
    .icon-cls {
      width: 18px;
      height: 18px;
    }
    &.is-fav {
      color: $favCo;
      border-color: $favCo;
    }
  }
  .icon-star {
    width: 15px;
    height: 15px;
    color: #cacaca;
    margin-left: 3px;
    margin-bottom: 2px;
  }
  .co-ff8e02 {
    color: $favCo;
  }
  /deep/ .gg-rating {
    font-size: 19px !important;
    line-height: 27px;
    .rate-num {
      color: #bdbdbd;
      font-size: 15px;
    }
  }
}
.btn-orange {
  background-color: #ff8500;
  border-radius: 5px;
  border: none;
  color: #fff;
  height: 35px;
  .icon-cls {
    width: 30px;
    height: 30px;
  }
}
.fixed-cart {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  min-height: 85px;
  background-color: rgba(0, 0, 0, 0.86);
  color: #fff;
  padding: 10px;
  display: none;
  .price-info /deep/ span {
    font-size: 15px !important;
    font-weight: normal !important;
  }
}
.cart-area {
  background-color: #f3f0ef;
  padding: 20px 25px;
  .btn-white {
    padding: 0;
    border: none;
    .payment-yZtzqpG {
      border-radius: 5px;
      /deep/ .main-info {
        padding: 8px 0;
        img {
          height: 30px;
        }
      }
    }
  }
}
</style>