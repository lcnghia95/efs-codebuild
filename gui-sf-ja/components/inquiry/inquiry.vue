<template>
  <div class="w-1000 flex layout-col">
    <div class="inquiry-form">
      <template v-if="step == 1">
        <h3 class="header title-border-bottom ">
          {{ $t('1') }}
        </h3>
        <div class="mt-50">
          <div class="flex">
            <span class="label">1</span>
            <div class="label-form">
              {{ $t('2') }}
            </div>
          </div>
          <div class="flex layout-col radio-group">
            <div class="child-group flex mid">
              <radio name="type" v-model="inquiry.categoryType" :attrs="{value: index, name:'type'}" :label="option" class="radio-option" v-for="(option,index) in firstOption" :key="'op1'+index" v-validate="{ rules: { required: true } }" />
            </div>
          </div>
          <div class="co-red" v-show="isClient && errors.has('type') && errors.firstByRule('type', 'required')">{{ $t('3') }}</div>
        </div>
        <div class="mt-50">
          <div class="flex">
            <span class="label">2</span>
            <div class="label-form">
              {{ $t('4') }}
            </div>
          </div>
          <div class="flex layout-col radio-group">
            <div v-if="inquiry.categoryType" class="child-group flex mid">
              <radio name="contentType" v-model="inquiry.serviceType" :attrs="{value: index, name:'contentType'}" :label="option" class="radio-option" v-for="(option,index) in secondOption" :key="'op2'+index" v-validate="{ rules: { required: true } }" />
            </div>
            <div class="child-group flex mid input2-disable" v-else>
              {{ $t('5') }}
            </div>
            <div v-if="inquiry.serviceType==9" class="extend-option">
              <hr />
              <div class="title pl-10 pr-10">
                <span>{{ $t('6') }}</span>
              </div>
              <div class="flex flex-wrap">
                <radio name="subOption" v-model="inquiry.serviceDetail" :attrs="{value: index, name:'subOption'}" :label="option" class="radio-sub-option" v-for="(option,index) in sub" :key="'sop1'+index" v-validate="{ rules: { required: true } }" />
              </div>
            </div>
          </div>
          <div class="co-red" v-show="isClient && errors.has('contentType') && errors.firstByRule('contentType', 'required')">{{ $t('7') }}</div>
          <div class="co-red" v-if="inquiry.serviceType==9" v-show="isClient && errors.has('subOption') && errors.firstByRule('subOption', 'required')">{{ $t('8') }}</div>
        </div>
        <div class="flex mt-50">
          <span class="label">3</span>
          <div class="label-form">
            {{ $t('9') }}
          </div>
        </div>
        <div class="flex pr-40 mt-20">
          <div class="mr-40 flex layout-col">
            <div class="require-note">
              <span>{{ $t('10') }}</span>
            </div>
            <input name="name" v-model="inquiry.name" class="input-box mt-5" v-validate="{ rules: { required: true } }" :placeholder="$t('11')" type="text" :disabled="disableFlag" />
            <div class="co-red" v-show="isClient && errors.has('name') && errors.firstByRule('name', 'required')">{{ $t('13') }}</div>
          </div>
          <div class="flex layout-col" v-if="!supportLocale">
            <input name="phone" v-model="inquiry.tel" class="input-box mt-15 " v-validate="{ rules: { regex: telRegex } }" :placeholder="$t('12')" type="text" :disabled="disableFlag" />
            <div class="co-red" v-show="isClient && errors.has('phone')">{{ $t('60') }}</div>
          </div>
        </div>
        <div class="mr-40 mt-25">
          <div class="require-note">
            <span>{{ $t('10') }}</span>
          </div>
          <input name="email" v-model="inquiry.mailAddress" class="input-box mt-5" :placeholder="$t('14')" type="email" :disabled="disableFlag" v-validate="{ rules: { required: true, email: true, min:3,max:254}}"
          />
          <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'required')">{{ $t('15') }}</div>
          <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'email')">{{ $t('16') }}</div>
          <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'min')">{{ $t('17') }}</div>
          <div class="co-red" v-show="isClient && errors.has('email') && errors.firstByRule('email', 'max')">{{ $t('18') }}</div>
        </div>
        <input name="emailAgain" v-model="emailAgain" class="input-box mt-15 " v-validate="{ rules: { required: true, confirmed: inquiry.mailAddress } }" :placeholder="$t('19')" type="text" :disabled="disableFlag"
        />
        <div class="co-red" v-show="isClient && errors.has('emailAgain') && errors.firstByRule('emailAgain', 'confirmed')">{{ $t('20') }}</div>
        <div class="co-red" v-show="isClient && errors.has('emailAgain') && errors.firstByRule('emailAgain', 'required')">{{ $t('21') }}</div>
        <div class="mr-40 mt-35">
          <div class="require-note">
            <span>{{ $t('10') }}</span>
          </div>
          <textarea name="content" v-model="inquiry.content" class="w-full mt-5" maxlength="2000" v-validate="{ rules: { required: true} }" :placeholder="$t('22')" type="text" :disabled="disableFlag"></textarea>
          <div class="co-red" v-show="isClient && errors.has('content') && errors.firstByRule('content', 'required')">{{ $t('23') }}</div>
        </div>
        <button class="flex space-between mt-20" @click="onConfirm">
          <span>{{ $t('24') }}</span>
          <span mr-5="">&gt;</span>
        </button>
      </template>
      <template v-if="step == 2">
        <h3 class="header title-border-bottom ">
          {{ $t('25') }}
        </h3>
        <div class="mt-50">
          <span class="label">1</span>{{ $t('26') }}          
          <div class="child-group radio-group flex mid">
            {{ firstOption[inquiry.categoryType] }}
          </div>
        </div>
        <div class="mt-50">
          <span class="label">2</span>{{ $t('27') }}
          <div class="flex layout-col radio-group radio-success">
            <div class="child-group flex mid">
              {{ secondOption[inquiry.serviceType] }}
            </div>
            <div class="mb-20" v-if="inquiry.serviceDetail!=null">
              <hr />
              {{ sub[inquiry.serviceDetail] }}
            </div>
          </div>
        </div>
        <div class="mt-50">
          <span class="label">3</span>{{ $t('28') }}
          <div class="flex layout-col radio-group">
            <div class="flex layout-col mt-20 mb-20 confirm-info">
              <div class="flex">
                <div class="flex title-2">
                  <span>{{ $t('29') }}</span>
                </div>:
                <span class="input-value">{{ inquiry.name }}</span>
              </div>
              <hr />
              <template v-if="!supportLocale">
                <div class="flex">
                  <div class="flex title-2">
                    <span>{{ $t('30') }}</span>
                  </div>:
                  <span class="input-value">{{ inquiry.tel }}</span>
                </div>
                <hr />
              </template>
              <div class="flex">
                <div class="flex title-2">
                  <span>{{ $t('31') }}</span>
                </div>:
                <span class="input-value">{{ inquiry.mailAddress }}</span>
              </div>
              <hr />
              <div class="flex layout-row">
                <div class="flex title-2">
                  <span>{{ $t('32') }}</span>
                </div>:
                <textarea v-model="inquiry.content" class="review-content mt-5" :disabled="true"></textarea>
              </div>
            </div>
          </div>
          <div class="note flex">
            <a :href="$t('privacyUrl')" target="_blank">
              {{ $t('33') }}
            </a>
            <span>{{ $t('34') }}</span>
          </div>
          <div class="flex layout-row">
            <button id="button-back" class="flex space-between button-st2" @click="onBack">
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
      <div v-if="step == 3" class="h-540">
        <h3 class="header title-border-bottom ">
          {{ $t('37') }}
        </h3>
        <div class="announce mt-50">
          <p>
            {{ $t('38') }}<br />
            {{ $t('39') }}
          </p>
          <div class="flex content-end">
            <a :href="topLink">{{ $t('40') }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VeeValidate from 'vee-validate'
  import i18n from '@@/lang/desktop/inquiry.json'
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
      onBack() {
        this.step -= 1
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
.inquiry-form {
  width: 880px;
  margin-top: 190px;
  color: #666;
  margin-bottom: 190px;
  padding: 60px 80px;
  background: #f5f5f5;
  .header {
    font-size: 26px;
    line-height: 0.77;
    color: #666;
  }
  .label {
    font-size: 14px;
    background-color: #666;
    margin-right: 5px;
    text-align: center;
  }
  .child-group {
    width: 720px;
    height: 50px;
  }
  .radio-group {
    width: 720px;
    border-radius: 5px;
    background-color: #fff;
    margin-top: 20px;
    padding-left: 20px;
    border: solid 1px #d9d9d9;
  }
  .radio-option {
    margin-right: 20px;
    font-weight: normal;
    margin-bottom: 0 !important;
  }
  .label-form {
    font-size: 14px;
  }
  .input2-disable {
    color: #b2b2b2;
  }
  .extend-option {
    margin-bottom: 28px;
  }
  .title {
    width: 200px;
    border-radius: 10px;
    background-color: #d9d9d9;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
  .input-box {
    width: 260px;
    height: 40px;
    padding: 15px;
  }
  .require-note {
    font-size: 11px;
    background-color: #b2b2b2;
    width: 60px;
    height: 17px;
    margin-bottom: -5px;
    line-height: 17px;
    text-align: center;
  }
  .radio-sub-option {
    font-size: 14px;
    color: #666;
    margin-top: 20px;
    margin-right: 30px;
    margin-bottom: 0 !important;
    font-weight: normal;
  }
  textarea {
    resize: vertical;
    width: 560px;
    height: 200px;
    padding: 15px;
  }
  button {
    width: 390px;
    height: 40px;
    color: white;
    background-color: black;
    border: solid 1px #d9d9d9;
    margin-bottom: 90px;
    padding-left: 21px;
    align-items: center;
  }
  span {
    text-align: center;
  }
  .co-red {
    margin-top: 5px;
    font-size: 12px;
    line-height: 1.67;
    color: #e5455d;
  }
  .title-border-bottom {
    line-height: 30px;
    border-bottom: solid 1px #d9d9d9;
    padding-bottom: 10px;
  }
  .title-2 {
    width: 120px;
    flex: 0 0 120px;
  }
  .confirm-info hr {
    width: 680px;
    margin-top: 20px;
  }
  .button-st2 {
    width: 280px;
    height: 40px;
    color: white;
    background-color: black;
    border: solid 1px #d9d9d9;
    margin-bottom: 90px;
    margin-right: 20px;
  }
  #button-back {
    border: solid 1px #d9d9d9;
    background-color: #a0a0a0;
  }
  .review-content {
    background: #fff;
    resize: none;
    overflow-y: auto;
    border: none;
    padding: 0 15px 0 45px;
  }
}
.input-value {
  margin-left: 46px;
}
.note {
  margin-top: 74px;
  margin-bottom: 11px;
}
.h-540 {
  height: 540px;
  width: 720px;
}
.announce {
  font-size: 14px;
}
/deep/ .c-label .radiomark::after {
    background: #9c3 !important;
}
hr {
  margin-top: 0;
  margin-right: 20px;
  border: 0.5px dashed #d9d9d9;
}
a {
  font-size: 12px;
  color: #04c;
  text-decoration: underline;
  text-underline-position: under;
}
</style>
