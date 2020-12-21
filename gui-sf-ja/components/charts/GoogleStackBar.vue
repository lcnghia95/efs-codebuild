<template>
  <img v-if="this.chart.length" :src="bars" alt="">
</template>

<script>
import i18n from '@@/lang/components/google-stackbar.json'
// this component is used for systemtrade only, refactor later
export default {
  i18n: {
    messages: i18n,
  },
  props: {
    chart: {
      type: Array,
      default() {
        return []
      },
    },
    option: {
      type: Object,
      default() {
        return {}
      },
    },
    pair: {
      type: Array,
      default() {
        return ['EUR/USD']
      },
    },
  },
  methods: {
    processText(number) {
      if (!number) {
        return '---'
      }
      return `${number}${this.$t('1')}`
    },
  },
  computed: {
    barData() {
      if (!this.chart.length) {
        return
      }
      return this.chart.map(item => {
        return {
          data: item.data[0],
          name: item.name,
        }
      })
    },
    pairList() {
      let tmp = []
      for (let index = this.pair.length - 1; index >= 0; index--) {
        tmp.push(this.pair[index])
      }
      return tmp.join('|')
      // return this.pair.reverse().join('|')
    },
    chxs() {
      let tmp = '1A,333388,12,0'
      return this.chart.map(() => tmp)
    },
    chxp() {
      // no need
      let totalcnt = this.chart.length + 1
      return this.chart.map((i, index) => {
        return 100 - Math.round((100 / totalcnt) * (index + 1))
      })
    },
    chartData() {
      return this.chart[0].data.join(',') + '|' + this.chart[1].data.join(',')
    },
    chm() {
      let re = []
      for (let index = 0; index < this.chart[0].data.length; index++) {
        re.push(
          `t%20${this.processText(
            this.chart[0].data[index]
          )}%20/%20${this.processText(
            this.chart[1].data[index]
          )},221122,0,${index},10,1`
        )
      }
      return re.join('|')
    },
    chbh() {
      let chart_w = 220,
        totalcnt = this.chart[0].data.length,
        calc = ((chart_w / (totalcnt + 1)) * 4) / 5,
        bar_w = calc > 50 ? 50 : Math.round(calc),
        margin_g = 0,
        margin = 0
      calc = chart_w / (totalcnt + 1)
      margin_g = (calc - bar_w / 2) * 2
      if (totalcnt > 1) {
        calc = chart_w - bar_w * totalcnt - margin_g
        margin = Math.round(calc / (totalcnt - 1))
        margin_g = Math.round(
          chart_w - margin * (totalcnt - 1) - bar_w * totalcnt
        )
      } else {
        margin = 0
      }
      return [
        bar_w,
        margin,
        chart_w - (bar_w * totalcnt + margin * (totalcnt - 1)),
      ]
    },
    bars() {
      let chf = 'c,ls,0,ffffff,0.2,f2f2f2,0.2'
      if (this.option.bgColor) {
        chf += `|bg,s,${this.option.bgColor}`
      }
      return `https://chart.apis.google.com/chart?chs=355x270&chxt=x,y,x&chxl=1:|${
        this.pairList
      }|2:||${this.$t('1')}&chbh=${this.chbh}&chds=a&chd=t:${this.chartData}&chm=${
        this.chm
      }&chdl=${this.barData[0].name}|${
        this.barData[1].name
      }&chdlp=t&cht=bhs&chf=${chf}&chco=aaedfd,fa8888,77ff88`
    },
  },
}
</script>
