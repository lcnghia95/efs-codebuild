<template>
  <div class="mobile-reset">
    <div class="text-center title">
      <h3 class="i-title"><b>{{ $t('1') }}</b></h3>
    </div>
    <div v-if="!canReset && !sendEmailSuccess">
      <input v-model="emailReceiver" name="email" v-validate="{rules: {required: true, email: true}}" class="w-full input-text mt-10 mb-10 h-40" :placeholder="$t('2')" />
      <Button01 class="w-full h-40" :background="'black'" :text="$t('3')" @click="onRequestSendEmail" :class="{'loading': loading}" />
      <div v-show="isClient && errors.has('email') && errors.firstByRule('email', 'required')" class="co-red mt-10">{{ $t('10') }}</div>
      <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'email')">{{ $t('17') }}</div>
      <div class="mt-20" v-html="$t('4')"></div>
    </div>
    <div v-if="canReset && !resetSuccess" class="mt-20">
      <input type="text" :value="emailReceiver" class="w-full input-text h-40" disabled />
      <input type="password" name="password" class="w-full input-text h-40 mt-10" v-model="password"
             v-validate="{rules: {required: true, min: 6, max: 32} }" :placeholder="$t('6')"
      />
      <input type="password" class="w-full input-text h-40 mt-10 mb-10" v-model="passwordConfirm" name="password-confirm"
             v-validate="{rules: {required: true, confirmed: 'password', min: 6, max: 32} }" :placeholder="$t('7')"
      />
      <div v-show="isClient && errors.has('password') && errors.firstByRule('password', 'required')" class="co-red">{{ $t('12') }}</div>
      <div v-show="isClient && errors.has('password') && errors.firstByRule('password', 'min')" class="co-red">{{ $t('13') }}</div>
      <div v-show="isClient && errors.has('password') && errors.firstByRule('password', 'max')" class="co-red">{{ $t('18') }}</div>
      <div v-show="isClient && errors.has('password-confirm') && errors.firstByRule('password-confirm', 'required')" class="co-red">{{ $t('12') }}</div>
      <div v-show="isClient && errors.has('password-confirm') && errors.firstByRule('password-confirm', 'confirmed')" class="co-red">{{ $t('11') }}</div>
      <Button01 class="w-full h-40 mt-10" :background="'black'" :text="$t('8')" @click="onResetPassword" :class="{'loading': loading}" />
    </div>
    <div v-if="resetSuccess == 1" class="mt-40 pt-40 pl-10 pr-10 border-dashed-2 text-center h-100 co-red bg-white border-radius-10">
      <b>{{ $t('9') }}</b>
    </div>
    <div v-if="resetSuccess == 0" class="mt-40 pt-40 pl-10 pr-10 border-dashed-2 text-center h-100 co-red bg-white border-radius-10">
      <b>{{ $t('16') }}</b>
    </div>
    <div v-if="sendEmailSuccess == 0" class="mt-40 pt-40 pl-10 pr-10 border-dashed-2 text-center h-100 co-red bg-white border-radius-10">
      <b>{{ $t('15') }}</b>
    </div>
    <div v-if="sendEmailSuccess == 1" class="mt-40 pt-40 pl-10 pr-10 border-dashed-2 text-center h-100 co-red bg-white border-radius-10">
      <b>{{ $t('14') }}</b>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/reset.json'
import Button01 from '@/components/common/Button01'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import title from '@@/../common/pages'

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
      Button01,
    },
    data() {
      return {
        password: null,
        passwordConfirm: null,
        resetSuccess: null,
        sendEmailSuccess: null,
        loading: false,
        isClient: process.browser,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/password/reset',
          },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: 'https://www.gogojungle.co.jp/password/reset',
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: 'https://www.gogojungle.co.jp/en/password/reset',
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: 'https://www.gogojungle.co.jp/th/password/reset',
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: 'https://www.gogojungle.co.jp/vi/password/reset',
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: 'https://www.gogojungle.co.jp/password/reset',
          }
        ],
      }
    },
    async asyncData({ app, query, store, redirect }) {
      if (store.state.user.id) {
        return redirect('/mypage')
      }
      let locale = app.i18n.locale,
        titleChunk = i18n[locale][1],
        emailReceiver = '',
        canReset = false
      if (query.email && query.data) {
        canReset = true
        emailReceiver = (query.email || '').replace(/\s/g, "+")
      }
      return {
        canReset,
        emailReceiver,
        titleChunk,
        descriptionTemplate() {
          return i18n[locale][19]
        },
      }
    },
    methods: {
      onRequestSendEmail() {
        this.loading = true
        this.$validator.validateAll().then(success => {
          if (!success) {
            this.loading = false
            return
          }
          let me = this
          this.GoGoHTTP.post('/api/password/reset', {
            email: me.emailReceiver,
          })
            .then(data => {
              me.sendEmailSuccess = !data ? 1 : 0
            })
            .catch(() => {
              me.sendEmailSuccess = 0
            })
            .finally(() => {
              this.loading = false
            })
        })
      },
      onResetPassword() {
        this.loading = true
        this.$validator.validateAll().then(success => {
          if (!success) {
            this.loading = false
            return
          }
          let me = this
          this.GoGoHTTP.post('/api/v3/account/password/reset', {
            email: me.emailReceiver,
            password: me.password,
            token: me.$route.query.data,
          })
            .then(data => {
              me.resetSuccess = !data ? 1 : 0
            })
            .catch(() => {
              me.resetSuccess = 0
            })
            .finally(() => {
              this.loading = false
            })
        })
      },
    },
  },
  title
)
</script>

<style lang="scss" scoped>
$color2: #b4b5b6;
.mobile-reset {
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
}
.co-red {
  color: red;
}
.bg-white {
  background: white;
}
.border-radius-10 {
  border-radius: 10px;
}
.border-dashed-2 {
  border: 2px $color2 dashed;
}
.h-100 {
  height: 100px;
}
.loading {
  pointer-events: none;
  opacity: 0.5;
}
</style>
