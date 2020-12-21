<template>
  <div class="bg-white review-slider">
    <div class="p-10 review-header">
      {{ config.title }}
    </div>
    <div class="flex space-between mid pt-10 pb-10 review-slide">
      <div @click="handleFocusSlider('prev')" class="next-btn"><AngleLeft /></div>
      <div class="text-center" style="width: 160px; overflow: hidden; height: 45px;">
        <div class="owl-carousel" ref="slider" style="width: 160px; overflow: hidden; height: 24px;">
          <div style="font-weight: bold; font-size: 17px; width: 160px;"
               v-for="item in config.cates"
               :key="item"
          >
            <span v-if="showType">{{ $t(item) }}</span>
          </div>
        </div>
        <div ref="dotsContainer" style="min-height: 24px;" class="owl-dots"> 
        </div>
      </div>
      <div @click="handleFocusSlider('next')" class="prev-btn"><AngleRight /></div>
    </div>
    <div class="pt-10 pl-10 pr-10 review-items">
      <div>
        <slot name="default"></slot>
      </div>
      <slot name="see-more">
        <div class="text-center p-10 flex center see-more" @click="onSeeMoreClick">
          {{ config.showMoreText || $t(1) }}
          <AngleRight />
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import AngleRight from '@@/../components/icons/AngleRight.vue'
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import i18n from '@@/lang/components-mobile/review-container.json'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  components: {
    AngleRight,
    AngleLeft,
  },
  data() {
    return {
      current: -1,
      showType: false,
    }
  },
  mounted() {
    let position = this.$route.params.type 
                ? this.config.cates.indexOf(this.$route.params.type) 
                : 0
    $(this.$refs.slider).owlCarousel({
      slideTransition: 'ease',
      nav: false,
      dots: true,
      autoplay: false,
      smartSpeed: 500,
      margin: 30,
      autoWidth: true,
      item: 1,
      dotsContainer: $(this.$refs.dotsContainer),
      dotsEach: true,
      loop: true,
      onChanged: this.onChanged,
      startPosition: position,
      onRefreshed: this.fnAfterInit
    })
    this.current = $(this.$refs.dotsContainer).find('.active').index()
  },
  methods: {
    fnAfterInit() {
      this.showType = true
    },
    handleFocusSlider(action) {
      var owl = $(this.$refs.slider)
      if(['next', 'prev'].includes(action)) {
        owl.trigger(`${action}.owl.carousel`)
      }
    },
    onChanged() {
      this.current = $(this.$refs.dotsContainer).find('.active').index()
      this.$emit('onNextPrev', this.config.cates[this.current])
    },
    onSeeMoreClick() {
      this.$emit(
        'seeMore',
        this.config.seeMoreURL 
          ? this.config.seeMoreURL.replace('{type}', (this.config.cates || {})[this.current])
          : ''
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.see-more {
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  /deep/ .icon-cls {
    height: 20px;
    width: 20px;
  }
}
/deep/ .owl-carousel {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
.prev-btn, .next-btn {
  transition: all 0.1s;
  display: flex;
  align-items: center;
  &:active {
    transform: scale(1.2);
  }
}
/deep/ .owl-dot {
  height: 8px;
  width: 8px;
  padding: 0;
  border: none;
  margin: 0 4px;
  background: #c1c1c1;
  border-radius: 15px;
  outline: none;
  &.active {
    background: #292929;
  }
}
.review-slider {
  min-height: 130px;
  overflow-y: hidden;
  border-radius: 5px;
}
.review-header {
  background: #292929;
  color: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.review-items {
  border: 1px solid #e0dedc;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top: none;
}
.review-slide {
  box-shadow: 0 1px 5px 0 #d1d1d1;
  border-left: 1px solid #e0dedc;
  border-right: 1px solid #e0dedc;
}
</style>