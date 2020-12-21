<template>
  <div class="reviews-wrap">
    <div class="flex border-bottom" v-for="(item, i) in reviews"
         :class="{'border-bottom-none': i == reviews.length - 1, 'bg-even': i % 2 == 1}"
         @click="() => reviewItemClick(`/review/detail/${item.productId}`)"
         :key="'review-' + i"
    >
      <div class="system-ava">
        <img :src="'/img/users/' + item.reviewUserId + '/tiny'" alt="" />
      </div>
      <div class="w-full">
        <div class="rv-product" v-if="item.productName"><b>{{ item.productName }}</b></div>
        <div class="co-commu">{{ $t('2') }}&nbsp;{{ formatTime(item.reviewPublishedDate, 1) }}</div>
        <Rate :stars="item.reviewStars || 0" :target="item.productId" class="h-20 mid" />
        <div class="reviews-title"><b>{{ item.reviewTitle }}</b></div>
        <div v-wrap-lines="4">{{ item.reviewContent }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/product-reviews.json'
import Rate from '@@/../components/product/Rate.vue'
export default {
  components: { Rate },
  props: ['reviews'],
  i18n: {
    messages: i18n,
  },
  methods: {
    reviewItemClick(url) {
      location.href = url
    }
  }
}
</script>

<style lang="scss" scoped>
.reviews-wrap {
  .system-ava {
    flex: 0 0 15%;
    margin-right: 3vw;
    img {
      width: 100%;
      height: auto;
    }
  }
  > div {
    padding: 4vw;
    font-size: 3.5vw;
    .co-commu {
      font-size: 3vw;
    }
    .gg-rating {
      font-size: 3.5vw;
      letter-spacing: -1px;
      /deep/ .rate-num {
        color: #434343;
        margin-left: 0.8vw;
      }
    }
    .reviews-title {
      margin: 2vw 0 1vw;
    }
  }
}
.bg-even {
  background: #f3f0ef;
}
</style>
