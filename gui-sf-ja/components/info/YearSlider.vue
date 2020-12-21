<template>
  <div ref="slider" class="owl-carousel mt-20">
    <button class="custom-btn w-120 h-60 fs-24"
            :class="{'btn-active' : currentTime == item}"
            @click="onSelectYear(item)"
            v-for="item in years"
            :key="'kq24w' + item">
      {{ item }}
    </button>
  </div>
</template>

<script>
if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const left = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="36px" height="36px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: currentColor;" xml:space="preserve"><g><g id="keyboard-arrow-left"><polygon points="247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306"/></g></g></svg>`,
  right = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="36px" height="36px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: currentColor;" xml:space="preserve"><g><g id="chevron-right"><polygon points="94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153"/></g></g></svg>`

export default {
  props: {
    year: [String, Number],
  },
  mounted() {
    this.$nextTick(() => {
      $(this.$refs.slider).owlCarousel({
        slideTransition: 'ease',
        autoplayTimeout: 8e3,
        loop: false,
        nav: true,
        dots: false,
        smartSpeed: 500,
        margin: 30,
        autoplayHoverPause: true,
        autoWidth: true,
        item: 6,
        navText: [left, right],
      })
    })
  },
  data() {
    return {
      currentTime: this.year,
      years: Array.from(Array(moment().format('YYYY') - 2019 + 1).keys()).map(
        x => moment().format('YYYY') - x
      ),
    }
  },
  methods: {
    onSelectYear(year) {
      this.currentTime = year
      this.$emit('year', year)
    },
  },
}
</script>

<style lang="scss" scoped>
.h-60 {
  height: 60px;
}
.w-120 {
  width: 120px;
}
.mt-20 {
  margin-top: 20px !important;
}
.fs-24 {
  font-size: 24px;
}
.custom-btn {
  outline: none;
  border: 10px #eaeaea solid;
  color: #eaeaea;
  background-color: white;
  font-weight: bold;
  &:hover {
    border: none;
    color: white;
    background: #51dad8;
  }
}
.btn-active {
  border: none;
  color: white;
  background: #51dad8;
  font-weight: bold;
}
.owl-carousel /deep/ {
  width: calc(100% - 120px);
  .owl-nav button {
    &.owl-prev,
    &.owl-next {
      position: absolute;
      font-size: 35px !important;
      line-height: 92px;
    }
    &.owl-prev {
      left: -60px;
    }
    &.owl-next {
      right: -60px;
    }
  }
  .owl-carousel {
    width: inherit;
  }
}
</style>
