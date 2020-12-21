<template>
  <div class="c-com">
    <h4>{{ $t('heading')['h4'] }}</h4>
    <div class="c-com__inner flex space-between">
      <product-item class="no-underlying" v-for="(item, i) in data" :data="item" :key="i"/>
    </div>
  </div>
</template>
<script>
import ProductItem from '@/components/product/navi/product-item/Item.vue'
import i18n from '@@/lang/desktop/navi-detail.json'
/**
 * The Related Products.
 */
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ProductItem,
  },
  props: ['data'],
}
</script>
<style lang="scss" scoped>
%fs-12 {
  font-size: 12px;
}
.c-com {
  margin-top: 60px;
}
.c-com__innter {
  margin-top: 20px;
}
h4 {
  color: #666;
  font-size: 20px;
  line-height: 20px;
  border-left: 2px solid #ddd;
  padding: 10px 17px;
}
/deep/ .o-item {
  width: 120px;
  height: 220px;
  .o-item__img {
    width: 100%;
    height: 120px;
  }
  .o-item__tit {
    color: #04c;
    text-decoration: underline;
    margin: 8px auto 5px auto;
    word-break: break-all;
    -webkit-text-underline-position: under;
    -ms-text-underline-position: below;
    text-underline-position: under;
    @extend %fs-12;
  }
  .price-cls {
    display: flex;
    flex-direction: column;
    .old-price {
      font-weight: normal;
    }
  }
  .price-cls:not(.layout-col) .co-red {
    margin-left: 0;
  }
  .prices {
    @extend %fs-12;
  }
}
</style>
<docs>
  ```vue
  <template>
    <related-products :data="dataRelatedProducts"/>
  </template>
  <script>
  export default {
    data() {
      return {
        dataRelatedProducts: [
          {
            "id": 1248,
            "title": "2880【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
            "prices": [
              {
                "price": 4457,
                "discountPrice": 2605
              }
            ],
            "rate": {
              "stars": 2,
              "number": 2747
            }
          },
          {
            "id": 4785,
            "title": "1883【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
            "prices": [
              {
                "price": 4296,
                "discountPrice": 2219
              }
            ],
            "rate": {
              "stars": 3,
              "number": 1515
            }
          }
        ]
      }
    },
  }
  </script>
  ```
</docs>
