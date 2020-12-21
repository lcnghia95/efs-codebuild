export default {
  data() {
    return {
      innerChart: null,
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
    chart() {
      this.watchData()
    },
  },
  mounted: function() {
    let cacheFn = this.initChart
    this.initChart = () => {
      cacheFn()
    }
    if (!this.chart) {
      return
    }
    this.initChart()
  },
  methods: {
    watchData() {
      !this.innerChart && this.initChart()
      let series = this.innerChart.series
      while (series.length > 0) {
        series[0].remove(false)
      }
      for (let e of this.chart) {
        this.innerChart.addSeries(e)
      }
      this.innerChart.redraw()
    },
    initChart() {},
  },
}
