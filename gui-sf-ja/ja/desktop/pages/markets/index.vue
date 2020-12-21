<template>
  <div class="w-1000 flex layout-col">
    <div class=" p-20 bg-co-59  h-300">
      <div class="flex mid space-between">
        <a href="/markets/economics" class="pl-10 spread-title fs-16">
          {{ $t('1') }}
        </a>
        <ShowMore01 class="fs-13" target="/markets/economics" />
      </div>
      <table class=" table-full table01 mt-10">
        <thead>
          <tr class="row-middle-all header text-center w-full co-white">
            <th class="w-70 h-35">{{ $t('2') }}</th>
            <th class="w-70 h-35">{{ $t('3') }}</th>
            <th class="w-70 h-35">{{ $t('4') }}</th>
            <th class="text-center h-35">{{ $t('5') }}</th>
            <th class="w-70 h-35">{{ $t('6') }}</th>
            <th class="w-70 h-35">{{ $t('7') }}</th>
            <th class="w-80 h-35">{{ $t('8') }}</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <template v-for="(item, index) in (market || {})">
            <tr :key="item.id" v-if="(market[index] || []).length">
              <td class="text-center" :rowspan="market[index].length">{{ formatTime(index,19) }}</td>
              <td class="text-center">{{ formatTime((market[index][0] || {}).CheckDate, 17) }}</td>
              <td class="text-center">
                <div class="flex mid center">
                  <Star class="co-star" v-for="i in parseInt((market[index][0] || {}).Value)" :key="'star-index-0'+ i" />
                </div>
              </td>
              <td>
                <a :href="'/markets/economics/' + (market[index][0] || {}).ID" class="co-black ho-change no-dec">
                  <img :src="'https://fx-on.com/img/flags/' + (market[index][0] || {}).Country + '.gif'" alt="" class="ml-5" />
                  {{ (market[index][0] || {}).Name }}
                </a>
              </td>
              <td class="text-center fs-10">{{ (market[index][0] || {}).LastTime || '-' }}</td>
              <td class="text-center fs-10">{{ (market[index][0] || {}).ThisTime || '-' }}</td>
              <td class="text-center fs-10">{{ (market[index][0] || {}).Result || '-' }}</td>
            </tr>
            <tr v-for="(row, idx) in market[index]" v-if="(market[index] || []).length > 1 && idx > 0" class="fs-12" :key="row.ID">
              <td class="text-center">{{ formatTime(row.CheckDate, 17) }}</td>
              <td class="text-center">
                <div class="flex mid center">
                  <Star class="co-star" v-for="i in parseInt(row.Value)" :key="'star-index-' + idx + i" />
                </div>
              </td>
              <td>
                <a :href="'/markets/economics/' + row.ID" class="co-black ho-change no-dec">
                  <img :src="'https://fx-on.com/img/flags/' + row.Country + '.gif'" alt="" class="ml-5" />
                  {{ row.Name }}
                </a>
              </td>
              <td class="text-center fs-10">{{ row.LastTime || '-' }}</td>
              <td class="text-center fs-10">{{ row.ThisTime || '-' }}</td>
              <td class="text-center fs-10">{{ row.Result || '-' }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="flex space-between mt-20">
      <div class="p-20 bg-co-59 chart-container">
        <div class="flex space-between">
          <a href="/markets/spreads" class="pl-10 spread-title fs-16 flex mid space-between">
            <span>{{ $t('9') }}</span>
          </a>
          <ShowMore01 :text="$t('33')" class="fs-13" target="/markets/spreads" />
        </div>
        <div class="select-content mb-5 mt-5" v-if="lineStock.length && !showLoading">
          <label class="sp pl-15 mr-15 mb-0" for="cbLow"><input id="cbLow" class="cb" type="radio" name="setting" value="High" checked="" v-model="setting" />High </label>
          <label class="sp pl-15 mr-15 mb-0" for="cbAvg"><input id="cbAvg" class="cb" type="radio" name="setting" value="Avg" v-model="setting" />Avg  </label>
          <label class="sp pl-15 mr-15 mb-0" for="cbHight"><input id="cbHight" class="cb" type="radio" name="setting" value="Low" v-model="setting" />Low </label>
          <select class="symbol" name="symbol" v-model="symbol">
            <option v-for="item in pairs3" :value="item.key" :key="item.key">{{ item.setting }}</option>
          </select>
        </div>
        <div class="h-330 mt-15">
          <LineStock ref="lineStock" :chart="lineStock" :option="lineStockOptions" v-if="lineStock.length && !showLoading" />
          <div class="h-330 flex mid center bg-white" v-else>
            <img src="https://fx-on.com/img/spread/loading.gif" alt="" />
          </div>
        </div>
        <table class="table-full fs-12 bg-white table02 mt-20" v-if="realtimeBrokers">
          <thead>
            <tr class="row-middle-all bg-co-12 text-center w-full co-white h-30">
              <th class="w-40">#</th>
              <th>{{ $t('11') }}</th>
              <th class="w-60" v-for="(_pair, i) in pairs" :key="i">{{ _pair }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(brk, index) in realtimeBrokers">
              <tr class="row-middle-all h-30" v-if="realtimeData && brk.id != 265" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td>
                  <div class="flex space-between">
                    <div class="w-120 wrap-text" :title="brk.name">
                      <a class="ho-change no-dec" :href="brk.newUrl || '/companies/' + brk.id" v-if="brk.url">{{ brk.name }}</a>
                      <div v-else :title="brk.name">{{ brk.name }}</div>
                    </div>
                    <div>
                      <span class="real fs-11" v-if="brk.real">{{ $t('29') }}</span>
                    </div>
                  </div>
                </td>
                <td v-for="(item, idx) in pairs" class="text-center" :key="idx" :id="brk.id + '_' + idx + '_td'">
                  <a :href="`/markets/spreads/${brk.id}/${idx}`" :id="brk.id + '_' + idx + '_a'">
                    {{ getDataRealTime(brk.id, idx) }}
                  </a>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="w-360  p-20 bg-co-59 ">
        <div class="flex mid space-between">
          <a href="/markets/charts" class="pl-10 spread-title fs-16">
            {{ $t('10') }}
          </a>
          <ShowMore01 class="fs-13" target="/markets/charts" />
        </div>
        <a class="bg-white flex mt-20 w-full cursor-pointer no-underlying"
           :href="`/markets/charts/${parseInt(symbol) + 1}/2`"
        >
          <img :src="imgSrc" alt="" class="chart-img h-100" />
          <div class="ml-10 mr-10 w-full">
            <div class="border-bottom co-custom pt-5 pb-5 w-full flex mid">
              <flags :pair="pair" />
              <b class="ml-20">{{ $t('p' + pair) }}</b>
            </div>
            <div class="flex space-between">
              <div>
                {{ $t('13') }}
                <br />
                {{ bid }}
              </div>
              <div>
                {{ $t('14') }}
                <br />
                {{ ask }}
              </div>
            </div>
          </div>
        </a>
        <table class="table03 mt-15 border-all w-full">
          <thead>
            <tr class="header2 co-white border-bottom border-left border-right">
              <th class="w-150 text-left pl-10">{{ $t('12') }}</th>
              <th class="text-left">{{ $t('13') }}</th>
              <th class="text-left">{{ $t('14') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr v-for="item in cfdData" class="row-middle-all h-35 cursor-pointer" v-if="pairs2[item.newSymbol]" :key="'XZlw0' + item.symbol" @click="changePair(item)">
              <td class="pl-10">
                <div class="flex mid">
                  <flags :pair="item.newSymbol" />
                  <span class="ml-20">{{ $t('p' + item.newSymbol) }}</span>
                </div>
              </td>
              <td :id="'bid_' + item.symbol">{{ item.bid }}</td>
              <td :id="'ask_' + item.symbol">{{ item.ask }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/spread.json'
import Flags from '@/components/spread/flags.vue'
import LineStock from '@@/../components/charts/LineStock01.vue'
import Star from '@@/../components/icons/Star.vue'
import ShowMore01 from '@/components/common/ShowMore01.vue'
import title from '@@/../common/pages'
const obj = Object.assign(
  {
    components: {
      Flags,
      LineStock,
      Star,
      ShowMore01,
    },
    data() {
      return {
        URL: '/api/v3/surface/spread',
        market: null,
        brokers: null,
        lineStock: [],
        realtimeBrokers: [],
        realtimeData: {},
        pairs: {
          1: 'USD/JPY',
          3: 'EUR/JPY',
          8: 'EUR/USD',
          2: 'GBP/JPY',
          9: 'GBP/USD',
          4: 'AUD/JPY',
        },
        pairs2: {
          1: 'USD/JPY',
          3: 'EUR/JPY',
          8: 'EUR/USD',
          2: 'GBP/JPY',
          9: 'GBP/USD',
          4: 'AUD/JPY',
          11: 'AUD/USD',
          7: 'NZD/JPY',
          6: 'CAD/JPY',
          5: 'CHF/JPY',
          12: 'USD/CHF',
          36: 'ZAR/JPY',
          10: 'NZD/USD',
        },
        revertMaps: {
          0: 1,
          1: 3,
          2: 8,
          4: 2,
          8: 9,
          3: 4,
          12: 11,
          5: 7,
          6: 6,
          7: 5,
          10: 11,
          11: 36,
          13: 10,
        },
        currentTime: new Date(),
        showLoading: true,
        cfdData: [],
        lineStockOptions: {
          split: true,
          height: 330,
          navigator: false,
          rangeSelector: true,
          margin: 30,
          legend: {
            enabled: false,
          },
          scrollbar: {
            enabled: false,
          },
          buttonPosition: {
            align: 'left',
            y: -15,
          },
          inputPosition: {
            align: 'right',
            x: -10,
            y: -15,
          },
        },
      }
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      imgSrc() {
        if (!this.pair) {
          return
        }
        let _pairReq = this.pairs2[this.pair].replace('/', '')
        return `https://chart.gogojungle.co.jp/chart/${_pairReq}/${_pairReq}M1.png?${this.formatTime(
          this.currentTime,
          18
        )}`
      },
    },
    watch: {
      setting() {
        this.lineStockOptions.title = `${this.pairs2[this.symbol]} ${
          this.setting
        } Spread`
        this.getDataChart()
      },
      symbol() {
        this.lineStockOptions.title = `${this.pairs2[this.symbol]} ${
          this.setting
        } Spread`
        this.getDataChart()
      },
    },
    async asyncData({ app }) {
      let [market, brokers] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/spread/market'),
          app.GoGoHTTP.get('/api/v3/surface/spread/company'),
        ]),
        pairs3 = [
          {
            key: 1,
            setting: 'USD/JPY',
          },
          {
            key: 3,
            setting: 'EUR/JPY',
          },
          {
            key: 8,
            setting: 'EUR/USD',
          },
          {
            key: 2,
            setting: 'GBP/JPY',
          },
          {
            key: 9,
            setting: 'GBP/USD',
          },
          {
            key: 4,
            setting: 'AUD/JPY',
          },
        ],
        locale = app.i18n.locale,
        bid = 0,
        ask = 0,
        pair = 1,
        symbol = 1,
        setting = 'Low'
      return {
        market,
        brokers,
        bid,
        ask,
        pair,
        symbol,
        setting,
        pairs3,
        titleChunk: i18n[locale][36],
        descriptionTemplate() {
          return i18n[locale][35]
        },
        linkMeta: [
          { rel: 'canonical', href: 'https://www.gogojungle.co.jp/markets' },
        ],
      }
    },
    mounted() {
      this.getDataChart()
      this.onGetDataRealTimeBrokers()
      this.onGetCfdData()
    },
    methods: {
      getDataRealTime(brkId, _pair) {
        if (!this.realtimeData[brkId]) {
          return '-'
        }
        let _data =
          this.realtimeData[brkId].filter(item => {
            return (parseInt(item.Symbol) === parseInt(_pair))
          })[0] || []
        return _data.Spread || '-'
      },
      onGetDataRealTimeBrokers() {
        let me = this
        this.GoGoHTTP.get(me.URL + '/realtime').then(data => {
          if (data) {
            me.$set(me, 'realtimeBrokers', data)
            data.forEach(item => {
              me.onGetDataRealTime(item.id)
            })
          }
        })
      },
      onGetDataRealTime(_id) {
        let me = this
        me.GoGoHTTP.get('/api/spread_realtime.php', {
          baseURL: process.env.FXON_BLOG_URL,
          params: {
            id: _id,
            callback: '?',
          },
        })
          .then(data => {
            data = data.substring(2, data.length - 2)
            data = JSON.parse(data)
            for (let props in data) {
              if (data[props].Spread !== 0) {
                let el = $(
                    '#' +
                      _id +
                      '_' +
                      data[props].Symbol +
                      '_td'
                  ),
                  ela = $(
                    '#' +
                      _id +
                      '_' +
                      data[props].Symbol +
                      '_a'
                  ),
                  _number = parseFloat(el.text()),
                  _spread = parseFloat(data[props].Spread).toFixed(1)
                ela.text(_spread || '-')
                if (_number < _spread) {
                  el.css('background-color', '#fee4e4')
                } else if (_number > _spread) {
                  el.css('background-color', '#dffedf')
                }
                setTimeout(() => {
                  el.css('background-color', '#fff')
                }, 1500)
              }
            }
            me.realtimeData[_id] = data
          })
          .finally(() => {
            setTimeout(() => {
              me.onGetDataRealTime(_id)
            }, 5000)
          })
      },
      getDataChart() {
        let me = this
        this.showLoading = true
        me.lineStock = []
        me.brokers.forEach(item => {
          if (item.id === 265) {
            return
          }
          me.GoGoHTTP.get('/api/v3/spread/performance', {
            params: {
              id: item.id,
              symbol: me.symbol,
              setting: me.setting,
              dayago: 7,
              callback: '?',
            },
          })
            .then(data => {
              me.lineStock.push({
                name: item.name,
                data: data,
                id: item.id,
              })
            })
            .finally(() => {
              me.showLoading = false
            })
        })
      },
      changePair(item) {
        this.pair = item.symbol
        this.bid = item.bid
        this.ask = item.ask
        this.currentTime = item.time
        location.href = `/markets/charts/${parseInt(item.symbol) + 1}/2`
      },
      onGetCfdData() {
        // TODO: hieunt - chart remove redirect
        // this.GoGoHTTP.get('/api/v3/rate/chart')
        this.GoGoHTTP.get('/chart/', {
          baseURL: 'https://rate.gogojungle.co.jp',
        })
          .then(data => {
            this.cfdData = data
            data
              .map(item => {
                item.newSymbol = this.revertMaps[item.symbol]
                return item
              })
              .forEach(item => {
                if (
                  !Object.keys(this.pairs2)
                    .map(i => parseInt(i))
                    .includes(item.symbol)
                ) {
                  return
                }
                if (item.symbol === this.pair) {
                  this.bid = item.bid
                  this.ask = item.ask
                  this.currentTime = item.time
                }
                let el1 = $('#bid_' + item.symbol),
                  el2 = $('#ask_' + item.symbol),
                  _number1 = parseFloat(el1.text()),
                  _number2 = parseFloat(el2.text()),
                  _new1 = item.bid,
                  _new2 = item.ask
                if (_number1 < _new1) {
                  el1.css('background-color', '#fee4e4')
                } else if (_number1 > _new1) {
                  el1.css('background-color', '#dffedf')
                }
                if (_number2 < _new2) {
                  el2.css('background-color', '#fee4e4')
                } else if (_number2 > _new2) {
                  el2.css('background-color', '#dffedf')
                }
                setTimeout(() => {
                  el1.css('background-color', '#fff')
                  el2.css('background-color', '#fff')
                }, 2000)
              })
          })
          .finally(() => {
            setTimeout(() => {
              this.onGetCfdData()
            }, 5000)
          })
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.co-white {
  color: white;
}
.co-black {
  color: black;
}
.bg-white {
  background: white;
}
.center-banner {
  width: 1000px;
  height: 180px;
}
.h-300 {
  height: 300px;
}
.h-330 {
  height: 330px;
}
.h-30 {
  height: 30px;
}
.h-35 {
  height: 35px;
}
.h-10 {
  height: 10px;
}
.w-40 {
  width: 40px;
}
.w-60 {
  width: 60px;
}
.w-70 {
  width: 70px;
}
.w-80 {
  width: 80px;
}
.w-90px {
  width: 90px;
}
.w-120 {
  width: 120px;
}
.w-360 {
  width: 360px;
}
.w-full {
  width: 100%;
}
.market-title {
  font-size: 26px;
  color: #a40000;
}
.h-100 {
  height: 100px;
}
.co-custom {
  color: #a40000;
}
.table01 {
  td,
  th {
    border: 1px solid #b4b5b6;
  }
}
.table-full {
  width: 100%;
  table-layout: fixed;
}
.table02 {
  tr {
    border-bottom: 1px solid #b4b5b6;
    border-left: 1px solid #b4b5b6;
    border-right: 1px solid #b4b5b6;
  }
  th {
    font-weight: normal;
  }
}
td,
th {
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 12px;
  .icon-cls {
    width: 22px;
    height: 22px;
  }
}
th {
  text-align: center;
}
.table03 {
  tr {
    border-bottom: 1px solid #b4b5b6;
    border-left: 1px solid #b4b5b6;
    border-right: 1px solid #b4b5b6;
  }
  th {
    text-align: left;
  }
  td {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.header {
  background-color: #a40000;
}
.header2 {
  background-color: #000;
}
.co-star {
  color: #f90;
}
.spread-title {
  color: #2d2d2d;
  border-left: 3px solid rgb(178, 178, 178);
  padding: 5px 0 5px 5px;
  text-decoration: none;
  &:hover {
    opacity: 0.8;
  }
  .icon-cls {
    width: 18px;
    height: 18px;
  }
}
.chart-container {
  width: 620px;
  position: relative;
}
.select-content {
  position: absolute;
  float: right;
  right: 40px;
  z-index: 8;
  top: 72px;
}
.bg-co-12 {
  background-color: #f60;
}
.chart-img {
  flex: 0 0 150px;
}
.real {
  background: #00623d;
  border-radius: 3px;
  padding: 0 2px;
  color: white;
}
.foreing {
  background: #156fe2;
  border-radius: 3px;
  padding: 0 2px;
  color: white;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
.bg-co-59 {
  background: #ededed;
}
.symbol {
  margin-left: 5px;
}
.no-dec {
  text-decoration: none;
}
.ho-change {
  color: black;
  &:hover {
    color: gray;
  }
}
.sp {
  display: inline-block;
  text-indent: -15px;
  line-height: 15px;
  &:hover {
    cursor: pointer;
  }
}
.cb {
  width: 13px;
  height: 13px;
  padding: 0;
  margin: 0;
  vertical-align: bottom;
  position: relative;
  top: -1px;
  *overflow: hidden;
}
.fs-10 {
  font-size: 10px;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>