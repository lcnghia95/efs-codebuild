<template>
  <div class="mobile-auth">
    <template v-if="!userTypes.length || userTypes.length === 1">
      <div class="text-center title">
        <h3 class="i-title">
          <b>{{ $t(loginTitle.toString()) }}</b>
        </h3>
        <h4>{{ $t('2') }}</h4>
      </div>
      <input
        type="text"
        name="email"
        v-model="email"
        v-validate="{ rules: { required: true, email: true, max: 60 } }"
        :placeholder="$t('3')"
        class="w-full input-text"
        tabindex="0"
      />
      <b
        class="co-red"
        v-show="
          isClient &&
            errors.has('email') &&
            errors.firstByRule('email', 'required')
        "
      >
        {{ $t('13') }}
      </b>
      <b
        class="co-red"
        v-show="
          isClient &&
            errors.has('email') &&
            errors.firstByRule('email', 'email')
        "
      >
        {{ $t('14') }}
      </b>
      <input
        type="password"
        name="password"
        v-model="password"
        v-validate="{ rules: { required: true, min: 6, max: 32 } }"
        :placeholder="$t('4')"
        class="w-full input-text mt-10"
      />
      <b
        class="co-red"
        v-show="
          isClient &&
            errors.has('password') &&
            errors.firstByRule('password', 'required')
        "
      >
        {{ $t('15') }}
      </b>
      <b
        class="co-red"
        v-show="
          isClient &&
            errors.has('password') &&
            errors.firstByRule('password', 'min')
        "
      >
        {{ $t('16') }}
      </b>
      <b
        class="co-red"
        v-show="
          isClient &&
            errors.has('password') &&
            errors.firstByRule('password', 'max')
        "
      >
        {{ $t('22') }}
      </b>
      <div class="m-t-10">
        <b class="co-red" v-show="hasError">{{ $t('17') }}</b>
      </div>
      <Button01
        class="mt-10 mb-10 w-full h-40"
        :class="{ loading: loading }"
        :text="$t('1')"
        @click="checkInput(onClickLogin)"
      />
      <b class="co-red" v-if="$route.query.e > 1 && $route.query.e < 5">
        {{ $t('e' + $route.query.e) }}
      </b>
      <div class="text-center mt-10">
        <Checkbox class="mt-5 remember" v-model="remember" :label="$t('5')" />
        <div class="reset">
          &#x25B8;
          <gogo-link target="/password/reset">
            {{ $t('6') }}
          </gogo-link>
        </div>
      </div>
      <div class="text-center mt-20">
        <b class="fs-18">
          {{ $t('7') }}
        </b>
      </div>
      <Button01
        class="mt-10 mb-20 w-full h-40"
        :text="$t('8')"
        @click="gotoRegister"
      />
      <SocialArea class="mb-40" />
    </template>
    <template v-else>
      <div class="text-center title">
        <h4 class="i-title">
          <b>{{ $t('18') }}</b>
        </h4>
      </div>
      <div
        class="pos-rel mt-10 mb-10"
        v-for="(uType, index) in userTypes"
        :key="'sChmU' + index"
      >
        <div class="flex mid pos-abs h-full pl-20 user-option-bg w-170">
          <Radio
            :attrs="{ value: uType.id, name: 'userId' }"
            v-model.number="userId"
            class="user-option"
            :id="'type-user-' + (index + 1)"
            :label="$t('type' + uType.type)"
          />
        </div>
        <div
          type="text"
          class="input-border user-type-input h-40 w-full wrap-text"
        >
          {{ uType.nickName ? uType.nickName : $t('19') }}
        </div>
      </div>
      <div class="mt-10">
        <b>{{ $t('3') }}:</b> {{ email }}
      </div>
      <input
        name="password"
        v-model="password"
        v-validate="{ rules: { required: true, min: 6, max: 32 } }"
        :placeholder="$t('4')"
        type="password"
        class="w-full input-text mt-10"
      />
      <Button01
        class="mt-10 mb-10 w-full h-40"
        :class="{ loading: loading }"
        :text="$t('1')"
        @click="checkInput(onClickTypeLogin)"
      />
      <b class="co-red" v-show="hasError">{{ $t('17') }}</b>
    </template>
    <Spinner v-if="lospinner || loading" />
  </div>
</template>

<script>
import Button01 from '@/components/common/Button01'
import Checkbox from '@@/../components/form/Checkbox.vue'
import Radio from '@@/../components/form/Radio.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import SocialArea from '@/components/social/SocialArea'
import Spinner from '@@/../components/Spinner.vue'
import i18n from '@@/lang/desktop/login.json'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import title from '@@/../common/pages'
import logoutFn from '@@/../common/js/logout'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

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

export default Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      Button01,
      Checkbox,
      Radio,
      GogoLink,
      SocialArea,
      Spinner,
    },
    validate({ params }) {
      return ~['login', 'logout'].indexOf(params.auth)
    },
    async asyncData({ store, redirect, route, params, app, res, req }) {
      let { auth } = params
      if (store.state.user.id && auth != 'logout') {
        if (!route.query.u) {
          return redirect('/mypage')
        } else {
          return redirect(route.query.u)
        }
      }
      await logoutFn(app, auth, req, res)

      // set meta tags
      if (auth == 'login') {
        return {
          titleChunk: 'ログイン',
          descriptionTemplate() {
            return 'GogoJungleをご利用いただくためのログインはこちらから。'
          },
          linkMeta: [
            { rel: 'canonical', href: 'https://www.gogojungle.co.jp/login' },
          ],
        }
      } else {
        return {
          titleChunk: 'ログアウト',
          descriptionTemplate() {
            return 'ログアウトしました。ご利用ありがとうございました。'
          },
          linkMeta: [
            { rel: 'canonical', href: 'https://www.gogojungle.co.jp/logout' },
          ],
        }
      }
    },
    async mounted() {
      let r = this.$route
      if (r.fullPath.includes('/logout')) {
        if (this.$store.state.user.id) {
          await this.GoGoHTTP.get('/asp/if/sync_log/logout.php', {
            baseURL: process.env.FXON_URL,
            withCredentials: true,
          })
          this.$store.commit('setUser', { id: '', name: '', isBuyuser: null })
        }
        if (r.query.u) {
          location.href = this.$route.query.u
        } else {
          this.showSpinner(false)
        }
      }
    },
    data() {
      return {
        hasError: null,
        loading: null,
        userId: null,
        email: null,
        remember: null,
        password: null,
        userTypes: [],
        lospinner: this.$route.path.includes('/logout'),
        isClient: process.browser,
      }
    },
    watch: {
      userTypes(val) {
        if (val[0]) {
          this.userId = val[0].id
        }
      },
    },
    computed: {
      loginTitle() {
        return this.$route.path.includes('/logout') ? 20 : 1
      },
    },
    methods: {
      showSpinner(show) {
        this.lospinner = show
        // $('body').css('overflow', show ? 'hidden' : 'initial')
      },
      syncLogin(info, ut) {
        let d = new Date().getTime().toString(),
          params = cleanProp({
            login_id: encodeURIComponent(info.email),
            login_pass: encodeURIComponent(info.password),
            type: ut.type,
            mode: ut.mode || null,
            id: ut.oId || null,
            remember: info.remember ? 1 : 0,
            su: 'vx',
            date: d.substr(0, d.length - 3),
          })
        this.GoGoHTTP.get('/api/v3/cart/sync')
        return this.GoGoHTTP.post('/asp/sync_log/sync_log.php', params, {
          baseURL: process.env.FXON_URL,
          withCredentials: true,
        })
      },
      buildGetParams() {
        let q = this.$route.query,
          params = Object.keys(q)
            .map(e => `${e}=${q[e]}`)
            .join('&')
        return params
      },
      onSubmitLogin() {
        if (this.userTypes.length > 1) {
          this.checkInput(this.onClickTypeLogin)
        } else {
          this.checkInput(this.onClickLogin)
        }
      },
      checkInput(fn) {
        if (this.loading) {
          return
        }
        this.$validator.validateAll().then(success => {
          return success ? fn() : () => {}
        })
      },
      onClickLogin() {
        let info = {
          email: this.email,
          password: this.password,
          u: !!this.$route.query.u,
          is_buyuser: !!this.$route.query.is_buyuser,
          remember: this.remember ? 1 : 0,
        }
        this.postLogin(info)
          .then(data => {
            this.afterPostLogin(data)
          })
          .catch(() => {
            this.hasError = true
          })
      },
      afterPostLogin(data) {
        if (data.length > 1) {
          this.userTypes = data
          this.$nextTick(() => {
            $('input[name=password]').focus()
          })
        } else {
          let info = {
            email: this.email,
            password: this.password,
            u: !!this.$route.query.u,
            is_buyuser: !!this.$route.query.is_buyuser,
            remember: this.remember ? 1 : 0,
          }
          this.loading = true
          this.syncLogin(info, data[0]).finally(() => {
            this.loading = false
            this.redirectAfterLogin()
          })
        }
      },
      redirectAfterLogin() {
        let redirect = localStorage.getItem('redirect')
        redirect && localStorage.removeItem('redirect')
        location.href = this.$route.query.u || redirect || '/mypage'
      },
      onClickTypeLogin() {
        this.loading = true
        let info = {
            id: this.userId,
            email: this.email,
            password: this.password,
            remember: this.remember ? 1 : 0,
            u: !!this.$route.query.u,
            is_buyuser: !!this.$route.query.is_buyuser,
          },
          ut =
            this.userTypes.filter(item => {
              return item.id === this.userId
            })[0] || {},
          oldLG = this.GoGoHTTP.post('/login/old', info).then(data => {
            if (data) {
              throw 'login error'
            }
            return data
          })
        Promise.all([oldLG, this.syncLogin(info, ut)])
          .then(old => {
            if (old[1].resolve !== true) {
              throw 'login error'
            }
            this.redirectAfterLogin()
          })
          .catch(() => {
            this.hasError = true
          })
          .finally(() => {
            this.loading = false
          })
      },
      postLogin(info) {
        this.loading = true
        return this.GoGoHTTP.post('/login', info)
          .then(data => {
            if (data.code === 40302) {
              throw '40302'
            }
            if (!data.length) {
              throw 'login error'
            }
            return data
          })
          .finally(() => {
            this.loading = false
          })
      },
      gotoRegister() {
        location.href = '/register'
      },
    },
  },
  title
)
</script>

<style lang="scss" scoped>
.mobile-auth {
  margin: 20px 20px;
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
    height: 41px;
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
    line-height: 45px;
  }
  .co-red {
    color: red;
  }
  .loading {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.scroll-btn {
  display: none !important;
}
/* stylelint-enable */
</style>
