<template>
  <div class="flex flex-wrap space-around">
    <div class="w-full flex space-around mt-10">
      <div class="flex mid type-select cursor-pointer"
           v-for="(text, type) in types"
           :class="{'active': type == currType}"
           @click="changeType(type)"
           :key="'type-' + type">
        <AngleRight class="icon"/>
        <span>{{ text.title }}</span>
      </div>
    </div>
    <div class="chart-panel p-10 mt-10" v-if="charts.column && (charts.column[currType] || []).length">
      <div class="flex space-between title">
        <span>{{ $t('1') }}&nbsp;({{ types[currType] ? types[currType].title : '' }})</span>
        <div>
          <span>
            {{ $t('short-months.' + monthSelected) }}:&nbsp;
            {{ getTotalShow() }}
            {{ types[currType] ? (currType == 'profit' ? $t('currencies.' + (currency || 1)) : types[currType].unit) : '' }}
          </span>
        </div>
      </div>
      <div class="flex center mt-10">
        <no-ssr>
          <ColumnNegative :chart="charts.column[currType]" :option="getColOpt()"/>
        </no-ssr>
      </div>
    </div>
    <div class="chart-panel p-10 mt-10" v-if="charts.bar && charts.bar[monthSelected]">
      <div class="title" :class="{'row-reverse': $i18n.locale == 'th'}">
        <span>{{ $t('months.' + monthSelected) }}</span><span>{{ $t('6') }}</span>
      </div>
      <div class="flex center mt-10">
        <no-ssr>
          <ColumnChart :chart="[charts.bar[monthSelected]]" :option="barChartOpt"/>
        </no-ssr>
      </div>
    </div>
    <div class="chart-panel p-10 mt-10" v-if="charts.pie && charts.pie[monthSelected]">
      <div class="title" :class="{'row-reverse': $i18n.locale == 'th'}">
        <span>{{ $t('months.' + monthSelected) }}</span><span>{{ $t('12') }}</span>
      </div>
      <div class="flex center mt-10">
        <no-ssr>
          <PieChart :chart="[charts.pie[monthSelected]]" :option="pieChartOptions"/>
        </no-ssr>
      </div>
    </div>
    <div class="chart-panel p-10 mt-10" v-if="(checkNested(['stackBar', `${monthSelected}`, 'chart'],this.charts) || []).length">
      <div class="title" :class="{'row-reverse': $i18n.locale == 'th'}">
        <span>{{ $t('months.' + monthSelected) }}</span><span>{{ $t('7') }}</span>
      </div>
      <div class="flex center mt-10">
        <no-ssr>
          <GoogleStackBar :pair="charts.stackBar[monthSelected].categories" :chart="charts.stackBar[monthSelected].chart"/>
        </no-ssr>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/systemtrade-chartarea.json'
import ColumnNegative from '@@/../components/charts/ColumnNegative.vue'
import ColumnChart from '@@/../components/charts/ColumnChart.vue'
import PieChart from '@@/../components/charts/PieChart.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import GoogleStackBar from '@@/../components/charts/GoogleStackBar.vue'
import { checkNested } from '@/utils/client/common'

export default {
  components: {
    ColumnNegative,
    ColumnChart,
    PieChart,
    AngleRight,
    GoogleStackBar,
  },
  props: {
    charts: {
      type: Object,
      default: () => {
        return {}
      },
    },
    monthSelected: [Number, String],
    currency: {
      type: Number,
      default: 1,
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    let vm = this
    return {
      columnOpt: {
        categories: [
          this.$t('short-months.1'),
          this.$t('short-months.2'),
          this.$t('short-months.3'),
          this.$t('short-months.4'),
          this.$t('short-months.5'),
          this.$t('short-months.6'),
          this.$t('short-months.7'),
          this.$t('short-months.8'),
          this.$t('short-months.9'),
          this.$t('short-months.10'),
          this.$t('short-months.11'),
          this.$t('short-months.12'),
        ],
        height: 280,
      },
      barChartOpt: {
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              align: 'left',
              formatter: function() {
                return `<span>${vm.formatNumber(this.y)}</span>`
              },
            },
          },
        },
        width: 300,
        height: 240,
        chartType: 'bar',
        xAxis: {
          categories: [this.$t('9'), this.$t('10')],
          title: {
            text: null,
          },
        },
        tooltip: {
          enabled: false,
        },
        colors: ['#aefeaf', '#feed8f'],
        marginTop: 30,
      },
      pieChartOptions: {
        width: 320,
        height: 240,
        dataLabels: true,
        format: `<b>{point.name}</b>: {point.percentage:.1f}%({point.y}${this.$t(
          '13'
        )})`,
        colors: ['#feed8f', '#aefeaf'],
      },
      types: {
        pips: {
          title: this.$t('4'),
          unit: this.$t('4'),
        },
        lots: {
          title: this.$t('5'),
          unit: this.$t('5'),
        },
        profit: {
          title: this.$t('2'),
          unit: '円',
        },
        winRate: {
          title: this.$t('3'),
          unit: '%',
        },
      },
      currType: 'pips',
    }
  },
  methods: {
    checkNested,
    changeType(type) {
      this.currType = type
    },
    getColOpt() {
      let obj = {},
        categories = (this.charts.column[this.currType] || []).map(e =>
          this.$t('short-months.' + e[0])
        )
      if (this.currType.toString() === 'pips') {
        obj.yValue = 'pips'
      } else if (this.currType.toString() === 'lots') {
        obj.yValue = 'lots'
      } else if (this.currType.toString() === 'profit') {
        obj.yValue = this.$t('currencies.' + (this.currency || 1)) //'円'
      } else if (this.currType.toString() === 'winRate') {
        obj.yValue = '%'
      }
      obj.categories = categories
      return Object.assign(this.columnOpt, obj)
    },
    getTotalShow() {
      let data = this.charts.column[this.currType].filter(
        e => parseInt(e[0]) === parseInt(this.monthSelected)
      )[0] || [0, 0]
      return data[1]
    },
  },
}
</script>

<style lang="scss" scoped>
.type-select {
  width: 22%;
  border: 1px solid #a0a0a0;
  border-radius: 5px;
  color: #a0a0a0;
  padding: 3px 5px;
  .icon {
    width: 18px;
    height: 18px;
  }
  &.active {
    color: #434343;
    background: #9c3;
    border: none;
  }
}
.chart-panel {
  width: 320px;
  .title {
    font-weight: bold;
    display: flex;
    &.row-reverse {
      flex-direction: row-reverse;
      justify-content: flex-end;
    }
  }
}
.co-666 {
  color: #666;
}
.w-320 {
  width: 320px;
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 670px;">
      <ChartGroup :chart="chart" :month-select="2"/>
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          chart: {
            column1: {total: 123123, data: [29.9, -71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]},
            column2: {total: 34345, data: [29.9, -71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]},
            pie: [{
              name: 'Buy',
              y: 220,
              sliced:  true,
              selected: true
            }, {
              name: 'Sell',
              y: 120,
            }],
            stackBar: {
              chart: [{
                name: 'John',
                data: [5, 3, 4, 7, 2]
              }, {
                name: 'Jane',
                data: [2, 2, 3, 2, 1]
              }],
              categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
            }
          }
        }
      }
    }
  </script>
  ```
</docs>
