<template>
  <div class="product-review01 w-full">
    <div class="flex w-full layout-row">
      <a :href="`/users/${review.reviewUserId}`">
        <img :src="imgSrc" class="shadow user-img" alt="" />
      </a>
      <div class="ml-5 info">
        <a class="review-nickname no-underlying" :href="`/users/${review.reviewUserId}`">
          <Pencil />
          {{ review.reviewNickName || $t('3') }}
        </a>
        <div class="review-published"> {{ formatTime(review.reviewPublishedDate, 6) }} </div>
      </div>
    </div>
    <div class="w-full mt-15">
      <ReviewRate :stars="review.reviewStars" :target="review.id" />
      <p class="short-des mb-0 fs-16" :title="review.reviewTitle"><b>{{ review.reviewTitle }}</b></p>
      <p class="review-content" v-wrap-lines="isExpanded ? -1 : minLine + 2" ref="content">
        {{ review.reviewContent }}
      </p>
      <span v-if="showExpandButton" @click="isExpanded = !isExpanded" class="show-more cursor-pointer">
        <template v-if="!isExpanded"><AngleDown />{{ $t(1) }}</template>
        <template v-else><AngleUp />{{ $t(2) }}</template>
      </span>
    </div>
  </div>
</template>

<script>
import Pencil from '@@/../components/icons/Pencil02.vue'
import ReviewRate from '@@/../components/product/Rate.vue'
import i18n from '@@/lang/components-mobile/review-item.json'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import AngleUp from '@@/../components/icons/AngleUp.vue'
export default {
  i18n: {
    messages: i18n,
  },
  props: {
    review: {
      type: Object,
      default() {
        return {}
      }
    },
    imgSrc: {
      type: String,
      default: '',
    },
    minLine: {
      type: Number,
      default() {
        return 4 
      }
    }
  },
  components: {
    Pencil,
    ReviewRate,
    AngleDown,
    AngleUp,
  },
  data() {
    return {
      isExpanded: false,
      showExpandButton: false,
    }
  },
  mounted() {
    setTimeout(()=>{
      this.showExpandButton = $(this.$refs.content).hasClass('ddd-truncated')
    }, 500)
  },
}
</script>

<style lang="scss" scoped>
.product-review01 {
  text-decoration: none;
  .user-img {
    flex: 0 0 40px;
    height: 40px;
    width: 40px;
  }
  .info {
    width: calc(100% - 45px);
    .review-nickname {
      /deep/ .icon-cls {
        width: 14px;
        height: 14px;
        padding-top: 2px;
      }
    }
    .review-published {
      color: #a0a0a0;
    }
  }
}
.short-des {
  color: #2d2d2d;
  word-break: break-all;
}
.fs-16 {
  font-size: 16px;
}
.review-content {
  white-space: pre-line;
  margin-top: -1.2em;
  text-align: justify;
}
.show-more {
  color: #1d2088;
  /deep/ .icon-cls {
    width: 12px;
    height: 12px;
    color: #2d2d2d;
  }
}
</style>
