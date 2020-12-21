<template>
  <div class="product-vertical p-5 pos-rel">
    <a :href="product.detailUrl" class="co-black" :title="product.name">
      <div class="product-img s-82">
        <div v-if="rank" :class="['lg', 'rank' + rank > 3 ? 4 : rank]">
          <b>{{ rank }}</b>
        </div>
        <div class="sale" v-if="(product.prices[0] || {}).discountPrice">
          <span class="flex mid center"/>
          <span class="flex mid center"><b>SALE</b></span>
        </div>
        <google-line-chart
          v-if="showChart"
          class="img-chart"
          :size="[80, 80]"
          :data="product.chart"
        />
        <img
          v-else
          class="s-82 mb-10 owl-lazy"
          :data-src="'/img/products/' + product.id + '/small'"
          :alt="product.name + ' ' + (category || '')"
        />
      </div>
      <div class="product-name mt-10 product-info" v-wrap-lines="2">{{ product.name }}</div>
    </a>
    <div class="product-info" v-if="product.description" v-wrap-lines="2" :title="product.description">
      {{ product.description }}
    </div>
    <Prices :prices="product.prices" :right-align="rightAlign" :is-vertical="true" />
    <Rate :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
          :target="product.id" 
    />
  </div>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'

export default {
  components: { Prices, Rate, GoogleLineChart },
  props: ['product', 'rightAlign', 'rank', 'category', 'showChart'],
}
</script>

<style lang="scss" scoped>
.product-vertical {
  width: 95px;
  box-sizing: content-box;
  > * {
    width: 100%;
  }
  .product-info {
    height: 36px;
    overflow: hidden;
  }
  .product-name {
    height: 42px;
    overflow: hidden;
    font-weight: bold;
  }
  .s-82 {
    width: 82px;
    height: 82px;
  }
  .sale {
    z-index: 2;
    right: 0;
    top: 0;
    span {
      text-transform: uppercase;
      position: absolute;
      background: red;
      font-size: 11px;
      color: white;
      height: 27px;
      width: 27px;
      top: 5px;
      right: 7px;
      z-index: 3;
      &::before,
      &::after {
        content: '';
        position: absolute;
        background: inherit;
        height: inherit;
        width: inherit;
        top: 0;
        right: 0;
        z-index: -1;
        transform: rotate(30deg);
      }
      &::after {
        transform: rotate(60deg);
      }
      &:nth-child(1) {
        transform: rotate(15deg);
      }
    }
  }
}
</style>

<docs>
  ```vue
  <template>
    <ProductVertical :product="item" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          detailUrl: '/systemtrade/fx/10833',
          id: '1',
          name: 'TORURIPI-R666BZ-R_USDJPY',
          prices: [{ price: 49900 }],
          review: { count: 3, stars: 1 },
        },
      }
    },
  }
  </script>
  ```
</docs>
