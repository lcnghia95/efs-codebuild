<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highstock'
import Exporting from 'highcharts/modules/exporting.js'

if (process.browser) {
  Exporting(HighCharts)
  HighCharts.setOptions({
    lang: {
      rangeSelectorZoom: '表示範囲',
      rangeSelectorFrom: '表示期間',
      rangeSelectorTo: '～',
      printChart: 'チャートを印刷',
      contextButtonTitle: '画像としてダウンロード',
      downloadJPEG: 'JPEG画像でダウンロード',
      downloadPDF: 'PDF文書でダウンロード',
      downloadPNG: 'PNG画像でダウンロード',
      downloadSVG: 'SVG形式でダウンロード',
      numericSymbols: null,
    },
  })
}

export default {
  mixins: [ChartWrapper],
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
      this.innerChart.redraw()
      this.innerChart.update({
        yAxis: this.option.yAxis,
        tooltip: this.option.tooltip,
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
