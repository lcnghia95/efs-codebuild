<template>
  <img class="img-chart" :data-src="buildSrc(data)" alt="" :style="{width: size[0], height: size[1]}" :width="size[0]" :height="size[1]" v-if="isLz">
  <img class="img-chart" :src="buildSrc(data)" alt="" :style="{width: size[0], height: size[1]}" :width="size[0]" :height="size[1]" v-else>
</template>

<script>
export default {
  props: {
    data: {
      type: [Array, String],
      default() {
        return []
      },
    },
    size: {
      type: Array,
      default() {
        return [90, 90]
      },
    },
    isLz: Boolean,
  },
  methods: {
    buildSrc(
      data = this.data,
      type = 'ls',
      size = this.size,
      color = '522ef4',
      areaColor = null
    ) {
      if (Array.isArray(data)) {
        data = data.map(item => item[1] || item)
      }

      let areaChart = '',
        api = 'https://chart.googleapis.com/chart?'

      if (areaColor) {
        areaChart = `&chm=B,${areaColor},0,0,0`
      }
      if (!data.length) {
        return `${api}chd=t:1,1&cht=ls&chs=${size.join(
          'x'
        )}&chco=522ef4&chds=a&chds=0,2`
      }
      return `${api}chd=t:${data}&cht=${type}&chs=${size.join(
        'x'
      )}&chco=${color}&chds=a${areaChart}`
    },
  },
}
</script>
<style lang="scss" scoped>
.img-chart {
  border: 1px solid #b0b0b0;
}
</style>

<docs>
  ```vue
  <template>
    <GoogleLineChart :size="size" :data="chart" />
  </template>
  <script>
  export default {
    data() {
      return {
        size: [88, 88],
        chart: '1000,9000,2000,-10000,1000,2000,13000,3000,3000,6000,-10000'
      }
    },
  }
  </script>
  ```
</docs>
