<template>
  <div class="product-JX0x5 p-10 fs-15">
    <div class="flex center ranking" v-if="rank"><b> {{ rank + $t('1') }}</b></div>
    <a :href="product.detailUrl" class="co-black" :title="product.name">
      <div class="sale text-center" v-if="product.prices[0].discountPrice" :class="{'sale-rank': rank}">
        <span><b>SALE!</b></span>
      </div>
      <div class="product-img pos-rel">
        <img class="pos-abs" :src="'/img/products/' + product.id" alt="" />
      </div>
      <div class="product-name mt-10" v-wrap-lines="2">
        {{ product.name }}
      </div>
      <Prices :prices="product.prices" :right-align="false" :is-vertical="true" />
    </a>
    <Rate :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0" :target="product.id" :alway-show="true" />
  </div>
</template>
<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import i18n from '@@/lang/components-mobile/product-vertical07.json'
export default {
  components: { Prices, Rate},
  i18n: { messages: i18n },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    rank: {
      type: [Number, String],
      default: 0,
    },
  },
}
</script>
<style lang="scss" scoped>
$w: 85px;
.product-JX0x5 {
  padding: 15px;
  width: $w;
  box-sizing: content-box;
  position: relative;
  > * {
    width: 100%;
  }
  .ranking {
    color: #b28850;
  }
  a {
    display: block;
    color: #969696;
    text-decoration: none;
  }
  .product-name {
    color: #707070;
    overflow: hidden;
    line-height: 1.6em;
    height: 3.2em;
  }
  .product-img {
    width: 100%;
    height: 0;
    padding-top: 100%;
    background: #f5f7fa;
    img {
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  /deep/ .rate-num {
    margin-top: 2px;
    font-size: 11px;
    color: #707070;
  }
}
/deep/ .gg-rating {
  > .rate-num {
    font-size: 13px;
  }
}
.sale {
  transform: rotate(45deg);
  position: absolute;
  right: 3px;
  top: 23px;
  width: 55px;
  height: 0;
  line-height: 10px;
  border-bottom: 14px solid #e33a52;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  z-index: 2;
  span {
    font-size: 8px;
    color: white;
    letter-spacing: 1px;
  }
}
.sale-rank {
  top: 41px;
}
/deep/ .price-cls {
  min-height: 40px;
  justify-content: flex-end;
}
</style>
<docs>
  ```vue
  <template>
    <div>
      <ProductVertical01 :product="product"/>
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            detailUrl:"/tools/indicators/10388",
            id:10388,
            chart:"0,0,14921,14921,14921,14921,29876,29876,40295,40295,40295,55215,68824,83769,100639,100639",
            name:"MT4連動ポイント＆フィギュア(ポイントアンドフィギュア)（P＆F）チャート自動作成ツール(ソフト)。エリオット波動計算表付き",
            prices: [{
              discountPrice:29800,
              price:32000
            }]
          }
        }
      }
    }
  </script>
  ```
</docs>
