<template>
  <div class="flex layout-col space-between bubble-chart-02">
    <div ref="chartWrap" class="inner-chart"></div>
    <div v-html="$t('12')" v-if="chart.length" class="formula-text"></div>
  </div>
</template>

<script>
import ChartWrapper from '@@/../components/charts/chart-wrapper'
import HighCharts from 'highcharts/highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import i18n from '@@/lang/components-desktop/bubble-chart02.json'

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
  i18n: {
    messages: i18n,
  },
  methods: {
    calcDate(x) {
      const y = parseInt(x / 12)
      const m = x % 12
      return y > 0 ? `${y}${this.$t(7)}` + (m > 0 ? `${m}${this.$t(2)}` : '') : `${m}${this.$t(2)}`
    },
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
          plotBorderWidth: 2,
          zoomType: 'xy',
          height: 390,
        },
        credits: {
          enabled: false,
        },
        legend: me.option.legend || {
          enabled: false,
        },
        exporting: {
          enabled: me.option.exporting || false,
        },
        title: {
          text: me.$t('10')
        },
        accessibility: {
          point: {
            valueDescriptionFormat: '{index}. {point.name}, fat: {point.x}g, sugar: {point.y}g, obesity: {point.z}%.'
          }
        },
        tooltip: Object.assign(
          {
            formatter: function (tooltip) {
              tooltip.options.borderColor = (this.point.marker || {}).coBorder || 'rgba(100, 100, 100, 0.5)'
              return tooltip.defaultFormatter.call(this, tooltip)
            },
            borderWidth: 2,
            useHTML: true,
            headerFormat: '<table>',
            footerFormat: '</table>',
            followPointer: true,
            pointFormatter: function () {
              return `<tr>
              <th colspan="2"><h3>${this.name}</h3></th></tr>
              <tr>
                <th style="width: 50px">${me.$t(1)}</th>
                <td>：${me.calcDate(this.x)}</td>
              </tr>
              <tr>
                <th style="width: 50px">${me.$t(3)}</th>
                <td>：${me.formatNumber(this.z)}${me.$t(4)}（${me.$t(5)}：${me.formatNumber(this.salesCount)}${me.$t(4)}）</td>
              </tr>
              <tr>
                <th style="width: 50px">${me.$t(6)}</th>
                <td>：${me.formatNumber(this.y, this.y, 2)}%</td>
              </tr>`
            }
          },
        ),
        xAxis:
          {
            gridLineWidth: 1,
            labels: {
              formatter: function() {
                return me.calcDate(this.value)
              }
            },
            maxPadding: 0.02,
            title: {
              text: me.$t('11'),
              useHTML: true,
              textAlign: 'center'
            }
          },
        zAxis: Object.assign(
          {},
          {
            // default options here
          },
          me.option.zAxis || {}
        ),
        yAxis: {
          startOnTick: false,
          endOnTick: false,
          title: {
            text: me.$t('9')
          },
          labels: {
            format: '{value}%'
          },
          maxPadding: 0.15,
          max: 107,
          min: -0.5,
        },
        plotOptions: {
          bubble:{
            minSize:5,
            maxSize:50,
          },
          series: {
            cursor: 'pointer',
            events: {
              click: function (event) {
                if ((event.point || {}).detailUrl) {
                  window.open(event.point.detailUrl)
                }
              }
            }
          }
        },
        series: [{
          color: 'rgba(100, 100, 100, 0.5)',
          data: me.chart,
        }]
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.bubble-chart-02 {
  min-height: 450px;
}
.formula-text {
  min-height: 60px;
}
</style>
