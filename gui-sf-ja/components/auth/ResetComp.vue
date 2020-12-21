<template>
  <div class="w-1000 reset-pw co-53 bg-co-64 mt-40 mb-40">
    <div class="border-bottom">
      <h3>{{ $t('1') }}</h3>
    </div>
    <div v-if="!canReset && !sendEmailSuccess">
      <div class="flex mt-40">
        <input type="text" v-model="emailReceiver" name="email" v-validate="{rules: {required: true, email: true}}" class="h-50 w-75p" :placeholder="$t('2')">
        <button class="btn-black w-25p text-center h-50" @click="onRequestSendEmail" :class="{'loading': loading}">
          {{ $t('3') }}
        </button>
      </div>
      <div v-show="isClient && errors.has('email') && errors.firstByRule('email', 'required')" class="co-red">{{ $t('10') }}</div>
      <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'email')">{{ $t('17') }}</div>
      <div class="mt-20" v-html="$t('4')"/>
    </div>
    <div v-if="canReset && !resetSuccess" class="mt-40">
      <div class="flex">
        <div class="w-25p text-right self-align pr-10">
          {{ $t('2') }}
        </div>
        <div class="w-75p">
          <input type="text" :value="emailReceiver" class="w-full bg-white h-35" disabled>
        </div>
      </div>
      <div class="flex mt-20">
        <div class="w-25p text-right self-align pr-10">
          {{ $t('6') }}
        </div>
        <div class="w-75p">
          <input type="password" name="password" class="w-full h-35" v-model="password"
                 v-validate="{rules: {required: true, min: 6, max: 32} }">
        </div>
      </div>
      <div class="flex mt-20">
        <div class="w-25p text-right self-align pr-10">
          {{ $t('7') }}
        </div>
        <div class="w-75p">
          <input type="password" class="w-full h-35" v-model="passwordConfirm" name="password-confirm"
                 v-validate="{rules: {required: true, confirmed: 'password', min: 6, max: 32} }">
        </div>
      </div>
      <div class="flex mt-20">
        <div class="w-25p"/>
        <div class="w-75p">
          <div v-show="isClient && errors.has('password') && errors.firstByRule('password', 'required')" class="co-red">{{ $t('12') }}</div>
          <div v-show="isClient && errors.has('password') && errors.firstByRule('password', 'min')" class="co-red">{{ $t('13') }}</div>
          <div v-show="isClient && errors.has('password') && errors.firstByRule('password', 'max')" class="co-red">{{ $t('18') }}</div>
          <div v-show="isClient && errors.has('password-confirm') && errors.firstByRule('password-confirm', 'required')" class="co-red">{{ $t('12') }}</div>
          <div v-show="isClient && errors.has('password-confirm') && errors.firstByRule('password-confirm', 'confirmed')" class="co-red">{{ $t('11') }}</div>
        </div>
      </div>
      <div class="flex mt-20">
        <div class="w-25p"/>
        <div class="w-75p">
          <button class="btn-black w-200 h-35" @click="onResetPassword" :class="{'loading': loading}">
            {{ $t('8') }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="resetSuccess == 1" class="mt-40 pt-40 border-dashed-2 text-center h-100 co-red bg-white border-radius-10">
      <b>{{ $t('9') }}</b>
    </div>
    <div v-if="resetSuccess == 0" class="mt-40 pt-40 border-dashed-2 text-center h-100 co-red bg-white border-radius-10">
      <b>{{ $t('16') }}</b>
    </div>
    <div v-if="sendEmailSuccess == 0" class="mt-40 pt-40 border-dashed-2 text-center h-100 co-red bg-white border-radius-10">
      <b>{{ $t('15') }}</b>
    </div>
    <div v-if="sendEmailSuccess == 1" class="mt-40 pt-40 border-dashed-2 text-center h-100 co-red bg-white border-radius-10">
      <b>{{ $t('14') }}</b>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/reset.json'
import VeeValidate from 'vee-validate'
import Vue from 'vue'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

export default 
  {
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        emailReceiver: null,
        canReset: false,
        password: null,
        passwordConfirm: null,
        resetSuccess: null,
        sendEmailSuccess: null,
        loading: false,
        isClient: process.browser,
      }
    },
    mounted() {
      if (this.$route.query.data && this.$route.query.email) {
        this.canReset = true
        this.emailReceiver = this.$route.query.email.replace(/\s/g, "+")
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
  }
</script>

<style lang="scss" scoped>
$color53: #666;
$color64: #f5f5f5;
$color2: #b4b5b6;
.reset-pw {
  margin: 100px auto;
  padding: 80px 60px;
}
.p-lr-80 {
  padding-left: 80px;
  padding-right: 80px;
}
.p-tb-60 {
  padding-top: 60px;
  padding-bottom: 60px;
}
.h-50 {
  height: 50px;
}
.w-75p {
  width: 75%;
}
.w-25p {
  width: 25%;
}
.h-100 {
  height: 100px;
}
.p-t-40 {
  padding-top: 40px;
}
input {
  border-radius: 0;
  padding-left: 5px;
}
.co-53 {
  color: $color53;
}
.bg-co-64 {
  background: $color64;
}
.btn-black {
  background: black;
  color: white;
  border-radius: 0;
  width: 210px;
  align-self: center;
  border: none;
  white-space: nowrap;
}
.co-red {
  color: red;
}
.self-align {
  align-self: center;
}
.h-35 {
  height: 35px;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
.w-200 {
  width: 200px;
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
.loading {
  pointer-events: none;
  opacity: 0.5;
}
input[name='email'] {
  border: none;
}
</style>
