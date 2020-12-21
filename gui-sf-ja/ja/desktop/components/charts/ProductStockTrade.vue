<template>
  <div ref="chartWrap" class="inner-chart"></div>
</template>

<script>
/* eslint-disabled */
import Vue from 'vue'
import HighCharts from 'highcharts/highcharts'
import Stock from 'highcharts/modules/stock'
import moment from 'moment'

if (process.browser) {
  Stock(HighCharts)
}

export default Vue.extend({
  props: ['chart', 'option'],
  data() {
    return {
      innerChart: {},
      dataChart: []
    }
  },
  watch: {
    chart() {
      this.watchData()
    }
  },
  mounted: function() {
    const cacheFn = this.initChart
    this.initChart = () => {
      cacheFn()
    }
    if (!this.chart) {
      return
    }
    this.initChart()
  },
  methods: {
    watchData() {
      !this.innerChart && this.initChart()
      const series = this.innerChart.series
      while (series.length > 0) {
        series[0].remove(false)
      }
      for (const e of this.chart) {
        this.innerChart.addSeries(e)
      }
      this.innerChart.redraw()
    },
    initChart() {
      const self = this
      this.innerChart = HighCharts.stockChart(this.$refs.chartWrap, {
        chart: this.option.chart || {},
        credits: {
          enabled: false
        },
        yAxis: this.option.yAxis || [
          {
            minorTickInterval: 'auto',
            lineColor: '#888',
            lineWidth: 1,
            tickColor: '#888',
            plotLines: [
              {
                value: 0,
                width: 2,
                color: '#eee'
              }
            ],
            labels: {
              enabled: false,
            }
          }
        ],
        xAxis: [
          {
            gridLineWidth: 1,
            lineColor: '#555',
            tickColor: '#888',
            labels: {
              formatter: function() {
                return moment(this.value).format('YY/MM/DD')
              }
            }
          }
        ],
        legend: this.option.legend || {
          enabled: true,
          layout: 'horizontal',
          floating: true,
          x: 0,
          y: 22
        },
        rangeSelector: {
          enabled: this.option.rangeSelector || false
        },
        navigator: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
        tooltip: {
          enabled: true,
          borderColor: '#666666',
          xDateFormat: '%A, %b %e, %Y',
          pointFormatter: function() {
            return `<span style="font-weight: bold; color:${this.series.color}">${
              this.series.name
            }</span><span style="font-weight: bold">: ${self.formatNumber(
              this.y,
              this.y,
              self.option.currency === 'pips' ? 1 : 2
            )} ${self.option.currency === 'JPY' ? '円' : self.option.currency}</span><br />`
          }
        },
        series: this.chart || []
      })
    }
  }
})
</script>
<style lang="scss" scoped>
.inner-chart {
  overflow: visible !important;
}
/deep/ .highcharts-container {
  overflow: visible !important;
}
/deep/ svg {
  overflow: visible !important;
}
</style>

