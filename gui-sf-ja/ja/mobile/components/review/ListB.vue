<template>
  <div class="p-10" style="background: #f3f0ef;">
    <div style="font-weight: bold; font-size: 16px; color: #434343; margin: 5px 0 15px;">{{ $t(6) }}</div>
    <!-- main list -->
    <ReviewSlider
      v-if="(config.cates || {}).length"
      @seeMore="$emit('onLoadMore')"
      @onNextPrev="(type) => $emit('onNextPrev', type)"
      class="mb-20"
      :config="{ 
        title,
        cates: config.cates,
        seeMoreURL: '/review/highscore',
        showMoreText: $t(7),
      }"
    >
      <template v-if="process">
        <Loading />
      </template>
      <div class="slider-ctn" v-else>
        <template v-if="list.length">
          <ReviewItem06 v-for="(item, index) in list" :item="item" :key="item.productId + config.current" :rank="parseInt(index) + 1" :style="index? '' : 'border: none'" />
        </template>
        <template v-else>
          <div style="font-size: 14px; color: red; height: 120px;">{{ $t(2) }}</div>
        </template>
      </div>
      <template #see-more v-if="isLoadMore">
        <Loading />
      </template>
      <div v-if="!isLoadMore" slot="see-more" 
           class="text-center p-10 flex center see-more" 
           @click="$emit('onLoadMore')" 
           v-show="showLoadMore"
      >
        {{ $t(7) }}
        <AngleDown />
      </div>
    </ReviewSlider>
    <template v-else>
      <div class="title">
        {{ config.title || '' }}
      </div>
      <div class="p-10 bg-white">
        <ReviewItem06 v-for="(item, index) in list" :item="item" :key="item.productId + index + '1d23'" :rank="parseInt(index) + 1" :style="index? '' : 'border: none'" />
      </div>
      <div class="mb-10 bg-white" style="border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;">
        <div class="ml-10 mr-10">
          <Loading v-if="isLoadMore" />
          <div v-else class="text-center p-10 flex center see-more" @click="$emit('onLoadMore')" v-show="showLoadMore">
            {{ $t(7) }}
            <AngleDown />
          </div>
        </div>
      </div>
    </template>

    <!-- other list cates -->
    <template v-for="(data, index) in bottomData">
      <ReviewContainer
        v-if="(data.list || {}).length" 
        :key="index + 'branch'"
        @seeMore="onSeeMore(data.url)"
        class="mb-20"
        :config="{
          title: data.title,
        }"
      >
        <ReviewItem04 v-for="(item, idx) in data.list" :key="item.productId + idx + 2" :item="item" :rank="parseInt(idx) + 1" />
      </ReviewContainer>
    </template>
    <!-- links external button -->
    <div style="font-weight: bold; font-size: 16px; color: #707070; margin: 25px 0 8px;">{{ $t(9) }}</div>
    <div class="p-10 bg-white link-extenal flex mid space-between mb-10" @click="onSeeMore('/review/highscore/systemtrade/12')"><span>{{ $t(2) }}</span>  <AngleRight /></div>
    <div class="p-10 bg-white link-extenal flex mid space-between mb-10" @click="onSeeMore('/review/highpost/systemtrade/12')"><span>{{ $t(3) }}</span> <AngleRight /></div>
    <div class="p-10 bg-white link-extenal flex mid space-between mb-10" @click="onSeeMore('/review/highscore/systemtrade')"><span>{{ $t(4) }}</span> <AngleRight /></div>
    <div class="p-10 bg-white link-extenal flex mid space-between mb-10" @click="onSeeMore('/review/')"><span>{{ $t(5) }}</span> <AngleRight /></div>
    <SocialLinks class="mt-20" />
  </div>
</template>

<script>
import ReviewItem06 from '@/components/review/ReviewItem06.vue'
import ReviewItem04 from '@/components/review/ReviewItem04.vue'
import ReviewContainer from "@/components/review/ReviewContainer.vue"
import AngleRight from '@@/../components/icons/AngleRight.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'
import i18n from '@@/lang/components-mobile/review-list.json'
import ReviewSlider from "@/components/review/ReviewSlider.vue"
import Loading from '@@/../components/icons/Loading.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ReviewItem06,
    ReviewItem04,
    ReviewContainer,
    AngleRight,
    SocialLinks,
    ReviewSlider,
    Loading,
    AngleDown
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
    bottomData: {
      type: Array,
      default() {
        return []
      },
    },
    config: {
      type: Object,
      default() {
        return {
          cates: [],
          title: ''
        }
      }
    },
    process: {
      type: Boolean,
      default() {
        return false
      }
    },
    isLoadMore: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: String,
      default() {
        return ''
      },
    },
    showLoadMore: [Number, Boolean],
  },
  data() {
    return {
      current: -1,
      type: '',
    }
  },
  methods: {
    onSeeMore(url) {
      location.href = url
    },
  },
}
</script>

<style lang="scss" scoped>
.link-extenal {
  height: 50px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid #e0dedc;
  .icon-cls {
    width: 22px;
    height: 22px;
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
.see-more {
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  /deep/ .icon-cls {
    height: 20px;
    width: 15px;
  }
}
.title {
  background: #292929;
  color: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 10px;
}
.owl-carousel {
  width: 100% !important;
}
</style>