<template>
  <div ref="chartWrap" class="inner-chart"/>
</template>

<script>
import ChartWrapper from './chart-wrapper'
import HighCharts from 'highcharts/highstock'
import i18n from '@@/lang/components/line-stock.json'

export default {
  mixins: [ChartWrapper],
  i18n: {
    messages: i18n,
  },
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
        title: {
          text: me.option.title,
        },
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
            labels: {
              formatter: function() {
                return moment(this.value).format('YY/MM/DD')
              },
            },
          },
        ],
        legend: me.option.legend || {
          enabled: true,
          layout: 'horizontal',
          floating: true,
          x: 0,
          y: 22,
        },
        rangeSelector: {
          enabled: me.option.rangeSelector || false,
          selected: 5,
          inputDateFormat: '%Y/%m/%d',
          buttons: [
            {
              type: 'month',
              count: 1,
              text: '1M',
            },
            {
              type: 'month',
              count: 3,
              text: '3M',
            },
            {
              type: 'month',
              count: 6,
              text: '6M',
            },
            {
              type: 'year',
              count: 1,
              text: '12M',
            },
            {
              type: 'year',
              count: 2,
              text: '24M',
            },
            {
              type: 'all',
              count: 1,
              text: 'ALL',
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
        tooltip: me.option.tooltip || {
          enabled: true,
          borderColor: '#666666',
          xDateFormat: '%A, %b %e, %Y',
          pointFormat:
            `<span style="font-weight: bold; color:{series.color}">{series.name}</span><span style="font-weight: bold">: {point.y:,.0f}${me.option.curUnit || '円'}</span><br />`,
        },
        series: me.chart || [],
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  .inner-chart {
    /deep/ .highcharts-container {
      overflow: visible !important;
      svg {
        overflow: visible !important;
      }
    }
  }
</style>
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
