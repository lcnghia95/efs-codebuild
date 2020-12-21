<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highcharts'
import Exporting from 'highcharts/modules/exporting.js'
import i18n from '@@/lang/common/labels.json'

if (process.browser) {
  Exporting(HighCharts)
}
export default {
  i18n: {
    messages: i18n,
  },
  mixins: [ChartWrapper],
  methods: {
    initChart() {
      let me = this
      me.innerChart = HighCharts.chart(me.$refs.chartWrap, {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          width: me.option.width || 340,
          height: me.option.height || 350,
          backgroundColor: me.option.bgColor || '#fff',
        },
        credits: {
          enabled: false,
        },
        exporting: {
          enabled: me.option.exporting || false,
        },
        title: me.option.title || {
          text: '',
        },
        tooltip: {
          pointFormat: this.$t('2') + ': <b>{point.percentage:.1f}%</b>',
        },
        legend: me.option.legend || {
          enabled: true,
        },
        colors: me.option.colors || HighCharts.getOptions().colors,
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              format: me.option.format,
              enabled: me.option.dataLabels || false,
            },
            showInLegend: me.option.showInLegend || false,
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
    <div style="height: 400px;">
      <PieChart :chart="chartData" :option="pieChartOptions" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [
          {
            name: 'Buy',
            y: 220,
            sliced:  true,
            selected: true
          }, {
            name: 'Sell',
            y: 120,
          },
        ],
        pieChartOptions: {
          width: 320,
          showInLegend: true,
          exporting: true,
          title: {
            text: 'chart pie with dummy',
            style: {
              color: '#7d7d7d',
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
        },
      }
    },
  }
  </script>
  ```
</docs>
