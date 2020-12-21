<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
if (process.browser) {
  HighchartsMore(HighCharts)
}

export default {
  mixins: [ChartWrapper],
  methods: {
    initChart() {
      let me = this

      me.innerChart = HighCharts.chart(me.$refs.chartWrap, {
        chart: {
          polar: true,
          type: 'line',
          width: me.option.width || 160,
          height: me.option.height || 160,
          backgroundColor: me.option.bgColor || '#fff',
          margin: 30,
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        exporting: {
          enabled: me.option.exporting || false,
        },
        pane: {
          size: '70%',
        },
        xAxis: {
          categories: me.option.categories,
          tickmarkPlacement: 'on',
          lineWidth: 0,
          labels: {
            style: {
              fontSize: '11px',
            },
          },
        },
        yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0,
          max: me.option.yMax,
          tickAmount: 3,
        },
        tooltip: {
          shared: true,
          /* eslint-disable no-template-curly-in-string */
          pointFormat:
            '<span style="color:{series.color}"><b>{point.y:,.2f}</b><br/>',
          /* eslint-enable no-template-curly-in-string */
        },
        legend: {
          enabled: false,
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
    <SpiderWeb :chart="chartData" :option="{categories: categories}" />
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [
          {
            name: 'Allocated Budget',
            data: [43000, 19000, 60000, 35000, 17000, 10000],
            pointPlacement: 'on'
          }
        ],
        categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
            'Information Technology', 'Administration']
      }
    },
  }
  </script>
  ```
</docs>
