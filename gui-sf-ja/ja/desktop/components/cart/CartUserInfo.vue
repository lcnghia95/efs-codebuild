<template>
  <section>
    <p class="heading pl-20 pos-rel">{{ $t('1') }}</p>
    <div class="cart-info fs-12">
      <div class="payment-method flex mid p-15">
        <div class="col-label flex mid center pr-10">{{ $t('2') }}</div>
        <div class="col-info flex mid p-15">
          <div :class="{'grow1': isAllSalon && payId == 5}"> {{ isAllSalon && payId == 5 ? $t('pays.tran2') : $t('pays.' + pays[payId || '0']) }} </div>
          <div v-if="isAllSalon && payId == 5" class="ml-20 fs-12" v-html="buildPay()"></div>
          <template v-if="payId == 2">
            <img class="ml-15 img1" :src="'/img/assets/pc/common/payment_ico_visacard.png'" alt="" />
            <img class="ml-5 img1" :src="'/img/assets/pc/common/payment_ico_mastercard.png'" alt="" />
          </template>
          <template v-if="payId == 3">
            <img class="ml-10 img1" :src="'/img/assets/pc/common/payment_ico_visacard.png'" alt="" v-if="$i18n.locale != 'ja'" />
            <img class="ml-10 img1" :src="'/img/assets/pc/common/payment_ico_mastercard.png'" alt="" v-if="$i18n.locale != 'ja'" />
            <img class="ml-10 img1" :src="'/img/assets/pc/common/payment_ico_jcb.png'" alt="" />
          </template>
        </div>
      </div>
      <div class="payment-method flex mid p-15" v-if="payId == 4">
        <div class="col-label flex mid center pr-10">{{ $t('41') }}</div>
        <div class="col-info flex mid p-15 flex-wrap">
          <label class="flex mid cursor-pointer mr-20">
            <Radio v-model.number="storeId" :attrs="{value: 1}" />
            <img class="reponsive-img-payment" src="/img/assets/pc/common/payment_ico_familymart_new.png" alt="" />
          </label>
          <label class="flex mid">
            <Radio v-model.number="storeId" :attrs="{value: 2}" />
            <div class="flex mid cursor-pointer">
              <img class="mr-5 reponsive-img-payment" src="/img/assets/pc/common/payment_ico_D1.png" alt="" />
              <img class="mr-5 reponsive-img-payment" src="/img/assets/pc/common/payment_ico_D2.png" alt="" />
            </div>
          </label>
        </div>
      </div>
      <div class="customer-info flex mid p-15">
        <div class="col-label flex mid center pr-10">{{ $t('7') }}</div>
        <div class="col-info flex layout-col center p-15">
          <p class="mb-10"><strong>{{ info.lastName }}&nbsp;{{ info.firstName }}</strong></p>
          <p class="mb-5"><span>{{ $t('3') }}:</span> {{ info.zip }}</p>
          <p class="mb-5"><span>{{ $t('4') }}:</span> {{ info.address1 }} {{ info.address2 }} {{ info.address3 }}</p>
          <p class="mb-5"><span>{{ $t('5') }}:</span> {{ info.tel }}</p>
        </div>
        <div class="col-edit text-center">
          <a @click="onClickEdit" class="cursor-pointer">{{ $t('6') }}</a>
        </div>
      </div>
    </div>
    <GogoModal :show="isShowModal" @update:show="val => isShowModal = val" :width="900" :height="485">
      <div slot="title" class="modal-title pl-10 ml-50">
        {{ $t('15') }}
      </div>
      <div slot="modal-body" class="user-input modal-body">
        <div class="info-area">
          <div class="a-row flex mid flex-wrap">
            <div class="left-text fs-12">
              {{ $t('16') }}
            </div>
            <template v-if="!isConfirm">
              <input id="input-lastname" name="lastName" v-model="info.lastName" class="input-border" v-validate="nameRules" :placeholder="$t('21')" type="text" />
              <input id="input-firstname" name="firstName" v-model="info.firstName" class="input-border ml-10" v-validate="nameRules" :placeholder="$t('22')" type="text" />
            </template>
            <div v-else>: {{ info.lastName }}&nbsp;{{ info.firstName }}</div>
          </div>
          <b class="co-red" v-show="isClient && (errors.firstByRule('firstName', 'required') || errors.firstByRule('lastName', 'required'))">
            {{ $t('REQUIRED_TEXT') }}
          </b>
          <b class="co-red" v-show="isClient && (errors.firstByRule('firstName', 'regex') || errors.firstByRule('lastName', 'regex'))">
            {{ $t('NAME_ERROR') }}
          </b>
          <div class="a-row flex mid flex-wrap" v-if="$i18n.locale == 'ja'">
            <div class="left-text fs-12">
              {{ $t('17') }}
            </div>
            <template v-if="!isConfirm">
              <input id="input-lastnamekana" name="lastNameKana" v-model="info.lastNameKana" class="input-border" v-validate="kanaNameRules" :placeholder="$t('23')" type="text" />
              <input id="input-firstnamekana" name="firstNameKana" v-model="info.firstNameKana" class="input-border ml-10" v-validate="kanaNameRules" :placeholder="$t('24')" type="text" />
            </template>
            <template v-else>
              <span>: {{ info.lastNameKana }}&nbsp;{{ info.firstNameKana }}</span>
            </template>
          </div>
          <b class="co-red" v-show="isClient && (errors.firstByRule('firstNameKana', 'required') || errors.firstByRule('lastNameKana', 'required'))">
            {{ $t('REQUIRED_TEXT') }}
          </b>
          <b class="co-red" v-show="isClient && (errors.firstByRule('firstNameKana', 'regex') || errors.firstByRule('lastNameKana', 'regex'))">
            {{ $t('KANA_NAME_ERROR') }}
          </b>
          <div class="a-row flex mid flex-wrap" v-if="!langSupported().includes(this.$i18n.locale)">
            <div class="left-text fs-12">
              {{ $t('3') }}
            </div>
            <template v-if="!isConfirm">
              <input id="input-zipcode" 
                     maxlength="8"
                     @keyup="zipCodeOnKeyUp($event)" 
                     @keyup.enter="zipCodeOnKeyUp($event)" 
                     name="zipCode" v-model="info.zip" 
                     class="input-border input-zip" 
                     v-validate="zipRules" 
                     :placeholder="$t('25')"
                     v-mask="'###-####'"
                     type="text"
              />
            </template>
            <template v-else>
              <span>: {{ info.zip }}</span>
            </template>
          </div>
          <b class="co-red" v-show="isClient && errors.has('zipCode')">{{ $t('ZIP_ERROR') }}</b>
          <div class="a-row flex mid flex-wrap">
            <div class="left-text fs-12">
              {{ $t('18') }}
            </div>
            <template v-if="!isConfirm">
              <SelectBox :data-source="prefecturesList" name="prefectureId" :display="'text'" :id-val="'id'" v-model="info.prefectureId" v-validate="{ rules: { required: true } }" width="250px" :class="{'disable-select': $i18n.locale != 'ja'}" />
            </template>
            <template v-else>
              <span>: {{ info.prefectureId ? $t('prefectures.' + info.prefectureId) : '-' }}</span>
            </template>
          </div>
          <b class="co-red" v-show="isClient && errPrefectureId">{{ $t('REQUIRED_TEXT') }}</b>
          <div class="a-row flex mid flex-wrap">
            <div class="left-text fs-12">
              {{ $t('4') }}1
            </div>
            <template v-if="!isConfirm">
              <input id="input-address1" name="address1" v-model="info.address1" class="input-border addresss" v-validate="addressRule" :placeholder="$t('27')" type="text" />
            </template>
            <template v-else>
              <span>: {{ info.address1 }}</span>
            </template>
          </div>
          <b class="co-red" v-show="isClient && errors.has('address1')">{{ $t('REQUIRED_TEXT') }}</b>
          <div class="a-row flex mid flex-wrap">
            <div class="left-text fs-12">
              {{ $t('4') }}2
            </div>
            <template v-if="!isConfirm">
              <input id="input-address2" name="address2" v-model="info.address2" class="input-border addresss" v-validate="addressRule" :placeholder="$t('4')" type="text" />
            </template>
            <template v-else>
              <span>: {{ info.address2 }}</span>
            </template>
          </div>
          <b class="co-red" v-show="isClient && errors.has('address2')">{{ $t('REQUIRED_TEXT') }}</b>
          <div class="a-row flex mid flex-wrap">
            <div class="left-text fs-12">
              {{ $t('4') }}3
            </div>
            <template v-if="!isConfirm">
              <input id="input-address3" name="address3" v-model="info.address3" class="input-border addresss" :placeholder="$t('28')" type="text" />
            </template>
            <template v-else>
              <span>: {{ info.address3 }}</span>
            </template>
          </div>
          <div class="a-row flex mid flex-wrap" v-if="!langSupported().includes(this.$i18n.locale)">
            <div class="left-text fs-12">
              {{ $t('5') }}
            </div>
            <template v-if="!isConfirm">
              <input id="input-tel" name="tel" v-model="info.tel" class="input-border" v-validate="{ rules: { regex: telRegex, required: true } }" placeholder="000-0000-0000" type="text" v-if="$i18n.locale == 'ja'" />
              <VueTelInput name="tel" v-model="info.tel" class="input-tel" :preferred-countries="['US', 'CN', 'TW', 'TH', 'VN']" :ignored-countries="['JP']" placeholder="000 0000 0000" :disabled-fetching-country="true" :default-country="defaultCountry" v-else />
            </template>
            <template v-else>
              <span>: {{ info.tel }}</span>
            </template>
          </div>
          <b class="co-red" v-show="isClient && errors.has('tel')">{{ $t('TEL_ERROR') }}</b>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer flex mid center">
        <button class="btn-cancel" @click="onClickCancel" v-if="!isConfirm">{{ $t('19') }}</button>
        <button class="ml-20" @click="onClickToEdit" v-else>{{ $t('30') }}</button>
        <button class="ml-20 btn-agree" @click="onClickToConfirm" v-if="!isConfirm">{{ $t('20') }}</button>
        <button class="ml-20 btn-agree" @click="onClickConfirm" v-else>{{ 'Ok' }}</button>
      </div>
    </GogoModal>
  </section>
</template>

<script>
import i18n from '@@/lang/components-desktop/cart.json'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import SelectBox from '@@/../components/form/SelectBox.vue'
import Radio from '@@/../components/form/Radio.vue'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import VueTelInput from 'vue-tel-input'
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask, { masked : true })

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
  props: {
    userData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  components: {
    GogoModal,
    SelectBox,
    Radio,
    VueTelInput,
  },
  mounted() {
    let scripTag = document.createElement('script')
    scripTag.setAttribute('src',"https://ajaxzip3.github.io/ajaxzip3.js")
    document.getElementsByTagName('head')[0].appendChild(scripTag)
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      isShowModal: false,
      info: {
        firstName: this.userData.firstName || null,
        lastName: this.userData.lastName || null,
        firstNameKana: this.userData.firstNameKana || null,
        lastNameKana: this.userData.lastNameKana || null,
        zip: this.userData.zip || null,
        prefectureId:
          this.$i18n.locale === 'ja' ? this.userData.prefectureId : 48,
        address1: this.userData.address1 || null,
        address2: this.userData.address2 || null,
        address3: this.userData.address3 || null,
        tel: this.userData.tel || null,
      },
      isConfirm: false,
      pays: {
        0: 'free',
        1: 'bank',
        2: 'card',
        3: 'card2',
        4: 'store',
        5: 'tran',
        8: 'btc',
      },
      isClient: process.browser,
      errPrefectureId: false,
    }
  },
  watch: {
    showUserInfoPopup(val) {
      if (val) {
        this.isShowModal = true
      }
    },
  },
  methods: {
    zipCodeOnKeyUp(e) {
      let me = this,
        s = e.target.value.trim().replace('-', '')
      if(me.info.zip.charAt(me.info.zip.length - 1) === '-') {
        me.info.zip = s
      }
      if(!s.match(/^([0-9]){7}$/)) {
        this.info.address1 = ''
        me.info.prefectureId = 0
        return
      }
      if(typeof AjaxZip3 !== undefined) { // eslint-disable-line no-undef
        // Override AjaxZip3.callback funtion
        AjaxZip3.callback = this.updateZipData  // eslint-disable-line no-undef
        AjaxZip3.zip2addr(e.target,'','address1','address1') // eslint-disable-line no-undef
      }
    },
    updateZipData(data) {
      let me = this,
        s = me.info.zip

      s = s.replace('-', '')
      if(data[s]) {
        let number = data[s][0]
        me.info.prefectureId = number
        me.info.address1 = data[s][1] + data[s][2]
      }
      else {
        me.info.address1 = ''
        me.info.prefectureId = 0
      }
    },
    onClickEdit() {
      this.isShowModal = true
    },
    onClickCancel() {
      this.isShowModal = false
      this.$store.commit('cart01/setShowUserModal', false)
      this.info = {
        firstName: this.userData.firstName || null,
        lastName: this.userData.lastName || null,
        firstNameKana: this.userData.firstNameKana || null,
        lastNameKana: this.userData.lastNameKana || null,
        zip: this.userData.zip || null,
        prefectureId:
          this.$i18n.locale === 'ja' ? this.userData.prefectureId : 48,
        address1: this.userData.address1 || null,
        address2: this.userData.address2 || null,
        address3: this.userData.address3 || null,
        tel: this.userData.tel || null,
      }
    },
    onClickToConfirm() {
      this.$validator.validateAll().then(success => {
        if (!success) {
          if (this.info.prefectureId < 1) {
            this.errPrefectureId = true
          } else {
            this.errPrefectureId = false
          }
          return
        }
        if (this.info.prefectureId < 1) {
          this.errPrefectureId = true
          return
        }
        this.errPrefectureId = false
        this.isConfirm = true
      })
    },
    onClickConfirm() {
      this.$emit('infochange', this.info)
      this.isShowModal = false
      this.$store.commit('cart01/setShowUserModal', false)
    },
    onClickToEdit() {
      this.isConfirm = false
    },
    buildPay() {
      let buyNow = this.$store.getters['cart01/buyNow']
      if (this.isAllSalon && this.payId == 5) {
        let text,
          price3m = '',
          price = ''
        if (buyNow.length > 1) {
          price3m = '('
          price = '('
        }
        for (let i in buyNow) {
          let pri = buyNow[i].prices[0],
            prc = pri.offType1 ? pri.campaign1 : (pri.offType0 ? pri.campaign0 : pri.price)
          price += this.formatNumber(prc)
          price3m += this.formatNumber(prc * 3)
          if (i < buyNow.length - 1) {
            price += ' + '
            price3m += ' + '
          }
        }
        if (buyNow.length > 1) {
          price3m += ')'
          price += ')'
        }
        text = this.$t('31').replace('%s', price3m)
        text = text.replace('%s', price)
        return text
      }
      return ''
    },
  },
  computed: {
    kanaNameRules() {
      if (this.$i18n.locale !== 'ja') {
        return {}
      }
      return { rules: { required: true, regex: '^(([ァ-ン])|([ぁ-ん]))*$' } }
    },
    zipRules() {
      if (this.$i18n.locale !== 'ja') {
        return { rules: { regex: '^([0-9]){5}$', required: false } }
      }
      return { rules: { regex: '^([0-9]){3}[-]?([0-9]){4}$', required: true } }
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
      let list = [{ id: 0, text: this.$t('29') }]
      for (let i in this.$t('prefectures')) {
        list.push({ id: parseInt(i), text: this.$t('prefectures.' + i) })
      }
      return list
    },
    payId() {
      return this.$store.getters['cart01/payId']
    },
    isAllSalon() {
      return this.$store.getters['cart01/isAllSalon']
    },
    storeId: {
      get() {
        return this.$store.getters['cart01/storeId']
      },
      set(val) {
        this.$store.commit('cart01/setStoreId', val)
      },
    },
    showUserInfoPopup() {
      return this.$store.getters['cart01/showUserInfoPopup']
    },
    defaultCountry() {
      return countryMaps[this.$i18n.locale] || 'US'
    },
    addressRule() {
      return this.langSupported().includes(this.$i18n.locale) ? { rules: {}} : { rules: { required: true}}
    }
  },
}
</script>

<style lang="scss" scoped>
.heading {
  font-size: 18px;
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    position: absolute;
    top: 7px;
    left: 0;
    border-radius: 50%;
    background: #ddd;
  }
}
.cart-info {
  width: 600px;
  border: 1px solid #ddd;
  border-radius: 5px;
  .payment-method {
    border-bottom: 1px solid #ddd;
  }
  .col-label {
    width: 95px;
    flex: 0 0 95px;
  }
  .col-info {
    width: 480px;
    border-left: 1px solid #ddd;
    > span {
      font-size: 14px;
    }
    p {
      word-break: break-all;
      &:first-child {
        font-size: 14px;
      }
      span {
        font-size: 10px;
        opacity: 0.8;
      }
    }
    .img1 {
      height: 20px;
    }
    .img2 {
      height: 40px;
    }
  }
  .customer-info {
    .col-info {
      width: 380px;
    }
    .col-edit {
      flex: 1 0 auto;
      a {
        color: #a002a0;
      }
    }
  }
}
.info-area {
  border-radius: 5px;
  background: white;
  padding: 20px 62px 30px;
  .a-row {
    margin-top: 10px;
    min-height: 35px;
    .left-text {
      width: 120px;
      flex: 0 0 120px;
      .required {
        border-radius: 3px;
        background: #b4b5b6;
        padding: 0 5px;
      }
    }
    .input-border {
      width: 170px;
      height: 35px;
      padding: 0 10px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      &::placeholder {
        color: #94a6b9;
      }
      &.addresss {
        width: 600px;
      }
      &.input-zip {
        width: 100px;
      }
      &.input-tel {
        width: 250px;
      }
    }
    /deep/ .sl-area {
      height: 35px;
    }
    /deep/ .dropdown-menu {
      height: 400px;
      overflow-y: auto;
    }
  }
  .co-red {
    font-size: 12px;
    color: red;
    margin-left: 125px;
  }
}
/deep/ .modal-dialog {
  top: 5%;
  .modal-header {
    .close {
      display: none;
    }
  }
  .user-input {
    height: 420px;
    overflow-y: auto;
    margin: 0;
  }
}
.modal-title {
  font-size: 18px !important;
  border-left: 2px solid black;
  .close {
    display: none;
  }
}
/deep/ .modal-footer {
  height: 80px !important;
  button {
    width: 160px;
    height: 40px;
    background: #f0eff0;
    border: 1px solid #c5c5c5;
    border-radius: 5px;
    outline: none;
    &.btn-agree {
      background: white;
    }
    &:hover {
      opacity: 0.85;
    }
  }
}
.disable-select {
  pointer-events: none;
  /deep/ .sl-area {
    background: #d0d0d0;
  }
}
</style>
