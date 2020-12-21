<template>
  <div class="product-JX0x5 p-10">
    <div class="flex center ranking" v-if="rank"><b> {{ rank + $t('1') }}</b></div>
    <a :href="product.detailUrl" class="co-black" :title="product.name">
      <div class="sale text-center" v-if="product.prices[0].discountPrice" :class="{'sale-rank': rank}">
        <span><b>SALE!</b></span>
      </div>
      <div class="product-img pos-rel">
        <img class="pos-abs" :src="'/img/products/' + product.id + '/small'" alt="" />
      </div>
      <div class="product-name mt-10 " v-wrap-lines="2">
        {{ product.name }}
      </div>
      <Prices :prices="product.prices" :right-align="false" :is-vertical="true" />
    </a>
  </div>
</template>
<script>
import Prices from '@@/../components/prices/Prices.vue'
import i18n from '@@/lang/components-mobile/product-vertical07.json'
export default {
  components: { Prices },
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
  width: $w;
  box-sizing: content-box;
  position: relative;
  > * {
    width: 100%;
  }
  .ranking {
    color: #b28850;
  }
  /deep/ .gogo-link {
    display: block;
    color: #969696;
    text-decoration: none;
  }
  .product-name {
    height: 38px;
    overflow: hidden;
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
}
.sale {
  transform: rotate(45deg);
  position: absolute;
  right: -8px;
  top: 15px;
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
.sale-rank {
  top: 30px;
  width: 52px;
  border-bottom: 13px solid #e33a52;
  border-left: 13px solid transparent;
  border-right: 13px solid transparent;
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
            }]
          }
        }
      }
    }
  </script>
  ```
</docs>
