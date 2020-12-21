<template>
  <div class="bg-white review-container">
    <div class="p-10 review-header">
      {{ config.title }}
    </div>
    <div class="pt-10 pl-10 pr-10 bg-white review-items">    
      <slot name="default">
        <div style="font-size: 14px; color: red; height: 120px;">{{ $t(2) }}</div>
      </slot>
      <slot name="see-more">
        <div class="text-center p-10 flex center see-more" @click="$emit('seeMore', config.seeMoreURL)">
          {{ config.showMoreText || $t(1) }}
          <AngleRight />
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-mobile/review-container'
import AngleRight from '@@/../components/icons/AngleRight.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    AngleRight,
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
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
.review-header {
  background: #2d2d2d;
  color: #fff;
  font-size: 16px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.review-container {
  min-height: 130px;
  overflow-y: hidden;
  border-radius: 5px;
}
.review-items {
  border: 1px solid #e0dedc;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>