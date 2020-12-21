<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highcharts'

export default {
  mixins: [ChartWrapper],
  methods: {
    initChart() {
      let me = this
      me.innerChart = HighCharts.chart(me.$refs.chartWrap, {
        chart: {
          type: me.option.chartType || 'column',
          width: me.option.width || 310,
          height: me.option.height || 340,
          marginTop: me.option.marginTop || 100,
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
        xAxis: me.option.xAxis || {
          type: 'category',
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif',
            },
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: me.option.yTitle || '',
          },
          labels: {
            formatter: function() {
              return (
                this.axis.defaultLabelFormatter.call(this) +
                (me.option.yValue || '')
              )
            },
          },
        },
        legend: me.option.legend || {
          enabled: false,
        },
        colors: me.option.colors || HighCharts.getOptions().colors,
        plotOptions: me.option.plotOptions || {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#FFFFFF',
              align: 'right',
              format: '{point.y:.1f}', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif',
              },
            },
          },
        },
        tooltip: me.option.tooltip || {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>',
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
    <ColumnChart :chart="chart" :option="barChartOpt"/>
  </template>
  <script>
  export default {
    data() {
      return {
        chart: [{
          name: 'Tokyo',
          data: [49.9, 71.5, 106.4, 129.2]
        }, {
          name: 'New York',
          data: [83.6, 78.8, 98.5, 93.4]
          }
        ],
        barChartOpt: {
          width: 300,
          height: 240,
          xAxis: {
            categories: ['category 1', 'category 2', 'category 3', 'category 4'],
            title: {
              text: null,
            },
          },
          marginTop: 30,
        },
      }
    },
  }
  </script>
  ```
</docs>
