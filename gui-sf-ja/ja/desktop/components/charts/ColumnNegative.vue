<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
// usage: <column-negative :chart="chartData" :option="{ categories: categories, yValue: 'lots' }"></column-negative>
//  chartData: [29.9, -71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
//  categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highcharts'
export default {
  mixins: [ChartWrapper],
  methods: {
    watchData() {
      let me = this
      this.innerChart.update({
        series: {
          data: me.chart || [],
        },
      })
    },
    initChart() {
      let me = this
      me.innerChart = HighCharts.chart(me.$refs.chartWrap, {
        chart: {
          width: me.option.width || 320,
          height: me.option.height || 240,
        },
        title: {
          text: me.option.title || '',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: me.option.categories || [],
          tickWidth: 0,
          lineWidth: 1,
        },
        exporting: {
          enabled: me.option.exporting || false,
        },
        plotOptions: {
          series: {
            pointWidth: me.option.columnWidth || 18,
            dataLabels: {
              enabled: true,
              format: '{point.y}',
            },
          },
        },
        yAxis: {
          title: {
            text: me.option.yTitle || '',
          },
          alternateGridColor: '#ededed',
          labels: {
            formatter: function() {
              return (
                this.axis.defaultLabelFormatter.call(this) +
                (me.option.yValue || '')
              )
            },
          },
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{point.x}</span><br>',
          pointFormat:
            '<span style="color:{point.color}"><b>{point.y:.2f}</b><br/>',
        },
        series: [
          {
            type: 'column',
            colorByPoint: true,
            showInLegend: false,
            data: me.chart || [],
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
    <ColumnNegative :chart="chartData" :option="{ categories: categories, yValue: 'lots' }"/>
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [29.9, -71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      }
    },
  }
  </script>
  ```
</docs>
