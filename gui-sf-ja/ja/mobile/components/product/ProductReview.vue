<template>
  <LazyComp01 min-height="100px">
    <a class="flex product-fio9b" :href="'/review/detail/' + product.productId">
      <ImgWrapper class="review-img-box mr-10" :href="product.detailUrl" :src="'/img/products/'+ product.productId +'/small'"/>
      <div class="des-review">
        <div class="title wrap-text">
          <b>{{ product.title }}</b>
        </div>
        <Rate :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
              :target="product.productId"/>
        <p class="date-time">
          {{ $t('1') }} {{ formatTime(product.publishedDate, 6) }}  {{ $t('2') }}
        </p>
        <span class="review-content" v-wrap-lines="4">
          {{ product.content }}
        </span>
      </div>
    </a>
  </LazyComp01>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import i18n from '@@/lang/components-mobile/product-rank-horizontal06.json'
export default {
  i18n: { messages: i18n },
  components: {
    Rate,
    ImgWrapper,
    LazyComp01,
  },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.product-fio9b {
  padding: 4vw;
  text-decoration: none;
  overflow: hidden;
  .review-img-box {
    flex: 0 0 14%;
    background: none;
    /deep/ img {
      top: unset;
      left: unset;
      transform: none;
    }
  }
  .des-review {
    overflow: hidden;
    .title {
      display: block;
      font-size: 3.5vw;
      color: #434343;
    }
    .gg-rating {
      font-size: 3.5vw;
      letter-spacing: -1px;
      /deep/ .rate-num a {
        color: #969696;
        margin-left: 5px;
      }
    }
    .date-time {
      font-size: 3vw;
      color: #434343;
      margin-bottom: 1vw;
    }
    .review-content {
      display: block;
      font-size: 3.5vw;
      color: #434343;
    }
  }
}
</style>

<docs>
  ```vue
  <template>
      <ProductReview :product="product" />
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            productId: 1,
            detailUrl: '/systemtrade/fx/14861',
            id: 14861,
            publishedDate: 1538319599,
            content:
              '情に棹させば流される。智に働けば角が立つ。どこへ越しても住みにくいと悟った時、詩が生れて、画が出来る。とかくに人の世は住みにくい。意地を通せば窮屈だ。とかくに人の世は住みにくい。どこへ越し',
            title: '智に働けば角が立つ。どこへ越しても住みにくい',
            review: {
              count: 10,
              stars: 4,
            },
          },
        }
      }
    }
  </script>
  ```
</docs>
