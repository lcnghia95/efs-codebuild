<template>
  <div class="p-10" style="background: #f3f0ef;">
    <div style="font-weight: bold; font-size: 16px; color: #434343; margin: 5px 0 15px;">{{ $t(6) }}</div>
    <!-- main list -->
    <ReviewContainer 
      class="mb-20"
      :config="{
        title,
        showMoreText: $t(7),
      }"
    >
      <ReviewItem06 
        v-for="(item, index) in list" 
        :key="item.productId + '-' + index" 
        :item="item" :rank="parseInt(index) + 1" 
        :style="index? '' : 'border: none'"
      />
      <div slot="see-more" class="text-center p-10 flex center see-more" @click="handlePagingClick" v-show="showLoadMore">
        {{ $t(7) }}
        <AngleDown />
      </div>
    </ReviewContainer>
    <!-- branch list -->
    <template v-for="(data, index) in bottomData">
      <ReviewContainer
        :key="index + 'branch'"
        @seeMore="onSeeMore(data.url)"
        class="mb-20"
        :config="{
          title: data.title,
        }"
      >
        <ReviewItem04 v-for="(item, index) in data.list" :key="item.productId" :item="item" :rank="parseInt(index) + 1" />
      </ReviewContainer>
    </template>
    <!-- links external button -->
    <div style="font-weight: bold; font-size: 16px; color: #707070; margin: 25px 0 8px;">{{ $t(9) }}</div>
    <div class="p-10 bg-white link-extenal flex space-between mb-10" @click="onSeeMore('/review/highscore/systemtrade/12')">{{ $t(2) }}  <AngleRight /></div>
    <div class="p-10 bg-white link-extenal flex space-between mb-10" @click="onSeeMore('/review/highpost/systemtrade/12')">{{ $t(3) }} <AngleRight /></div>
    <div class="p-10 bg-white link-extenal flex space-between mb-10" @click="onSeeMore('/review/highscore/systemtrade')">{{ $t(4) }} <AngleRight /></div>
    <div class="p-10 bg-white link-extenal flex space-between mb-10" @click="onSeeMore('/review/')">{{ $t(5) }} <AngleRight /></div>
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
    AngleDown,
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
    title: {
      type: String,
      default() {
        return ''
      },
    },
    showLoadMore: [Number, Boolean],
  },
  methods: {
    handlePagingClick() {
      this.$emit('pagingClick')
    },
    onSeeMore(url) {
      location.href = url
    }
  },
}
</script>

<style lang="scss" scoped>
.link-extenal {
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid #e0dedc;
  .icon-cls {
    width: 22px;
    height: 50px;
    /deep/ svg {
      height: 50px;
    }
  }
}
</style>