<template>
  <div class="w-1000 cart-index">
    <div class="flex space-between">
      <div class="left-cart">
        <div
          class="flex layout-col"
          v-if="!$store.getters['cart01/buyNow'].length"
        >
          <div class="flex mid">
            <Cart />
            <span class="title">{{ $t('20') }}</span>
          </div>
          <div class="no-product text-center mt-10">
            <div class="no-content-title mb-10">{{ $t('24') }}</div>
            <div
              v-html="$t('25')"
              class="no-content"
              v-if="!$store.state.user.id"
            ></div>
            <div class="no-content" v-else>{{ $t('26') }}</div>
          </div>
        </div>
        <template v-else>
          <ProductList :title="$t('20')">
            <Cart />
          </ProductList>
          <div
            class="border-bottom pt-15 pb-15"
            v-if="sumPrice && $store.getters['cart01/hasDvd'] && $i18n.locale == 'ja'"
          >
            <CartDvdOption />
          </div>
        </template>
        <div class="pb-10 pt-10 text-right">
          <!-- eslint-disable -->
          <span>
            <b>{{ $t('22') }}</b>{{ $t('23') }}
          </span>
          <!-- eslint-enable -->
          <b class="co-red ml-20">
            ￥{{ productCount ? formatNumber(sumPrice + dvdPrice + bankTranFee) : 0 }}
          </b>
        </div>
        <CartPaymentMethod
          class="mt-40"
          v-if="$store.getters['cart01/productCount']"
        >
          <CartSteps class="reponsive-cart" />
        </CartPaymentMethod>
        <CartSteps v-else class="reponsive-cart" />
        <ProductList
          :buy-later="true"
          class="buy-later mt-50"
          :title="$t('21')"
        >
          <Coffee />
        </ProductList>
        <div class="mt-50 link-title flex mid continue-shopping" id="continue-shop">
          <Bag class="mr-5" />
          {{ $t('27') }}
        </div>
        <div class="flex flex-wrap space-between link-area pt-10 center continue-shopping">
          <div class="flex layout-col mid center mb-20 mr-5">
            <a :href="langSupported().includes($i18n.locale) ? `/${$i18n.locale}` : '/systemtrade'">{{ $t('14') }}</a>
            <p class="mt-10 text-center" v-html="$t('28')"></p>
          </div>
          <div class="flex layout-col mid center mb-20 mr-5" v-if="$i18n.locale == 'th'">
            <a href="/th/tools/indicators">{{ $t('15') }}</a>
            <p class="mt-10 text-center" v-html="$t('29')"></p>
          </div>
          <template v-if="!langSupported().includes($i18n.locale)">
            <div class="flex layout-col mid center mb-20 mr-5">
              <a href="/tools">{{ $t('15') }}</a>
              <p class="mt-10 text-center" v-html="$t('29')"></p>
            </div>
            <div class="flex layout-col mid center mb-20 mr-5">
              <a href="/event">{{ $t('16') }}</a>
              <p class="mt-10 text-center" v-html="$t('30')"></p>
            </div>
            <div class="flex layout-col mid center mb-20 mr-5">
              <a href="/finance/salons">{{ $t('17') }}</a>
              <p class="mt-10 text-center" v-html="$t('31')"></p>
            </div>
            <div class="flex layout-col mid center mb-20 mr-5">
              <a href="/finance/navi">{{ $t('18') }}</a>
              <p class="mt-10 text-center" v-html="$t('32')"></p>
            </div>
            <div class="flex layout-col mid center mb-20 mr-5">
              <a href="/finance/videos">{{ $t('19') }}</a>
              <p class="mt-10 text-center" v-html="$t('33')"></p>
            </div>
          </template>
        </div>
      </div>
      <div class="right-cart">
        <CartSteps />
      </div>
    </div>
    <CartUserRegister
      class="mt-50"
      v-if="!$store.state.user.id && isAllSalon"
      :show-type="isAllSalon"
    />
    <div class="featured alsoBought mt-40" v-if="alsoBoughtProducts.length > 0">
      <div class="title mb-10">{{ $t('48') }}</div>
      <div class="owl-carousel mt-10 flex owl-loaded owl-drag">
        <ProductVertical
          :product="i"
          v-for="(i, key) in alsoBoughtProducts"
          :key="'slider3' + key"
        />
      </div>
      <br />
    </div>
    <div class="featured mt-40 mb-10" v-if="$i18n.locale == 'ja'">
      <div class="title mb-10">{{ $t('2') }}</div>
      <div class="owl-carousel mt-10 flex owl-loaded owl-drag">
        <ProductVertical
          :product="i"
          v-for="(i, key) in prProducts"
          :key="'slider2' + key"
        />
      </div>
      <br />
    </div>
    <GogoModal
      :show="isShowModal"
      @update:show="val => (isShowModal = val)"
      :width="810"
      :height="500 + dataAdvising.length * 30"
    >
      <div class="modal-header flex content-end" slot="modal-header">
        <button type="button" class="close-custom" @click="onAccept()" v-if="!isAllSalon"><span>&times;</span></button>
      </div>
      <div slot="modal-body" class="advising-body">
        <div class="text-center">
          <b class="title text-center">{{ $t('6') }}</b>
        </div>
        <p v-html="$t('7')" class="mt-10"></p>
        <div class="flex center mt-20">
          <button class="btn-agree" @click="onAccept">{{ $t('8') }}</button>
          <button class="btn-decline ml-50" @click="onDecline">
            {{ $t('9') }}
          </button>
        </div>
        <p v-html="$t('10')" class="mt-20"></p>
        <!-- eslint-disable -->
        <template v-for="prd in dataAdvising">
          <div
            class="flex center mt-20"
             v-if="prd.product.isAdvising"
            :key="'sample-url-' + prd.product.id"
          >
            <a
              @click="onShowSampleBefore(prd.product.id, prd.user.id)"
              class="cursor-pointer"
            >
              【{{ $t('11') }}】
            </a>
            <a
              @click="onShowSampleContract(prd.product.id)"
              class="ml-50 cursor-pointer"
            >
              【{{ $t('12') }}】
            </a>
          </div>
        </template>
        <!-- eslint-enable -->
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
    <GogoModal
      class="err-modal"
      :show="isErr"
      @update:show="val => (isErr = val)"
      :width="450"
      :height="200"
      :cancel-text="''"
    >
      <div slot="modal-header"></div>
      <div slot="modal-body">
        <div class="err-body flex center pt-50 pl-20 pr-20">
          <span class="warning flex mid center mr-5">!</span>
          <!-- eslint-disable -->
          <span
            v-html="cartErrorMsg ? cartErrorMsg :
              $t('cart-errors.' + $route.query.e) !=
              'cart-errors.' + $route.query.e
                ? $t('cart-errors.' + $route.query.e, {
                    number: $route.query.limit,
                  })
                : $t('cart-errors.cartError010')
            "
          ></span>
          <!-- eslint-enable -->
        </div>
      </div>
      <div slot="modal-footer">
        <div class="flex mid flex-wrap space-around mb-20 pl-10 pr-10">
          <button class="btn-simple mt-5 mb-5 btn-cancel" @click="onClickContinue">
            {{ $t('27') }}
          </button>
          <button class="btn-simple mt-5 mb-5 btn-submit" @click="onClickStay">
            {{ $t('34') }}
          </button>
        </div>
      </div>
    </GogoModal>
    <GogoModal
      class="login-buyer-modal"
      :show="isErrBuyer"
      @update:show="val => (isErrBuyer = val)"
      :width="450"
      :cancel-text="''"
    >
      <div slot="modal-header" class="modal-header pl-20 flex">
        <span class="warning flex mid center">!</span>
        <span>{{ $t('35') }}</span>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="err-body flex layout-col mid pt-30 pb-35 pl-15 pr-15">
          <span class="txt-title co-red">{{ $t('36') }}</span>
          <div class="login-form pt-15" @keyup.enter="onClickLogin">
            <div v-html="$t('37')"></div>
            <input
              type="email"
              name="email"
              v-model="email"
              :placeholder="$t('38')"
              class="w-full pl-10 pr-10 mt-15 fs-13"
              v-validate="{ rules: { required: true, email: true } }"
              :class="{ 'btn-loading': loading }"
            />
            <b
              class="co-red"
              v-show="
                isClient &&
                  errors.has('email') &&
                  errors.firstByRule('email', 'required')
              "
            >
              {{ $t('39') }}
            </b>
            <b
              class="co-red"
              v-show="
                isClient &&
                  errors.has('email') &&
                  errors.firstByRule('email', 'email')
              "
            >
              {{ $t('40') }}
            </b>
            <input
              type="password"
              name="password"
              v-model="password"
              :placeholder="$t('41')"
              class="w-full pl-10 pr-10 mt-10 fs-13"
              v-validate="{ rules: { required: true, min: 6 } }"
              :class="{ 'btn-loading': loading }"
            />
            <b
              class="co-red"
              v-show="
                isClient &&
                  errors.has('password') &&
                  errors.firstByRule('password', 'required')
              "
            >
              {{ $t('42') }}
            </b>
            <b
              class="co-red"
              v-show="
                isClient &&
                  errors.has('password') &&
                  errors.firstByRule('password', 'min')
              "
            >
              {{ $t('43') }}
            </b>
            <Checkbox
              :label="$t('44')"
              :attrs="{ value: 1 }"
              v-model="remember"
              class="mt-20"
            />
            <a class="fs-12 pass-reset mt-5" href="/password/reset">
              <span class="icon-arrow"></span>
              {{ $t('45') }}
            </a>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="btn-wrapp flex mid center modal-footer flex-wrap">
        <button class="btn-simple btn-cancel" style="padding: 5px; margin: 5px;" @click="onClickContinue">
          {{ $t('27') }}
        </button>
        <button
          class="btn-simple btn-submit ml-10"
          @click="onClickLogin"
          :class="{ 'btn-loading': loading }"
          style="padding: 5px; margin: 5px;"
        >
          {{ $t('46') }}
        </button>
      </div>
    </GogoModal>
    <GogoModal
      class="term-modal"
      :show="isShowSample"
      @update:show="val => (isShowSample = val)"
      :width="810"
      :height="600"
      :ok-text="''"
      :cancel-text="'3'"
      @close="onCloseSample"
      :title="titleText"
    >
      <div slot="modal-body" class="modal-body sample">
        <div class="advising-body">
          <div class="flex mid center h-full" v-if="loadingSample">
            <Loading style="width: 50px; height: 50px;" />
          </div>
          <p v-html="term"></p>
        </div>
      </div>
    </GogoModal>
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/cart-index.json'
import title from '@@/../common/pages'
import Cart from '@@/../components/icons/Cart.vue'
import Bag from '@@/../components/icons/Bag.vue'
import CartDvdOption from '@/components/cart/CartDvdOption.vue'
import CartPaymentMethod from '@/components/cart/CartPaymentMethod.vue'
import CartUserRegister from '@/components/cart/CartUserRegister.vue'
import CartSteps from '@/components/cart/CartSteps.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import ProductVertical from '@@/../components/product/ProductVertical.vue'
import Coffee from '@@/../components/icons/Coffee.vue'
import ProductList from '@/components/cart/ProductList.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import Loading from '@@/../components/icons/Loading.vue'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import { getCookie } from '@/utils/client/common'
import { getIp } from '@@/../utils/server'
import criteo from '@@/../common/js/criteo/cart'
import {trackingBeginCheckout} from '@@/../common/js/ga/ecom-enhance'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

/**
 * Clean property in object in case the value is null/undefined
 * @param obj
 */
function cleanProp(obj) {
  let e,
    str = ''
  for (let objKey in obj) {
    e = obj[objKey]
    if (obj.hasOwnProperty(objKey) && e !== null && e !== undefined) {
      str += `${objKey}=${e}&`
    }
  }
  return str.substring(0, str.length - 1)
}

const obj = Object.assign(
  {
    components: {
      Cart,
      CartDvdOption,
      CartPaymentMethod,
      CartUserRegister,
      CartSteps,
      GogoModal,
      ProductVertical,
      Coffee,
      ProductList,
      Bag,
      Checkbox,
      Loading,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        isClient: process.browser,
        titleChunk: this.$t('1'),
        isShowModal: false,
        descriptionChunk: this.$t('desChunk'),
        acceptDelivery: false,
        isErr: false,
        isErrBuyer: false,
        remember: 0,
        email: null,
        password: null,
        loading: false,
        term: null,
        loadingSample: false,
        isShowSample: false,
        titleText: null,
      }
    },
    computed: {
      dataAdvising() {
        return this.$store.getters['cart01/dataAdvising']
      },
      sumPrice() {
        return this.$store.getters['cart01/sumPrice']
      },
      dvdPrice() {
        return this.$store.getters['cart01/dvdPrice']
      },
      bankTranFee() {
        return this.$store.getters['cart01/bankTranFee']
      },
      hasAdvising() {
        return this.$store.getters['cart01/hasAdvising']
      },
      isAllSalon() {
        return this.$store.getters['cart01/isAllSalon']
      },
      productCount() {
        return this.$store.getters['cart01/productCount']
      },
    },
    mounted() {
      this.isErr =
        !!this.$route.query.e && this.$route.query.e !== 'cartError001'
      this.isErrBuyer = this.$route.query.e === 'cartError001'
      this.isShowModal = this.hasAdvising && !this.isErr && !this.isErrBuyer
      this.$nextTick(() => {
        $('.owl-carousel').owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: true,
          autoplay: true,
          items: 5,
          nav: true,
          dots: false,
          center: false,
          lazyLoad: true,
          slideBy: 4,
          smartSpeed: 500,
          autoplayHoverPause: true,    
          responsive: {
            0:{
              items: 2,
            },
            400:{
              items: 3,
            },
            700:{
              items: 4,
            },
            1000:{
              items: 5,
            }
          }
        })
      })
      criteo.call(this)
      trackingBeginCheckout(this.data.buyNow)
    },
    async asyncData({ app, store, req, res }) {
      if (req.headers['new-cart-enable'] != 'true') {
        return
      }
      let c = req.cookies,
        cartErrorMsg = c.cartErrorMsg || ''

      // delete cookie
      cartErrorMsg && res.clearCookie('cartErrorMsg')

      console.log(
        '[%s] CART INDEX cpayid',
        getIp(req),
        c.cpayid,
        'cdvdoption',
        c.cdvdoption,
        'csid',
        c.csid,
        'ssid',
        c.ssid
      )
      let [data, prProducts, alsoBoughtProducts] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/cart'),
        app.GoGoHTTP.get('/api/v3/surface/products/pr?limit=20'),
        app.i18n.locale === 'ja'
          ? app.GoGoHTTP.get('/api/v3/cart/also-bought')
          : []
      ])
      if (Array.isArray(prProducts) && prProducts.length <= 10) {
        prProducts = prProducts.concat(prProducts).concat(prProducts)
      }
      store.commit('cart01/setData', data)
      return {
        data,
        cartErrorMsg,
        prProducts,
        alsoBoughtProducts,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/cart',
          },
        ],
      }
    },
    methods: {
      keywordsTemplate() {
        return this.$t('keywordChunk')
      },
      onAccept() {
        this.acceptDelivery = true
        this.isShowModal = false
      },
      onDecline() {
        this.GoGoHTTP.delete('/api/v3/cart/remove/salons').then(() => {
          let salons = (this.data.buyNow || []).filter(
            item => item.product.typeId === 4
          )
          if (salons.length === 1) {
            location.href = `/finance/salons/${salons[0].product.id}`
          } else {
            location.href = '/finance/salons'
          }
        })
      },
      onClickContinue() {
        if (this.langSupported().includes(this.$i18n.locale)) {
          location.href = `/${this.$i18n.locale}`
          return
        }
        if (process.browser) {
          location.href = getCookie('savePath', document.cookie) || '/'
        } else {
          location.href = '/'
        }
      },
      onClickStay() {
        location.href = '/cart'
      },
      onClickLogin() {
        this.$validator.validateAll().then(success => {
          if (!success) {
            return
          }
          this.loading = true
          let info = {
            email: this.email,
            password: this.password,
            u: !!this.$route.query.u,
            is_buyuser: 1,
            remember: this.remember ? 1 : 0,
          }
          this.GoGoHTTP.post('/login', info)
            .then(data => {
              if (data.code === 40302) {
                this.isShowModal = true
                throw '40302'
              }
              if (!data.length) {
                this.isShowModal = true
                throw 'login error'
              }
              let ut = data[0],
                d = new Date().getTime().toString(),
                params = cleanProp({
                  login_id: encodeURIComponent(this.email),
                  login_pass: encodeURIComponent(this.password),
                  type: ut.type,
                  mode: ut.mode || null,
                  id: ut.oId || null,
                  remember: this.remember ? 1 : 0,
                  su: 'vx',
                  date: d.substr(0, d.length - 3),
                }),
                uid = ut.id,
                uname = ut.nickName,
                isBuyuser = 1,
                llt = d.substr(0, d.length - 3),
                isaff = 0
              this.$store.commit('setUser', {
                id: uid,
                name: uname,
                isBuyuser: parseInt(isBuyuser),
                llt,
                isaff,
              })
              this.loading = true
              this.GoGoHTTP.get('/api/v3/cart/sync')
              this.GoGoHTTP.post('/asp/sync_log/sync_log.php', params, {
                baseURL: process.env.FXON_URL,
              }).finally(() => {
                this.loading = false
              })
            })
            .catch(() => {
              this.hasError = true
            })
            .finally(() => {
              this.loading = false
              location.href = this.$route.query.u || '/cart'
            })
        })
      },
      async onShowSampleBefore(pId, devId) {
        this.titleText = this.$t('11')
        this.isShowModal = false
        this.loadingSample = true
        this.isShowSample = true
        this.term = await this.GoGoHTTP.get(
          `/api/v3/surface/inquiry/usb/${pId}/${devId}`
        )
        this.term = (this.term || {}).Contents
        this.loadingSample = false
      },
      async onShowSampleContract(pId) {
        this.titleText = this.$t('12')
        this.isShowModal = false
        this.loadingSample = true
        this.isShowSample = true
        this.term = await this.GoGoHTTP.get(
          `/api/v3/surface/inquiry/usa/${pId}`
        )
        this.term = (this.term || {}).Contents
        if (this.term) {
          let maskin = '*****'
          this.term = this.term
            .replace('#PostalCode#', maskin)
            .replace('#postal_code#', maskin)
            .replace('#Region1#', maskin)
            .replace('#Region2#', maskin)
            .replace('#Region3#', maskin)
            .replace('#buy_last_name#', maskin)
            .replace('#buyename#', maskin)
            .replace('#buyfname#', maskin)
            .replace('#buy_first_name#', maskin)
            .replace('#dev_last_name#', maskin)
            .replace('#dev_first_name#', maskin)
            .replace('#devename#', maskin)
            .replace('#devfname#', maskin)
            .replace('#term#', maskin)
            .replace('#dday#', maskin)
            .replace('#dday2#', maskin)
            .replace('#dday3#', maskin)
            .replace('#Region4#', maskin)
            .replace('#price#', maskin)
        }
        this.loadingSample = false
      },
      onCloseSample() {
        this.isShowSample = false
        this.isShowModal = true
      },
    },
  },
  title
)
export default obj
</script>

<style>
/* TODO: class modal open is missing in production env */
.modal-open {
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
@import '@/assets/cart/variables.scss';
@media only screen and (max-width: 610px) { // reponsive only vertical device
  /deep/ .list-header {
    display: none;
  }
  /deep/ .product-info-wrapp, /deep/ .product-info-wrapp-2 {
    width: 100% !important;
  }
  /deep/ .product-vjFXY .prices-area {
    align-items: flex-start !important;
  }
  /deep/ .term-content {
    padding: 0 !important;
    height: auto !important;
  }
  /deep/ .text-warn {
    font-size: 15px !important;
  }
  /deep/ .product-detail {
    .reponsive-label {
      margin-right: 5px;
      line-height: 22px;
      display: inline;
    }
    font-size: 15px;
    .type {
      margin: 5px 5px 5px 0 !important;
      min-width: 140px;
      width: auto !important;
      text-align: left;
    }
    .count {
      margin: 5px 0 !important;
      min-width: 70px;
      width: auto !important;
      text-align: left;
    }
    .product-prices {
      margin: 5px 0 !important;
      margin: 0;
      text-align: left !important;
    }
    .cart-edit {
      margin-bottom: 0;
    }
  }
  /deep/ .gift-area .gift-content {
    width: 100% !important;
    margin: 2px 0 !important;
  }
}
@media only screen and (max-width: $max-width) {
  /deep/ .product-vjFXY .bottom-detail .contract {
    white-space: pre-wrap !important;
  }
  /deep/ .contract-ck.c-label {
    white-space: pre-wrap !important;
  }
  .right-cart {
    display: none;
  }
  .left-cart {
    width: 100% !important;
  }
  .payment-wrapp {
    width: 100% !important;
  }
  .cart-index {
    padding: 50px 10px !important;
  }
  .reponsive-cart {
    display: block !important;
    width: 100% !important;
    margin: 15px auto;
    max-width: 540px;
  }
  .continue-shopping {
    display: none;
  }
  /deep/ .options-wrapp {
    width: 100% !important;
    flex-wrap: wrap;
  }
  /deep/ .register-wrapp {
    height: calc(100% - 105px) !important;
    .a-row input {
      margin: 8px 0 !important;
      width: 100% !important;
    }
    .info-area {
      padding: 20px 20px 30px !important;
      .co-red {
        margin-left: 0 !important;
      }
    }
    .dropdown {
      margin: 8px 0 !important;
    }
  }
  /deep/ .choose-area {
    padding: 20px !important;
    .c-label {
      &:first-child {
        flex: 0 0 100% !important;
      }
      &:last-child {
        flex: 0 0 100% !important;
      }
    }
  }
  /deep/ .sample.modal-body {
    height: 60vh !important;
  }
  /deep/ .payments .a-row img {
    margin: 0 0 0 20px;
  }
  /deep/ .product-detail {
    font-size: 15px;
  }
  /deep/ .owl-carousel {
    width: calc(100% - 15px);
    .owl-nav button.owl-prev {
      left: -10px;
    }
    .owl-nav button.owl-next {
      right: -10px;
    }
  }
}
@media only screen and (min-width: $min-width) {
  /deep/ .modal-body {
    height: auto !important;
    max-height: calc(80vh - 100px);
  }
  /deep/ .modal-content {
    height: auto !important;
  }
}
//===============================================
.reponsive-cart {
  display: none;
}
.cart-index {
  color: #2d2d2d;
  padding: 50px 0;
  .title {
    font-size: 20px;
    line-height: 20px;
  }
  .left-cart {
    width: 600px;
    .list-header {
      .price {
        width: 140px;
      }
      .type {
        width: 80px;
      }
      .quantity {
        width: 50px;
      }
    }
    .border-bottom {
      border-bottom: 1px solid #d9d9d9;
    }
    .buy-later /deep/ {
      > div:first-child {
        border-bottom: 1px solid #d9d9d9;
        padding-bottom: 7px;
      }
      .title {
        font-size: 18px;
      }
      .icon-cls {
        width: 27px;
        height: 28px;
      }
    }
  }
  .right-cart {
    width: 330px;
  }
  .featured {
    padding: 40px 0;
    border-top: 1px solid #d9d9d9;
    overflow: hidden;
    .title {
      font-size: 18px;
      line-height: 20px;
    }
  }
  .alsoBought {
    margin-bottom: -80px;
  }
  .product-vertical {
    width: 120px;
    height: 260px;
    padding: 10px;
    &:hover {
      background: #f5f5f5;
    }
    /deep/ .product-name {
      color: #2d2d2d;
      height: 38px;
    }
    /deep/ .product-des {
      height: 38px;
    }
  }
  .no-product {
    padding: 120px 0 140px;
    color: #b2b2b2;
    border-top: 1px solid #b2b2b2;
    border-bottom: 1px solid #b2b2b2;
    .no-content-title {
      font-size: 20px;
    }
    .no-content /deep/ {
      a {
        color: #b2b2b2;
        text-decoration: underline;
        &:hover {
          color: #888;
        }
      }
    }
  }
  .link-title {
    font-size: 18px;
    color: #2d2d2d;
    .icon-cls {
      width: 26px;
      height: 27px;
    }
  }
  .link-area {
    div {
      color: #2d2d2d;
      width: 290px;
      height: 160px;
      border: 1px solid #d9d9d9;
      border-radius: 5px;
      a {
        color: #2d2d2d;
        font-size: 17px;
      }
      p {
        font-size: 12px;
      }
    }
  }
}
/deep/ .modal-dialog {
  top: 15%;
  margin: 10% auto;
  .modal-header {
    .close {
      display: none;
    }
  }
  .modal-footer {
    height: auto;
  }
}
.advising-body {
  color: #2d2d2d;
  padding: 35px 30px;
  height: calc(100% - 50px);
  overflow-y: auto;
  .title {
    font-size: 16px;
    line-height: 30px;
  }
  button {
    outline: none;
    width: 200px;
    height: 35px;
    color: white;
    border: none;
  }
  .btn-agree {
    background: #a0a0a0;
    &:hover {
      background: white;
      border: 2px solid #a0a0a0;
      color: #a0a0a0;
    }
  }
  .btn-decline {
    background: #000;
    &:hover {
      background: white;
      border: 2px solid #000;
      color: #000;
    }
  }
  a {
    color: #04c;
    font-size: 15px;
  }
}
.term-modal /deep/ {
  .modal-header {
    .modal-title {
      border-left: 2px solid #2d2d2d;
      padding-left: 5px;
      margin-left: 20px;
    }
  }
  .advising-body {
    color: #2d2d2d;
    padding: 20px 30px;
  }
}
.login-buyer-modal /deep/ {
  .modal-header {
    color: #2d2d2d;
    height: auto;
    .warning {
      border-radius: 50%;
      background: #f60;
      font-weight: bold;
      width: 17px;
      height: 17px;
      flex: 0 0 17px;
      color: white;
      margin: 3px 5px 0 0;
      ~ span {
        font-size: 14px;
        margin-top: 2px;
      }
    }
  }
  .err-body {
    .txt-title {
      font-size: 16px;
    }
    .login-form {
      width: 100%;
      border-top: 1px solid #ccc;
      input {
        border: #d9d9d9 1px solid;
        height: 40px;
        &::placeholder {
          color: #b2b2b2;
        }
      }
      .c-label {
        font-weight: normal;
        font-size: 12px;
        margin-bottom: 0;
      }
      .pass-reset {
        color: #0344cc;
        display: inline-block;
        .icon-arrow {
          display: inline-block;
          width: 0;
          height: 0;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid #666;
        }
      }
    }
  }
}
.err-modal /deep/ {
  .err-body {
    color: #2d2d2d;
    height: 120px;
    overflow-y: auto;
    .warning {
      border-radius: 50%;
      background: #f60;
      font-weight: bold;
      width: 20px;
      height: 20px;
      flex: 0 0 20px;
      color: white;
      ~ span {
        font-size: 16px;
      }
    }
  }
}
.btn-simple {
  border-radius: 5px;
  width: 90%;
  min-height: 35px;
  border: 0;
  outline: none;
  display: block;
  margin: 5px 0;
  padding: 5px 10px;
  word-break: break-word;
  font-size: 15px;
  @media screen and (min-width: $mobile-small) {
    width: 45%;
    min-width: 180px;
  }
  &.btn-submit {
    background: #ff7d02;
    color: white;
    &:hover {
      opacity: 0.85;
    }
  }
  &.btn-cancel {
    background: inherit;
    border: 1px solid #c5c5c5;
    &:hover {
      background: #f0eff0;
    }
  }
}
.co-red {
  color: #e60012;
}
.btn-loading {
  pointer-events: none;
  opacity: 0.5;
}
.close-custom {
  height: 25px;
  outline: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
}
</style>
