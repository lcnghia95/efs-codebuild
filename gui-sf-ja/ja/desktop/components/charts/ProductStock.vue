<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highstock'

export default {
  mixins: [ChartWrapper],
  methods: {
    initChart() {
      let me = this,
        hc = HighCharts
      me.innerChart = HighCharts.stockChart(me.$refs.chartWrap, {
        tooltip: {
          formatter: function() {
            let x = hc.dateFormat('%B, %Y', parseInt(this.x)),
              yData = parseFloat((this.y || 0).toFixed(0)),
              y = `${me.option.name}: <strong>${me.formatNumber(yData)}${
                me.option.currency
              }</strong>`
            return [x, y]
          },
        },
        chart: {
          height: 130,
          width: 212,
        },
        credits: {
          enabled: false,
        },
        yAxis: {
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
            enabled: false,
          },
        },
        xAxis: {
          gridLineWidth: 1,
          labels: {
            style: {
              fontSize: '10px',
            },
            padding: 3,
            formatter: function() {
              return moment(this.value).format('YY/MM/DD')
            },
          },
        },
        rangeSelector: {
          enabled: false,
        },
        scrollbar: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
        navigator: {
          enabled: false,
        },
        series: [
          {
            name: me.option.name,
            data: me.chart,
          },
        ],
      })
    },
  },
}
</script>

<docs>
  ```vue
  <template>
    <ProductStock :chart="chartData" :option="{ height: 130, width: 212, name: '収益' }"/>
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [
          [
            1527692400000,
            69746
          ],
          [
            1527778800000,
            90784
          ],
          [
            1527865200000,
            90784
          ],
          [
            1528038000000,
            90784
          ],
          [
            1528124400000,
            90784
          ],
          [
            1528210800000,
            90784
          ],
          [
            1528297200000,
            90784
          ],
          [
            1528383600000,
            90784
          ]
        ]
      }
    },
  }
  </script>
  ```
</docs>
