<template>
  <div class="o-layout">
    <div class="c-nav text-center">
      <a href="/systemtrade/search/easy" class="c-btn pos-rel">
        {{ $t('1') }}<i class="o-arrow-r pos-abs"></i>
      </a>
    </div>
    <div class="c-tit flex mid">
      <search-plus class="o-icon mr-5" />{{ $t('2') }}
    </div>
    <div class="c-form">
      <div class="c-row">
        <input type="text" class="o-name w-full" :placeholder="$t('3')" v-model="q" />
      </div>
      <div class="c-btn-w">
        <button class="c-btn u-submit pos-rel" @click="gotoSearch">{{ $t('11') }}</button>
      </div>
      <hr class="o-hr" />
      <div class="c-row u-end">
        <label class="mb-10">{{ $t('10') }}</label>
        <div class="flex flex-wrap space-between">
          <radio v-model="params.month" :attrs="{ id: 'month'+key, value: key }" :label="label" v-for="(label, key) in periods" :key="key" class="u-30" />
        </div>
      </div>
      <hr class="o-hr u-10" />
      <div class="c-row">
        <label class="mb-10">{{ $t('27') }}</label>
        <div class="flex flex-wrap">
          <checkbox v-model="params.categoryId" :attrs="{ id: 'categoryId'+key, value: key }" :label="label" v-for="(label, key) in categories" :key="key" class="o-label" />
        </div>
      </div>
      <hr class="o-hr u-10" />
      <div class="c-row">
        <label class="mb-10">{{ $t('31') }}</label>
        <div class="select-bet">
          <label class="o-label">{{ $t('32') }}</label>
          <div class="flex mid w-270 space-between">
            <select v-model="params.minOperatingMonths">
              <option value="null">{{ $t('4') }}</option>
              <option value="12">1{{ $t('33') }}</option>
              <option value="24">2{{ $t('33') }}</option>
              <option value="36">3{{ $t('33') }}</option>
              <option value="60">5{{ $t('33') }}</option>
              <option value="84">7{{ $t('33') }}</option>
            </select>
            <span class="c-span-01">~</span>
            <select v-model="params.maxOperatingMonths">
              <option value="null">{{ $t('4') }}</option>
              <option value="12">1{{ $t('33') }}</option>
              <option value="24">2{{ $t('33') }}</option>
              <option value="36">3{{ $t('33') }}</option>
              <option value="60">5{{ $t('33') }}</option>
              <option value="84">7{{ $t('33') }}</option>
            </select>
          </div>
        </div>
        <div class="select-bet">
          <label class="o-label">{{ $t('34') }}</label>
          <div class="flex mid w-270 space-between">
            <select v-model="params.minActiveCount">
              <option value="null">{{ $t('4') }}</option>
              <option value="20">20{{ $t('38') }}</option>
              <option value="50">50{{ $t('38') }}</option>
              <option value="100">100{{ $t('38') }}</option>
              <option value="200">200{{ $t('38') }}</option>
              <option value="500">500{{ $t('38') }}</option>
            </select>
            <span class="c-span-01">~</span>
            <select v-model="params.maxActiveCount">
              <option value="null">{{ $t('4') }}</option>
              <option value="20">20{{ $t('38') }}</option>
              <option value="50">50{{ $t('38') }}</option>
              <option value="100">100{{ $t('38') }}</option>
              <option value="200">200{{ $t('38') }}</option>
              <option value="500">500{{ $t('38') }}</option>
            </select>
          </div>
        </div>
        <div class="select-bet">
          <label class="o-label">{{ $t('35') }}</label>
          <div class="flex mid w-270 space-between">
            <select v-model="params.minActiveRate">
              <option value="null">{{ $t('4') }}</option>
              <option value="20">20%</option>
              <option value="40">40%</option>
              <option value="60">60%</option>
              <option value="80">80%</option>
              <option value="100">100%</option>
            </select>
            <span class="c-span-01">~</span>
            <select v-model="params.maxActiveRate">
              <option value="null">{{ $t('4') }}</option>
              <option value="20">20%</option>
              <option value="40">40%</option>
              <option value="60">60%</option>
              <option value="80">80%</option>
              <option value="100">100%</option>
            </select>
          </div>
        </div>
      </div>
      <hr class="o-hr u-3" />
      <div class="c-row">
        <label class="mb-10">{{ $t('43') }}</label>
        <div class="select-bet" v-for="(item, i) in selectOps" :key="i">
          <label class="o-label">{{ labelSelectOps[i] }}</label>
          <div class="flex mid space-between">
            <select class="pos-rel" v-model="params[item['min']]">
              <option value="null">{{ $t('4') }}</option>
              <option v-for="(val, o) in item['val']" :value="val" :key="'op-'+o">{{ val }}</option>
            </select>
            <span class="o-tidle pos-rel">~</span>
            <select v-model="params[item['max']]">
              <option value="null">{{ $t('4') }}</option>
              <option v-for="(val, e) in item['val']" :value="val" :key="'op-'+e">{{ val }}</option>
            </select>
          </div>
        </div>
      </div>
      <hr class="o-hr u-3" />
      <div class="c-row">
        <label class="c-label-01 mb-10">{{ $t('44') }}</label>
        <div class="select-bet">
          <label class="o-label">{{ $t('40') }}</label>
          <div class="flex mid w-270">
            <checkbox v-model="params.isOnSale" :attrs="{ value: true }" :label="$t('41')" />
            <checkbox v-model="params.isOperating" :attrs="{ value: true }" :label="$t('42')" class="ml-10" />
          </div>
        </div>
        <label class="mb-10">{{ $t('45') }}</label>
        <div class="select-bet" v-for="(item, i) in selectOps2" :key="i">
          <label class="o-label">{{ labelSelectOps2[i] }}</label>
          <div class="flex mid space-between">
            <select class="pos-rel" v-model="params[item['min']]">
              <option value="null">{{ $t('4') }}</option>
              <option v-for="(val, o) in item['val']" :value="val" :key="'op-'+o">{{ val }}</option>
            </select>
            <span class="o-tidle pos-rel">~</span>
            <select v-model="params[item['max']]">
              <option value="null">{{ $t('4') }}</option>
              <option v-for="(val, e) in item['val']" :value="val" :key="'op-'+e">{{ val }}</option>
            </select>
          </div>
        </div>
      </div>
      <hr class="o-hr u-10" />
      <div class="c-row">
        <button class="c-btn u-curbox pos-rel" @click="openCurrencyBox"><external-link class="mr-5" />{{ $t('5') }}</button>
      </div>
      <div class="c-row flex flex-wrap c-curbox">
        <checkbox v-model="params.currencyPairs" :checked="true" :attrs="{ id: 'currencyPairs'+item, value: item }" :label="$t('pairs')[item]" v-for="item in params.currencyPairs" :key="'s'+item" class="u-bot" />
        <label v-if="params.currencyPairs.length > 0" @click="resetCurrencyPairs" class="c-reset">{{ $t('6') }}</label>
      </div>
      <GogoModal :show="isShowModal" :cancel-text="null" :ok-text="'OK'" @ok="() => {}" @update:show="val => isShowModal = val" class="c-modal" :width="'90vw'" :height="'100vh'">
        <div slot="title" class="c-modal__t">
          {{ $t('7') }}
        </div>
        <div slot="modal-body" class="c-modal__b flex flex-wrap">
          <checkbox v-model="params.currencyPairs" :attrs="{ id: 'currencyPairs'+key, value: key }" :label="label" v-for="(label, key) in $t('pairs')" :key="key" />
        </div>
      </GogoModal>
      <hr class="o-hr" />
      <div class="c-btn-w" style="padding-top: 4vw;">
        <button class="c-btn u-submit pos-rel" @click="gotoSearch">{{ $t('11') }}</button>
      </div>
      <hr class="o-hr" />
      <div class="c-row">
        <label class="mb-10">{{ $t('26') }}</label>
        <div class="flex flex-wrap">
          <checkbox v-model="params.platformId" :attrs="{ id: 'platformId'+key, value: key }" :label="label" v-if="key != 5" v-for="(label, key) in $t('platforms')" :key="key" class="o-label" />
        </div>
      </div>
      <hr class="o-hr" />
      <div class="c-row">
        <label class="mb-10">{{ $t('8') }}</label>
        <div class="flex flex-wrap">
          <checkbox v-model="params.tradingStyles" :attrs="{ id: 'tradingStyles'+key, value: key }" :label="label" v-for="(label, key) in $t('trading-types')" :key="key" class="o-label" />
        </div>
      </div>
      <hr class="o-hr u-10" />
      <div class="c-row">
        <label class="mb-10">{{ $t('9') }}</label>
        <div class="flex flex-wrap">
          <checkbox v-model="params.technicalIndicators" :attrs="{ id: 'technicalIndicators'+key, value: key }" :label="label" v-for="(label, key) in $t('indicators')" :key="key" class="o-label" />
        </div>
      </div>
    </div>
    <div class="c-btn-w" style="padding-top: 4vw;">
      <button class="c-btn u-submit pos-rel" @click="gotoSearch">{{ $t('11') }}</button>
    </div>
  </div>
</template>
<script>
import SearchPlus from '@@/../components/icons/SearchPlus.vue'
import Radio from '@@/../components/form/Radio.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import ExternalLink from '@@/../components/icons/ExternalLink.vue'
import i18n from '@@/lang/mobile/systemtrade-search-detail.json'
import title from '@@/../common/pages'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      SearchPlus,
      Radio,
      Checkbox,
      ExternalLink,
      GogoModal,
    },
    data() {
      const query = this.$route.query
      return {
        isShowModal: false,
        categories: {
          1: this.$t('28'),
          3: this.$t('29'),
        },
        periods: {
          1: this.$t('12'),
          3: this.$t('13'),
          6: this.$t('14'),
          12: this.$t('15'),
          24: this.$t('16'),
          0: this.$t('17'),
        },
        statusOps: {
          1: this.$t('18'),
          2: this.$t('19'),
        },
        selectOps: [
          {
            min: 'minProfitRate',
            max: 'maxProfitRate',
            val: [0, 10, 20, 50, 100],
          },
          {
            min: 'minProfitFactor',
            max: 'maxProfitFactor',
            val: [0, 1, 2, 3, 4, 5],
          },
          {
            min: 'minTotalTrades',
            max: 'maxTotalTrades',
            val: [0, 50, 100, 200, 500],
          },
          {
            min: 'minDrawdown',
            max: 'maxDrawdown',
            val: [0, 5, 10, 20, 30],
          },
        ],
        selectOps2: [
          {
            min: 'minPosition',
            max: 'maxPosition',
            val: [0, 1, 2, 3, 4, 5],
          },
          {
            min: 'minPrice',
            max: 'maxPrice',
            val: [0, 10000, 30000, 50000, 100000],
          },
        ],
        labelSelectOps: {
          0: this.$t('20'),
          1: this.$t('21'),
          2: this.$t('22'),
          3: this.$t('24'),
        },
        labelSelectOps2: {
          0: this.$t('25'),
          1: this.$t('23'),
        },
        params: {
          name: null,
          status: null,
          minProfitRate: null,
          maxProfitRate: null,
          minProfitFactor: null,
          maxProfitFactor: null,
          minTotalTrades: null,
          maxTotalTrades: null,
          minPrice: null,
          maxPrice: null,
          minDrawdown: null,
          maxDrawdown: null,
          minPosition: null,
          maxPosition: null,
          currencyPairs: [],
          tradingStyles: [],
          technicalIndicators: [],
          platformId: [],
          categoryId: [],
          month: 0,
          minOperatingMonths: null,
          maxOperatingMonths: null,
          minActiveCount: null,
          maxActiveCount: null,
          minActiveRate: null,
          maxActiveRate: null,
          isOnSale: query.isOnSale == undefined && (!Object.keys(query).length || query.name) ? true : (query.isOnSale == true || false),
          isOperating: query.isOperating == undefined && (!Object.keys(query).length || query.name) ? true : (query.isOperating == true || false),
        },
        q: null,
        tCurrencyPairs: [],
      }
    },
    methods: {
      openCurrencyBox() {
        this.isShowModal = true
      },
      resetCurrencyPairs() {
        this.params.currencyPairs = []
      },
      serialize(obj) {
        var str = []
        for (var p in obj)
          if (
            obj.hasOwnProperty(p) &&
            obj[p] != null &&
            obj[p] != 'null' &&
            obj[p] != '' ||
            p == 'isOnSale' ||
            p == 'isOperating'
          ) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
          }
        return str.join('&')
      },
      gotoSearch() {
        let query = this.serialize(this.params)
        location.href = `/systemtrade/search/?${query}`
      },
    },
    watch: {
      q: function(newValue) {
        this.params.name = newValue
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
$color_01: #fff;
$color_02: rgb(197, 197, 197);
$color_03: rgb(255, 132, 0);
$color_04: rgb(217, 217, 217);
$color_05: rgb(102, 102, 102);
$color_06: rgb(240, 240, 240);
%border_radius_5 {
  border-radius: 5px;
}
%strong {
  font-weight: bold;
}
%absolute {
  position: absolute;
}
%height_auto {
  height: auto;
}
%font_weight_normal {
  font-weight: normal;
}
%width_full {
  width: 100%;
}
%left_0 {
  left: 0;
}
%bottom_0 {
  bottom: 0;
}
.c-nav {
  padding: 4vw;
  a {
    text-decoration: none;
  }
}
.c-tit {
  color: $color_01;
  background: $color_05;
  border-top: 4px solid $color_03;
  height: 12vw;
  padding: 0 4vw;
  font-size: 3.5vw;
  .o-icon {
    width: 4.2vw;
    @extend %height_auto;
  }
}
.c-form {
  background: $color_06;
}
.o-name {
  height: 11vw;
  border: 1px solid $color_04;
  box-shadow: inset 0 0 10px #ddd;
  padding: 2vw 3vw;
  @extend %border_radius_5;
  font-size: 3.5vw;
  &::placeholder {
    color: #b2b2b2;
  }
}
.select-bet {
  font-size: 3.5vw;
  margin-bottom: 3vw;
  label {
    margin-bottom: 0;
    @extend %font_weight_normal;
  }
}
/deep/ .c-label {
  font-size: 3.5vw;
  padding-left: 6vw;
  margin-bottom: 4vw;
  &.o-label {
    margin-bottom: 5vw;
    width: 46%;
    margin-left: 3%;
    padding-left: 7vw;
    @extend %font_weight_normal;
  }
  &.u-status {
    margin: 3vw 1vw 0 3vw;
    padding-left: 6vw;
  }
  &.u-30 {
    width: 30%;
    padding-left: 6vw;
    @extend %font_weight_normal;
  }
  span.radiomark,
  span.checkmark {
    width: 5vw;
    height: 5vw;
    &::after {
      width: 2.5vw;
      height: 2.5vw;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.o-hr {
  margin: 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #fff;
  &.u-3 {
    margin-top: -3px;
  }
  &.u-10 {
    margin-top: -10px;
  }
}
.o-tidle {
  font-size: 6vw;
  margin: 0 1vw;
  &::before {
    content: '';
    position: absolute;
    top: 2.8vw;
    left: -5vw;
    width: 0;
    height: 0;
    border-left: 1.2vw solid transparent;
    border-right: 1.2vw solid transparent;
    border-top: 2vw solid white;
  }
  &::after {
    content: '';
    position: absolute;
    top: 2.8vw;
    left: 44vw;
    width: 0;
    height: 0;
    border-left: 1.2vw solid transparent;
    border-right: 1.2vw solid transparent;
    border-top: 2vw solid white;
  }
}
.c-btn {
  display: block;
  height: 14vw;
  line-height: 13vw;
  font-size: 4.5vw;
  color: $color_03;
  border: 2px solid $color_02;
  background: $color_01;
  @extend %strong;
  @extend %border_radius_5;
  @extend %width_full;
  &::after {
    content: '';
    height: 3px;
    background: rgb(230, 230, 230);
    @extend %left_0;
    @extend %bottom_0;
    @extend %absolute;
    @extend %width_full;
  }
  &.u-curbox {
    font-size: 4vw;
    color: #000;
    height: 13vw;
    line-height: 12vw;
    @extend %font_weight_normal;
    i.icon-cls {
      width: 4.2vw;
      margin-bottom: -1px;
      @extend %height_auto;
    }
  }
  &.u-submit {
    border: 3px solid $color_03;
  }
}
.c-curbox {
  padding: 0 4vw !important;
  label {
    width: calc(100% / 3);
    padding-left: 7vw;
    font-size: 3.5vw;
    @extend %font_weight_normal;
    &.c-reset {
      padding-left: 0;
    }
  }
}
.c-reset {
  color: #04c;
  text-decoration: underline;
}
.c-row {
  padding: 4vw;
  &.u-end {
    padding-bottom: 0;
    margin-bottom: 8vw;
  }
}
select {
  height: 9vw;
  border-radius: 4px;
  background: rgb(186, 186, 186);
  color: $color_01;
  border: 1px solid rgb(166, 166, 166);
  @extend %width_full;
  padding: 0 3vw;
  outline: none;
  -webkit-appearance: none;
}
.o-arrow-r {
  border: solid $color_03;
  border-width: 0 2px 2px 0;
  padding: 2px;
  top: 20px;
  right: 13px;
  transform: rotate(-45deg);
}
.c-btn-w {
  padding: 0 4vw 4vw 4vw;
  @extend %left_0;
  @extend %bottom_0;
  @extend %width_full;
}
.c-modal /deep/ {
  .modal-dialog {
    height: 85vh;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .modal-header {
      height: 40px;
      padding: 10px;
      h4 {
        font-size: 18px;
      }
      button {
        padding: 2px 5px;
        outline: none;
      }
    }
    .c-modal__b {
      height: calc(85vh - 90px);
      padding: 15px;
      overflow-y: scroll;
      label {
        font-size: 3.2vw;
        font-weight: normal;
        flex: 0 0 calc(100% / 3);
        padding-left: 7vw;
        margin-bottom: 5vw;
      }
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: #ececec;
      }
      &::-webkit-scrollbar-thumb {
        background: #b9b9b9;
      }
    }
    .modal-footer {
      height: 50px;
      button {
        padding: 4px 35px;
        outline: none;
      }
    }
  }
}
@media only screen and (min-width: 600px) {
  .c-btn {
    width: 60vw;
    height: 9vw;
    line-height: 9vw;
    font-size: 3vw;
    margin: 0 auto;
    &-w {
      padding: 2.5vw;
    }
  }
  .c-tit {
    height: 10vw;
  }
  .c-row {
    padding: 4vw 8vw;
  }
  .o-name {
    height: 9vw;
  }
  .select-bet {
    font-size: 2.8vw;
    margin-bottom: 2vw;
  }
  label {
    font-size: 2.8vw;
  }
  select {
    height: 7vw;
  }
  .c-btn.u-curbox {
    font-size: 3vw;
    color: #000;
    height: 10vw;
    line-height: 10vw;
    i.icon-cls {
      width: 3.2vw;
    }
  }
  /deep/ .c-label {
    font-size: 2.7vw;
    margin-bottom: 3vw !important;
    span.checkmark {
      width: 4vw;
      height: 4vw;
    }
  }
  .c-curbox label {
    font-size: 3vw;
    margin-bottom: 2vw !important;
  }
  .o-tidle {
    &::before {
      top: 3.2vw;
      border-left: 1vw solid transparent;
      border-right: 1vw solid transparent;
      border-top: 1.7vw solid white;
    }
    &::after {
      top: 3.2vw;
      left: 40vw;
      border-left: 1vw solid transparent;
      border-right: 1vw solid transparent;
      border-top: 1.7vw solid white;
    }
  }
}
</style>
