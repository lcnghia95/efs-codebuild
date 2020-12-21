<template>
  <div class="product-tIhXrfXTOP">
    <a :href="product.detailUrl" :title="product.name">
      <img :src="'/img/products/' + product.id + '/small'" class="img-prd-new" :alt="product.name" width="40" height="40">
      <div class="product-info">
        <div v-wrap-lines="2" class="product-name">
          {{ product.name }}
        </div>
      </div>
    </a>
    <div class="flex" style="height: 40px;">
      <span v-if="product.isReal" class="readtrade">REAL</span>
      <Prices :prices="product.prices" :is-vertical="true" :class="{'ml-45': !product.isReal}"/>
    </div>
    <div class="flex mid">
      <div class="category text-center mr-5" :style="{ 'background-color': categoryColors[product.category || 1], 'font-size': product.category == 18 ? '9px' : '11px'}">
        {{ $t('c' + (product.category || 1)) }}
      </div>
      <Rate :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
            :target="product.id" :alway-show="true"/>
    </div>
    <google-line-chart class="img-chart mt-10" :size="[144, 68]" :data="product.chart"/>
  </div>
</template>
<script>
import RankNumber from '@/components/icons/RankNumber.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import Rate from '@@/../components/product/Rate.vue'
import Prices from '@@/../components/prices/Prices.vue'
import i18n from '@@/lang/components-desktop/product-productvert.json'

export default {
  i18n: { messages: i18n },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    RankNumber,
    GoogleLineChart,
    Rate,
    Prices,
  },
  data() {
    return {
      categoryColors: {
        1: '#8fc31f',
        3: '#00b7ee',
        18: '#f19149',
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.product-tIhXrfXTOP {
  width: 160px;
  background: #ebeaeb;
  box-sizing: border-box;
  padding: 10px 7px;
  overflow: hidden;
  a {
    display: flex;
    text-decoration: none;
    &:hover .product-name {
      text-decoration: underline;
    }
    .img-prd-new {
      flex: 0 0 40px;
      margin-right: 7px;
    }
    .product-info {
      flex: 0 1 auto;
      .product-name {
        height: 40px;
        color: #666;
        overflow: hidden;
      }
    }    
  }
  /deep/ .price-cls {
    height: 40px;
    justify-content: flex-end;
    margin-top: -3px;
    .old-price {
      color: #666;
    }
  }
  /deep/ .rate-num {
    font-size: 12px;
    color: #666;
  }
  .category {
    width: 40px;
    height: 14px;
    line-height: 15px;
    color: white;
    border-radius: 2px;
  }
  .readtrade {
    background-color: #bf9e6c;
    color: #fff;
    font-size: 1rem;
    display: inline-block;
    min-width: 40px;
    padding: 0 2px;
    height: 17px;
    line-height: 19px;
    border-radius: 5px;
    text-align: center;
    margin-right: 5px;
    margin-top: 20px;
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <ProductVertical05 :product="product" />
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            category:1,
            chart:"0,0,14921,14921,14921,14921,29876,29876,40295,40295,40295,55215,68824,83769,100639,100639",
            detailUrl:"/systemtrade/fx/14861",
            id:14861,
            name:"Prospect_FX_AUDNZD",
            prices:[{
              price:15000
            }],
            review: {
              count:10,
              stars:4,
            }
          }
        }
      }
    }
  </script>
  ```
</docs>
