<template>
  <div class="login-wrapper w-1000 pl-30 pr-30 pt-40 pb-40 mt-30 mb-60" @keyup.enter="onRegister">
    <h3 class="header title-border-bottom border-color-43">
      {{ $t('1') }}
    </h3>
    <div class="flex mt-30">
      <div class="register-by-email p-30 pt-20 bg-co mr-20">
        <h5><b>{{ $t('2') }}</b></h5>
        <input id="input-email-register" name="email" v-model="email" class="w-full input-border mt-5"
               v-validate="{ rules: { required: true, email: true } }" :placeholder="$t('3')" type="email">
        <b class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'required')">{{ $t('4') }}</b>
        <b class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'email')">{{ $t('5') }}</b>
        <input id="input-nickname" name="nickName" v-model="nickName" class="w-full input-border mt-10" v-validate="{ rules: { required: true } }" :placeholder="$t('12')" type="text">
        <b class="co-red" v-show="isClient && errors.has('nickName') && errors.firstByRule('nickName', 'required')">{{ $t('6') }}</b>
        <input v-model="password" class="w-full input-border mt-10"
               v-validate="{ rules: { required: true, min: 6, max: 32 } }" :placeholder="$t('13')" type="password">
        <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'required')">{{ $t('7') }}</b>
        <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'min')">{{ $t('8') }}</b>
        <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'max')">{{ $t('24') }}</b>
        <div class="mt-10">
          <b class="co-red" v-show="hasError">{{ $t('9') }}</b>
        </div>
        <div class="mt-10">
          <b class="co-red" v-show="emailExist">{{ $t('10') }}</b>
        </div>
        
      </div>
      <div class="bg-co p-30 pt-20 w-full">
        <h5><b>{{ $t('16') }}</b></h5>
        <div class="flex space-between mt-15">
          <div class="social-block flex mid">
            <img :src="'/img/assets/pc/common/icon_Twitter.jpg'" alt="Twitter">
            <a class="pr-10 pl-10 fs-12 co-black no-underlying"
              @click="snsRegister('twitter')">Twitter</a>
          </div>
          <div class="social-block flex mid">
            <img :src="'/img/assets/pc/common/icon_Facebook_new.png'" alt="Facebook">
            <a class="pr-10 pl-10 fs-12 co-black no-underlying"
               @click="snsRegister('facebook')">Facebook</a>
          </div>
        </div>
      </div>
    </div>
    <div class="terms-area bg-white flex grow0 layout-col mt-20">
      <div class="fs-13">
        {{ $t('11') }}
      </div>
      <div v-html="term" class="w-full term-cls mt-10 border-all p-10"/>
      <button id="on-click-btnregister" :class="{'loading': loading}" @click="onRegister" class="pl-10 text-left w-full btn-orange mt-15 btn-login">
        {{ $t('14') }}
      </button>
      <Checkbox class="mt-10 fs-12" v-model.number="isDelivery" :label="$t('15')"/>
    </div>
    <Spinner v-if="loading"/>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/register.json'
import Checkbox from '@@/../components/form/Checkbox.vue'
import Spinner from '@@/../components/Spinner.vue'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import {trackingUserRegister} from '@@/../common/js/ga/ecom-enhance'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

export default {
    i18n: {
      messages: i18n,
    },
    components: {
      Checkbox,
      Spinner,
    },
    props: {
      term: String
    },
    data() {
      return {
        email: '',
        password: '',
        nickName: null,
        isDelivery: 1,
        hasError: false,
        emailExist: false,
        msg: null,
        loading: false,
        isClient: process.browser,
      }
    },
    mounted() {
      $('input[name="email"]').focus()
    },
    methods: {
      onRegister() {
        this.$validator.validateAll().then(success => {
          if (!success) {
            return
          }
          let me = this,
            data = {
              email: this.email,
              password: this.password,
              nickName: this.nickName,
            }
          me.hasError = false
          me.emailExist = false
          if (this.isDelivery) {
            data.isDelivery = 1
          }
          this.loading = true
          this.GoGoHTTP.post('/register', data)
            .then(async data => {
              if (data.code === 40301) {
                me.emailExist = true
                return
              }
              if (!data && !data.id) {
                me.hasError = true
                return
              }
              await trackingUserRegister(this.$i18n.locale)
              if (this.$route.query.u) {
                let url = this.$route.query.u
                if (url.includes('?')) {
                  url = url + `&via=/${this.$i18n.locale}/register/completed`
                } else {
                  url = url + `?via=/${this.$i18n.locale}/register/completed`
                }
                location.href = url
              } else {
                location.href = '/register/completed'
              }
            })
            .catch(() => {
              me.hasError = true
            })
            .finally(() => {
              this.loading = false
            })
        })
      },
      buildGetParams() {
        let q = this.$route.query,
          params = Object.keys(q)
            .map(e => `${e}=${q[e]}`)
            .join('&')
        return params
      },
      async snsRegister(provider) {
        await trackingUserRegister(this.$i18n.locale)
        location.href = `/sns/login?provider=${provider}&${this.buildGetParams()}`
      }
    },
  }
</script>

<style lang="scss" scoped>
$color53: #666;
$color64: #f5f5f5;
$color43: #d9d9d9;
$color12: #f60;
$color1: #d9d9d9;
.login-wrapper {
  margin: 0 auto 50px auto;
  background: $color64;
  .header {
    color: $color53;
    font-size: 26px;
    margin-bottom: 0;
  }
  .main-login {
    width: 1000px;
    background: $color64;
  }
  .register-by-email {
    width: 400px;
    flex: 0 0 400px;
  }
  .login-border {
    border-right: 1px dashed $color43;
  }
  .btn-login {
    color: white;
    display: block;
    background: $color12;
    border-radius: 0 !important;
    height: 40px;
    line-height: 40px;
    border: none;
    &:active,
    &:focus,
    &:hover,
    &:visited {
      color: white;
      outline: none;
      text-decoration: none;
    }
  }
  .social-block {
    background: white;
    img {
      width: 40px;
      height: 40px;
    }
    a {
      border: 1px solid $color1;
      height: 40px;
      line-height: 40px;
      width: 150px;
    }
  }
  .border-color-43 {
    border-color: $color43;
  }
  .input-border {
    height: 35px;
    padding-left: 5px;
    border-radius: 4px;
    border: 2px solid $color1;
  }
  .terms-area {
    padding: 20px 30px;
    border: solid 5px #e9eaec;
  }
  .term-cls {
    height: 250px;
    overflow-y: auto;
    word-wrap: break-word;
    text-align: justify;
  }
  .bg-co {
    background-color: #e9eaec;
  }
}
.fs-12 {
  font-size: 12px;
}
.title-border-bottom {
  line-height: 30px;
  border-bottom: solid 1px $color1;
  font-weight: bold;
}
.loading {
  pointer-events: none;
  opacity: 0.5;
}
.co-red {
  color: red;
}
</style>
