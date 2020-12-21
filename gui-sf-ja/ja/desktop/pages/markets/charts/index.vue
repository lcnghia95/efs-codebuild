<template>
  <div class="w-1000 pos-rel">
    <!-- info -->
    <top-info :symbol-real-time="symbolRealTime" :symbols="symbols" />
    <!-- list -->
    <div>
      <div class="flex layout-col fxchart">
        <div>
          <p class="fs-22 mt-10">{{ $t('1') }}</p>
        </div>
        <div class="time-frame-area pt-10 pl-30">
          <div v-for="(item, idx) in timeFrameArea" :class="'tf-'+item.class" :id="'tf-'+(idx)" :key="idx" @click="updateTimeFrameAll(idx)">{{ $t(item.key) }}</div>
        </div>
        <div class="flex flex-wrap frame">
          <template v-for="(item, idx) in charts">
            <div class="small-chart-area" :id="'chart' + item.symbol" :key="idx" v-if="show(item.symbol)">
              <div class="flex small-chart-title" :title="$t(symbols[item.symbol])">
                <flags :pair="item.symbol" />
                <a :href="'/markets/charts/' + (item.symbol+1) +'/'+(selectedTimeFrame+1)" :key="idx" class="flex">
                  <span class="ml-15">{{ $t(symbols[item.symbol]) }}</span>
                </a>
              </div>
              <div class="pb-20">
                <div class="flex pl-8 pr-8">
                  <div class="rate-area">
                    <span class="rate-span">{{ $t('2') }}:</span>
                    <br />
                    <p :class="'p'+item.vary.bid">
                      <span v-if="item.vary.bid < 2">▼</span>
                      <span v-if="item.vary.bid > 2">▲</span>
                      <span class="bid-span">{{ formatMoney(item.bid, item.symbol + 1) }}</span>
                    </p>
                  </div>
                  <div class="rate-area">
                    <span class="rate-span">{{ $t('3') }}:</span>
                    <br />
                    <p :class="'p'+item.vary.ask">
                      <span v-if="item.vary.ask < 2">▼</span>
                      <span v-if="item.vary.ask > 2">▲</span>
                      <span class="ask-span">{{ formatMoney(item.ask, item.symbol + 1) }}</span>
                    </p>
                  </div>
                </div>
                <div class="chart-area">
                  <a :href="'/markets/charts/' + (item.symbol+1) +'/'+(selectedTimeFrame+1)" v-if="symbols[item.symbol]">
                    <img :src="'https://chart.gogojungle.co.jp/chart/' + symbols[item.symbol] + '/' + symbols[item.symbol] + timeFrameArea[selectedTimeFrame].key +'.png?20191291427'" alt="" @error="setNoImg(item.symbol)" />
                  </a>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/charts.json'
import flags from '@/components/market/charts/flags.vue'
import TopInfo from '@/components/market/charts/TopInfo.vue'
const obj = Object.assign(
  {
    components: {
      flags,
      TopInfo,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        ditgits: {
          1: 3,
          2: 3,
          3: 5,
          4: 3,
          5: 3,
          6: 3,
          7: 3,
          8: 3,
          9: 3,
          10: 5,
          11: 5,
          12: 3,
          13: 5,
          14: 5,
          15: 5,
          16: 3,
          17: 3,
          18: 5,
          19: 5,
          20: 5,
          21: 5,
          22: 5,
          23: 0,
          24: 1,
          25: 1,
          26: 1,
          27: 2,
          28: 3,
          29: 1,
          30: 2,
          31: 0,
          32: 0,
          33: 2,
          default: 5,
        },
        hiddenList: [],
        selectedTimeFrame: 0,
        timeFrameArea: [
          {
            key: 'M1',
            class: 'selected', //default this frame is selected
          },
          {
            key: 'M5',
            class: 'not-selected',
          },
          {
            key: 'M15',
            class: 'not-selected',
          },
          {
            key: 'M30',
            class: 'not-selected',
          },
          {
            key: 'H1',
            class: 'not-selected',
          },
          {
            key: 'H4',
            class: 'not-selected',
          },
          {
            key: 'D1',
            class: 'not-selected',
          },
          {
            key: 'W1',
            class: 'not-selected',
          },
        ],
        symbols: {
          0: 'USDJPY',
          1: 'EURJPY',
          2: 'EURUSD',
          3: 'AUDJPY',
          4: 'GBPJPY',
          5: 'NZDJPY',
          6: 'CADJPY',
          7: 'CHFJPY',
          8: 'HKDJPY',
          9: 'GBPUSD',
          10: 'USDCHF',
          11: 'ZARJPY',
          12: 'AUDUSD',
          13: 'NZDUSD',
          14: 'EURAUD',
          15: 'TRYJPY',
          16: 'SGDJPY',
          17: 'EURGBP',
          18: 'EURCHF',
          19: 'GBPCHF',
          20: 'USDHKD',
          21: 'EURDKK',
          22: 'JP225Cash',
          23: 'US30Cash',
          24: 'US100Cash',
          25: 'US500Cash',
          26: 'GOLD',
          27: 'SILVER',
          28: 'GER30Cash',
          29: 'UK100Cash',
          30: 'HK50Cash',
          31: 'BTCJPY',
          32: 'WTI',
        },
      }
    },
    async asyncData({ app }) {
      let charts = [],
        symbolRealTimeCfg = [22, 24, 0, 25, 26, 31],
        symbolRealTime = [],
        locale = app.i18n.locale
      symbolRealTime = symbolRealTimeCfg.map(item => {
        return {
          ask: 0,
          bid: 0,
          oldAsk: 0,
          oldBid: 0,
          status: 2,
          symbol: item,
          vary: '0.00',
        }
      })
      for (let i = 0; i < 33; i++) {
        charts.push({
          ask: 0,
          bid: 0,
          open: 0,
          symbols: i,
          vary: {
            ask: 2,
            bid: 2,
          },
        })
      }
      return {
        charts,
        symbolRealTime,
        symbolRealTimeCfg,
        titleChunk: i18n[locale][1],
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/markets/charts',
          },
        ],
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      // get data in firts time and start realtime
      getData() {
        this.GoGoHTTP.get(`/api/v3/rate/chart?d=1`)
          .then(data => {
            this.charts = data
            this.charts.forEach(item => {
              item.vary = {
                bid: 2,
                ask: 2,
                vary: {
                  ask: 2,
                  bid: 2,
                },
              }
            })
            this.symbolRealTime = this.symbolRealTimeCfg.map(symbol => {
              let temp = {}
              this.charts.forEach(item => {
                if (symbol == item.symbol) {
                  temp = {
                    symbol: item.symbol,
                    ask: item.ask,
                    bid: item.bid,
                    oldBid: item.bid,
                    status: 2,
                    vary: 0,
                  }
                }
              })
              return temp
            })
          })
          .finally(this.getSymbolRealTime)
      },
      // Update time frame on click
      updateTimeFrameAll(idx) {
        this.timeFrameArea[this.selectedTimeFrame].class = 'not-selected'
        this.selectedTimeFrame = idx
        this.timeFrameArea[this.selectedTimeFrame].class = 'selected'
      },
      // Show info increase or decrease
      updateInfo(newChart, oldChart) {
        let array = this.symbolRealTimeCfg.map(symbol => {
          //
          let idx = 0,
            status = 2,
            vary = 0
          // Find and get item
          newChart.forEach((item, index) => {
            if (item.symbol == symbol) {
              idx = index
            }
          })
          //
          vary =
            ((newChart[idx].bid - oldChart[idx].bid) / newChart[idx].bid) * 100
          // status 3: increase | 2: no change | 1: decerase
          if (vary > 0) {
            status = 3
          } else if (vary < 0) {
            status = 1
          }
          //
          return {
            symbol: newChart[idx].symbol,
            bid: newChart[idx].bid,
            ask: newChart[idx].ask,
            oldAsk: oldChart[idx].ask,
            oldBid: oldChart[idx].bid,
            status,
            vary,
          }
        })
        this.symbolRealTime = array
      },
      // Show chart increase or decrease
      showChange(data, oldData) {
        data.forEach((item, idx) => {
          let el = $('#chart' + item.symbol)
          if (item.ask > oldData[idx].ask) {
            $('#chart' + item.symbol + ' .ask-label').css('color', 'blue')
          } else if (item.ask < oldData[idx].ask) {
            $('#chart' + item.symbol + ' .ask-label').css('color', 'red')
          }
          if (item.bid > oldData[idx].bid) {
            $('#chart' + item.symbol + ' .bid-label').css('color', 'blue')
          } else if (item.bid < oldData[idx].bid) {
            $('#chart' + item.symbol + ' .bid-label').css('color', 'red')
          }
          if (item.bid > oldData[idx].bid && item.ask > oldData[idx].ask) {
            el.attr('class', 'small-chart-area themes-1')
          } else if (
            item.bid < oldData[idx].bid &&
            item.ask < oldData[idx].ask
          ) {
            el.attr('class', 'small-chart-area themes-2')
          }
          setTimeout(() => {
            el.attr('class', 'small-chart-area')
            $('#chart' + item.symbol + ' .bid-label').css('color', 'black')
            $('#chart' + item.symbol + ' .ask-label').css('color', 'black')
          }, 5000)
        })
      },
      //
      getSymbolRealTime() {
        let oldChart = this.charts
        this.GoGoHTTP.get(`/api/v3/rate/chart?d=1`)
          .then(data => {
            if (data) {
              this.showChange(data, oldChart)
              this.updateInfo(data, oldChart)
              this.charts = this.cmpFormatData(data, oldChart)
            }
          })
          .finally(setTimeout(this.getSymbolRealTime, 8000))
      },
      // In put is new data, format and compare it then return
      cmpFormatData(data, oldChart) {
        return data.map((item, idx) => {
          let vary = {
            ask: 2,
            bid: 2,
          }
          if (item.ask > oldChart[idx].ask) {
            vary.ask = 3
          } else if (item.ask < oldChart[idx].ask) {
            vary.ask = 1
          }
          if (item.bid > oldChart[idx].bid) {
            vary.bid = 3
          } else if (item.bid < oldChart[idx].bid) {
            vary.bid = 1
          }
          item.vary = vary
          return item
        })
      },
      // If img is not found, get this imd
      setNoImg(symbol) {
        let img = 'https://chart.gogojungle.co.jp/chart/chart_nodata.jpg'
        $('#chart' + symbol + ' img').attr('src', img)
      },
      formatMoney(n, pair) {
        let s = n
          ? n
              .toFixed(this.ditgits[pair || 'default'] || 2)
              .replace(/\d(?=(\d{3})+\.)/g, '$&,')
          : 0
        if (!this.ditgits[pair]) {
          s = s.toString().slice(0, s.length - 3)
        }
        return s
      },
      show(n) {
        // n is not in hiddenList => true
        let array = this.hiddenList.filter(item => {
          return item == n
        })
        return !(array.length > 0)
      },
      descriptionTemplate() {
        return this.$t('23')
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.pr-8 {
  padding-right: 8px;
}
.pl-8 {
  padding-left: 8px;
}
.p1 {
  color: #ff133d;
}
.p2 {
  color: black;
}
.p3 {
  color: #2a7dff;
}
.col-1 {
  color: rgb(229, 69, 93);
}
.col-2 {
  color: white;
}
.col-3 {
  color: #39f;
}
.fl-r {
  float: right;
}
.fs-12 {
  font-size: 12px;
}
.fs-14 {
  font-size: 14px;
}
.fs-16 {
  font-size: 16px;
}
.fs-22 {
  font-size: 22px;
}
.fs-28 {
  font-size: 28px;
}
.co-white {
  color: white;
}
.bg-10 {
  background: repeating-linear-gradient(
    -45deg,
    rgb(56, 51, 51),
    rgb(29, 29, 29) 1%,
    white 1%
  );
}
.h-80 {
  height: 80px;
}
.w-350 {
  width: 350px;
}
.br {
  border-right: 1px solid grey;
}
.info-item {
  padding: 7px 0;
  border-bottom: 1px solid grey;
  flex-direction: column;
  min-width: 320px;
  height: 100%;
  .offset-0 {
    border: none;
  }
  .offset-1 {
    border-left: 1px solid grey;
    border-right: 1px solid grey;
  }
  .offset-2 {
    border: none;
  }
}
.info-title {
  order: 1;
}
.info-content {
  order: 2;
  p {
    margin: 5px 0 0 0;
    transition: all 1s ease;
  }
}
.time-frame-area {
  background-color: black;
  color: white;
  width: 100%;
  font-size: 18px;
  height: 40px;
  div {
    font-size: 12px;
    float: left;
    min-width: 70px;
    text-align: center;
    height: 30px;
    padding-top: 7px;
  }
}
.tf-not-selected {
  transition: color 0.3s, background-color 0.3s, box-shadow 0.3s, transform 0.3s;
  &:hover {
    background: white;
    color: black;
    cursor: pointer;
  }
}
/deep/ .div-coin {
  margin: 1px;
}
.tf-selected {
  transition: color 0.3s, background-color 0.3s, box-shadow 0.3s, transform 0.3s;
  background-color: #fff;
  color: black;
  cursor: pointer;
}
.frame {
  background: #fff;
  margin: 0 0 15px 0;
  overflow: hidden;
  margin-top: 10px;
}
.small-chart-area {
  width: 195px;
  height: 210px;
  display: block;
  float: left;
  border: 1px solid #e1e3e4;
  transition: 0.8s;
  margin: 2px;
  a {
    color: #a40000;
  }
  &:hover {
    border: 1px solid #ff9163;
  }
}
.themes-1 {
  background: rgb(223, 234, 248);
  div {
    background: rgb(223, 234, 248);
  }
  .small-chart-title {
    background: #a5cff9;
    .pos-rel {
      background: #a5cff9;
    }
  }
}
.themes-2 {
  background: rgb(251, 228, 234);
  div {
    background: rgb(251, 228, 234);
  }
  .small-chart-title {
    background: #f9b8c1;
    .pos-rel {
      background: #f9b8c1;
    }
  }
}
.select-area {
  width: 100%;
  display: block;
  float: left;
  text-align: center;
  padding: 10px 0 10px 0;
  background-color: #e1e3e4;
  transition: 0.8s;
  select {
    margin: 0 0 0 5px;
    cursor: pointer;
  }
}
.small-chart-title {
  font-size: 12px;
  height: 40px;
  padding: 10px;
  font-weight: bold;
  color: rgb(164, 0, 0);
  background: #e6e6e6;
  margin-bottom: 10px;
  line-height: 20px;
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
  }
}
.rate-area {
  width: 100%;
  float: left;
  display: block;
  font-weight: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 10px;
}
.rate-span {
  margin: 0 5px 0 0;
}
.bid-span {
  margin: 0 10px 0 0;
  font-weight: normal;
}
.ask-span {
  margin: 0;
  font-weight: normal;
}
.chart-area {
  background: #e6e6e6;
  height: 94px;
  img {
    width: 100%;
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>