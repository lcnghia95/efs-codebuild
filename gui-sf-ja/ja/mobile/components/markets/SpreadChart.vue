<template>
  <div>
    <SelectBox2 :data-source="symbolDataSource"
                v-model="symbol"
                @input="onSymbolSelect"
                display="text"
                :selected="symbol"
                class="mb-15 bg-white"
                :id-val="'id'"
    />
    <div class="pos-rel">
      <div ref="chartWrap" class="inner-chart mb-15"></div>
      <div v-if="isLoading" class="loading flex" :style="{ height: `${(this.options.chart || {}).height || 480}px` }">
        <Loading style="margin: auto;" />
      </div>
    </div>
    <slot>
      <div>
        <div class="flex space-between mid date-input-ctn mb-10">
          <div class="flex date-input-item space-between pos-rel">
            <input type="date" v-model="min" @change="onDateChange" />
            <div class="date-txt">{{ convertDate(min) }}</div>
            <div class="date-btn flex mid center">
              <CalendarAlt />
            </div>
          </div>
          <div style="font-size: 0.8em; font-weight: bold;">
            {{ $t(11) }}
          </div>
          <div class="flex date-input-item space-between pos-rel">
            <input type="date" v-model="max" @change="onDateChange" />
            <div class="date-txt">{{ convertDate(max) }}</div>
            <div class="date-btn flex mid center">
              <CalendarAlt />
            </div>
          </div>
        </div>
        <div class="flex control-ctn mb-10" v-if="hideRangeSelect">
          <div class="w-full control-btn" 
               :class="{active: activatedButton.setting === 'High', 'is-loading': isLoading}"
               @click="onSettingSelect('High')"
          >
            {{ $t(12) }}
          </div>
          <div class="w-full control-btn" 
               :class="{active: activatedButton.setting === 'Avg', 'is-loading': isLoading}"
               @click="onSettingSelect('Avg')"
          >
            {{ $t(13) }}
          </div>
          <div class="w-full control-btn" 
               :class="{active: activatedButton.setting === 'Low', 'is-loading': isLoading}"
               @click="onSettingSelect('Low')"
          >
            {{ $t(14) }}
          </div>
        </div>
        <div class="flex control-ctn">
          <div class="w-full control-btn" :class="{active: activatedButton.rangeSelected === 'H1'}" @click="onRangeSelect('H1')">H1</div>
          <div class="w-full control-btn" :class="{active: activatedButton.rangeSelected === 'H4'}" @click="onRangeSelect('H4')">H4</div>
          <div class="w-full control-btn" :class="{active: activatedButton.rangeSelected === 'D1'}" @click="onRangeSelect('D1')">D1</div>
          <div class="w-full control-btn" :class="{active: activatedButton.rangeSelected === 'W1'}" @click="onRangeSelect('W1')">W1</div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import HighCharts from 'highcharts/highstock.src'
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import i18n from '@@/lang/components-mobile/markets-spread-chart.json'
import SelectBox2 from '@/components/markets/SelectBox2.vue'
import Loading from '@@/../components/icons/Loading.vue'
const TIMEZONE_MAP = {
  'ja': 9,
}
if (process.browser) {
    let H = HighCharts
    // Override drawLegendSymbol prototype of HightChart (to render the checkbox)
    // ============================================================================
    H.wrap(H.Series.prototype, 'drawLegendSymbol', function (proceed, legend, item) {
      proceed.call(this, legend) // do not remove
      let verticalCenter = legend.baseline - Math.round(legend.fontMetrics.b * 0.3)

      // add checkbox icon
      this.chart.renderer.path(
        ['m0.000026,7.436913l0,20.229787l19.834476,0l0,-20.229787l-19.834476,0zm8.298246,14.329428l-3.718958,-3.640511l1.152871,-1.20958l2.545428,2.475626l5.80241,-6.054603l1.175191,1.187654l-6.956942,7.241415z'],
      ).attr({
        stroke: '#fff',
        fill: '#434343',
        class: 'legend-checkbox',
      })
      .add(this.legendGroup)

      // add line chart icon
      this.chart.renderer.path(
        [
          'M',
          25,
          verticalCenter,
          'L',
          45,
          verticalCenter,
        ]
      ).attr({
        stroke: item.color,
        'stroke-width': 7,
      })
      .add(this.legendGroup)
    })

    // Override refresh tooltip event (to auto hidding tooltip)
    // ============================================================================
    H.wrap(H.Tooltip.prototype, 'refresh', function (proceed) {
      // Run the original proceed method
      proceed.apply(this, Array.prototype.slice.call(arguments, 1))

      // Auto hide tooltip. To set time for the hidden, set it at tooltips.hideDelay option
      // Warning: if The option tooltips.hideDelay is not set, tooltip will be hide immediately 
      this.hide()
    })
}

export default {
  i18n: {messages: i18n},
  components: {
    CalendarAlt,
    SelectBox2,
    Loading,
  },
  data() {
    return {
      innerChart: null,
      activatedButton: {
        setting: 'High',
        rangeSelected: 'H1',
      },
      max: null,
      min: null,
      symbol: this.currentSymbol,
      symbolDataSource: [
          {
            id: 1,
            text: 'USD/JPY',
          },
          {
            id: 3,
            text: 'EUR/JPY',
          },
          {
            id: 8,
            text: 'EUR/USD',
          },
          {
            id: 2,
            text: 'GBP/JPY',
          },
          {
            id: 9,
            text: 'GBP/USD',
          },
          {
            id: 4,
            text: 'AUD/JPY',
          },
          {
            id: 11,
            text: 'AUD/USD',
          },
          {
            id: 7,
            text: 'NZD/JPY',
          },
          {
            id: 6,
            text: 'CAD/JPY',
          },
          {
            id: 5,
            text: 'CHF/JPY',
          },
        ],
    }
  },
  props: {
    chart: { // chart data
      type: [Object, Array],
      default() {
        return []
      },
    },
    currentSymbol: { // set current symbol id for this chart
      type: Number,
      default: 1
    },
    isLoading: { // hide/show loading
      type: Boolean,
      default() {
        return false
      },
    },
    options: { // option for hightchart
      type: [Object, Array],
      default() {
        return []
      },
    },
    hideRangeSelect: { // hide/show range-selector
      type: Boolean,
      default() {
        return true
      },
    },
  },
  watch: {
    chart() {
      this.watchData()
    },
  },
  mounted() {
    if (!this.chart) {
      return
    }
    this.initChart()
    window.onresize = this.updateLegendSize
  },
  methods: {
    watchData() {
      !this.innerChart && this.initChart()
      let series = this.innerChart.series
      while (series.length > 0) {
        series[0].remove(false)
      }
      for (let e of this.chart) {
        this.innerChart.addSeries(e)
      }
      this.onRangeSelect(this.activatedButton.rangeSelected)
    },
    onSettingSelect(setting) {
      if(this.isLoading) {
        return
      }
      if(this.activatedButton.setting === setting) {
        return
      }
      this.activatedButton.setting = setting
      this.$emit('onSettingSelect', setting)
      let symbolTitle = this.symbolDataSource.find(item => item.id === this.symbol)['text'] || '',
        params = { 
          symbol: symbolTitle, 
          range: this.activatedButton.rangeSelected,
          setting: this.activatedButton.setting,
        }
      this.innerChart.update({
        title: {
            text: this.$t(10, params),
            align: 'center',
        }
      })
    },
    onSymbolSelect(symbol) {
      this.$emit('onSymbolSelect', symbol)
      this.onRangeSelect(this.activatedButton.rangeSelected)
    },
    onRangeSelect(type) {
      if(!this.chart[0]) {
        return
      } 
      let max = Date.now(),
        min = null,
        hour = 3.6e+6,
        symbolTitle = this.symbolDataSource.find(item => item.id === this.symbol)['text'] || '',
        params = {
          symbol: symbolTitle,
          range: type,
          setting: this.activatedButton.setting,
        }
      this.innerChart.update({
        title: this.options.title || {
            text: this.$t(10, params),
            align: 'center',
        },
      })
      if(type == 'H1') {
        min = max - hour
      }
      if(type == 'H4') {
        min = max - hour*4
      }
      if(type == 'D1') {
        min = max - hour*24
      }
      if(type == 'W1') {
        min = max - hour*24*7
      }
      this.max = moment(max).format('YYYY-MM-DD')
      this.min = moment(min).format('YYYY-MM-DD')
      this.activatedButton.rangeSelected = type
      this.innerChart.update({
        xAxis: {
          min,
          max,
        },
        series: this.chart,
      })
    },
    onDateChange() {
      let min = (new Date(this.min)).getTime(),
       max = (new Date(this.max)).getTime()

      if(min > max) {
        let temp = max
        max = min
        min = temp
      }
      this.innerChart.update({
        xAxis: {
          min,
          max,
        },
      })
    },
    updateLegendSize() {
      let lendBoxWidth = $(this.$refs.chartWrap).width(),
        itemWidth = lendBoxWidth/2

      // Custom responsive for legend
      if(lendBoxWidth >= 500) {
        itemWidth = lendBoxWidth/4
      }
      // 
      this.innerChart.update({
        legend: {
          width: lendBoxWidth,
          itemWidth,
        },
      })
    },
    initChart() {
      let me = this,
        symbolTitle = this.symbolDataSource.find(item => item.id === this.symbol)['text'] || ''
      // HighCharts.setOptions({
      //   lang: {
      //     rangeSelectorZoom: this.$t('1'),
      //     rangeSelectorFrom: this.$t('2'),
      //     rangeSelectorTo: this.$t('3'),
      //     printChart: this.$t('4'),
      //     contextButtonTitle: this.$t('5'),
      //     downloadJPEG: this.$t('6'),
      //     downloadPDF: this.$t('7'),
      //     downloadPNG: this.$t('8'),
      //     downloadSVG: this.$t('9'),
      //     numericSymbols: null,
      //     thousandsSep: ',',
      //   },
      // })
      me.innerChart = HighCharts.stockChart(me.$refs.chartWrap, {
        chart: this.options.chart ||{
          height: 480,
          margin: [40, 5, 200, 0],
        },
        credits: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
        title: this.options.title || {
          text: this.$t(10, { symbol: symbolTitle, range: this.activatedButton.rangeSelected }),
          align: 'center',
          style: {
            fontWeight: 'bold'
          }
        },
        yAxis: [
          {
            minorTickInterval: 'auto',
            lineColor: '#888',
            lineWidth: 1,
            tickColor: '#888',
            plotLines: [
              {
                value: 0,
                width: 2,
                color: '#eee',
              },
            ],
            labels: {
              align: 'right',
              x: -5,
              formatter: function() {
                return (
                  this.value.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') +
                  ' 　'
                )
              },
            },
          },
        ],
        split: true,
        legend: this.options.legend ||{
          enabled: true,
          align: 'center',
          verticalAlign: 'bottom',
          backgroundColor: this.options.legendBoxBg || '#eaeaea',
          padding: 15,
          symbolPadding: 49,
          itemMarginTop: 8,
          symbolWidth: .001,
          itemStyle: {
            fontSize: 15,
            padding: [50, 0],
            fontWeight: 'normal',
          },
          itemHiddenStyle: {
            "color": "#333",
          },
          labelFormatter() {
            $('.highcharts-legend-item.highcharts-flags-series').find('text').attr('x', 25)
            return this.getName()
          },
        },
        scrollbar: {
          enabled: false,
        },
        margin: 5,
        buttonPosition: {
          align: 'left',
          y: -15,
        },
        inputPosition: {
          align: 'right',
          x: -10,
          y: -15,
        },
        xAxis: [
          {
            gridLineWidth: 1,
            x: -10,
            lineColor: '#555',
            tickColor: '#888',
            labels: {
              formatter: function() {
                return moment(this.value).format('M/D HH:mm')
              },
            },
          },
        ],
        rangeSelector: {
          enabled: false,
        },
        navigator: {
          baseSeries: 0,
          enabled: false,
        },
        plotOptions: {
          series: {
            dataGrouping: {
              dateTimeLabelFormats: {
                millisecond: [
                  '%Y/%m/%d %H:%M:%S.%L',
                  '%Y/%m/%d %H:%M:%S.%L',
                  '-%H:%M:%S.%L',
                ],
                second: ['%Y/%m/%d %H:%M:%S', '%Y/%m/%d %H:%M:%S', '-%H:%M:%S'],
                minute: ['%Y/%m/%d %H:%M', '%Y/%m/%d %H:%M', '-%H:%M'],
                hour: ['%Y/%m/%d %H:%M', '%Y/%m/%d %H:%M', '-%H:%M'],
                day: ['%Y/%m/%d', '%Y/%m/%d', '-%Y/%m/%d'],
                week: ['%Y/%m/%d', '%Y/%m/%d', '-%Y/%m/%d'],
                month: ['%B %Y', '%B', '-%B %Y'],
                year: ['%Y', '%Y', '-%Y'],
              },
            },
          },
        },
        line: {
          dataLabels: {
            enables: true,
          },
        },
        tooltip: {
          formatter: function() {
            if (this.y) {
              let tooltipList = [],
                tooltipIdx = 0,
                s = ''
              let time =  moment(this.x)
              time.add(TIMEZONE_MAP[me.$i18n.locale] || 9, 'hours')
              s += HighCharts.dateFormat('%Y/%m/%d %H:%M', time)
              $.each(this.points, function() {
                tooltipList[tooltipIdx] =
                  ('000' + HighCharts.numberFormat(this.y, 1)).slice(-5) +
                  ',<span style="color:' +
                  this.series.color +
                  '">●</span> ' +
                  this.series.name +
                  ''
                tooltipIdx++
              })
              tooltipList.sort(function(a, b) {
                if (a < b) {
                  return 1
                }
                if (a > b) {
                  return -1
                }
                return 0
              })
              if (tooltipList.length) {
                for (let i = 0; i < tooltipList.length; i++) {
                  let tList = tooltipList[i].split(',')
                  if (
                    tList[0].substr(0, 1) === '0' &&
                    tList[0].substr(2, 1) === '.'
                  ) {
                    tList[0] = tList[0].substr(1, 3)
                  }
                  if (
                    tList[0].substr(0, 2) === '00' &&
                    tList[0].substr(3, 1) === '.'
                  ) {
                    tList[0] = tList[0].substr(2, 3)
                  }
                  s +=
                    '<br />' +
                    tList[1] +
                    ': <span style="font-weight: bold">' +
                    tList[0] +
                    '</span>'
                }
              }
              return s
            } else {
              return this.point.name || ''
            }
          },
          valueDecimals: 1,
          positioner: function() {
              return {
                  x: 0,
                  y: 30,
              }
          },
          split: false,
          shared: true,
          hideDelay: 3000
        },
        series: me.chart || [],
      })
      //  custom chart
      this.updateLegendSize()
    },
    convertDate(date) {
      let d = (new Date(date)).getTime()/1000
      return this.formatTime(d, 7)
    }
  },
}
</script>
<style lang="scss" scoped>
.inner-chart {
  min-height: 280px;
}
.control-ctn {
  box-shadow: 0 0 5px #a7a7a7;
  border-radius: 5px;
  .control-btn {
    background: #fff;
    color: #b2b2b2;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-right: 1px solid;
    text-align: center;
    display: block;
    height: 40px;
    line-height: 40px;
    border-color: #d3d1d1;
    &.active {
      background: #434343;
      color: #fff;
      border-color: #434343;
      &.is-loading {
        opacity: 1;
      }
    }
    &.is-loading {
      opacity: 0.3;
    }
  }
  div:first-child {
    border-left: 1px solid;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  div:last-child {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }
}

$size: 40px;
.date-input-ctn {
  .date-input-item {
    box-shadow: 0 0 5px #b2b2b2;
    border-radius: 5px;
    width: calc((100% - 40px) / 2);
    overflow: hidden;
    background: #fff;
  }
  input {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    height: $size;
    width: calc(100% - 40px);
    font-size: 15px;
    border: 1px solid #b2b2b2;
    background: #fff;
    position: absolute;
    opacity: 0;
    &::-webkit-calendar-picker-indicator {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .date-txt {
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    width: 100%;
  }
  .date-btn {
    height: $size;
    width: $size;
    flex: 0 0 $size;
    background: #434343;
    color: #fff;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    .icon-cls {
      height: 29px;
      width: 29px;
      margin: auto;
    }
  }
}
/deep/ .modal-dialog {
  display: flex;
  align-items: center;
  .modal-content {
    width: 100%;
  }
  .modal-footer {
    height: 42px;
  }
}
.loading {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  opacity: 0.5;
  height: 470px;
  width: 100%;
}
</style>
<style lang="scss">
.highcharts-flags-series {
  rect {
    x: 4 !important;
  }
}
.highcharts-legend-item-hidden .legend-checkbox {
  fill: #d6d3d2;
}
</style>