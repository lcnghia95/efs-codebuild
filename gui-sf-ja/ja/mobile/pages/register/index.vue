<template>
  <div>
    <div class="register-banner">
      <a :href="banner.landingPageUrl" target="_blank" rel="nofollow" v-if="Object.keys(banner).length && isShowNewBanner(banner)">
        <img class="w-full" :src="banner.bannerUrl" alt="GogoJungle 【異国のローソク足チェック】" />
      </a>
    </div>
    <div class="mobile-register">
      <div class="text-center title">
        <h3 class="i-title"><b>{{ $t('1') }}</b></h3>
        <h5>{{ $t('2') }}</h5>
      </div>
      <input id="input-email-register" name="email" v-model="email" class="w-full input-text mt-10" v-validate="{ rules: { required: true, email: true } }" :placeholder="$t('3')" type="email" />
      <b class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'required')">{{ $t('4') }}</b>
      <b class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'email')">{{ $t('5') }}</b>
      <input id="input-nickname" name="nickName" v-model="nickName" class="w-full input-text mt-10" v-validate="{ rules: { required: true } }" :placeholder="$t('12')" type="text" />
      <b class="co-red" v-show="isClient && errors.has('nickName') && errors.firstByRule('nickName', 'required')">{{ $t('6') }}</b>
      <input v-model="password" class="w-full input-text mt-10"
             v-validate="{ rules: { required: true, min: 6, max: 32 } }" :placeholder="$t('13')" type="password"
      />
      <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'required')">{{ $t('7') }}</b>
      <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'min')">{{ $t('8') }}</b>
      <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'max')">{{ $t('24') }}</b>
      <div class="mt-10">
        <b class="co-red" v-show="hasError">{{ $t('9') }}</b>
      </div>
      <div class="mt-10">
        <b class="co-red" v-show="emailExist">{{ $t('10') }}</b>
      </div>
      <p class="mt-10 fs-11">{{ $t('11') }}</p>
      <div v-html="term" class="w-full term-cls mt-10 border-all p-10"></div>
      <Button01 class="mt-10 w-full h-40" :class="{'loading': loading}" :text="$t('14')" @click="onRegister" />
      <div class="text-center mt-20 mb-20">
        <Checkbox class="mt-5 remember" v-model="isDelivery" :label="$t('15')" />
      </div>
      <SocialArea class="mb-40" />
      <Spinner v-if="loading" />
    </div>
  </div>
</template>

<script>
import SocialArea from '@/components/social/SocialArea'
import Button01 from '@/components/common/Button01'
import Checkbox from '@@/../components/form/Checkbox.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import Spinner from '@@/../components/Spinner.vue'
import i18n from '@@/lang/desktop/register.json'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import title from '@@/../common/pages'
import {trackingUserRegister} from '@@/../common/js/ga/ecom-enhance'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

export default Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      SocialArea,
      Checkbox,
      Button01,
      GogoLink,
      Spinner,
    },
    mounted() {
      if (this.$store.state.user.id) {
        location.href = '/mypage'
      }
      $('input[name="email"]').focus()
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
        linkMeta: [
          { rel: 'canonical', href: 'https://www.gogojungle.co.jp/register' },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: 'https://www.gogojungle.co.jp/register',
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: 'https://www.gogojungle.co.jp/en/register',
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: 'https://www.gogojungle.co.jp/th/register',
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: 'https://www.gogojungle.co.jp/vi/register',
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: 'https://www.gogojungle.co.jp/register',
          }
        ],
      }
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
                  url = url + '&via=/register/completed'
                } else {
                  url = url + '?via=/register/completed'
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
      isShowNewBanner(banner) {
        if (!Object.keys(banner).length || !banner.bannerUrl) {
          return false
        }
        let now = Date.now()

        return (now > new Date(banner.startedAt).getTime() && now < new Date(banner.endedAt).getTime())
      }
    },
    async asyncData({ app, redirect, store }) {
      if (store.state.user.id) {
        return redirect('/mypage')
      }
      let [term, advertiseBanners] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/terms/user'),
        app.GoGoHTTP.post('/api/v3/surface/advertisement', {
          service_path: '/register',
        }),
      ]),
        locale = app.i18n.locale,
        banners = (!Object.keys(advertiseBanners['advertiseBanners']).length) ? [] : advertiseBanners['advertiseBanners'][0]
      return {
        term,
        banner: (!banners.length) ? {} : banners[0],
        titleChunk: i18n[locale][1],
        descriptionTemplate() {
          return i18n[locale][25]
        },
      }
    },
  },
  title
)
</script>

<style lang="scss" scoped>
.mobile-register {
  margin: 20px 20px;
  .register-banner {
    width: 100vw;
    height: 25vw;
    a {
      display: block;
      max-width: 100%;
      height: 100%;
    }
    img {
      max-width: 100%;
      height: 100%;
    }
  }
  .title {
    .i-title {
      color: #707070;
    }
  }
  .input-text {
    padding-left: 10px;
    border: 1px solid #c9c9c9;
    border-radius: 3px;
    height: 40px;
  }
  .h-40 {
    height: 45px;
  }
  .reset {
    line-height: 15px;
  }
  .remember {
    margin-bottom: 5px !important;
  }
  .fs-18 {
    font-size: 18px;
  }
  .user-option-bg {
    background: #f5f5f5;
    top: 2px;
    left: 2px;
    height: 36px;
  }
  .w-170 {
    width: 160px;
  }
  .user-option {
    margin-bottom: 0 !important;
  }
  .user-type-input {
    border: 2px solid #eaeaea;
    border-radius: 4px;
    padding-left: 180px;
    background: white;
    line-height: 36px;
  }
  .term-cls {
    height: 300px;
    overflow-y: auto;
    word-wrap: break-word;
    text-align: justify;
  }
  .border-all {
    border: 1px solid #b4b5b6;
    border-radius: 4px;
    background: #e7e7ea;
  }
}
.fs-11 {
  font-size: 11px;
}
.co-red {
  color: red;
}
.loading {
  pointer-events: none;
  opacity: 0.5;
}
</style>
<style lang="scss">
/* stylelint-disable */
.scroll-btn {
  display: none !important;
}
/* stylelint-enable */
</style>
