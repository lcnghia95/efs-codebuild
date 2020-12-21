<template>
  <div class="pb-50">
    <div class="top-title">{{ $t(3) }}</div>
    <!-- Top info -->
    <TopInfo :symbol-real-time="symbolRealTime" :symbols="symbols" />
    <div class="p-10">
      <!-- range time -->
      <div class="p-10 text-center" style="font-size: 17px; font-weight: bold;">{{ $t('title') }}</div>
      <TimeTab class="mt-5 mb-20" @tChanged="(data) => selectedTimeFrame = data.index" />
      <!-- chart items -->
      <div class="flex flex-wrap space-between">
        <div class="flex space-between chart-item mb-10"
             @click="itemOnClick(item)"
             :id="'chart' + item.symbol"
             :key="idx"
             v-for="(item, idx) in charts"
        >
          <div class="flex flex-wrap info-block space-between center">
            <div class="info-1 w-full">
              <flags :pair="item.symbol" class="mb-5" />
              <div v-wrap-lines="2" style="color: #a40000; font-weight: bold;">{{ $t(symbols[item.symbol]) }}</div>
            </div>
            <div class="info-2 w-full">
              <div class="rate-area">
                <span class="rate-span">{{ $t(1) }}:</span>
                <br />
                <p :class="'p'+item.vary.bid">
                  <span v-if="item.vary.bid < 2">▼</span>
                  <span v-if="item.vary.bid > 2">▲</span>
                  <span class="bid-span">{{ formatMoney(item.bid, item.symbol + 1) }}</span>
                </p>
              </div>
              <div class="rate-area">
                <span class="rate-span">{{ $t(2) }}:</span>
                <br />
                <p :class="'p'+item.vary.ask">
                  <span v-if="item.vary.ask < 2">▼</span>
                  <span v-if="item.vary.ask > 2">▲</span>
                  <span class="ask-span">{{ formatMoney(item.ask, item.symbol + 1) }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="chart-item-img flex mid">
            <img :src="'https://chart.gogojungle.co.jp/chart/' + symbols[item.symbol] + '/' + symbols[item.symbol] + timeFrameArea[selectedTimeFrame].key +'.png?20191291427'"
                 alt="" @error="setNoImg(item.symbol)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/markets-charts-index.json'
import TopInfo from '@/components/markets/charts/TopInfo.vue'
import flags from '@/components/markets/charts/flags.vue'
import TimeTab from '@/components/markets/charts/TimeTab.vue'

const obj = Object.assign(
  {
    components: {
      TopInfo,
      TimeTab,
      flags,
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
      let charts = await app.GoGoHTTP.get('/api/v3/rate/chart?d=1'),
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
      charts.forEach(item => {
        item.vary = {
          bid: 2,
          ask: 2,
          vary: {
            ask: 2,
            bid: 2,
          },
        }
      })
      return {
        charts,
        symbolRealTime,
        symbolRealTimeCfg,
        titleChunk: i18n[locale]['title'],
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
      itemOnClick(item) {
        location.href = `/markets/charts/${item.symbol + 1}/1`
      },
      // get data in firts time and start realtime
      getData() {
        this.GoGoHTTP.get(`/api/v3/rate/chart?d=1`)
          .then(data => {
            this.$set(this, 'charts', data)
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
          if (item.bid > oldData[idx].bid && item.ask > oldData[idx].ask) {
            el.attr('class', 'flex space-between chart-item mb-10 themes-1')
          } else if (
            item.bid < oldData[idx].bid &&
            item.ask < oldData[idx].ask
          ) {
            el.attr('class', 'flex space-between chart-item mb-10 themes-2')
          }
          setTimeout(() => {
            el.attr('class', 'flex space-between chart-item mb-10')
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
              let charts = this.cmpFormatData(data, oldChart)
              this.$set(this, 'charts', charts)
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
      descriptionTemplate() {
        return this.$t('des')
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
@media only screen and (min-width: 480px) {
  .chart-item {
    width: calc(50% - 10px) !important;
  }
}
.chart-item {
  height: 160px;
  width: 100%;
  box-shadow: 0 0 5px grey;
  border-radius: 5px;
  border: 1px solid #fff;
  &:active {
    border-color: orange;
  }
  .chart-item-img {
    overflow: hidden;
    max-width: 260px;
    padding-right: 10px;
    img {
      width: 100%;
      height: auto;
    }
  }
  &.themes-1 .info-block {
    background: #a5cff9;
    .info-1 {
      background: #a5cff9;
    }
    .info-2 {
      background: #dfeaf8;
      border-color: #a5cff9;
    }
  }
  &.themes-2 .info-block {
    background: #f9b8c1;
    .info-1 {
      background: #f9b8c1;
    }
    .info-2 {
      background: #f8dce0;
      border-color: #f9b8c1;
    }
  }
  .info-block {
    height: 158px;
    flex: 0 0 90px;
    margin-right: 5px;
    align-content: space-between;
    background: #e6e6e6;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    .info-1 {
      background: #e6e6e6;
      border-top-left-radius: 5px;
      height: 65px;
      padding: 8px;
      font-size: 15px;
      line-height: 16px;
    }
    .info-2 {
      background: #e6e6e6;
      border-bottom-left-radius: 5px;
      font-size: 14px;
      line-height: 16px;
      height: 90px;
      border-top: 1px solid #fff;
      padding: 8px;
    }
  }
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
.top-title {
  font-weight: bold;
  padding: 5px;
  line-height: 30px;
  color: #434343;
  background: #f3f0ef;
  font-size: 16px;
  border-bottom: 1px solid #d0d0d0;
}
</style>