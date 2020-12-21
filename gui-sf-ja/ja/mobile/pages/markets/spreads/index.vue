<template>
  <div>
    <div class="top-title mb-10">{{ $t(1) }}</div>
    <div class="mb-15 mt-10 text-center" style="font-size: 2rem;">{{ $t(2) }}</div>
    <SpreadChart :chart="lineStock"
                 class="p-10"
                 @onSettingSelect="value => setting = value"
                 :is-loading="inProgress"
                 @onSymbolSelect="value => pair = value"
    />
    <div class="p-10 pb-50" style="background: #eaeaea;">
      <div class="table-title">{{ $t(3) }}</div>
      <SpreadTable :data.sync="tableData"
                   class="mt-10 mb-5"
                   @onChangeSortType="onChangeSortType"
      />
      <div style="color: #f00; font-size: 15px; text-align: justify;">{{ $t(5) }}</div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/markets-spreads-index.json'
import title from '@@/../common/pages'
import SpreadChart from '@/components/markets/SpreadChart.vue'
import SpreadTable from '@/components/markets/SpreadTable.vue'
const obj = Object.assign(
  {
    components: {
      SpreadChart,
      SpreadTable,
    },
    data() {
      return {
        URL: '/api/v3/surface/spread',
        market: null,
        brokers: null,
        lineStock: [],
        realtimeData: {},
        realtimeBrokers: [],
        sortType: 0,
        inProgress: false,
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
      }
    },
    i18n: {
      messages: i18n,
    },
    watch: {
      setting() {
        this.lineStockOptions.title.text = `${this.pairs[this.pair]} ${
          this.setting
        } Spread`
        this.getDataChart()
      },
      pair() {
        this.lineStockOptions.title.text = `${this.pairs[this.pair]} ${
          this.setting
        } Spread`
        this.getDataChart()
      },
    },
    mounted() {
      this.onGetDataRealTimeBrokers()
      this.getDataChart()
    },
    async asyncData({ app }) {
      let [brokers, realtimeBrokers] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/spread/company'),
          app.GoGoHTTP.get('/api/v3/surface/spread/realtime'),
        ]),
        locale = app.i18n.locale,
        setting = 'Low',
        pair = 1,
        pairs = {
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
        },
        lineStockOptions = {
          title: {
            text: `${pairs[pair]} ${setting} Spread`,
            style: {
              fontWeight: 'bold',
              fontSize: '26px',
            },
            y: 55,
            floating: true,
          },
          chart: {
            plotShadow: true,
            height: 600,
            margin: [40, 20, 20, 20],
          },
          legend: {
            enabled: true,
            layout: 'horizontal',
            verticalAlign: 'bottom',
            floating: false,
            useHTML: true,
            x: 0,
          },
          rangeSelector: true,
          inputEnabled: true,
          buttonPosition: {
            align: 'left',
            y: -25,
          },
          inputPosition: {
            align: 'right',
            x: -10,
            y: -25,
          },
          navigator: true,
        }
      return {
        brokers,
        realtimeBrokers,
        titleChunk: i18n[locale]['title'],
        lineStockOptions,
        pairs,
        pair,
        setting,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/markets/spreads',
          },
        ],
      }
    },
    computed: {
      title() {
        return (
          this.pairs[this.pair] +
          ' ' +
          this.setting +
          ' ' +
          this.$t(4)
        )
      },
      tableData() {
        return {
          brokers: this.realtimeBrokers,
          realtimeData: this.realtimeData,
          sortType: this.sortType,
          pairs: [
            {
              1: 'USD/JPY',
              2: 'GBP/JPY',
              3: 'EUR/JPY',
              4: 'AUD/JPY',
              5: 'CHF/JPY',
            },
            {
              6: 'CAD/JPY',
              7: 'NZD/JPY',
              8: 'EUR/USD',
              9: 'GBP/USD',
              11: 'AUD/USD',
            },
          ],
        }
      }
    },
    methods: {
      onGetDataRealTimeBrokers() {
        (this.realtimeBrokers || []).forEach(item => {
          this.onGetDataRealTime(item.id)
        })
      },
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
      getDataChart() {
        let me = this
        if(me.inProgress) {
          return
        }
        me.inProgress = true
        this.$set(this, 'lineStock', [])
        me.brokers.forEach(item => {
          if (item.id === 265) {
            return
          }
          me.GoGoHTTP.get('/api/v3/spread/performance', {
            params: {
              id: item.id,
              symbol: me.pair,
              setting: me.setting,
              dayago: 7,
              callback: '?',
            },
        }).then(data => {
            me.lineStock.push({
              name: item.name,
              data,
              id: item.id,
            })
            if(me.lineStock.length === 7) {
              me.inProgress = false
            }
          })
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
                  el.css('background-color', '')
                }, 1000)
              }
            }
            this.$set(me.realtimeData, _id, data)
          })
          .finally(() => {
            setTimeout(() => {
              me.onGetDataRealTime(_id)
            }, 8000)
          })
      },
      onChangeSortType(_type) {
        if (parseInt(_type) === 0) {
          if (this.sortType === 0) {
            this.$set(this, 'sortType', -999)
          } else {
            if (this.sortType === -999) {
              this.$set(this, 'sortType', 999)
            } else {
              this.$set(this, 'sortType', -999)
            }
          }
        } else {
          if (Math.abs(this.sortType) !== parseInt(_type)) {
            this.$set(this, 'sortType', parseInt(_type))
          } else {
            this.$set(this, 'sortType', -this.sortType)
          }
        }
        this.onSortDataByType()
      },
      onSortDataByType() {
        if (this.sortType === -999) {
          this.realtimeBrokers = this.realtimeBrokers.sort((a, b) => {
            return a.name.localeCompare(b.name)
          })
          return
        } else if (this.sortType === 999) {
          this.realtimeBrokers = this.realtimeBrokers.sort((a, b) => {
            return b.name.localeCompare(a.name)
          })
          return
        }
        let arr = [],
          me = this,
          tmpArr = []
        for (let i in me.realtimeData) {
          let obj = $.grep(me.realtimeData[i], function(obj) {
            return parseInt(obj.Symbol) === Math.abs(me.sortType)
          })[0]
          arr.push([parseInt(i), (obj || {}).Spread])
        }
        arr.sort((a, b) => {
          if (me.sortType > 0) {
            return a[1] - b[1]
          } else {
            return b[1] - a[1]
          }
        })
        for (let j in arr) {
          let brk = $.grep(me.realtimeBrokers, function(obj) {
            return parseInt(obj.id) === parseInt(arr[j][0])
          })[0]
          tmpArr.push(brk)
        }
        me.$set(me, 'realtimeBrokers', tmpArr)
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
<style lang="scss" scope>
.top-title {
  font-weight: bold;
  padding: 5px;
  line-height: 30px;
  color: #434343;
  background: #f3f0ef;
  font-size: 16px;
  border-bottom: 1px solid #d0d0d0;
}
.table-title {
  font-size: 2.1rem;
  font-weight: bold;
  text-align: center;
  margin: 14px 0;
}
</style>