<template>
  <div ref="chartWrap" class="inner-chart"></div>
</template>

<script>
import HighCharts from 'highcharts/highstock'

if (process.browser) {
    let H = HighCharts
    // Override refresh tooltip event (to auto hidding tooltip)
    H.wrap(H.Tooltip.prototype, 'refresh', function (proceed) {
      // Run the original proceed method
      proceed.apply(this, Array.prototype.slice.call(arguments, 1))

      // Auto hide tooltip. To set time for the hidden, setting it at tooltips.hideDelay option
      // Warning: if The option tooltips.hideDelay is not set, tooltip will be hide immediately 
      this.hide()
    })
  // ============================================================================
}
export default {
  mounted() {
    let cacheFn = this.initChart
    this.initChart = () => {
      cacheFn()
    }
    if (!this.chart) {
      return
    }
    setInterval(() => {
      this.innerChart.update({
        yAxis: this.option.yAxis,
        series: this.chart,
      })
    }, 5000)
  },
  props: {
    chart: {
      type: [Object, Array],
      default() {
        return []
      },
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    chart() {
      this.watchData()
    },
  },
  methods: {
    watchData() {
      !this.innerChart && this.initChart()
      let series = this.innerChart.series,
        tooltip = Object.assign(
          this.option.tooltip, 
          {
            positioner: function() {
                return {
                    x: 10,
                    y: 10,
                }
            },
            split: false,
            shared: true,
            hideDelay: 3000
          }
        )
      while (series.length > 0) {
        series[0].remove(false)
      }
      for (let e of this.chart) {
        this.innerChart.addSeries(e)
      }
      this.innerChart.update({
        yAxis: this.option.yAxis,
        tooltip,
      })
    },
    initChart() {
      let me = this
      me.innerChart = HighCharts.stockChart(me.$refs.chartWrap, {
        chart: me.option.chart || {
          height: me.option.height,
          margin: me.option.margin || 0,
        },
        exporting: { enabled: false },
        credits: { enabled: false },
        rangeSelector: {
          enabled: me.rangeSelector || false,
        },
        navigator: {
          enabled: me.navigator || false,
        },
        scrollbar: { enabled: false },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom',
                },
              },
            },
          ],
        },
        xAxis: {
          gridLineWidth: 1,
          dateTimeLabelFormats: {
            day: '%e of %b',
            millisecond: '%H:%M',
          },
        },
        yAxis: me.option.yAxis || [
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
              formatter: function() {
                return this.value
                  .toString()
                  .replace(/(\d)(?=(\d\d\d)+$)/g, '$1,')
              },
            },
          },
        ],
        plotOptions: me.option.plotOptionswd || {
          series: {
            dataGrouping: {
              enabled: true,
              force: true,
            },
          },
        },
        tooltip: me.option.tooltip || {
          split: true,
        },
        series: me.chart || [],
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.inner-chart {
  min-height: 300px;
  background: #f2f0ed;
}
</style>
<docs>
  ```vue
  <template>
    <div style="height: 400px;">
      <LineStock :chart="chartData" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [
        {
          name: "ストラテジー登録前",
          tooltip: {
            valueDecimals: 2
          },
          data: [
            [
              1268924400000,
              2000
            ],
            [
              1269270000000,
              4000
            ],
            [
              1269356400000,
              7000
            ],
          ]
        }]
      }
    },
  }
  </script>
  ```
</docs>
