<template>
  <div class="auth-Ht7WL" @keyup.enter="onSubmitLogin">
    <div v-if="!userTypes.length || userTypes.length === 1">
      <h3 class="header title-border-bottom">
        {{ $t(loginTitle.toString()) }}
      </h3>
      <h5
        v-if="this.$route.path.includes('/logout')"
        class="login-success pt-5 pb-10 title-border-bottom"
      >
        {{ $t('21') }}
      </h5>
      <div class="flex title-border-bottom pb-10">
        <div class="register-by-email">
          <h5>
            <b>{{ $t('2') }}</b>
          </h5>
          <input
            name="email"
            v-model="email"
            v-validate="{ rules: { required: true, email: true, max: 60 } }"
            class="w-full input-border"
            maxlength="60"
            :placeholder="$t('3')"
            type="text"
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
            name="password"
            v-model="password"
            v-validate="{ rules: { required: true, min: 6, max: 32 } }"
            class="w-full input-border mt-20"
            :placeholder="$t('4')"
            type="password"
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
          <button
            class="pl-10 text-left w-full btn-orange mt-20"
            :class="{ loading: loading }"
            @click="checkInput(onClickLogin)"
          >
            {{ $t('1') }}
          </button>
          <b
            class="co-red mt-10 block"
            v-if="$route.query.e > 1 && $route.query.e < 5"
          >
            {{ $t('e' + $route.query.e) }}
          </b>
          <Checkbox
            class="mt-10 remember"
            v-model="remember"
            :label="$t('5')"
          />
          <div class="reset">
            &#x25B8;
            <gogo-link target="/password/reset">
              {{ $t('6') }}
            </gogo-link>
          </div>
        </div>
        <div class="login-border ml-40 mr-40"></div>
        <div>
          <h5>
            <b>{{ $t('9') }}</b>
          </h5>
          <div class="social-block flex mid">
            <img :src="'/img/assets/pc/common/icon_Yahoo.jpg'" alt="Yahoo" />
            <a
              id="yahoo"
              class="pl-10 pr-40 w-full fs-12 co-black no-underlying"
              rel="nofollow"
              :href="'/sns/login?provider=yahoojp&' + buildGetParams()"
            >
              {{ $t('12') }}
            </a>
          </div>
          <div class="social-block flex mid mt-20">
            <img
              :src="'/img/assets/pc/common/icon_Twitter.jpg'"
              alt="Twitter"
            />
            <a
              id="twitter"
              class="pl-10 pr-40 w-full fs-12 co-black no-underlying"
              rel="nofollow"
              :href="'/sns/login?provider=twitter&' + buildGetParams()"
            >
              {{ $t('10') }}
            </a>
          </div>
          <div class="social-block flex mid mt-20">
            <img
              :src="'/img/assets/pc/common/icon_Facebook_new.png'"
              alt="Facebook"
            />
            <a
              id="facebook"
              class="pl-10 pr-40 w-full fs-12 co-black no-underlying"
              rel="nofollow"
              :href="'/sns/login?provider=facebook&' + buildGetParams()"
            >
              {{ $t('11') }}
            </a>
          </div>
        </div>
      </div>
      <div>
        <h5>
          <b>{{ $t('7') }}</b>
        </h5>
        <gogo-link class="register-link" :target="'/register?'+ buildGetParams()">
          <button class="pl-10 text-left register-btn btn-orange mt-10">
            {{ $t('8') }}
          </button>
        </gogo-link>
      </div>
    </div>
    <div v-else>
      <h3 class="header title-border-bottom">
        {{ $t('18') }}
      </h3>
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
        <div type="text" class="input-border user-type-input h-40 w-full wrap-text">
          {{ uType.nickName ? uType.nickName : $t('19') }}
        </div>
      </div>
      <div class="pw-step-2">
        <b>{{ $t('3') }}:</b> {{ email }}<br />
        <input
          name="password"
          v-model="password"
          v-validate="{ rules: { required: true, min: 6, max: 32 } }"
          class="w-full input-border mt-10 mb-10"
          :placeholder="$t('4')"
          type="password"
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
        <button
          class="pl-10 text-left w-full btn-orange mt-20 mb-10"
          :class="{ loading: loading }"
          @click="checkInput(onClickTypeLogin)"
        >
          {{ $t('1') }}
        </button>
        <b class="co-red" v-show="hasError">{{ $t('17') }}</b>
      </div>
    </div>
    <Spinner v-if="lospinner || loading" />
  </div>
</template>

<script>
import Checkbox from '@@/../components/form/Checkbox.vue'
import Radio from '@@/../components/form/Radio.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
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
export default Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      Checkbox,
      GogoLink,
      Radio,
      Spinner,
    },
    validate({ params }) {
      return ~['login', 'logout'].indexOf(params.auth)
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
    async mounted() {
      let r = this.$route
      this.$store.commit('pushBC', {
        name: this.$t(this.loginTitle),
        path: r.path,
      })
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
      $('input[name="email"]').focus()
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
    async asyncData({ store, redirect, route, params, app, res, req }) {
      let { auth } = params
      if (store.state.user.id && auth != 'logout' && !route.query.is_buyuser) {
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
            {
              rel: 'alternate',
              hreflang: 'ja',
              href: `https://www.gogojungle.co.jp/login`,
            },
            {
              rel: 'alternate',
              hreflang: 'en',
              href: `https://www.gogojungle.co.jp/en/login`,
            },
            {
              rel: 'alternate',
              hreflang: 'th',
              href: `https://www.gogojungle.co.jp/th/login`,
            },
            {
              rel: 'alternate',
              hreflang: 'vi',
              href: `https://www.gogojungle.co.jp/vi/login`,
            },
            {
              rel: 'alternate',
              hreflang: 'x-default',
              href: `https://www.gogojungle.co.jp/login`,
            }
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
    methods: {
      showSpinner(show) {
        this.lospinner = show
        $('body').css('overflow', show ? 'hidden' : 'initial')
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
    },
  },
  title
)
</script>

<style lang="scss" scoped>
$borderCo: #d9d9d9;
.co-red {
  color: red;
}
.auth-Ht7WL {
  width: 1000px;
  margin: 0 auto;
  background: #f5f5f5;
  padding: 40px 80px;
  .header {
    color: #666;
  }
  .login-success {
    color: #f60;
  }
  .title-border-bottom {
    line-height: 30px;
    border-bottom: solid 1px $borderCo;
    font-weight: bold;
  }
  .register-by-email {
    width: 400px;
  }
}
.input-border {
  padding-left: 5px;
  border-radius: 4px;
  height: 35px;
  border: 2px solid $borderCo;
}
.login-border {
  border-right: 1px dashed $borderCo;
}
.btn-orange {
  border: none;
  outline: none;
  color: white;
  display: block;
  background: #f60;
  height: 40px;
  line-height: 40px;
}
.remember {
  display: initial;
  font-weight: normal;
  margin-bottom: 0 !important;
}
.register-btn {
  width: 400px;
}
.register-link {
  text-decoration: none;
}
.fs-12 {
  font-size: 12px;
}
.social-block {
  background: white;
  img {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
  }
  a {
    border: 1px solid #d9d9d9;
    height: 40px;
    line-height: 40px;
  }
}
.reset {
  line-height: 15px;
}
.user-option-bg {
  background: #f5f5f5;
  top: 2px;
  left: 2px;
  height: 36px;
}
.user-type-input {
  border-radius: 0;
  padding-left: 200px;
  background: white;
  line-height: 36px;
}
.user-option {
  margin-bottom: 0 !important;
}
.h-40 {
  height: 40px;
}
.w-170 {
  width: 170px;
}
.pw-step-2 {
  width: 400px;
}
.loading {
  pointer-events: none;
  opacity: 0.5;
}
.block {
  display: block;
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
