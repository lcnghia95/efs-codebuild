<template>
  <div class="inquiry-form">
    <template v-if="step == 1">
      <div class="header">
        {{ $t('1') }}
      </div>
      <div class="mt-15">
        <div class="flex">
          <div class="label">1</div>
          <div class="label-form">{{ $t('2') }}</div>
        </div>
        <div class="flex layout-col radio-group">
          <div class="child-group flex flex-wrap mid">
            <radio
              name="type"
              v-model="inquiry.categoryType"
              :attrs="{value: index, name:'type'}"
              :label="option" class="radio-option"
              v-for="(option,index) in firstOption"
              :key="'op1'+index"
              v-validate="{ rules: { required: true } }"
            />
          </div>
        </div>
        <div class="co-red" v-show="isClient && errors.has('type') && errors.firstByRule('type', 'required')">{{ $t('3') }}</div>
      </div>
      <div class="mt-30">
        <div class="flex">
          <div class="label">2</div>
          <div class="label-form">{{ $t('4') }}</div>
        </div>
        <div class="flex layout-col radio-group">
          <div v-if="inquiry.categoryType" class="child-group flex mid flex-wrap">
            <radio 
              name="contentType"
              v-model="inquiry.serviceType"
              :attrs="{value: index, name:'contentType'}"
              :label="option"
              class="radio-option"
              v-for="(option,index) in secondOption"
              :key="'op2'+index"
              v-validate="{ rules: { required: true } }"
            />
          </div>
          <div class="child-group flex mid input2-disable" v-else>
            {{ $t('5') }}
          </div>
          <div v-if="inquiry.serviceType==9" class="extend-option">
            <div class="title pl-10 pr-10 wrap-text">
              <span>{{ $t('6') }}</span>
            </div>
            <div class="flex flex-wrap">
              <radio
                name="subOption"
                v-model="inquiry.serviceDetail"
                :attrs="{value: index, name:'subOption'}"
                :label="option" 
                class="radio-option"
                v-for="(option,index) in sub"
                :key="'sop1'+index"
                v-validate="{ rules: { required: true } }"
              />
            </div>
          </div>
        </div>
        <div class="co-red" v-show="isClient && errors.has('contentType') && errors.firstByRule('contentType', 'required')">{{ $t('7') }}</div>
        <div class="co-red" v-if="inquiry.serviceType==9" v-show="isClient && errors.has('subOption') && errors.firstByRule('subOption', 'required')">{{ $t('8') }}</div>
      </div>
      <div class="flex mt-30">
        <div class="label">3</div>
        <div class="label-form">{{ $t('9') }}</div>
      </div>
      <div class="flex flex-wrap mt-20 reponsive-row space-between">
        <div class="flex layout-col w-full reponsive-item-1">
          <div class="require-note wrap-text">
            <span>{{ $t('10') }}</span>
          </div>
          <input name="name" v-model="inquiry.name" class="input-box mt-5" v-validate="{ rules: { required: true } }" :placeholder="$t('11')" type="text" :disabled="disableFlag" />
          <div class="co-red" v-show="isClient && errors.has('name') && errors.firstByRule('name', 'required')">{{ $t('13') }}</div>
        </div>
        <div class="flex layout-col w-full reponsive-item-2" v-if="!supportLocale">
          <input name="phone" v-model="inquiry.tel" class="input-box mt-15 " v-validate="{ rules: { regex: telRegex } }" :placeholder="$t('12')" type="text" :disabled="disableFlag" />
          <div class="co-red" v-show="isClient && errors.has('phone')">{{ $t('60') }}</div>
        </div>
      </div>
      <div class="flex flex-wrap mt-20 reponsive-row space-between">
        <div class="flex layout-col w-full reponsive-item-1">
          <div class="require-note wrap-text">
            <span>{{ $t('10') }}</span>
          </div>
          <input name="email" v-model="inquiry.mailAddress" class="input-box mt-5" :placeholder="$t('14')" type="email" :disabled="disableFlag" v-validate="{ rules: { required: true, email: true, min:3,max:254}}" />
          <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'required')">{{ $t('15') }}</div>
          <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'email')">{{ $t('16') }}</div>
          <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'min')">{{ $t('17') }}</div>
          <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'max')">{{ $t('18') }}</div>
        </div>
        <div class="flex layout-col w-full reponsive-item-2">
          <input name="emailAgain" v-model="emailAgain" class="input-box mt-15 " v-validate="{ rules: { required: true, confirmed: inquiry.mailAddress } }" :placeholder="$t('19')" type="text" :disabled="disableFlag" />
          <div class="co-red" v-show="isClient && errors.has('emailAgain') && errors.firstByRule('emailAgain', 'confirmed')">{{ $t('20') }}</div>
          <div class="co-red" v-show="isClient && errors.has('emailAgain') && errors.firstByRule('emailAgain', 'required')">{{ $t('21') }}</div>
        </div>
      </div>
      <div class="mt-25">
        <div class="require-note wrap-text">
          <span>{{ $t('10') }}</span>
        </div>
        <textarea name="content" v-model="inquiry.content" class="w-full mt-5 input-box" maxlength="2000" v-validate="{ rules: { required: true} }" :placeholder="$t('22')" type="text" :disabled="disableFlag"></textarea>
        <div class="co-red" v-show="isClient && errors.has('content') && errors.firstByRule('content', 'required')">{{ $t('23') }}</div>
      </div>
      <button class="flex space-between mt-20 mb-30" @click="onConfirm">
        <span>{{ $t('24') }}</span>
        <span mr-5="">&gt;</span>
      </button>
    </template>
    <template v-if="step == 2">
      <div class="header">
        {{ $t('25') }}
      </div>
      <div class="mt-15">
        <div class="flex">
          <div class="label">1</div>
          <div class="label-form">{{ $t('26') }}</div>
        </div>
        <div class="child-group radio-group flex mid">
          <div class="child-group flex mid">
            {{ firstOption[inquiry.categoryType] }}
          </div>
        </div>
      </div>
      <div class="mt-30">
        <div class="flex">
          <div class="label">2</div>
          <div class="label-form">{{ $t('27') }}</div>
        </div>
        <div class="flex layout-col radio-group radio-success">
          <div class="child-group flex mid" style="padding: 5px 0;">
            {{ secondOption[inquiry.serviceType] }}
          </div>
          <div v-if="inquiry.serviceDetail!=null" style="padding: 12px 0 5px 0; border-top: 1px dashed #c7c7c7;">
            {{ sub[inquiry.serviceDetail] }}
          </div>
        </div>
      </div>
      <div class="mt-30">
        <div class="flex">
          <div class="label">3</div>
          <div class="label-form">{{ $t('28') }}</div>
        </div>
        <div class="flex layout-col radio-group">
          <div class="flex layout-col confirm-info">
            <div class="flex info-row">
              <div class="title-2 space-between wrap-text">
                {{ $t('29') }}
              </div>
              <span class="input-value">{{ inquiry.name }}</span>
            </div>
            <template v-if="!supportLocale">
              <div class="flex info-row">
                <div class="title-2 space-between wrap-text">
                  {{ $t('30') }}
                </div>
                <span class="input-value">{{ inquiry.tel }}</span>
              </div>
            </template>
            <div class="flex info-row">
              <div class="title-2 space-between wrap-text">
                {{ $t('31') }}
              </div>
              <span class="input-value">{{ inquiry.mailAddress }}</span>
            </div>
            <div class="flex layout-row mt-5 info-row">
              <div class="title-2 space-between wrap-text">
                {{ $t('32') }}
              </div>
              <textarea v-model="inquiry.content" class="review-content" disabled></textarea>
            </div>
          </div>
        </div>
        <div class="note" v-html="$t(61)"></div>
        <div class="flex layout-row space-between mb-15">
          <button class="flex space-between button-st2 button-back" @click="step--">
            <span>{{ $t('35') }}</span>
            <span mr-5="">&gt;</span>
          </button>
          <button class="flex space-between button-st2" @click="onSend">
            <span>{{ $t('36') }}</span>
            <span mr-5="">&gt;</span>
          </button>
        </div>
      </div>
    </template>
    <div v-if="step == 3">
      <div class="header">
        {{ $t('37') }}
      </div>
      <div class="announce">
        <div class="pb-10">{{ $t('38') }} </div>
        <div class="pb-10">{{ $t('39') }} </div>
        <div class="flex content-end mb-200">
          <a :href="topLink">{{ $t('40') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VeeValidate from 'vee-validate'
  import i18n from '@@/lang/mobile/inquiry.json'
  import Vue from 'vue'
  import Radio from '@@/../components/form/Radio.vue'
  if (process.browser) {
    Vue.use(VeeValidate, {
      inject: true,
      events: 'none',
    })
  }
  export default {
    components: {
      Radio,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        inquiry: {
          name: '',
          tel: '',
          mailAddress: '',
          content: '',
          categoryType: null,
          serviceType: null,
          serviceDetail: null,
        },
        emailAgain: '',
        step: 1,
        isClient: process.browser,
        firstOption: {
          1: this.$t('41'),
          2: this.$t('42'),
          3: this.$t('43'),
          4: this.$t('44'),
          7: this.$t('45')
        },
        secondOption: {
          4: this.$t('46'),
          5: this.$t('47'),
          6: this.$t('48'),
          7: this.$t('49'),
          8: this.$t('50'),
          9: this.$t('51'),
        },
        sub: {
          1: this.$t('54'),
          2: this.$t('55'),
          3: this.$t('56'),
          4: this.$t('57'),
          5: this.$t('58'),
          6: this.$t('59')
        }
      }
    },
    methods: {
      onConfirm() {
        this.$validator.validateAll().then(success => {
          if (!success) {
            return
          }
          this.inquiry.serviceType !== "9" ? this.inquiry.serviceDetail = null : {}
          this.step += 1
        })
      },
      async onSend() {
        this.inquiry.serviceType !== "9" ? delete this.inquiry.serviceDetail : {}
        await this.GoGoHTTP.post(`/api/v3/surface/inquiry`, this.inquiry)
        this.step += 1
        $('html, body').animate({scrollTop: 0}, 'slow')
      },
    },
    computed: {
      disableFlag() {
        return !this.inquiry.serviceType || (this.inquiry.serviceType == 9 && !this.inquiry.serviceDetail)
      },
      telRegex() {
        if (this.$i18n.locale !== 'ja') {
          // 000-000-0000
          return '^[0-9]{3}-[0-9]{3}-[0-9]{4}$'
        }
        return '^(([0-9]){2,4}|[+]([0-9]){2,3})[-]([0-9]){2,4}[-]([0-9]){4}$'
      },
      topLink() {
        if (this.langSupported().includes(this.$i18n.locale)) {
          return `/${this.$i18n.locale}`
        }
        return '/'
      },
      supportLocale() {
        return this.langSupported().includes(this.$i18n.locale)
      }
    },
    name: 'Index',
  }
</script>

<style lang="scss" scoped>

@media only screen and (min-width: 550px) {
  .reponsive-row {
    .reponsive-item-1 {
      width: 48%;
    }
    .reponsive-item-2 {
      width: 48%;
      input {
        margin-top: 24px;
      }
    }
  }
}
.inquiry-form {
  color: #666;
  padding: 10px;
  background: #f5f5f5;
  .header {
    font-size: 16px;
    line-height: 40px;
    color: #434343;
    margin: -10px -10px 0 -10px;
    height: 40px;
    padding: 0 10px;
    font-weight: bold;
    background: #f3f0ef;
    box-shadow: 0 0.5px 0 0 #999;
  }
  .label {
    font-size: 14px;
    background-color: #666;
    margin-right: 5px;
    text-align: center;
    height: 21px;
    width: 21px;
    margin-top: -1px;
    flex: 0 0 21px;
    line-height: 21px;
    padding: 0;
  }
  .child-group {
    min-height: 20px;
  }
  .radio-group {
    border-radius: 5px;
    background-color: #fff;
    margin-top: 10px;
    border: solid 1px #b0b0af;
    padding: 8px 15px;
    box-shadow: 0 0 10px #f3f3f3;
  }
  .radio-option {
    padding-right: 10px;
    font-weight: normal;
    margin-bottom: 0 !important;
    height: 25px;
    line-height: 25px;
    min-width: 20%;
  }
  .label-form {
    font-size: 15px;
    margin-top: -2px;
    word-break: break-word;
    color: #2d2d2d;
  }
  .input2-disable {
    color: #b2b2b2;
  }
  .extend-option {
    padding-top: 15px;
    border-top: 1px dotted #c3c3c3;
    margin-top: 7px;
  }
  .title {
    width: 230px;
    border-radius: 10px;
    background-color: #d9d9d9;
    font-size: 15px;
    line-height: 20px;
    text-align: center;
    margin-bottom: 5px;
  }
  .input-box {
    width: 100%;
    height: 38px;
    padding: 5px 10px;
    border: 1px solid #b0b0af;
    color: #2d2d2d;
    &::placeholder {
      color: #2d2d2d;
      font-size: 15px;
      line-height: 28px;
    }
  }
  .require-note {
    font-size: 15px;
    background-color: #eb5068;
    width: 60px;
    height: 24px;
    margin-bottom: -5px;
    line-height: 24px;
    text-align: center;
    color: #fff;
  }
  textarea {
    min-height: 140px;
    resize: none;
  }
  button {
    height: 40px;
    color: white;
    width: 100%;
    background-color: black;
    border: none;
    align-items: center;
    padding: 0 15px;
    line-height: 40px;
  }
  span {
    word-break: break-word;
  }
  .co-red {
    margin-top: 5px;
    font-size: 12px;
    line-height: 1.67;
    color: #e5455d;
  }
  .title-2 {
    width: 30%;
    flex: 0 0 30%;
    max-width: 90px;
    padding-right: 5px;
    position: relative;
    &::after {
      position: absolute;
      content: ':';
      right: 3px;
      top: 0;
    }
  }
  .button-st2 {
    width: 48%;
    height: 40px;
    color: white;
    background-color: black;
  }
  .button-back {
    background-color: #a0a0a0;
  }
  .review-content {
    background: #fff;
    resize: none;
    overflow-y: auto;
    border: none;
    padding: 0 9px;
    width: 100%;
  }
  .info-row {
    padding: 5px 0;
    border-bottom: 1px dashed #d8d8d8;
    color: #2d2d2d;
    &:last-child {
      border-bottom: none;
    }
  }
}
.input-value {
  margin-left: 10px;
}
.note {
  margin-top: 24px;
  margin-bottom: 11px;
  /deep/ a {
    color: #04c;
    border-bottom: 1px solid #04c;
    padding-bottom: 1px;
  }
}
.announce {
  font-size: 15px;
  padding: 10px 0;
  color: #000;
}
/deep/ .c-label .radiomark::after {
  background: #9c3 !important;
}
a {
  font-size: 15px;
  color: #04c;
  text-decoration: underline;
  text-underline-position: under;
}
/deep/ .c-label .radiomark {
  top: calc(50% - 8px) !important;
}
</style>
