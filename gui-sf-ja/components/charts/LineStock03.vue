<template>
  <div class="grow1 pos-rel">
    <div ref="chartWrap" class="flex inner-chart w-full pos-abs"/>
  </div>
</template>


<script>
import ChartWrapper from './chart-wrapper'
import HighCharts from 'highcharts/highstock'
import Exporting from 'highcharts/modules/exporting.js'
import i18n from '@@/lang/components/line-stock.json'

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
          renderTo: 'field',
          plotShadow: true,
          margin: me.option.margin,
        },
        credits: {
          enabled: false,
        },
        title: {
          text: me.option.title,
          style: {
            fontWeight: 'bold',
          },
          y: 60,
        },
        scrollbar: {
          enabled: false,
        },
        exporting: {
          enabled: me.option.exporting || false,
        },
        yAxis: [
          {
            minorTickInterval: 'auto',
            lineColor: '#000',
            lineWidth: 1,
            tickWidth: 1,
            tickColor: '#000',
            plotLines: [
              {
                value: 0,
                width: 2,
                color: 'silver',
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
            labels: {
              formatter: function() {
                return moment(this.value).format('YY/MM/DD')
              },
            },
          },
        ],
        legend: {
          enabled: me.option.legendEnabled || false,
          align: 'center',
          layout: 'horizontal',
          verticalAlign: 'bottom',
          floating: false,
          x: 0,
          borderColor: me.option.borderColor || null,
          borderWidth: me.option.borderWidth || 0,
          width: 800,
          itemWidth: 200,
          itemStyle: {
            width: 180,
          },
        },
        rangeSelector: {
          enabled: true,
          allButtonsEnabled: true,
          inputPosition: {
            align: 'right',
            x: 0,
            y: me.option.yAlignSelector || 0,
          },
          buttonPosition: {
            align: me.option.needAlignSelector || 'left',
            x: 0,
            y: me.option.yAlignSelector || 0,
          },
          inputDateFormat: '%m/%d %H:%M',
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
          selected: 1,
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
            let tooltipList = [],
              tooltipIdx = 0,
              s = ''
            s += HighCharts.dateFormat('%Y/%m/%d %H:%M', this.x)
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
          },
          valueDecimals: 1,
        },
        series: me.chart || [],
      })
    },
  },
}
</script>
