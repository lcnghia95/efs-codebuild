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

const marker = {
  fillColor: {
    radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
    stops: [[0, 'rgba(255,255,255,0.5)'], [1, 'rgba(124,181,236,0.5)']],
  },
}

export default {
  mixins: [ChartWrapper],
  methods: {
    watchData() {
      !this.innerChart && this.initChart()
      let series = this.innerChart.series
      while (series.length > 0) {
        series[0].remove(false)
      }
      for (let e of this.chart) {
        e.marker = marker
        this.innerChart.addSeries(e)
      }
      this.innerChart.redraw()
    },
    initChart() {
      let me = this
      me.innerChart = HighCharts.chart(me.$refs.chartWrap, {
        chart: {
          type: 'bubble',
          plotBorderWidth: 1,
          zoomType: 'xy',
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
        tooltip: me.option.tooltip || {
          formatter: function() {
            return `<span> 
              ${this.series.name}<br>
              ${me.option.xAxis.title.text}: ${this.point.x}${me.option.xunit ||
              'ヶ月'}<br>
              ${me.option.yAxis.title.text}: ${me.formatNumber(
              this.point.y
            )}${me.option.yunit || '円'}<br>
              ${me.option.zAxis.title.text}: ${this.point.z}${me.option.zunit ||
              '%'}
            </span>`
          },
        },
        xAxis: Object.assign(
          {},
          {
            gridLineWidth: 1,
          },
          me.option.xAxis || {}
        ),
        zAxis: Object.assign(
          {},
          {
            // default options here
          },
          me.option.zAxis || {}
        ),
        yAxis: Object.assign(
          {},
          {
            startOnTick: false,
            endOnTick: false,
          },
          me.option.yAxis || {}
        ),
        legend: me.option.legend || {
          enabled: true,
        },
        series: me.chart.slice(0).map(item => {
          return Object.assign(
            {},
            { marker: marker },
            {
              data: item.data,
              name: item.name,
            }
          )
        }),
      })
    },
  },
}
</script>
