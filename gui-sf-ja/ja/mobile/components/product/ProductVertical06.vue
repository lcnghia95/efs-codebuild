<template>
  <div class="product-CU2Su p-10">
    <gogo-link :target="product.detailUrl" class="co-black" :title="product.name">
      <div class="sale text-center" v-if="product.prices[0].discountPrice">
        <span><b>SALE!</b></span>
      </div>
      <div class="product-img pos-rel">
        <google-line-chart class="img-chart" :size="[85, 85]" :data="product.chart" />
      </div>
      <div class="product-name mt-10" v-wrap-lines="2">
        {{ product.name }}
      </div>
      <Prices :prices="product.prices" :right-align="false" :is-vertical="true" />
    </gogo-link>
    <Rate :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
          :target="product.id"
    />
  </div>
</template>
<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
export default {
  components: { Prices, Rate, GogoLink, GoogleLineChart },
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
$w: 85px;
.product-CU2Su {
  width: $w;
  box-sizing: content-box;
  position: relative;
  > * {
    width: 100%;
  }
  /deep/ .gogo-link {
    display: block;
    color: #969696;
    text-decoration: none;
  }
  .product-name {
    height: 38px;
    overflow: hidden;
    color: #003cc5;
  }
}
.sale {
  transform: rotate(45deg);
  position: absolute;
  right: -5px;
  top: 20px;
  width: 60px;
  height: 0;
  line-height: 12px;
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
/deep/ .price-cls {
  min-height: 40px;
  justify-content: flex-end;
}
</style>
<docs>
  ```vue
  <template>
    <div>
      <ProductVertical06 :product="product"/>
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
            }],
            review: {
              count:22,
              stars:5
            }
          }
        }
      }
    }
  </script>
  ```
</docs>
