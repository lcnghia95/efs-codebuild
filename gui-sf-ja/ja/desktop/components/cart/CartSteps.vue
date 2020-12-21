<template>
  <div class="cart-step">
    <div class="steps flex mid center mb-15">
      <div class="flex mid" v-for="(item,i) in steps" :key="'step-' + i">
        <span :class="{'active': step == i}">{{ i + 1 }}&nbsp;{{ item }}</span>
        <span v-if="i < 2" class="space">&nbsp;</span>
      </div>
    </div>
    <div class="summary pt-25" v-if="step != 2">
      <div class="a-row pb-15 ml-25 mr-25">{{ $t('4') }}</div>
      <div class="a-row fs-12 pb-15 pt-15 ml-25 mr-25">
        <div class="flex mid space-between">
          <span>{{ $t('14').replace('%s', productCount) }}</span>
          <span>￥{{ formatNumber(sumPrice, '0') }}</span>
        </div>
        <div v-if="dvdOpt && productCount" class="flex mid space-between mt-5">
          <span>{{ dvdOptions[dvdOpt] }}</span>
          <span>￥{{ formatNumber(dvdPrice, '0') }}</span>
        </div>
        <div v-if="pay == 5" class="flex mid space-between mt-5">
          <span>{{ $t('30') }}</span>
          <span>￥{{ formatNumber(bankTranFee, '0') }}</span>
        </div>
        <div v-if="pay == 1 && bankRefund" class="flex mid space-between mt-5 co-red">
          <span>{{ $t('39') }}</span>
          <span>￥{{ formatNumber(bankRefund, '0') }}</span>
        </div>
      </div>
      <div class="a-row pt-15 pb-15 ml-25 mr-25 flex mid space-between">
        <span><b>{{ $t('5') }}</b><span class="ml-5">({{ $t('15') }})</span></span>
        <span class="total-price"><b>￥{{ productCount ? formatNumber(sumPrice + dvdPrice + bankTranFee + bankRefund, '0') : 0 }}</b></span>
      </div>
      <div class="login-form pl-25 pr-25 pt-35 pb-30" v-if="showLogin && step == 0" @keyup.enter="onClickLogin">
        <input type="email" name="email" v-model="email" :placeholder="$t('7')" class="w-full pl-10 pr-10 fs-13" v-validate="{ rules: { required: true, email: true } }" :class="{'btn-loading': loading}" />
        <b class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'required')">{{ $t('22') }}</b>
        <b class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'email')">{{ $t('23') }}</b>
        <input type="password" name="password" v-model="password" :placeholder="$t('8')" class="w-full pl-10 pr-10 mt-10 fs-13" v-validate="{ rules: { required: true, min: 6, max: 32 } }" :class="{'btn-loading': loading}" />
        <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'required')">{{ $t('24') }}</b>
        <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'min')">{{ $t('25') }}</b>
        <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'max')">{{ $t('44') }}</b>
        <button class="btn-cart mt-20 w-full flex mid space-around" @click="onClickLogin" :class="{'btn-loading': loading}">
          <span>{{ buyNow.length ? $t('9') : $t('38') }}</span>
          <Loading v-if="loading" class="sm" style="width: 40px; height: 40px;" />
        </button>
        <Checkbox :label="$t('10')" :attrs="{value: 1}" v-model="remember" class="mt-10" /><br />
        <a class="fs-12 pass-reset" href="/password/reset">
          <span class="icon-arrow"></span>
          {{ $t('11') }}
        </a>
        <div class="sns-login mt-20">
          <p><b>{{ $t('40') }}</b></p>
          <div class="social-block flex mid mt-10" v-if="!langSupported().includes($i18n.locale)">
            <img :src="'/img/assets/pc/common/icon_Yahoo.jpg'" alt="Yahoo" />
            <a class="pr-10 pl-10 fs-12 co-black no-underlying" rel="nofollow"
               :href="'/sns/login?provider=yahoojp&' + buildGetParams()"
            >
              {{ $t('43') }}
            </a>
          </div>
          <div class="social-block flex mid mt-10">
            <img :src="'/img/assets/pc/common/icon_Twitter.jpg'" alt="Twitter" />
            <a class="pr-10 pl-10 fs-12 co-black no-underlying" rel="nofollow"
               :href="'/sns/login?provider=twitter&' + buildGetParams()"
            >
              {{ $t('41') }}
            </a>
          </div>
          <div class="social-block flex mid mt-10">
            <img :src="'/img/assets/pc/common/icon_Facebook_new.png'" alt="Facebook" />
            <a class="pr-10 pl-10 fs-12 co-black no-underlying" rel="nofollow"
               :href="'/sns/login?provider=facebook&' + buildGetParams()"
            >
              {{ $t('42') }}
            </a>
          </div>
        </div>
        <button style="background: #3f48cc;" class="btn-cart mt-30 w-full flex mid space-around" @click="gotoRegister" v-if="!userId">
          {{ $t('6') }}
        </button>
      </div>
      <template v-if="productCount">
        <div v-if="!showLogin && step != 1" class="p-30">
          <form ref="cfCartForm" :action="'/cart/confirm'" method="post"></form>
          <button class="btn-cart w-full" :class="{'btn-loading': loading || hasError}" @click="onClickForm">
            {{ step ? ((pay == 2 || pay == 3) ? $t('31') : $t('16')) : $t('36') }}
          </button>
          <b class="co-red" v-show="payErr">{{ $t('27') }}</b><br />
          <b class="co-red" v-show="termErr">{{ $t('29') }}</b>
        </div>
        <div class="p-30" v-if="step == 1">
          <form ref="cplCartForm" :action="'/cart/complete'" method="post">
            <input type="hidden" name="checkoutData" />
          </form>
          <button class="btn-cart w-full flex mid space-around" :class="{'disabled-zPANr': !activeBtn, 'btn-loading': loading || hasError}" @click="onClickForm">
            <span>{{ step ? ((pay == 2 || pay == 3) ? $t('31') : $t('16')) : $t('13') }}</span>
            <Loading v-if="loading" class="sm" style="width: 40px; height: 40px;" />
          </button>
          <b class="co-red" v-show="payErr">{{ $t('27') }}</b><br />
          <b class="co-red" v-show="termErr">{{ $t('29') }}</b>
        </div>
      </template>
      <a class="confirm-footer flex center p-15" @click="gotoContinueShop" v-if="!step">
        {{ $t('12') }}
      </a>
    </div>
    <div v-else>
      <div class="cart-complete">
        <div class="complete-header flex mid">
          <Check class="mr-5" />
          <b>{{ $t('17') }}</b>
        </div>
        <div class="flex layout-col complete-content">
          <a href="/mypage/download" class="flex space-between"
             v-if="typeIds.includes(1) || typeIds.includes(2) || typeIds.includes(6)"
          >
            <span>{{ $t('18') }}</span><span>〉</span>
          </a>
          <a href="/mypage/navi" class="flex space-between" v-if="typeIds.includes(3)">
            <span>{{ $t('32') }}</span><span>〉</span>
          </a>
          <a href="/mypage/mailmagazine" class="flex space-between" v-if="userId && typeIds.includes(4)">
            <span>{{ $t('33') }}</span><span>〉</span>
          </a>
          <a href="/mypage/event" class="flex space-between" v-if="typeIds.includes(19)">
            <span>{{ $t('34') }}</span><span>〉</span>
          </a>
          <a href="/mypage/video" class="flex space-between" v-if="typeIds.includes(5)">
            <span>{{ $t('35') }}</span><span>〉</span>
          </a>
          <a href="/" class="flex space-between">
            <span>{{ $t('19') }}</span><span>〉</span>
          </a>
          <a href="/mypage/statement/purchase" class="flex space-between" v-if="userId">
            <span>{{ $t('20') }}</span><span>〉</span>
          </a>
          <a :href="fxonUrl('/inquiry/')" class="flex space-between">
            <span>{{ $t('21') }}</span><span>〉</span>
          </a>
        </div>
      </div>
      <a class="send-payment text-center w-full mt-30" v-if="pay == 4 && confirmUrl" :href="confirmUrl" target="_blank">{{ $t('28') }}</a>
    </div>
    <GogoModal :show="isShowModal" @update:show="val => isShowModal = val" :width="480" :height="180">
      <div slot="title"></div>
      <div slot="modal-body" class="error-body flex mid center">
        <div class="flex flex-wrap">
          <div class="warning flex mid center mr-5">!</div>
          <div class="text-warn text-center" v-html="$t('26')"></div>
        </div>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/cart-steps.json'
import Checkbox from '@@/../components/form/Checkbox.vue'
import Check from '@@/../components/icons/Check.vue'
import Loading from '@@/../components/icons/Loading.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import { setCookie } from '@/utils/client/common'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import {trackingPurchase} from '@@/../common/js/ga/ecom-enhance'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

/**
 * Clean property in object in case the value is null/undefined
 * @param obj
 */
// function cleanProp(obj) {
//   let e,
//     str = ''
//   for (let objKey in obj) {
//     e = obj[objKey]
//     if (obj.hasOwnProperty(objKey) && e !== null && e !== undefined) {
//       str += `${objKey}=${e}&`
//     }
//   }
//   return str.substring(0, str.length - 1)
// }

export default {
  components: {
    Checkbox,
    Check,
    Loading,
    GogoModal,
  },
  props: {
    step: {
      type: Number,
      default: 0,
    },
    confirmUrl: String,
    typeIds: {
      type: Array,
      default: () => [],
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      isClient: process.browser,
      steps: [this.$t('1'), this.$t('2'), this.$t('3')],
      dvdOptions: {
        0: this.$t('dvd0'),
        1: this.$t('dvd1'),
        2: this.$t('dvd2'),
      },
      remember: 0,
      email: null,
      password: null,
      loading: false,
      isShowModal: false,
      payErr: false,
      termErr: false,
      syncData: {},
      toFn: null,
    }
  },
  computed: {
    activeBtn() {
      if (!this.step || this.loading) {
        return true
      } else {
        return this.confirmAgreeAll
      }
    },
    confirmAgreeAll() {
      return this.$store.getters['cart01/confirmAgreeAll']
    },
    dvdPrice() {
      return this.$store.getters['cart01/dvdPrice']
    },
    dvdOpt() {
      return this.$store.getters['cart01/dvdOpt']
    },
    productCount() {
      return this.$store.getters['cart01/productCount']
    },
    sumPrice() {
      return this.$store.getters['cart01/sumPrice']
    },
    pay() {
      return this.$store.getters['cart01/payId']
    },
    term() {
      return this.$store.getters['cart01/agreeAll']
    },
    bankTranFee() {
      return this.$store.getters['cart01/bankTranFee']
    },
    buyer() {
      return this.$store.getters['cart01/buyer']
    },
    storeId() {
      return this.$store.getters['cart01/storeId']
    },
    showLogin() {
      let llt = this.$store.state.user.llt,
        // OAM-22457 extend llt cookie from 15 minutes to 7 days
        // https://gogojungle.backlog.jp/view/OAM-22805, expired date is 2 years
        checkTime = new Date().getTime() / 1000 - llt > 6.307e+7
      return !this.userId || (this.userId && (!llt || checkTime))
    },
    buyNow() {
      return this.$store.getters['cart01/buyNow']
    },
    isUserInfoOk() {
      if (!this.sumPrice) {
        return true
      }
      if (this.$i18n.locale === 'ja') {
        return (
          this.$store.getters['cart01/isUserInfoOk']
        )
      } else {
        return this.$store.getters['cart01/isUserForeignInfoOk']
      }
    },
    bankRefund() {
      if (this.pay !== 1) {
        return 0
      }
      if (this.sumPrice > 5000 && this.sumPrice <= 30000) {
        return -220
      } else if (this.sumPrice > 30000) {
        return -440
      }
      return 0
    },
    hasError() {
      return this.$store.getters['cart01/hasError']
    },
    userId() {
      return this.$store.state.user.id
    },
  },
  mounted() {
    if (this.$route.query.login) {
      this.checkPreCondition()
    }
  },
  methods: {
    checkPreCondition(showErr = true) {
      let count = 0
      if (this.sumPrice + this.dvdPrice + this.bankTranFee) {
        if (!this.pay) {
          if (showErr) {
            this.payErr = true
          }
          count++
        }
      } else {
        this.payErr = false
      }
      if (!this.term) {
        if (showErr) {
          this.termErr = true
        }
        count++
      } else {
        this.termErr = false
      }
      return !!count
    },
    onClickForm() {
      this.toFn && clearTimeout(this.toFn)
      this.toFn = setTimeout(() => {
        this.handleClickForm()
      }, 400)
    },
    handleClickForm() {
      if (!this.activeBtn) {
        return
      }
      let period = 30 * 24 * 60
      setCookie('cdvdoption', this.dvdOpt, period)
      if (this.step === 0) {
        if (this.checkPreCondition()) {
          return
        }
        this.$nuxt.$emit('cart/showSpinner', true)
        this.payErr = false
        this.termErr = false
        setCookie('cpayid', this.pay, period)
        this.addGtag(this.$refs.cfCartForm, 'confirm')
      } else if (this.step === 1) {
        if (!this.isUserInfoOk) {
          this.$store.commit('cart01/setShowUserModal', true)
          return
        }
        this.$nuxt.$emit('cart/showSpinner', true)
        this.loading = true
        this.GoGoHTTP.post('/api/v3/cart/checkout', {
          userInfo: this.buyer,
          storeId: this.storeId,
        })
          .then(async data => {
            trackingPurchase(data.trackingInfo)
            if (this.buyer.type === 1) {
              let info = {
                email: this.buyer.mailAddress,
                password: this.buyer.password,
                u: !!this.$route.query.u,
                is_buyuser: 1,
                remember: this.remember ? 1 : 0,
              }
              await this.sendReqLogin(info)
            }
            let paymentUrl = data.paymentUrl
            if ([2, 3].includes(this.pay)) {
              if (paymentUrl) {
                // user don't have visa info
                this.$store.dispatch('cart01/submitCreditCard', {
                  action: paymentUrl,
                  data: data.data,
                })
              } else {
                // user already have visa info
                location.href = `/cart/complete?ssid=${data.sessionId}`
              }
            } else if (this.pay === 8 && paymentUrl) {
              location.href = paymentUrl
            } else {
              $(this.$refs.cplCartForm)
                .find('input[name=checkoutData]')
                .val(JSON.stringify(data))
            }
          })
          .finally(() => {
            if (this.pay !== 2 && this.pay !== 3) {
              this.addGtag(this.$refs.cplCartForm, 'complete')
            } else {
              this.addGtag(null, 'complete')
            }
            this.loading = false
            this.$nuxt.$emit('cart/showSpinner', false)
          })
      }
    },
    onClickLogin() {
      this.$validator.validateAll().then(async success => {
        if (!success) {
          return
        }
        this.loading = true
        this.$nuxt.$emit('cart/showSpinner', true)
        let info = {
          email: this.email,
          password: this.password,
          u: true,
          is_buyuser: 1,
          remember: this.remember ? 1 : 0,
        }
        this.sendReqLogin(info)
          .then(data => {
            this.syncData = data || {}
            this.loading = false
            this.$nuxt.$emit('cart/showSpinner', false)
            if (this.syncData.hasError || !this.buyNow.length) {
              location.reload()
              return
            } else if (this.checkPreCondition(false)) {
              location.href = `/cart?login=1`
              return
            } else {
              this.payErr = false
              this.termErr = false
              let period = 30 * 24 * 60
              setCookie('cpayid', this.pay, period)
              setCookie('cdvdoption', this.dvdOpt, period)
              this.addGtag(this.$refs.cfCartForm, 'confirm')
            }
          })
          .catch(() => {
            this.isShowModal = true
            this.loading = false
            this.$nuxt.$emit('cart/showSpinner', false)
          })
      })
    },
    async sendReqLogin(info) {
      try {
        this.$nuxt.$emit('cart/showSpinner', true)
        let data = await this.GoGoHTTP.post('/login', info)
        if (data.code === 40302) {
          throw '40302'
        }
        if (!data.length) {
          throw 'login error'
        }
        let ut = data[0],
          d = new Date().getTime().toString(),
          infoOld = {
            id: ut.id,
            email: this.email,
            password: this.password,
            remember: this.remember ? 1 : 0,
            u: true,
            is_buyuser: 1,
          },
          uid = ut.id,
          uname = ut.nickName,
          isBuyuser = 1,
          llt = d.substr(0, d.length - 3),
          isaff = 0
        let oData = await this.GoGoHTTP.post('/login/old', infoOld)
        if (oData) {
          throw 'login error'
        }
        this.$store.commit('setUser', {
          id: uid,
          name: uname,
          isBuyuser: parseInt(isBuyuser),
          llt,
          isaff,
        })
        this.$nuxt.$emit('cart/showSpinner', false)
        return this.GoGoHTTP.get('/api/v3/cart/sync')
      } catch (e) {
        this.loading = false
        this.$nuxt.$emit('cart/showSpinner', false)
        throw e
      }
    },
    gotoContinueShop() {
      $('html, body').animate(
        {
          scrollTop: $('#continue-shop').offset().top - 10,
        },
        800
      )
    },
    gotoRegister() {
      if ($('.register-wrapp').length) {
        $('html, body').animate(
          {
            scrollTop: $('.register-wrapp').offset().top - 10,
          },
          800
        )
      } else {
        location.href = `/register?u=${process.env.GOGO_URL}/cart`
      }
    },
    buildGetParams() {
      let q = Object.assign({}, this.$route.query, {
          u: `${process.env.GOGO_URL}/cart`,
        }),
        params = Object.keys(q)
          .map(e => `${e}=${q[e]}`)
          .join('&')
      return params
    },
    addGtag(form, action) {
      let value = this.sumPrice + this.dvdPrice + this.bankTranFee + this.bankRefund

      // OAM-35654 add google event
      window.gtag && window.gtag('event', action, {
        event_category: 'payment',
        event_label: this.pay || 0,
        value
      })

      // OAM-35661 add google event for "/cart"
      window.gtag && window.gtag('event', action, {
        event_category: 'cart',
        event_label: this.buyNow.map(item => item.product.id).join('|'),
        value
      })

      form && $(form).submit()
    },
  },
}
</script>

<style lang="scss" scoped>
.cart-step {
  width: 330px;
  color: #2d2d2d;
  .steps {
    .active {
      font-weight: bold;
      color: #f60;
    }
    .space {
      display: inline-block;
      width: 23px;
      height: 2px;
      background: #d6d6d6;
      margin: 0 5px 3px;
    }
  }
  .summary {
    border: 4px solid #d9d9d9;
    border-radius: 10px;
    background: #f5f5f5;
    font-size: 14px;
    overflow: hidden;
    .a-row {
      border-bottom: 1px solid #d9d9d9;
      &.fs-12 {
        line-height: 15px;
      }
      .total-price {
        color: #e60012;
      }
    }
    .login-form {
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
  .confirm-footer {
    background: white;
    color: #0344cc;
    border-top: #d9d9d9 1px solid;
    cursor: pointer;
    &:hover {
      text-decoration: none;
      background: #f1f0f0;
    }
  }
  .btn-cart {
    background: #f60;
    color: white;
    outline: none;
    border: none;
    height: 40px;
    &:hover {
      opacity: 0.85;
    }
  }
  .cart-complete {
    border: 4px solid #d9d9d9;
    border-radius: 10px;
    overflow: hidden;
    .complete-header {
      background: #ff8503;
      color: white;
      font-size: 20px;
      line-height: 24px;
      padding: 30px 15px;
      .icon-cls {
        width: 25px;
        height: 27px;
      }
    }
    .complete-content {
      a {
        font-size: 12px;
        color: #2d2d2d;
        padding: 17px 10px 15px 45px;
        border-bottom: 1px solid #eee;
        text-decoration: none;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
  .send-payment {
    padding: 15px 0;
    background: #f0f0f0;
    border-radius: 5px;
    display: block;
    color: #2d2d2d;
    cursor: pointer;
    font-size: 14px;
  }
  .error-body {
    height: 130px;
  }
}
/deep/ .modal-dialog {
  top: 25%;
  margin: 10% auto;
  .modal-header {
    height: 40px;
    padding: 8px;
    .close {
      display: block;
      font-size: 25px;
      outline: none;
    }
  }
}
.warning {
  border-radius: 50%;
  background: #f60;
  font-weight: 700;
  width: 21px;
  height: 21px;
  color: #fff;
  margin: auto 10px auto 0;
  padding-left: 2px;
}
.text-warn {
  font-size: 18px;
}
.disabled-zPANr {
  opacity: 0.5;
  pointer-events: none;
}
.btn-loading {
  pointer-events: none;
  opacity: 0.5;
}
.co-red {
  color: red;
  font-size: 12px;
}
.sns-login {
  .social-block {
    background: white;
    img {
      width: 40px;
      flex: 0 0 40px;
      height: 40px;
    }
    a {
      border: 1px solid #d9d9d9;
      height: 40px;
      line-height: 40px;
      width: 100%;
    }
    .co-black {
      color: black;
    }
    .no-underlying {
      text-decoration: none;
    }
  }
}
</style>
