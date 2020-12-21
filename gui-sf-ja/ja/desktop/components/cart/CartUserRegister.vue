<template>
  <div class="register-wrapp">
    <div class="flex mid title">
      <Pencil />
      <span class="ml-5 text-title">{{ $t('1') }}</span>
    </div>
    <div class="info-area mt-10" :class="{'loading-grey': processing}">
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('2') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-lastname" name="lastName" v-model="info.lastName" class="input-border" v-validate="nameRules" :placeholder="$t('3')" type="text" />
        <input id="input-firstname" name="firstName" v-model="info.firstName" class="input-border ml-10" v-validate="nameRules" :placeholder="$t('4')" type="text" />
      </div>
      <b class="co-red" v-show="isClient && (errors.firstByRule('firstName', 'required') || errors.firstByRule('lastName', 'required'))">
        {{ $t('REQUIRED_TEXT') }}
      </b>
      <b class="co-red" v-show="isClient && (errors.firstByRule('firstName', 'regex') || errors.firstByRule('lastName', 'regex'))">
        {{ $t('NAME_ERROR') }}
      </b>
      <div class="a-row flex mid flex-wrap" v-if="$i18n.locale == 'ja'">
        <div class="left-text">
          {{ $t('5') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-lastnamekana" name="lastNameKana" v-model="info.lastNameKana" class="input-border" v-validate="kanaNameRules" :placeholder="$t('6')" type="text" />
        <input id="input-firstnamekana" name="firstNameKana" v-model="info.firstNameKana" class="input-border ml-10" v-validate="kanaNameRules" :placeholder="$t('7')" type="text" />
      </div>
      <b class="co-red" v-show="isClient && (errors.firstByRule('firstNameKana', 'required') || errors.firstByRule('lastNameKana', 'required'))">
        {{ $t('REQUIRED_TEXT') }}
      </b>
      <b class="co-red" v-show="isClient && (errors.firstByRule('firstNameKana', 'regex') || errors.firstByRule('lastNameKana', 'regex'))">
        {{ $t('KANA_NAME_ERROR') }}
      </b>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('22') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-nickName" name="nickName" v-model="info.nickName" class="input-border" :placeholder="$t('22')" type="text" v-validate="{ rules: { required: true } }" />
      </div>
      <b class="co-red" v-show="isClient && errors.has('nickName')">{{ $t('NICKNAME_REQUIRED') }}</b>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('8') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-zip" name="zip" v-model="info.zip" class="input-border" v-validate="{ rules: { regex: zipRegex, required: true } }" :placeholder="$t('9')" type="text" />
      </div>
      <b class="co-red" v-show="isClient && errors.has('zip')">{{ $t('ZIP_ERROR') }}</b>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('10') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <SelectBox :data-source="prefecturesList" name="prefectureId" :display="'text'" :id-val="'id'" v-model="info.prefectureId" v-validate="{ rules: { required: true } }" width="270px" />
      </div>
      <b class="co-red" v-show="isClient && errPrefectureId">{{ $t('REQUIRED_TEXT') }}</b>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('12') }}
          <span class="required ml-10" v-if="!langSupported().includes($i18n.locale)">{{ $t('required') }}</span>
        </div>
        <input id="input-address1" name="address1" v-model="info.address1" class="input-border" v-validate="addressRule" :placeholder="$t('13')" type="text" />
      </div>
      <b class="co-red" v-show="isClient && errors.has('address1')">{{ $t('REQUIRED_TEXT') }}</b>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('14') }}
          <span class="required ml-10" v-if="!langSupported().includes($i18n.locale)">{{ $t('required') }}</span>
        </div>
        <input id="input-address2" name="address2" v-model="info.address2" class="input-border" v-validate="addressRule" :placeholder="$t('31')" type="text" />
      </div>
      <b class="co-red" v-show="isClient && errors.has('address2')">{{ $t('REQUIRED_TEXT') }}</b>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('15') }}
        </div>
        <input id="input-address3" name="address3" v-model="info.address3" class="input-border" :placeholder="$t('15')" type="text" />
      </div>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('32') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-tel" name="tel" v-model="info.tel" class="input-border" v-validate="{ rules: { regex: telRegex, required: true } }" placeholder="000-000-0000" type="text" v-if="$i18n.locale == 'ja'" />
        <VueTelInput name="tel" v-model="info.tel" class="input-tel" v-validate="{ rules: { required: true } }" :preferred-countries="['US', 'CN', 'TW', 'TH', 'VN']" :ignored-countries="['JP']" placeholder="00 0000 0000" :disabled-fetching-country="true" :default-country="defaultCountry" v-else />
      </div>
      <b class="co-red" v-show="isClient && errors.has('tel')">{{ $t('TEL_ERROR') }}</b>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('17') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-mailadress" name="mailAddress" v-model="info.mailAddress" class="input-border" v-validate="{ rules: { required: true, email: true } }" placeholder="email@example.com" type="text" />
      </div>
      <b class="co-red" v-show="isClient && errors.has('mailAddress')">{{ $t('EMAIL_ERROR1') }}</b>
      <div class="a-row flex mid flex-wrap">
        <div class="left-text">
          {{ $t('18') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-confirmmailaddress" name="confirmmailaddress" v-model="info.confirmMailAddress" class="input-border" v-validate="{ rules: { required: true, confirmed: 'mailAddress' } }" placeholder="email@example.com" type="text" />
      </div>
      <b class="co-red" v-show="isClient && errors.has('confirmmailaddress')">{{ $t('EMAIL_ERROR2') }}</b>
      <div class="a-row flex mid flex-wrap" v-if="info.type == 1">
        <div class="left-text">
          {{ $t('23') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-password" name="password" v-model="info.password" class="input-border" v-validate="{ rules: { required: info.type == 1, min: 6} }" :placeholder="$t('23')" type="password" />
      </div>
      <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'required')">{{ $t('PASSWORD_REQUIRED') }}</b>
      <b class="co-red" v-show="isClient && errors.has('password') && errors.firstByRule('password', 'min')">{{ $t('PASSWORD_ERROR') }}</b>
      <div class="a-row flex mid flex-wrap" v-if="info.type == 1">
        <div class="left-text">
          {{ $t('24') }}
          <span class="required ml-10">{{ $t('required') }}</span>
        </div>
        <input id="input-confirmpassword" name="confirmpassword" v-model="info.confirmPassword" class="input-border" v-validate="{ rules: { required: info.type == 1, confirmed: 'password' } }" :placeholder="$t('24')" type="password" />
      </div>
      <b class="co-red" v-show="isClient && errors.has('confirmpassword')">{{ $t('PASSWORD_ERROR_CONFIRM') }}</b>
      <div class="choose-area flex flex-wrap mt-20" v-if="showType">
        <label class="c-label cursor-pointer flex">
          <input type="radio" v-model.number="info.type" value="1" />
          <div class="pl-5 flex">
            <span>{{ $t('19') }}</span>
            <a @click="showTerm" class="cursor-pointer">{{ $t('25') }}</a>)
          </div>
        </label>
        <label class="c-label cursor-pointer flex">
          <input type="radio" v-model.number="info.type" value="2" />
          <div class="pl-5" v-html="$t('20')"></div>
        </label>
      </div>
      <div class="mt-30 flex" v-if="!showType">
        <span>{{ $t('35') }}</span>
        (<a @click="showTerm" class="cursor-pointer">{{ $t('25') }}</a>)
      </div>
      <div class="flex mid layout-col mt-40">
        <button class="btn-register" @click="onRegister">{{ info.type == 1 ? $t('21'): $t('33') }}</button>
        <Checkbox class="mt-10 remember" v-if="info.type == 1" v-model="info.isDelivery" :label="$t('34')" />
      </div>
      <div class="flex mid layout-col">
        <b class="warn" v-show="payErr">{{ $t('29') }}</b><br />
        <b class="warn" v-show="termErr">{{ $t('30') }}</b>
        <b class="warn" v-if="mailExist">{{ $t('36') }}</b>
      </div>
    </div>
    <GogoModal :show="isShowModal" @update:show="val => isShowModal = val" :width="840" :height="665" :cancel-text="$t('26')" :ok-text="''">
      <div slot="title" class="modal-title pl-10 ml-20">
        {{ $t('27') }}
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="term-content flex mid center">
          <Loading v-if="loading" style="width: 60px; height: 60px;" />
          <div v-html="terms" class="h-full w-full p-15" v-else></div>
        </div>
      </div>
    </GogoModal>
    <form ref="cfCartForm" :action="'/cart/confirm'" method="post">
      <input type="hidden" name="info" :value="JSON.stringify(info)" />
    </form>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/cart-register.json'
import Pencil from '@@/../components/icons/Pencil.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Loading from '@@/../components/icons/Loading.vue'
import SelectBox from '@@/../components/form/SelectBox.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import { setCookie } from '@/utils/client/common'
import VueTelInput from 'vue-tel-input'
import {trackingUserRegister} from '@@/../common/js/ga/ecom-enhance'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
  require('vue-tel-input/dist/vue-tel-input.css')
}

const countryMaps = {
  en: 'US',
  th: 'TH',
  tw: 'TW',
  ch: 'CN',
  vi: 'VN',
}

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Pencil,
    GogoModal,
    Loading,
    SelectBox,
    Checkbox,
    VueTelInput,
  },
  props: {
    data: Object,
    showType: {
      type: [Boolean, Number],
      default: 1,
    },
  },
  data() {
    return {
      isClient: process.browser,
      info: {
        firstName: null,
        lastName: null,
        firstNameKana: null,
        lastNameKana: null,
        nickName: null,
        zip: null,
        prefectureId: this.$i18n.locale === 'ja' ? 0 : 48,
        address1: null,
        address2: null,
        address3: null,
        tel: null,
        mailAddress: null,
        confirmMailAddress: null,
        password: null,
        confirmPassword: null,
        type: 1,
        isDelivery: 1,
      },
      isShowModal: false,
      loading: false,
      terms: null,
      isConfirm: false,
      payErr: false,
      termErr: false,
      conditions: [
        {
          c: 'pay',
          e: 'payErr',
        },
        {
          c: 'term',
          e: 'termErr',
        },
      ],
      errPrefectureId: false,
      mailExist: false,
      processing: false,
    }
  },
  computed: {
    pay() {
      return this.$store.getters['cart01/payId']
    },
    dvdOpt() {
      return this.$store.getters['cart01/dvdOpt']
    },
    term() {
      return this.$store.getters['cart01/agreeAll']
    },
    kanaNameRules() {
      if (this.$i18n.locale !== 'ja') {
        return {}
      }
      return { rules: { required: true, regex: '^(([ァ-ン])|([ぁ-ん]))*$' } }
    },
    zipRegex() {
      if (this.$i18n.locale !== 'ja') {
        return '^([0-9]){5}$'
      }
      return '^([0-9]){3}[-]?([0-9]){4}$'
    },
    telRegex() {
      if (this.$i18n.locale === 'ja') {
        return '^(([0-9]){2,4}|[+]([0-9]){2,3})-?([0-9]){2,4}-?([0-9]){4}$'
      }
      return null
    },
    nameRules() {
      if (this.$i18n.locale !== 'ja') {
        return { rules: { required: true } }
      }
      return {
        rules: {
          required: true,
          regex:
            '^([\u3005]|[\u3040-\u3096]|[\u30A1-\u30F3]|[\u4E00-\u9FAF]|[\u30f6])+$',
        },
      }
    },
    prefecturesList() {
      let list = [{ id: 0, text: this.$t('28') }]
      for (let i in this.$t('prefectures')) {
        list.push({ id: parseInt(i), text: this.$t('prefectures.' + i) })
      }
      return list
    },
    defaultCountry() {
      return countryMaps[this.$i18n.locale] || 'US'
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
    addressRule() {
      return this.langSupported().includes(this.$i18n.locale) ? { rules: { required: this.info.type == 1, min: 6}} : { rules: {}}
    }
  },
  methods: {
    onRegister() {
      if (this.processing) {
        return
      }
      this.processing = true
      this.errPrefectureId = false
      this.payErr = false
      this.termErr = false
      this.mailExist = false
      this.$validator.validateAll().then(success => {
        if (!success) {
          if (this.info.prefectureId < 1) {
            this.errPrefectureId = true
          }
          this.processing = false
          return
        }
        if (this.info.prefectureId < 1) {
          this.errPrefectureId = true
          this.processing = false
          return
        }
        if (this.checkPreCondition()) {
          this.processing = false
          return
        }
        if (this.info.type == 1) {
          this.GoGoHTTP.post('/api/v3/auth/validate/email', {
            email: this.info.mailAddress,
          })
            .then(data => {
              if (data.res) {
                let period = 30 * 24 * 60
                setCookie('cpayid', this.pay, period)
                setCookie('cdvdoption', this.dvdOpt, period)
                this.addGtag(this.$refs.cfCartForm)
              } else {
                this.mailExist = true
              }
            })
            .finally(() => {
              this.processing = false
            })
        } else {
          let period = 30 * 24 * 60
          setCookie('cpayid', this.pay, period)
          setCookie('cdvdoption', this.dvdOpt, period)
          this.addGtag(this.$refs.cfCartForm)
        }
      })
    },
    showTerm() {
      this.isShowModal = true
      if (!this.terms) {
        this.loading = true
        this.GoGoHTTP.get('/api/terms/service')
          .then(data => {
            this.terms = (data[0] || {}).content
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    onClickCancel() {
      this.isShowModal = false
    },
    onClickConfirm() {
      this.isConfirm = true
      this.isShowModal = false
    },
    checkPreCondition() {
      let count = 0
      if (this.sumPrice + this.dvdPrice + this.bankTranFee) {
        if (!this.pay) {
          this.payErr = true
          count++
        }
      } else {
        this.payErr = false
      }
      if (!this.term) {
        this.termErr = true
        count++
      } else {
        this.termErr = false
      }
      return !!count
    },
    addGtag(form) {
      // OAM-35654 add google event
      window.gtag && window.gtag('event', 'confirm', {
        event_category: 'payment',
        event_label: this.pay || 0,
        value: this.sumPrice + this.dvdPrice + this.bankTranFee
      })
      if (this.info.type == 1) {
        trackingUserRegister(this.$i18n.local)
      }
      $(form).submit()
    }
  },
}
</script>
<style lang="scss" scoped>
.register-wrapp {
  color: #2d2d2d;
  .co-red {
    color: red;
    margin-left: 250px;
  }
  .warn {
    color: red;
  }
  .title {
    .icon-cls {
      width: 24px;
      height: 25px;
    }
  }
  .text-title {
    font-size: 18px;
    line-height: 20px;
  }
  .info-area {
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    padding: 40px 90px 70px;
    .a-row {
      margin-top: 13px;
      .left-text {
        width: 250px;
        flex: 0 0 250px;
        .required {
          border-radius: 3px;
          background: #b4b5b6;
          padding: 0 5px;
        }
      }
      .input-border {
        width: 270px;
        padding: 8px 10px;
        border: 1px solid #d9d9d9;
        &::placeholder {
          color: #ababab;
        }
      }
      .input-tel {
        width: 250px;
        padding: 3px 5px;
        border: 1px solid #d9d9d9;
        border-radius: 0;
        &::placeholder {
          color: #ababab;
        }
      }
      /deep/ .dropdown-menu {
        height: 400px;
        overflow-y: auto;
      }
    }
    .choose-area {
      background: #f0eff0;
      border-radius: 5px;
      padding: 25px 50px 20px;
      .c-label {
        font-weight: normal;
        > div {
          margin-top: 3px;
        }
        &:first-child {
          width: 45%;
          height: 100%;
          flex: 0 0 45%;
        }
        &:last-child {
          width: 55%;
          flex: 0 0 55%;
        }
      }
    }
    .btn-register {
      width: 270px;
      height: 40px;
      background: #f60;
      color: white;
      border: none;
      border-radius: none;
      &:hover {
        opacity: 0.85;
      }
    }
  }
  .term-content {
    padding: 30px;
    height: 560px;
  }
  .btn-cancel {
    background: inherit;
    border: 1px solid #c5c5c5;
    border-radius: 5px;
    width: 160px;
    height: 40px;
  }
  .btn-agree {
    background: white;
    border: 1px solid #c5c5c5;
    border-radius: 5px;
    width: 160px;
    height: 40px;
  }
  .modal-title {
    border-left: 2px solid black;
  }
  .modal-footer {
    button {
      width: 120px;
      height: 34px;
      outline: none;
      &.btn-agree {
        background: #327ab7;
        color: white;
        &:hover {
          background: #286090;
        }
      }
      &.btn-cancel {
        background: white;
        &:hover {
          background: #e6e6e6;
        }
      }
    }
  }
  /deep/ .modal-dialog {
    top: 5%;
  }
}
.loading-grey {
  pointer-events: none;
  opacity: 0.5;
}
</style>
<docs>
  ```vue
  <template>
    <CartUserRegister />
  </template>
  ```
</docs>
