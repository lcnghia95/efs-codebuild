<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
// <scatter-line :chart="chartData" :option="{}"></scatter-line>
//  chartData: [
//   [[0, 1.11], [5, 4.51]],
//   [1, 1.5, 2.8, 3.5, 3.9, 4.2]]

import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highcharts'

export default {
  name: 'ScatterLine',
  mixins: [ChartWrapper],
  data() {
    return {
      chartOption: [
        {
          type: 'line',
          name: this.option.lTitle || '',
          data: [],
          marker: {
            enabled: false,
          },
          states: {
            hover: {
              lineWidth: 0,
            },
          },
          enableMouseTracking: false,
        },
        {
          type: 'scatter',
          name: this.option.cTitle || '',
          data: [],
          marker: {
            radius: 4,
          },
        },
      ],
    }
  },
  methods: {
    watchData() {
      let me = this
      this.innerChart.update({
        series: [
          {
            data: me.chart[0],
          },
          {
            data: me.chart[1],
          },
        ],
      })
    },
    processData() {
      this.chartOption[0].data = this.chart[0]
      this.chartOption[1].data = this.chart[1]
      return this.chartOption
    },
    initChart() {
      let me = this
      me.innerChart = HighCharts.chart(me.$refs.chartWrap, {
        chart: {
          width: me.option.width || 310,
          height: me.option.height || 340,
        },
        xAxis: {
          min: -0.5,
          max: 5.5,
          title: {
            text: me.option.xTitle || '',
          },
        },
        credits: {
          enabled: false,
        },
        exporting: {
          enabled: me.option.exporting || false,
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          min: 0,
          title: {
            text: me.option.yTitle || '',
          },
        },
        title: {
          text: me.option.title || '',
        },
        series: me.processData(),
      })
    },
  },
}
</script>
<docs>
  ```vue
  <template>
    <ScatterLine :chart="chartData" :option="{}"></ScatterLine>
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [
          [[0, 1.11], [5, 4.51]],
          [1, 1.5, 2.8, 3.5, 3.9, 4.2]
        ]
      }
    },
  }
  </script>
  ```
</docs>
