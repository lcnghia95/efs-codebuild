<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
import ChartWrapper from './chart-wrapper'
import HighCharts from 'highcharts/highstock'
import Exporting from 'highcharts/modules/exporting.js'
import i18n from '@@/lang/components/line-stock.json'
const TIMEZONE_MAP = {
  'ja': 9,
}
if (process.browser) {
  Exporting(HighCharts)
}

export default {
  mixins: [ChartWrapper],
  i18n: {messages: i18n},
  methods: {
    initChart() {
      let me = this
      HighCharts.setOptions({
        lang: {
          rangeSelectorZoom: this.$t('1'),
          rangeSelectorFrom: this.$t('2'),
          rangeSelectorTo: this.$t('3'),
          printChart: this.$t('4'),
          contextButtonTitle: this.$t('5'),
          downloadJPEG: this.$t('6'),
          downloadPDF: this.$t('7'),
          downloadPNG: this.$t('8'),
          downloadSVG: this.$t('9'),
          numericSymbols: null,
          thousandsSep: ',',
        },
      })
      me.innerChart = HighCharts.stockChart(me.$refs.chartWrap, {
        chart: me.option.chart || {
          height: me.option.height,
          margin: me.option.margin || 0,
        },
        credits: {
          enabled: false,
        },
        title: me.option.title || {},
        subtitle: me.option.subtitle || {},
        scrollbar: me.option.scrollbar || {
          enabled: true,
        },
        exporting: {
          enabled: me.option.exporting || false,
        },
        yAxis: [
          {
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
              align: 'right',
              formatter: function() {
                return (
                  this.value.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') +
                  ' 　'
                )
              },
            },
          },
        ],
        xAxis: [
          {
            gridLineWidth: 1,
            lineColor: '#555',
            tickColor: '#888',
            labels: me.option.xLabelFormat || {
              formatter: function() {
                return moment(this.value).format('M/D HH:mm')
              },
            },
          },
        ],
        legend: me.option.legend || {
          enabled: false,
          layout: 'horizontal',
          floating: true,
          x: 0,
          y: 22,
        },
        rangeSelector: {
          enabled: me.option.rangeSelector || false,
          selected: 1,
          allButtonsEnabled: true,
          inputPosition: me.option.inputPosition || {},
          buttonPosition: me.option.buttonPosition || {},
          inputEnabled: me.option.inputEnabled || false,
          inputDateFormat: '%Y/%m/%d',
          buttons: [
            {
              type: 'minute',
              count: 60,
              text: 'H1',
            },
            {
              type: 'minute',
              count: 240,
              text: 'H4',
            },
            {
              type: 'day',
              count: 1,
              text: 'D1',
            },
            {
              type: 'all',
              text: 'W1',
            },
          ],
        },
        navigator: {
          baseSeries: 0,
          enabled: me.option.navigator || false,
        },
        plotOptions: {
          series: {
            dataGrouping: {
              dateTimeLabelFormats: {
                millisecond: [
                  '%Y/%m/%d %H:%M:%S.%L',
                  '%Y/%m/%d %H:%M:%S.%L',
                  '-%H:%M:%S.%L',
                ],
                second: ['%Y/%m/%d %H:%M:%S', '%Y/%m/%d %H:%M:%S', '-%H:%M:%S'],
                minute: ['%Y/%m/%d %H:%M', '%Y/%m/%d %H:%M', '-%H:%M'],
                hour: ['%Y/%m/%d %H:%M', '%Y/%m/%d %H:%M', '-%H:%M'],
                day: ['%Y/%m/%d', '%Y/%m/%d', '-%Y/%m/%d'],
                week: ['%Y/%m/%d', '%Y/%m/%d', '-%Y/%m/%d'],
                month: ['%B %Y', '%B', '-%B %Y'],
                year: ['%Y', '%Y', '-%Y'],
              },
            },
          },
        },
        line: {
          dataLabels: {
            enables: true,
          },
        },
        tooltip: {
          formatter: function() {
            if (this.y) {
              let tooltipList = [],
                tooltipIdx = 0,
                s = ''
              let time =  moment(this.x);
              time.add(TIMEZONE_MAP[me.$i18n.locale] || 9, 'hours')
              s += HighCharts.dateFormat('%Y/%m/%d %H:%M', time)
              $.each(this.points, function() {
                tooltipList[tooltipIdx] =
                  ('000' + HighCharts.numberFormat(this.y, 1)).slice(-5) +
                  ',<span style="color:' +
                  this.series.color +
                  '">●</span> ' +
                  this.series.name +
                  ''
                tooltipIdx++
              })
              tooltipList.sort(function(a, b) {
                if (a < b) {
                  return 1
                }
                if (a > b) {
                  return -1
                }
                return 0
              })
              if (tooltipList.length) {
                for (let i = 0; i < tooltipList.length; i++) {
                  let tList = tooltipList[i].split(',')
                  if (
                    tList[0].substr(0, 1) === '0' &&
                    tList[0].substr(2, 1) === '.'
                  ) {
                    tList[0] = tList[0].substr(1, 3)
                  }
                  if (
                    tList[0].substr(0, 2) === '00' &&
                    tList[0].substr(3, 1) === '.'
                  ) {
                    tList[0] = tList[0].substr(2, 3)
                  }
                  s +=
                    '<br />' +
                    tList[1] +
                    ': <span style="font-weight: bold">' +
                    tList[0] +
                    '</span>'
                }
              }
              return s
            } else {
              return this.point.name || ''
            }
          },
          valueDecimals: 1,
        },
        series: me.chart || [],
      })
    },
  },
}
</script>
<docs>
  ```vue
  <template>
    <div style="height: 400px;">
      <LineStock :chart="chartData" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [
        {
          name: "ストラテジー登録前",
          tooltip: {
            valueDecimals: 2
          },
          data: [
            [
              1268924400000,
              2000
            ],
            [
              1269270000000,
              4000
            ],
            [
              1269356400000,
              7000
            ],
          ]
        }]
      }
    },
  }
  </script>
  ```
</docs>
