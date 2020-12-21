<template>
  <div class="grow1 flex w-full"></div>
</template>
<script>
import HighCharts3D from 'highcharts/highcharts-3d'
import HighCharts from 'highcharts/highcharts'
import i18n from '@@/lang/components-desktop/chart-scatter3d.json'

if (process.browser) {
  HighCharts3D(HighCharts)
}

export default {
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      innerChart: null,
      radColors: null,
    }
  },
  props: {
    chart: {
      type: [Object, Array],
      default() {
        return []
      },
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    chart(val) {
      this.innerChart.series = val
    },
  },
  methods: {
    calcDate(x) {
      const y = parseInt(x / 12)
      const m = x % 12
      return y > 0 ? `${y}${this.$t('1')}` + (m > 0 ? `${m}${this.$t('2')}` : '') : `${m}${this.$t('2')}`
    },
    initChart() {
      let me = this
      me.innerChart = HighCharts.chart(me.$el, {
        colors: me.radColors,
        chart: {
          margin: me.option.margin || 100,
          type: 'scatter3d',
          options3d: {
            enabled: true,
            alpha: 10,
            beta: 30,
            depth: 250,
            viewDistance: 35,
            fitToPlot: false,
            frame: {
              bottom: {
                size: 1,
                color: 'rgba(0,0,0,0.02)',
              },
              back: {
                size: 1,
                color: 'rgba(0,0,0,0.04)',
              },
              side: {
                size: 1,
                color: 'rgba(0,0,0,0.06)',
              },
            },
          },
        },
        credits: {
          enabled: false,
        },
        title: me.option.title || {
          text: '',
        },
        subtitle: me.option.subTitle || {
          text: me.$t(6),
        },
        plotOptions: {
          scatter: {
            width: 1000,
            height: 1000,
            depth: 1000,
          },
          series: {
            cursor: 'pointer',
            events: {
              click: e => {
                e = me.innerChart.pointer.normalize(e)
                window.open(e.point.series.userOptions.url, '_blank')
              },
            },
            marker: {
              symbol: 'circle',
            },
          },
        },
        yAxis: {
          title: { text: me.$t(4) },
          labels: {
            formatter: function() {
              return this.value + '%'
            }
          },
        },
        xAxis: {
          gridLineWidth: 1,
          title: { text: me.$t(3) },
          labels: {
            formatter: function() {
              return me.calcDate(this.value)
            }
          },
        },
        zAxis: {
          showFirstLabel: false,
          title: { text: me.$t(5) },
          labels: {
            formatter: function() {
              return this.value + '%'
            }
          },
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          useHTML: true,
          formatter: function() {
            let tooltip =
              `<a class="no-underlying" href="${
                this.series.userOptions.url
              }">` +
              '<b>' +
              this.series.name +
              '</b>'
            if (me.$t(3)) {
              tooltip +=
                '<br/>' + me.$t(3) + ': ' + me.calcDate(this.series.data[0].x)
            }
            if (me.$t(4)) {
              tooltip +=
                '<br/>' + me.$t(4) + ': ' + me.formatNumber(this.series.data[0].y, this.series.data[0].y, 2) + '%'
            }
            if (me.$t(5)) {
              tooltip +=
                '<br/>' + me.$t(5) + ': ' + me.formatNumber(this.series.data[0].z, this.series.data[0].z, 2) + '%'
            }
            tooltip += '</a>'
            return tooltip
          },
          style: {
            pointerEvents: 'auto',
          },
        },
        series: me.chart,
      })
    },
  },
  mounted() {
    if (!this.chart) {
      return
    }
    this.radColors = $.map(HighCharts.getOptions().colors, function(color) {
      return {
        radialGradient: {
          cx: 0.4,
          cy: 0.3,
          r: 0.5,
        },
        stops: [
          [0, color],
          [
            1,
            HighCharts.Color(color)
              .brighten(-0.2)
              .get('rgb'),
          ],
        ],
      }
    })
    this.initChart()
    let me = this
    $(me.innerChart.container).on('mousedown.hc touchstart.hc', function(
      eStart
    ) {
      eStart = me.innerChart.pointer.normalize(eStart)

      let posX = eStart.chartX,
        posY = eStart.chartY,
        alpha = me.innerChart.options.chart.options3d.alpha,
        beta = me.innerChart.options.chart.options3d.beta,
        newAlpha,
        newBeta,
        sensitivity = 5

      $(document).on({
        'mousemove.hc touchmove.hc': function(e) {
          // Run beta
          e = me.innerChart.pointer.normalize(e)
          newBeta = beta + (posX - e.chartX) / sensitivity
          me.innerChart.options.chart.options3d.beta = newBeta

          // Run alpha
          newAlpha = alpha + (e.chartY - posY) / sensitivity
          me.innerChart.options.chart.options3d.alpha = newAlpha

          me.innerChart.redraw(false)
        },
        'mouseup touchend': function() {
          $(document).off('.hc')
        },
      })
    })
  },
}
</script>
<docs>
  ```vue
  <template>
    <div style="height: 400px;">
      <Scatter3d :chart="chartData"/>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [
          {
            name: "Beatrice-RSI02",
            url: "/systemtrade/fx/4101",
            data: [
              [
                61,
                93.79,
                21.06
              ]
            ]
          },
          {
            name: "シンプルMAシグナル",
            url: "/systemtrade/stocks/6180",
            data: [
              [
                48,
                0,
                0
              ]
            ]
          },
          {
            name: "Project0221USDCAD",
            url: "/systemtrade/fx/1892",
            data: [
              [
                87,
                5.24,
                30.66
              ]
            ]
          },
          {
            name: "Gram GBPUSD M15",
            url: "/systemtrade/fx/13611",
            data: [
              [
                6,
                7.94,
                6.1
              ]
            ]
          }
        ]
      }
    },
  }
  </script>
  ```
</docs>
