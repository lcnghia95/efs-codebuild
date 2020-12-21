<template>
  <no-ssr style="height: 40px; margin: 20px 0; overflow-y: hidden;">
    <div ref="slider" class="owl-carousel flex" style="max-width: 100%; overflow-x: hidden;">
      <button class="custom-btn w-110 h-50 fs-18"
              :class="{'btn-active' : currentTime == item}"
              @click="onSelectYear(item)"
              v-for="item in years"
              :key="'kq24w' + item"
      >
        {{ $t('1', {year: item}) }}
      </button>
    </div>
  </no-ssr>
</template>

<script>
if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const left = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="22px" height="22px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: currentColor;" xml:space="preserve"><g><g id="keyboard-arrow-left"><polygon points="247.35,270.3 130.05,153 247.35,35.7 211.65,0 58.65,153 211.65,306"/></g></g></svg>`,
  right = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="22px" height="22px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;fill: currentColor;" xml:space="preserve"><g><g id="chevron-right"><polygon points="94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153"/></g></g></svg>`
import i18n from '@@/lang/components-mobile/info-yearsliders.json'
export default {
  props: {
    year: [String, Number],
  },
  i18n: {
    messages: i18n,
  },
  mounted() {
    let me = this
    this.$nextTick(() => {
      $(this.$refs.slider).owlCarousel({
        slideTransition: 'ease',
        loop: true,
        nav: true,
        dots: false,
        smartSpeed: 500,
        autoplay: false,
        autoWidth: true,
        item: 3,
        navText: [left, right],
        center: true,
        responsive: {
          0: {
              items: 3,
              stagePadding: 450
          },
          400: {
              items: 3,
              stagePadding: 550
          },
          600: {
              items: 3,
              stagePadding: 650
          }
        }
      })
      $(this.$refs.slider).on('changed.owl.carousel', function (e) {
        let cloneLeft = parseInt(($('.owl-item').length - me.years.length) / 2),
          tmpIdx = e.item.index - cloneLeft,
          idx = tmpIdx < 0 ? me.years.length + tmpIdx : tmpIdx,
          y = me.years[idx]
        if (y && y != me.currentTime) {
          me.$set(me, 'currentTime', y)
          me.$emit('year', y)
        }
      })
      // if (this.currentTime != this.years[0]) {
      //   let idx = parseInt(this.years.findIndex(e => e == this.currentTime))
      //   $(this.$refs.slider).trigger('to.owl.carousel', idx)
      // }
    })
  },
  data() {
    let curY = (new Date).getFullYear(),
      leftArr = Array.from(Array(parseInt(this.year) - 2015).keys()).map(
        x => parseInt(this.year) - x
      ),
      rightArr = Array.from(Array(curY - parseInt(this.year)).keys()).map(
        x => curY - x
      )
    return {
      currentTime: this.year,
      years: leftArr.concat(rightArr)
    }
  },
  methods: {
    onSelectYear(year) {
      let idx = this.years.findIndex(e => e == year)
      $(this.$refs.slider).trigger('to.owl.carousel', idx)
    },
  },
}
</script>

<style lang="scss" scoped>
.h-50 {
  height: 40px;
}
.w-110 {
  width: calc(100vmin / 4 + 15px);
  min-width: 100px;
}
.fs-18 {
  font-size: 18px;
}
.custom-btn {
  outline: none;
  border: 3px #eaeaea solid;
  color: #eaeaea;
  background-color: white;
  font-weight: bold;
  margin: 0 20px;
}
.btn-active {
  color: #707070;
  border: 3px #707070 solid;
  font-weight: bold;
}
.owl-carousel /deep/ {
  width: 100vw;
  .owl-nav button {
    &.owl-prev,
    &.owl-next {
      position: absolute;
      font-size: 35px !important;
      line-height: 18px;
      top: 10px;
      color: #707070 !important;
    }
    &.owl-prev {
      left: calc(100% / 2 - 100vmin / 8 - 40px);
    }
    &.owl-next {
      right: calc(100% / 2 - 100vmin / 8 - 40px);
    }
  }
  .owl-carousel {
    width: inherit;
  }
}
</style>
