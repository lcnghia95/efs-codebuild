<template>
  <div class="bg-white">
    <div class="top-title mb-10">{{ $t(1) }}</div>
    <!-- economic -->
    <LazyComp01 min-height="500px" class="cate-container">
      <div class="flex space-between mb-10 mid">
        <div class="title">
          {{ $t(2) }}
        </div>
        <a class="link-btn bg-white" :href="'/markets/economics'">
          {{ $t(3) }} 
          <AngleRight />
        </a>
      </div>
      <EconomicsTable :data="market" />
    </LazyComp01>
    <!-- spread -->
    <LazyComp01 min-height="760px" class="cate-container mt-15">
      <div class="flex space-between mb-10 mid">
        <div class="title">
          {{ $t(4) }}
        </div>
        <a class="link-btn bg-white" :href="'/markets/spreads'">
          {{ $t(3) }} 
          <AngleRight />
        </a>
      </div>
      <SpreadChart :chart="lineStock"
                   :is-loading="showLoading"
                   :options="{ legend:{ enabled: false }, chart: { height: 280, margin: [40, 5, 30, 5], } }"
                   @onSettingSelect="value => setting = value"
                   @onSymbolSelect="value => symbol = value"
      />
      <!-- spread table -->
      <table class="bg-white table02 mt-30 w-full" v-if="realtimeBrokers">
        <thead>
          <tr class="text-center h-30">
            <th style="width: 20px;">#</th>
            <th style="font-size: 1.4rem;">{{ $t(6) }}</th>
            <th style="width: 35px;" v-for="(_pair, i) in pairs" :key="i">{{ _pair }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(brk, index) in realtimeBrokers">
            <tr class="row-middle-all h-30" v-if="realtimeData && brk.id != 265" :key="index">
              <td class="text-center" style="color: #000;">{{ index + 1 }}</td>
              <td>
                <div class="p-5">
                  <div class="wrap-text" :title="brk.name">
                    <a class="ho-change no-dec" style="color: #000;" :href="brk.newUrl || '/companies/' + brk.id" v-if="brk.url">{{ brk.name }}</a>
                    <div v-else :title="brk.name">{{ brk.name }}</div>
                  </div>
                  <div>
                    <span class="real fs-11" v-if="brk.real">{{ $t(7) }}</span>
                  </div>
                </div>
              </td>
              <td v-for="(item, idx) in pairs" class="text-center" :key="idx" :id="brk.id + '_' + idx + '_td'">
                <a :href="`/markets/spreads/${brk.id}/${idx}`" :id="brk.id + '_' + idx + '_a'" style="color: #2e80cb;">
                  {{ getDataRealTime(brk.id, idx) }}
                </a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <!--  -->
    </LazyComp01>
    <!-- chart -->
    <LazyComp01 min-height="650px" class="cate-container mt-15 mb-50">
      <div class="flex space-between mb-10 mid">
        <div class="title" style="font-size: 16px; line-height: 22px; height: 41px;" v-html="$t(5)"></div>
        <a class="link-btn bg-white" :href="'/markets/charts'">
          {{ $t(3) }} 
          <AngleRight />
        </a>
      </div>
      <a class="bg-white flex mt-20 w-full cursor-pointer no-underlying p-5 space-between"
         :href="`/markets/charts/${parseInt(symbol) + 1}/2`"
      >
        <img :src="imgSrc" alt="" class="chart-img" />
        <div class="w-full" style="flex: 0 0 145px;">
          <div class="pt-5 pb-10 w-full flex mid space-between " style="border-bottom: 1px #b4b5b6 solid; color: #7d0000;">
            <flags :pair="pair" />
            <b>{{ $t('p' + pair) }}</b>
          </div>
          <div class="flex space-between pt-5" style="font-weight: bold;">
            <div>
              {{ $t(8) }}
              <br />
              {{ bid }}
            </div>
            <div>
              {{ $t(9) }}
              <br />
              {{ ask }}
            </div>
          </div>
        </div>
      </a>
      <div>
        <div class="bg-co-59 ">
          <table class="table03 mt-15 w-full">
            <thead>
              <tr class="header2 co-white border-bottom border-left border-right">
                <th class="w-150 text-left pl-10">{{ $t(10) }}</th>
                <th class="text-left">{{ $t(8) }}</th>
                <th class="text-left">{{ $t(9) }}</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <template v-for="item in cfdData">
                <tr class="cursor-pointer" style="height: 35px;" v-if="pairs2[item.newSymbol]" :key="'XZlw0' + item.symbol" @click="changePair(item)">
                  <td class="pl-10">
                    <div class="flex mid">
                      <flags :pair="item.newSymbol" />
                      <span class="ml-20">{{ $t('p' + item.newSymbol) }}</span>
                    </div>
                  </td>
                  <td class="p-5" :id="'bid_' + item.symbol">{{ item.bid }}</td>
                  <td class="p-5" :id="'ask_' + item.symbol">{{ item.ask }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </LazyComp01>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/markets-index.json'
import title from '@@/../common/pages'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import EconomicsTable from '@/components/markets/EconomicsTable.vue'
import SpreadChart from '@/components/markets/SpreadChart.vue'
import Flags from '@/components/markets/flags.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'


const obj = Object.assign(
  {
    components: {
      AngleRight,
      SpreadChart,
      EconomicsTable,
      Flags,
      LazyComp01,
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
          height: 230,
          navigator: false,
          rangeSelector: false,
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
        titleChunk: i18n[locale][16],
        descriptionTemplate() {
          return i18n[locale][15]
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
            }, 8000)
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
                data,
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
        this.GoGoHTTP.get(`/api/v3/rate/chart?d=1`)
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
.cate-container {
  padding: 15px 15px;

  /* background: #d0d0d0; */
  background: #f3f0ef;
  .title {
    color: #2d2d2d;
    border-left: 5px solid #b2b2b2;
    line-height: 39px;
    padding-left: 5px;
    height: 38px;
    font-weight: bold;
    font-size: 16px;
    min-width: 130px;
  }
  .link-btn {
    height: 38px;
    line-height: 38px;
    min-width: 80px;
    border: 1px solid #b2b2b2;
    border-radius: 20px;
    padding: 0 15px;
    color: #2d2d2d;
    .icon-cls {
      height: 12px;
      width: 15px;
      /deep/ svg {
        height: 15px;
      }
    }
  }
}
.top-title {
  font-weight: bold;
  padding: 5px;
  line-height: 30px;
  color: #434343;
  background: #f3f0ef;
  font-size: 16px;
  border-bottom: 1px solid #d0d0d0;
}
.table02 {
  font-size: 1.3rem;
  table-layout: fixed;
  tr {
    border-bottom: 1px solid #d6d6d6;
    border-right: 1px solid #d6d6d6;
    td:first-child {
      border-right: 1px solid #d6d6d6;
      border-left: 1px solid #d6d6d6;
    }
  }
  th {
    font-weight: normal;
    text-align: center;
    word-break: break-word;
    background: #e65c00;
    border-right: 1px solid #d45500;
    border-bottom: 1px solid #e65c00;
    padding: 7px 2px;
    color: #fff;
    font-size: 1.1rem;
  }
  th:first-child {
    border-top-left-radius: 5px;
  }
  th:last-child {
    border-top-right-radius: 5px;
    border-top: none;
    border-right: none;
  }
}
.real {
  background: #00623d;
  border-radius: 3px;
  padding: 0 2px;
  color: white;
}
.wrap-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chart-img {
  width: calc(100% - 155px);
  height: calc(100% - 93px);
}
.table03 {
  border-radius: 5px;
  overflow: hidden;
  tr {
    border-bottom: 1px solid #b4b5b6;
    border-left: 1px solid #b4b5b6;
    border-right: 1px solid #b4b5b6;
  }
  th {
    text-align: left;
    background-color: #000;
    color: #fff;
    height: 35px;
    border: none;
  }
  th:first-child {
    border-top-left-radius: 5px;
  }
  th:last-child {
    border-top-right-radius: 5px;
  }
  td {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
