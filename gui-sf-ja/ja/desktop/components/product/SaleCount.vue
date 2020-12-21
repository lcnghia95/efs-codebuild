<template>
  <div class="sale-count" v-if="saleCount" :style="{'width': mapping[type], 'background': type}"/>
</template>

<script>
export default {
  props: {
    saleCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    type() {
      if (this.saleCount >= 1 && this.saleCount <= 5) {
        return 'grey'
      } else if (this.saleCount >= 6 && this.saleCount <= 50) {
        return 'green'
      } else if (this.saleCount >= 51 && this.saleCount <= 200) {
        return 'yellow'
      } else if (this.saleCount >= 201) {
        return 'red'
      } else {
        return 'red'
      }
    },
  },
  data() {
    return {
      mapping: {
        grey: '50px',
        green: '250px',
        yellow: '350px',
        red: '540px',
      },
    }
  },
}
</script>


<style lang="scss" scoped>
.sale-count {
  height: 20px;
  position: relative;
  &::after {
    right: -34px;
    position: absolute;
    content: '';
    width: 34px;
    height: 20px;
    background: url(/img/assets/pc/common/running.png) no-repeat;
  }
}
</style>
