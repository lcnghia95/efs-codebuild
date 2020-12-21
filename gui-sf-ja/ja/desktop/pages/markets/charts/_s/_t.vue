<template>
  <div>
    <div class="w-1000 pos-rel">
      <!-- info -->
      <top-info :symbol-real-time="symbolRealTime" :symbols="symbols" />
      <!-- detail -->
      <div class="mt-20">
        <div class="h-50 bg-black p-15 flex">
          <div class="flex">
            <flags :pair="s" />
            <span class="fs-20 co-white ml-20 title-detail-header">{{ $t(symbols[s]) }}</span>
          </div>
        </div>
        <div :class="'flex detail-container status-' + (detail.vary.val)">
          <div class="flex detail-item">
            <div class="title-detail">
              <span>{{ $t('2') }}<br />{{ $t('11') }}</span>
            </div>
            <div class="content-detail">
              <span v-if="detail.vary.bid > 2">▲</span>
              <span v-else-if="detail.vary.bid < 2">▼</span>
              <span>{{ formatMoney(detail.bid, s + 1) || '0' }}</span>
            </div>
          </div>
          <div class="flex detail-item">
            <div class="title-detail">
              <span>{{ $t('3') }}<br />{{ $t('12') }}</span>
            </div>
            <div class="content-detail">
              <span v-if="detail.vary.ask > 2">▲</span>
              <span v-else-if="detail.vary.ask < 2">▼</span>
              <span>{{ formatMoney(detail.ask, s + 1) || '0' }}</span>
            </div>
          </div>
          <div class="flex detail-item">
            <div class="title-detail">
              <span>{{ $t('9') }}<br />{{ $t('10') }}</span>
            </div>
            <div class="content-detail">
              <span v-if="detail.vary.change > 2">▲</span>
              <span v-else-if="detail.vary.change < 2">▼</span>
              <span>{{ formatMoney(detail.change, s + 1) || '0' }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- chart -->
      <div class="flex layout-col chart mt-20">
        <div class="time-frame-area pt-10 pl-30">
          <template v-for="(item, idx) in timeFrameArea">
            <div v-if="showTimeFrame(idx, 32)" :class="'tf-'+item.class" :id="'tf-'+(idx)" :key="idx" @click="changeRoute(idx+1)">
              {{ $t(item.key) }}
            </div>
          </template>
        </div>
        <div class="bg-11 flex layout-col mt-10 h-100">
          <div class="flex pl-60 mt-45 w-full">
            <div id="ma" class="chart-button status-2" @click="setChart('ma')">{{ $t('4') }}</div>
            <div id="band" class="chart-button status-2" @click="setChart('band')">{{ $t('5') }}</div>
            <div id="rsi" class="chart-button status-2" @click="setChart('rsi')">{{ $t('6') }}</div>
            <div id="macd" class="chart-button status-2" @click="setChart('macd')">{{ $t('7') }}</div>
          </div>
        </div>
        <div class="chart-area pl-50 pr-50 pb-25">
          <CandlestickChart :chart="dataChart" :option="lineStockOpt" />
        </div>
      </div>
      <!-- frame -->
      <div class="flex space-between frame pt-15">
        <table class="table" v-for="(data, idx) in dataFrames" :key="idx">
          <thead>
            <tr>
              <th class="column-1">{{ $t('8') }}</th>
              <th class="column-2">{{ $t('2') }}</th>
              <th class="column-3">{{ $t('3') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item,idxRow) in data">
              <tr :key="item.symbol" :id="'t'+idx+'-r'+idxRow">
                <td>
                  <a class="flex pl-10" :href="'/markets/charts/' + (item.symbol+1) + '/' + t">
                    <flags :pair="item.symbol" />
                    <span class="ml-15">{{ $t(symbols[item.symbol])|| '-' }}</span>
                  </a>
                </td>
                <template>
                  <td>{{ formatMoney(item.bid, item.symbol + 1) || '-' }}</td>
                  <td>{{ formatMoney(item.ask, item.symbol + 1) || '-' }}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import CandlestickChart from '@/components/market/charts/CandlestickChart.vue'
import flags from '@/components/market/charts/flags.vue'
import TopInfo from '@/components/market/charts/TopInfo.vue'
import i18n from '@@/lang/desktop/charts.json'
import { filterInt } from '@/utils/client/common'
const obj = Object.assign(
  {
    components: {
      flags,
      CandlestickChart,
      TopInfo,
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
        timeForGetChart: [
          60000,
          300000,
          900000,
          1800000,
          3600000,
          14400000,
          14400000,
          604800000,
        ],
        bands_dev: 2,
        bands_period: 20,
        rsi_period: 14,
        ma_period: 20,
        macd_sma_period: 12,
        macd_lma_period: 26,
        macd_signal_period: 9,
        selectedTimeFrame: 2,
        lineStockOpt: {
          tooltip: {
            split: false,
          },
          rangeSelector: false,
          navigator: false,
          chart: {
            marginRight: 50,
            height: 600,
            backgroundColor: 'rgba(242, 240, 237)',
            plotBackgroundColor: 'rgba(255, 255, 255)',
          },
          yAxis: [
            {
              height: '100%',
              labels: {
                align: 'right',
                x: 50,
              },
              lineWidth: 1,
            },
            {
              height: '0%',
              labels: {
                align: 'right',
                x: 50,
              },
              lineWidth: 1,
            },
            {
              height: '0%',
              labels: {
                align: 'right',
                x: 50,
              },
              lineWidth: 1,
            },
          ],
          plotOptions: {
            series: {
              dataLabels: { color: '#B0B0B3' },
              marker: { lineColor: '#333' },
            },
            boxplot: { fillColor: '#237EAE' },
            candlestick: { lineColor: '#237EAE' },
            errorbar: { color: 'white' },
            dataGrouping: {
              enabled: true,
              forced: true,
              groupPixelWidth: 2,
            },
          },
        },
        idxArray: {
          ma: -1,
          band: -1,
          macd: -1,
          rsi: -1,
        },
        ma: [],
        band: {
          plus_sigma: [],
          minus_sigma: [],
        },
        rsi: [],
        macd: [],
        macd_signal: [],
        statusChart: {
          ma: false,
          band: false,
          rsi: false,
          macd: false,
        },
        charts: [],
        rawData: [],
        dataChart: [],
        ohlc: [],
      }
    },
    i18n: {
      messages: i18n,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.t)) && !isNaN(filterInt(params.s))
    },
    async asyncData({ app, params, store, error }) {
      let s = params.s - 1, // because symbol start from 0, and s start from 1
        t = params.t,
        symbols = {
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
        timeFrameArea = [
          {
            key: 'M1',
            class: 'not-selected',
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
        dataFrames = [],
        symbolRealTimeCfg = [22, 24, 0, 25, 26, 31],
        tableConfig = [],
        symbolRealTime = [],
        charts = [],
        detail = {
          id: s,
          ask: 0,
          bid: 0,
          change: 0,
          vary: {
            // increase: 3, no-change: 2, decrease: 1
            val: 2,
            change: 2,
            ask: 2,
            bid: 2,
          },
        },
        locale = app.i18n.locale,
        descriptionText = {
          s: i18n['ja'][symbols[s]],
          t: i18n['ja'][(timeFrameArea[params.t - 1] || {}).key],
        },
        titleChunk = i18n[locale][24]
          .replace('{s}', i18n['ja'][symbols[s]])
          .replace('{t}', i18n['ja'][(timeFrameArea[params.t - 1] || {}).key])
      if (!symbols[params.s - 1] || !timeFrameArea[params.t - 1]) {
        return error({ statusCode: 404 })
      }
      store.commit('pushBC', {
        name: i18n[locale][symbols[s]],
        target: { path: `/markets/charts/${s + 1}/${t}` },
      })
      if (timeFrameArea[t - 1]) {
        timeFrameArea[t - 1].class = 'selected'
      }
      for (let i = 0; i < 3; i++) {
        // this page is have 3 table
        let temp = [],
          temp2 = []
        for (let k = 0; k < 11; k++) {
          temp.push(i * 11 + k)
          temp2.push({
            ask: 0,
            bid: 0,
            open: 0,
            symol: i * 11 + k,
          })
        }
        tableConfig.push(temp)
        dataFrames.push(temp2)
      }
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
        symbolRealTime,
        symbolRealTimeCfg,
        dataFrames,
        charts,
        tableConfig,
        timeFrameArea,
        locale,
        detail,
        s,
        t,
        symbols,
        titleChunk: titleChunk,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/markets/charts/${params.s}/${
              params.t
            }`,
          },
        ],
        descriptionText,
      }
    },
    mounted() {
      // this.getData()
      this.getRawDataChart()
    },
    methods: {
      getData() {
        this.GoGoHTTP.get(`/api/v3/rate/chart?d=1`).then(data => {
          this.charts = data
          this.charts.forEach(item => {
            if (item.symbol == this.s) {
              this.detail = {
                id: this.s,
                ask: item.ask,
                bid: item.bid,
                change: 0,
                vary: { val: 2, change: 2, ask: 2, bid: 2 },
              }
            }
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
            this.dataFrames = this.tableConfig.map(item => {
              return item.map(item => {
                let temp = {}
                this.charts.forEach(itemCharts => {
                  if (itemCharts.symbol == item) temp = itemCharts
                })
                return temp
              })
            })
          })
        })
      },
      getRawDataChart() {
        this.GoGoHTTP.get(`/api/v3/rate/chart/?s=${this.s + 1}&t=${this.t}`)
          .then(data => {
            let ohlc = []
            // data for candleStick chart
            for (let i = 40; i < data.length; i++) {
              ohlc.push([
                data[i][0],
                data[i][1],
                data[i][2],
                data[i][3],
                data[i][4],
              ])
            }
            this.ohlc = ohlc
            this.rawData = data
            this.dataChart.push({
              turboThreshold: 0,
              type: 'candlestick',
              name: i18n[this.locale][16],
              data: this.ohlc,
            })
          })
          .finally(() => {
            this.getDataRealTime()
            this.getChartRealTime()
          })
      },
      removeChart(nameChart) {
        // nameChart : 'ma' || 'band' || 'rsi' || 'macd'
        if (nameChart === 'band' || nameChart === 'macd') {
          let idx = this.idxArray[nameChart]
          Object.keys(this.idxArray).forEach(key => {
            if (this.idxArray[key] > idx) {
              this.idxArray[key] -= 2
            }
          })
          this.dataChart.splice(idx, 2)
          this.idxArray[nameChart] = -1
        } else {
          let idx = this.idxArray[nameChart]
          Object.keys(this.idxArray).forEach(key => {
            if (this.idxArray[key] > idx) {
              this.idxArray[key] -= 1
            }
          })
          this.dataChart.splice(idx, 1)
          this.idxArray[nameChart] = -1
        }
      },
      setChart(type) {
        let me = this,
          temp = !me.statusChart[type]
        switch (type) {
          case 'ma': {
            if (me.statusChart[type]) {
              //if charts have had 'ma', remove it
              if (this.dataChart.length == 2) {
                me.lineStockOpt.tooltip.split = false
              }
              me.removeChart(type)
            } else {
              me.maCalc()
              if (this.dataChart.length == 1) {
                me.lineStockOpt.tooltip.split = true
              }
              this.dataChart.push({
                type: 'line',
                name: i18n[this.locale][18] + '(' + this.ma_period + ')',
                color: 'red',
                data: this.ma,
              })
              this.idxArray[type] = this.dataChart.length - 1
            }
            break
          }
          case 'band': {
            if (me.statusChart[type]) {
              //if charts have had 'band', remove it
              if (this.dataChart.length == 3) {
                me.lineStockOpt.tooltip.split = false
              }
              me.removeChart(type)
            } else {
              me.bandCalc()
              if (this.dataChart.length == 1) {
                me.lineStockOpt.tooltip.split = true
              }
              this.dataChart.push({
                type: 'line',
                name:
                  i18n[this.locale][19] +
                  this.bands_dev +
                  'σ (' +
                  this.bands_period +
                  ')',
                color: 'green',
                data: this.band.plus_sigma,
              })
              this.dataChart.push({
                type: 'line',
                name:
                  i18n[this.locale][20] +
                  this.bands_dev +
                  'σ (' +
                  this.bands_period +
                  ')',
                color: 'green',
                data: this.band.minus_sigma,
              })
              this.idxArray[type] = this.dataChart.length - 2
            }
            break
          }
          case 'rsi': {
            if (me.statusChart['rsi']) {
              if (me.statusChart['macd']) {
                this.lineStockOpt.yAxis = [
                  {
                    height: '60%',
                    labels: {
                      align: 'right',
                      x: 50,
                    },
                    lineWidth: 1,
                  },
                  {
                    height: '0%',
                    labels: {
                      align: 'right',
                      x: 50,
                    },
                    lineWidth: 1,
                  },
                  {
                    top: '65%',
                    height: '35%',
                    labels: {
                      align: 'right',
                      x: 50,
                    },
                    lineWidth: 1,
                  },
                ]
              } else {
                this.lineStockOpt.yAxis = [
                  {
                    height: '100%',
                  },
                  {
                    height: '0%',
                  },
                  {
                    height: '0%',
                  },
                ]
              }
              if (this.dataChart.length == 2) {
                me.lineStockOpt.tooltip.split = false
              }
              me.removeChart(type)
            } else {
              me.rsiCalc()
              if (me.statusChart['macd']) {
                this.lineStockOpt.yAxis = [
                  {
                    height: '55%',
                  },
                  {
                    top: '58%',
                    height: '20%',
                  },
                  {
                    top: '80%',
                    height: '20%',
                  },
                ]
              } else {
                this.lineStockOpt.yAxis = [
                  {
                    height: '60%',
                  },
                  {
                    top: '65%',
                    height: '35%',
                  },
                  {
                    height: '0%',
                  },
                ]
              }
              if (this.dataChart.length == 1) {
                me.lineStockOpt.tooltip.split = true
              }
              this.dataChart.push({
                type: 'column',
                name: i18n[this.locale][17] + '(' + this.rsi_period + ')',
                color: 'red',
                data: this.rsi,
                yAxis: 1,
              })
              this.idxArray[type] = this.dataChart.length - 1
            }
            break
          }
          case 'macd': {
            if (this.statusChart[type]) {
              if (me.statusChart['rsi']) {
                this.lineStockOpt.yAxis = [
                  {
                    height: '60%',
                  },
                  {
                    height: '35%',
                  },
                  {
                    height: '0%',
                  },
                ]
              } else {
                this.lineStockOpt.yAxis = [
                  {
                    height: '100%',
                  },
                  {
                    height: '0%',
                  },
                  {
                    height: '0%',
                  },
                ]
              }
              if (this.dataChart.length == 3) {
                me.lineStockOpt.tooltip.split = false
              }
              this.removeChart(type)
            } else {
              if (me.statusChart['rsi']) {
                this.lineStockOpt.yAxis = [
                  {
                    height: '55%',
                  },
                  {
                    top: '58%',
                    height: '20%',
                  },
                  {
                    top: '80%',
                    height: '20%',
                  },
                ]
              } else {
                this.lineStockOpt.yAxis = [
                  {
                    height: '60%',
                  },
                  {
                    height: '0%',
                  },
                  {
                    top: '65%',
                    height: '35%',
                  },
                ]
              }
              me.macdCalc()
              if (this.dataChart.length == 1) {
                me.lineStockOpt.tooltip.split = true
              }
              me.dataChart.push({
                type: 'column',
                name:
                  i18n[this.locale][21] +
                  '(' +
                  this.macd_sma_period +
                  ',' +
                  this.macd_lma_period +
                  ',' +
                  this.macd_signal_period +
                  ')',
                color: 'red',
                data: this.macd,
                yAxis: 2,
              })
              me.dataChart.push({
                type: 'column',
                name:
                  i18n[this.locale][22] +
                  '(' +
                  this.macd_sma_period +
                  ',' +
                  this.macd_lma_period +
                  ',' +
                  this.macd_signal_period +
                  ')',
                color: 'green',
                data: this.macd_signal,
                yAxis: 2,
              })
              this.idxArray[type] = this.dataChart.length - 2
            }
            break
          }
          default:
            break
        }
        me.statusChart[type] = temp
        if (me.statusChart[type]) {
          $('#' + type).removeClass('status-2')
          $('#' + type).addClass('status-1')
        } else {
          $('#' + type).removeClass('status-1')
          $('#' + type).addClass('status-2')
        }
      },
      chartUpdate() {
        let ohlc = [],
          data = this.rawData
        for (let i = 40; i < data.length; i++) {
          ohlc.push([
            data[i][0],
            data[i][1],
            data[i][2],
            data[i][3],
            data[i][4],
          ])
        }
        this.dataChart[0].data = ohlc
        Object.keys(this.idxArray).forEach(key => {
          if (this.idxArray[key] > -1) {
            // update this chart with idx
            switch (key) {
              case 'rsi':
                this.rsiCalc()
                this.dataChart[this.idxArray[key]].data = this.rsi
                break
              case 'ma':
                this.maCalc()
                this.dataChart[this.idxArray[key]].data = this.ma
                break
              case 'band':
                this.bandCalc()
                this.dataChart[this.idxArray[key]].data = this.band.plus_sigma
                this.dataChart[
                  this.idxArray[key] + 1
                ].data = this.band.minus_sigma
                break
              case 'macd':
                this.macdCalc()
                this.dataChart[this.idxArray[key]].data = this.macd
                this.dataChart[this.idxArray[key]].data = this.macd_signal
                break
              default:
                break
            }
          }
        })
      },
      maCalc() {
        let historyData = this.rawData.slice(),
          ma = [],
          len = historyData.length,
          cal = 0,
          ma_period = 20
        while (len > ma_period) {
          let sum = 0,
            avg = 0
          for (let i = cal; i < ma_period + cal; i++) {
            sum += historyData[i][4]
          }
          avg = sum / ma_period
          avg = Number(avg.toFixed(this.ditgits[this.s + 1]))
          if (cal > 19) {
            ma.push([historyData[cal + parseInt(ma_period)][0], avg])
          }
          cal++
          len--
        }
        this.ma = ma
      },
      bandCalc() {
        let historyData = this.rawData.slice(),
          len = historyData.length,
          bands_period = 20,
          plus_sigma = [],
          minus_sigma = [],
          cal = 0,
          bands_dev = 2
        while (len > bands_period) {
          let sum = 0,
            sdev = 0,
            avg = 0
          for (let i = cal; i < bands_period + cal; i++) {
            sum += historyData[i][4]
          }
          avg = sum / bands_period
          for (let i = cal; i < bands_period + cal; i++) {
            sdev += (historyData[i][4] - avg) * (historyData[i][4] - avg)
          }
          sdev /= bands_period
          sdev = Math.sqrt(sdev)
          let plus = avg + sdev * bands_dev,
            minus = avg - sdev * bands_dev
          plus = Number(plus.toFixed(this.ditgits[this.s + 1]))
          minus = Number(minus.toFixed(this.ditgits[this.s + 1]))
          if (cal > 19) {
            plus_sigma.push([historyData[cal + bands_period][0], plus])
            minus_sigma.push([historyData[cal + bands_period][0], minus])
          }
          cal++
          len--
        }
        this.band.plus_sigma = plus_sigma
        this.band.minus_sigma = minus_sigma
      },
      rsiCalc() {
        let historyData = this.rawData.slice(),
          len = historyData.length,
          rsi = [],
          cal = 0,
          rsi_period = this.rsi_period

        while (len > rsi_period) {
          let sum = 0,
            plus = 0,
            res = 0
          for (let i = cal; i < rsi_period + cal; i++) {
            let temp = historyData[i][4] - historyData[i][1]
            sum += Math.abs(temp)
            if (temp > 0) {
              plus += temp
            }
          }
          res = (plus / sum) * 100
          res = Number(res.toFixed(this.ditgits[this.s + 1]))
          if (cal > 25) {
            rsi.push([historyData[cal + rsi_period][0], res])
          }
          cal++
          len--
        }
        this.rsi = rsi
      },
      macdCalc() {
        let fast = this.macd_sma_period, // macd_sma_period
          slow = this.macd_lma_period, // macd_lma_period
          signal = this.macd_signal_period, // macd_signal_period
          historyData = this.rawData.slice(),
          len1 = historyData.length,
          len2 = len1,
          len3 = len1,
          cal1 = 0,
          cal2 = 0,
          cal3 = 0,
          main1 = [],
          main2 = [],
          sub = [],
          macd = [],
          macd_signal = []

        while (len1 > cal1) {
          let sum1 = 0,
            sum2 = 0,
            fast_ema = 0,
            slow_ema = 0
          if (len1 > cal1 - fast && cal1 - fast >= 0) {
            for (let i = cal1 - fast; i < cal1; i++) {
              sum1 += historyData[i][4]
              if (i == cal1 - fast) {
                sum1 += historyData[i][4]
              }
            }
            fast_ema = sum1 / (fast + 1)
          }
          if (len1 > cal1 - slow && cal1 - slow >= 0) {
            for (let i = cal1 - slow; i < cal1; i++) {
              sum2 += historyData[i][4]
              if (i == cal1 - slow) {
                sum2 += historyData[i][4]
              }
            }
            slow_ema = sum2 / (slow + 1)
          }
          main1[cal1] = fast_ema
          main2[cal1] = slow_ema
          cal1++
        }
        while (len2 > cal2) {
          let res = main1[cal2] - main2[cal2]
          res = Number(res.toFixed(this.ditgits[this.s + 1]))
          if (cal2 > 39) {
            macd.push([historyData[cal2][0], res])
          }
          sub[cal2] = res
          cal2++
        }
        while (len3 > slow + signal) {
          let sum = 0,
            sig = 0
          for (let i = cal3 + slow; i < cal3 + slow + signal; i++) {
            sum += sub[i]
          }
          sig = sum / signal
          sig = Number(sig.toFixed(this.ditgits[this.s + 1]))
          if (cal3 > 4) {
            macd_signal.push([historyData[cal3 + slow + signal][0], sig])
          }
          cal3++
          len3--
        }
        macd.sort()
        macd_signal.sort()
        this.macd = macd
        this.macd_signal = macd_signal
      },
      getChartRealTime() {
        this.GoGoHTTP.get(`/api/v3/rate/chart/?s=${this.s + 1}&t=${this.t}`)
          .then(data => {
            if (data) {
              this.rawData = data
              this.chartUpdate()
            }
          })
          .finally(() => {
            setTimeout(
              this.getChartRealTime,
              this.timeForGetChart[this.t - 1] / 2
            )
          })
      },
      getDataRealTime() {
        let oldChart = this.charts
        this.GoGoHTTP.get(`/api/v3/rate/chart?d=1`)
          .then(data => {
            if (data && oldChart.length > 0 && data.length > 0) {
              let oldDataFrame = this.dataFrames
              this.charts = data
              this.divCharts()
              this.updateInfo(data, oldChart)
              this.updateDetail(data, oldChart)
              this.dataFrames.forEach((tableData, idxTb) => {
                tableData.forEach((item, idxRow) => {
                  let el = $('#t' + idxTb + '-r' + idxRow)
                  if (
                    item.bid > oldDataFrame[idxTb][idxRow].bid &&
                    item.ask > oldDataFrame[idxTb][idxRow].ask
                  ) {
                    el.children('*').css('background', '#e0ebf8')
                  } else if (
                    item.bid < oldDataFrame[idxTb][idxRow].bid &&
                    item.ask < oldDataFrame[idxTb][idxRow].ask
                  ) {
                    el.children('*').css('background', '#fbe5eb')
                  }
                  setTimeout(() => {
                    el.children('*').css('background', '')
                  }, 5000)
                })
              })
            }
          })
          .finally(() => {
            setTimeout(this.getDataRealTime, 8000)
          })
      },
      updateDetail(newChart, oldChart) {
        let item = newChart[0],
          change = 0,
          vary = {
            val: 2,
            change: 2,
            ask: 2,
            bid: 2,
          },
          itemOld = oldChart.length > 0 ? oldChart[0] : item
        newChart.forEach(i => {
          if (i.symbol == this.detail.id) {
            item = i
          }
        })
        oldChart.forEach(i => {
          if (i.symbol == this.detail.id) {
            itemOld = i
          }
        })
        if (item.ask > this.detail.ask) {
          vary.ask = 3
        } else if (item.ask < this.detail.ask) {
          vary.ask = 1
        }
        if (item.bid > this.detail.bid) {
          vary.bid = 3
        } else if (item.bid < this.detail.bid) {
          vary.bid = 1
        }
        if (vary.ask == vary.bid) {
          vary.val = vary.ask
        }
        if (this.rawData && this.rawData.length > 0) {
          change = item.bid - itemOld.bid
        }
        if (change > 0) {
          vary.change = 3
        } else if (change < 0) {
          vary.change = 1
        }
        this.detail.ask = item.ask
        this.detail.bid = item.bid
        this.detail.change = change
        this.detail.vary = vary
      },
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
          if (oldChart[idx].bid) {
            vary =
              ((newChart[idx].bid - oldChart[idx].bid) / newChart[idx].bid) *
              100
          }
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
      divCharts() {
        let dataTables = this.tableConfig.map(item => {
          return this.mapCharts(item)
        })
        this.dataFrames = dataTables
      },
      mapCharts(listSymbol) {
        return listSymbol.map(item => {
          let temp = {}
          this.charts.forEach(itemCharts => {
            if (itemCharts.symbol == item) {
              temp = itemCharts
            }
          })
          return temp
        })
      },
      changeRoute(idx) {
        location.href = `/markets/charts/${this.s + 1}/${idx}`
      },
      formatMoney(n, pair) {
        let s = n
          ? n
              .toFixed(this.ditgits[pair || 'default'] || 2)
              .replace(/\d(?=(\d{3})+\.)/g, '$&,')
          : parseFloat(0).toFixed(this.ditgits[pair])
        if (!this.ditgits[pair]) {
          s = s.toString().slice(0, s.length - 3)
        }
        return s
      },
      showTimeFrame(idx) {
        if (idx == 7 && this.s + 1 == 32) {
          return false
        }
        if (idx == 6 && this.s + 1 == 32) {
          return false
        }
        if (idx == 7 && this.s + 1 == 23) {
          return false
        }
        return true
      },
      descriptionTemplate() {
        let s = this.descriptionText.s,
          t = this.descriptionText.t
        return this.$t('25', { s, t })
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.h-800 {
  height: 800px;
}
.m-auto {
  margin: auto;
}
.pl-60 {
  padding-left: 60px;
}
.frame {
  width: 100%;
  margin-top: 5px;
}
.chart {
  height: 750px;
  width: 100%;
  .status-1 {
    background: rgb(248, 181, 81);
    color: rgb(255, 255, 255);
  }
  .status-2 {
    background: rgb(225, 227, 228);
    color: rgb(51, 51, 51);
  }
}
.chart-area {
  height: 100%;
  background: rgb(242, 240, 237);
}
.chart-button {
  float: left;
  padding: 8px 15px 8px 15px;
  margin-right: 15px;
  border-radius: 5px;
  text-align: center;
  min-width: 110px;
  background: rgb(225, 227, 228);
  color: rgb(51, 51, 51);
  cursor: pointer;
  user-select: none;
}
.detail-container {
  height: 60px;
  background: rgb(51, 153, 255);
  transition: 1s;
}
.detail-item {
  border-right: 1px solid black;
  margin: 15px;
  min-width: 150px;
}
.status-1 {
  background: rgb(229, 69, 93);
  color: white;
}
.status-2 {
  background: #e1e3e4;
  color: black;
}
.status-3 {
  background: #39f;
  color: white;
}
.title-detail {
  line-height: 14px;
  font-size: 11px;
  margin: auto 0;
  min-width: 45px;
}
.title-detail-header {
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.content-detail {
  font-size: 24px;
  padding: 0 10px;
  min-width: 150px;
  line-height: 30px;
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
.tf-selected {
  transition: color 0.3s, background-color 0.3s, box-shadow 0.3s, transform 0.3s;
  background-color: #fff;
  color: black;
  cursor: pointer;
}
.table {
  padding: 3px;
  width: 320px;
  font-size: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  th {
    padding: 5px 15px;
    background: rgb(242, 240, 237);
    color: black;
    font-size: 13px;
    border-top: 1px solid #d7d9db;
    border-bottom: 1px solid #d7d9db;
  }
  td {
    padding: 0 5px;
    height: 28px;
    line-height: 25px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-top: 1px solid #d7d9db;
    max-width: 100px;
    border-bottom: 1px solid #d7d9db;
  }
  tr {
    background: white;
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 1px solid #d7d9db;
    .column-1 {
      width: 50%;
    }
    .column-2 {
      max-width: 25%;
    }
    .column-3 {
      max-width: 25%;
    }
    a {
      color: black;
      text-decoration: none;
    }
    &:hover {
      background: #f5f5f5;
    }
  }
}
/deep/ .div-coin {
  margin: 5px 0;
}
.col-1 {
  color: rgb(229, 69, 93);
}
.col-2 {
  color: #e1e3e4;
}
.col-3 {
  color: #39f;
}
.co-white {
  color: white;
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
.fs-20 {
  font-size: 20px;
}
.fs-28 {
  font-size: 28px;
}
.fl-r {
  float: right;
}
.h-40 {
  height: 40px;
}
.h-80 {
  height: 80px;
}
.h-100 {
  height: 100px;
}
.w-240 {
  width: 240px;
}
.b-r {
  border-right: 1px solid black;
}
.bg-black {
  background: black;
}
.bg-11 {
  background: #f2f0ed;
}
.bg-10 {
  background: repeating-linear-gradient(
    -45deg,
    rgb(56, 51, 51),
    rgb(29, 29, 29) 1%,
    white 1%
  );
}
.img-loading {
  width: 50px;
  height: 50px;
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>