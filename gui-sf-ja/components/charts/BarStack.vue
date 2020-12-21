<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
// usage: <bar-stack :option="{ categories: categories }" :chart="chartData"></bar-stack>
//  chartData: [{
//        name: 'John',
//        data: [5, 3, 4, 7, 2]
//      }, {
//        name: 'Jane',
//        data: [2, 2, 3, 2, 1]
// }]
//  categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highcharts'
import Exporting from 'highcharts/modules/exporting.js'

if (process.browser) {
  Exporting(HighCharts)
}

export default {
  mixins: [ChartWrapper],
  watch: {
    option: {
      handler() {
        this.initChart()
      },
      deep: true,
    },
  },
  methods: {
    initChart() {
      let me = this
      me.innerChart = HighCharts.chart(me.$refs.chartWrap, {
        chart: {
          type: 'bar',
          width: me.option.width || 325,
          height: me.option.height || 440,
          backgroundColor: me.option.bgColor || '#fff',
        },
        xAxis: {
          categories: me.option.categories || [],
          title: {
            text: me.option.xTitle || '',
          },
        },
        yAxis: me.option.yAxis || {
          type: 'category',
          // alternateGridColor: '#ededed',
          title: {
            text: me.option.yTitle || '',
          },
        },
        exporting: {
          enabled: me.option.exporting || false,
        },
        legend: me.option.legend || {
          enabled: true,
          verticalAlign: 'top',
          layout: 'vertical',
          align: 'right',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: '#FFFFFF',
          shadow: true,
        },
        colors: me.option.colors || HighCharts.getOptions().colors,
        credits: {
          enabled: false,
        },
        title: {
          text: me.option.title || '',
        },
        plotOptions: me.option.plotOptions || {
          series: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              format: '<b>{point.y}</b> ({point.percentage:.0f}%)',
            },
          },
        },
        series: me.chart,
      })
    },
  },
}
</script>
<docs>
  ```vue
  <template>
    <BarStack :option="{ categories: categories }" :chart="chartData" />
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [{
          name: 'John',
          data: [5, 3, 4, 7, 2]
        }, {
          name: 'Jane',
          data: [2, 2, 3, 2, 1]
        }],
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
      }
    },
  }
  </script>
  ```
</docs>
